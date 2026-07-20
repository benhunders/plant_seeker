'use client';

import type { CareTask } from '@/lib/types';
import { isDue, todayISO } from '@/lib/schedule';

const TASK_ICON: Record<CareTask['type'], string> = {
  water: '💧',
  fertilize: '🌱',
  rotate: '🔄',
  repot: '🪴',
  mist: '💨',
};

function relativeDue(nextDue: string): string {
  const ref = todayISO();
  if (nextDue < ref) return 'Overdue';
  if (nextDue === ref) return 'Due today';
  const days = Math.round(
    (new Date(`${nextDue}T00:00:00`).getTime() -
      new Date(`${ref}T00:00:00`).getTime()) /
      86400000,
  );
  return days === 1 ? 'Tomorrow' : `In ${days} days`;
}

export default function ScheduleList({
  schedule,
  onComplete,
}: {
  schedule: CareTask[];
  onComplete?: (taskId: string) => void;
}) {
  if (schedule.length === 0) {
    return <p className="text-sm text-leaf-600">No care tasks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {schedule.map((task) => {
        const due = isDue(task);
        return (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-xl border border-leaf-200 bg-white p-3"
          >
            <span aria-hidden className="text-xl">
              {TASK_ICON[task.type]}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-leaf-800">{task.label}</p>
              <p
                className={`text-xs ${due ? 'font-semibold text-rose-600' : 'text-leaf-600'}`}
              >
                {relativeDue(task.nextDue)} · every {task.intervalDays}d
              </p>
            </div>
            {onComplete && (
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="rounded-lg bg-leaf-100 px-3 py-1.5 text-xs font-semibold text-leaf-700 hover:bg-leaf-200"
              >
                Done
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
