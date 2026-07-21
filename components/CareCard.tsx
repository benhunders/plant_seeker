'use client';

import type { CareInfo } from '@/lib/types';
import { useI18n } from '@/components/I18nProvider';
import type { MessageKey } from '@/lib/i18n';

const ROWS: Array<{ key: keyof CareInfo; icon: string; labelKey: MessageKey }> = [
  { key: 'light', icon: '☀️', labelKey: 'care_light' },
  { key: 'water', icon: '💧', labelKey: 'care_water' },
  { key: 'soil', icon: '🪴', labelKey: 'care_soil' },
  { key: 'humidity', icon: '💨', labelKey: 'care_humidity' },
  { key: 'temperature', icon: '🌡️', labelKey: 'care_temperature' },
];

const DIFFICULTY_STYLE: Record<CareInfo['difficulty'], string> = {
  easy: 'bg-leaf-100 text-leaf-700',
  moderate: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

const DIFFICULTY_KEY: Record<CareInfo['difficulty'], MessageKey> = {
  easy: 'difficulty_easy',
  moderate: 'difficulty_moderate',
  hard: 'difficulty_hard',
};

export default function CareCard({ care }: { care: CareInfo }) {
  const { t } = useI18n();
  const difficultyStyle = DIFFICULTY_STYLE[care.difficulty] ?? DIFFICULTY_STYLE.moderate;
  const difficultyLabel = DIFFICULTY_KEY[care.difficulty]
    ? t(DIFFICULTY_KEY[care.difficulty])
    : care.difficulty;

  return (
    <section className="rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-leaf-600">
          {t('care_title')}
        </h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyle}`}
        >
          {difficultyLabel}
        </span>
      </div>

      <p className="mb-4 rounded-xl bg-leaf-50 p-3 text-sm text-leaf-800">
        {care.summary}
      </p>

      <dl className="space-y-2.5">
        {ROWS.map(({ key, icon, labelKey }) => (
          <div key={key} className="flex gap-3 text-sm">
            <span aria-hidden className="w-5 shrink-0 text-center">
              {icon}
            </span>
            <dt className="w-24 shrink-0 font-medium text-leaf-700">{t(labelKey)}</dt>
            <dd className="text-leaf-800">{String(care[key])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
