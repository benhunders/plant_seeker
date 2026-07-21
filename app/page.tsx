'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '@/components/CameraCapture';
import CareCard from '@/components/CareCard';
import ScheduleList from '@/components/ScheduleList';
import { usePlants } from '@/lib/storage';
import { addDays, todayISO } from '@/lib/schedule';
import { useI18n } from '@/components/I18nProvider';
import type { MessageKey } from '@/lib/i18n';
import type { CareTask, IdentifyResult, Plant } from '@/lib/types';

const CONFIDENCE_KEY: Record<string, MessageKey> = {
  high: 'conf_high',
  medium: 'conf_medium',
  low: 'conf_low',
};

type Stage =
  | { kind: 'idle' }
  | { kind: 'loading'; image: string }
  | { kind: 'result'; image: string; result: IdentifyResult }
  | { kind: 'error'; message: string };

function makeId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Turn the model's schedule template into concrete tasks starting today. */
function buildSchedule(result: IdentifyResult): CareTask[] {
  const start = todayISO();
  return result.schedule.map((t) => ({
    id: makeId(),
    type: t.type,
    label: t.label,
    intervalDays: t.intervalDays,
    nextDue: addDays(start, t.intervalDays),
  }));
}

export default function HomePage() {
  const router = useRouter();
  const { addPlant } = usePlants();
  const { t, locale } = useI18n();
  const [stage, setStage] = useState<Stage>({ kind: 'idle' });

  async function identify(image: string) {
    setStage({ kind: 'loading', image });
    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('home_couldNotIdentify'));
      setStage({ kind: 'result', image, result: data as IdentifyResult });
    } catch (e) {
      setStage({
        kind: 'error',
        message: e instanceof Error ? e.message : t('home_genericError'),
      });
    }
  }

  function save(image: string, result: IdentifyResult) {
    const plant: Plant = {
      id: makeId(),
      commonName: result.commonName,
      scientificName: result.scientificName,
      confidence: result.confidence,
      imageDataUrl: image,
      care: result.care,
      schedule: buildSchedule(result),
      createdAt: new Date().toISOString(),
    };
    addPlant(plant);
    router.push(`/plants/${plant.id}`);
  }

  if (stage.kind === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stage.image}
          alt="Your plant"
          className="h-56 w-56 rounded-2xl object-cover shadow"
        />
        <p className="animate-pulse text-leaf-600">{t('home_identifying')}</p>
      </div>
    );
  }

  if (stage.kind === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-rose-600">{stage.message}</p>
        <button
          onClick={() => setStage({ kind: 'idle' })}
          className="rounded-xl bg-leaf-500 px-5 py-2.5 font-semibold text-white hover:bg-leaf-600"
        >
          {t('home_tryAgain')}
        </button>
      </div>
    );
  }

  if (stage.kind === 'result') {
    const { result, image } = stage;

    if (!result.identified) {
      return (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Your photo"
            className="h-48 w-48 rounded-2xl object-cover shadow"
          />
          <p className="text-leaf-700">
            {result.message || t('home_notIdentified')}
          </p>
          <button
            onClick={() => setStage({ kind: 'idle' })}
            className="rounded-xl bg-leaf-500 px-5 py-2.5 font-semibold text-white hover:bg-leaf-600"
          >
            {t('home_tryAnother')}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={result.commonName}
          className="h-56 w-full rounded-2xl object-cover shadow"
        />
        <div>
          <h1 className="text-2xl font-bold text-leaf-800">{result.commonName}</h1>
          <p className="italic text-leaf-600">{result.scientificName}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-leaf-500">
            {CONFIDENCE_KEY[result.confidence]
              ? t('confidence_label', { level: t(CONFIDENCE_KEY[result.confidence]) })
              : result.confidence}
          </p>
        </div>

        <CareCard care={result.care} />

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-leaf-600">
            {t('home_careSchedule')}
          </h2>
          <ScheduleList schedule={buildSchedule(result)} />
        </section>

        <div className="flex gap-2 pb-4">
          <button
            onClick={() => save(image, result)}
            className="flex-1 rounded-xl bg-leaf-500 px-5 py-3 font-semibold text-white hover:bg-leaf-600"
          >
            {t('home_save')}
          </button>
          <button
            onClick={() => setStage({ kind: 'idle' })}
            className="rounded-xl border border-leaf-300 px-5 py-3 font-semibold text-leaf-700 hover:bg-leaf-100"
          >
            {t('home_retake')}
          </button>
        </div>
      </div>
    );
  }

  // idle
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-leaf-800">{t('home_title')}</h1>
        <p className="mt-1 text-leaf-600">{t('home_subtitle')}</p>
      </div>
      <CameraCapture onCapture={identify} />
      <p className="text-center text-xs text-leaf-500">{t('home_tip')}</p>
    </div>
  );
}
