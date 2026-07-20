import type { CareTask, Plant } from './types';

/** Returns today's date as an ISO date string (YYYY-MM-DD), local time. */
export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** A task is due if its nextDue date is today or in the past. */
export function isDue(task: CareTask, ref: string = todayISO()): boolean {
  return task.nextDue <= ref;
}

/** Mark a task done as of `ref`, advancing nextDue by its interval. */
export function completeTask(task: CareTask, ref: string = todayISO()): CareTask {
  return {
    ...task,
    lastDone: ref,
    nextDue: addDays(ref, task.intervalDays),
  };
}

export type DueItem = { plant: Plant; task: CareTask };

/** All care tasks across all plants that are due today or overdue. */
export function dueToday(plants: Plant[], ref: string = todayISO()): DueItem[] {
  const items: DueItem[] = [];
  for (const plant of plants) {
    for (const task of plant.schedule) {
      if (isDue(task, ref)) items.push({ plant, task });
    }
  }
  // Most overdue first.
  return items.sort((a, b) => a.task.nextDue.localeCompare(b.task.nextDue));
}
