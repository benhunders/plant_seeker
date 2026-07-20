'use client';

import Link from 'next/link';
import PlantCard from '@/components/PlantCard';
import { usePlants } from '@/lib/storage';
import { dueToday } from '@/lib/schedule';

const TASK_ICON: Record<string, string> = {
  water: '💧',
  fertilize: '🌱',
  rotate: '🔄',
  repot: '🪴',
  mist: '💨',
};

export default function PlantsPage() {
  const { plants, ready } = usePlants();

  if (!ready) {
    return <p className="py-10 text-center text-leaf-600">Loading…</p>;
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl" aria-hidden>
          🪴
        </span>
        <p className="text-leaf-700">You haven&apos;t saved any plants yet.</p>
        <Link
          href="/"
          className="rounded-xl bg-leaf-500 px-5 py-2.5 font-semibold text-white hover:bg-leaf-600"
        >
          Identify your first plant
        </Link>
      </div>
    );
  }

  const due = dueToday(plants);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mb-2 text-sm font-semibold uppercase tracking-wide text-leaf-600">
          Today
        </h1>
        {due.length === 0 ? (
          <p className="rounded-2xl border border-leaf-200 bg-white p-4 text-sm text-leaf-600">
            🎉 Nothing due today. Your plants are all set.
          </p>
        ) : (
          <ul className="space-y-2">
            {due.map(({ plant, task }) => (
              <li key={task.id}>
                <Link
                  href={`/plants/${plant.id}`}
                  className="flex items-center gap-3 rounded-xl border border-leaf-200 bg-white p-3 hover:border-leaf-400"
                >
                  <span aria-hidden className="text-xl">
                    {TASK_ICON[task.type] ?? '🌿'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-leaf-800">
                      {task.label}
                    </p>
                    <p className="text-xs text-leaf-600">
                      {plant.nickname || plant.commonName}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-rose-600">
                    {task.nextDue < new Date().toISOString().slice(0, 10)
                      ? 'Overdue'
                      : 'Due'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h1 className="mb-2 text-sm font-semibold uppercase tracking-wide text-leaf-600">
          My plants
        </h1>
        <div className="space-y-2">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>
    </div>
  );
}
