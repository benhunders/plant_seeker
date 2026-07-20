import type { CareInfo } from '@/lib/types';

const ROWS: Array<{ key: keyof CareInfo; icon: string; label: string }> = [
  { key: 'light', icon: '☀️', label: 'Light' },
  { key: 'water', icon: '💧', label: 'Water' },
  { key: 'soil', icon: '🪴', label: 'Soil' },
  { key: 'humidity', icon: '💨', label: 'Humidity' },
  { key: 'temperature', icon: '🌡️', label: 'Temperature' },
];

const DIFFICULTY_STYLE: Record<CareInfo['difficulty'], string> = {
  easy: 'bg-leaf-100 text-leaf-700',
  moderate: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

export default function CareCard({ care }: { care: CareInfo }) {
  return (
    <section className="rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-leaf-600">
          Care at a glance
        </h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${DIFFICULTY_STYLE[care.difficulty]}`}
        >
          {care.difficulty}
        </span>
      </div>

      <p className="mb-4 rounded-xl bg-leaf-50 p-3 text-sm text-leaf-800">
        {care.summary}
      </p>

      <dl className="space-y-2.5">
        {ROWS.map(({ key, icon, label }) => (
          <div key={key} className="flex gap-3 text-sm">
            <span aria-hidden className="w-5 shrink-0 text-center">
              {icon}
            </span>
            <dt className="w-24 shrink-0 font-medium text-leaf-700">{label}</dt>
            <dd className="text-leaf-800">{String(care[key])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
