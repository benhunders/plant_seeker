'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';
import CareCard from '@/components/CareCard';
import ScheduleList from '@/components/ScheduleList';
import ChatBox from '@/components/ChatBox';
import { usePlants } from '@/lib/storage';
import { completeTask } from '@/lib/schedule';
import { useI18n } from '@/components/I18nProvider';

export default function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { plants, ready, updatePlant, removePlant } = usePlants();
  const { t } = useI18n();
  const plant = plants.find((p) => p.id === id);

  if (!ready) {
    return <p className="py-10 text-center text-leaf-600">{t('plants_loading')}</p>;
  }

  if (!plant) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-leaf-700">{t('detail_notFound')}</p>
        <Link
          href="/plants"
          className="rounded-xl bg-leaf-500 px-5 py-2.5 font-semibold text-white hover:bg-leaf-600"
        >
          {t('detail_back')}
        </Link>
      </div>
    );
  }

  function markDone(taskId: string) {
    updatePlant(id, (p) => ({
      ...p,
      schedule: p.schedule.map((t) => (t.id === taskId ? completeTask(t) : t)),
    }));
  }

  function handleDelete() {
    const name = plant!.nickname || plant!.commonName;
    if (window.confirm(t('detail_confirmRemove', { name }))) {
      removePlant(id);
      router.push('/plants');
    }
  }

  return (
    <div className="space-y-4 pb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plant.imageDataUrl}
        alt={plant.commonName}
        className="h-56 w-full rounded-2xl object-cover shadow"
      />
      <div>
        <h1 className="text-2xl font-bold text-leaf-800">
          {plant.nickname || plant.commonName}
        </h1>
        <p className="italic text-leaf-600">{plant.scientificName}</p>
      </div>

      <CareCard care={plant.care} />

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-leaf-600">
          {t('home_careSchedule')}
        </h2>
        <ScheduleList schedule={plant.schedule} onComplete={markDone} />
      </section>

      <ChatBox
        commonName={plant.commonName}
        scientificName={plant.scientificName}
        care={plant.care}
      />

      <button
        onClick={handleDelete}
        className="w-full rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
      >
        {t('detail_remove')}
      </button>
    </div>
  );
}
