import type { Task } from '~/data/mockData'

/**
 * ISO weekdays 1=Mon … 7=Sun.
 * Backend is the source of truth for `repeat_weekdays` — no localStorage cache.
 */

/** Unique, sorted, clamped to 1…7 (API validation contract). */
export function normalizeRepeatWeekdays(days: unknown): number[] {
  if (!Array.isArray(days)) return []
  const seen = new Set<number>()
  const out: number[] = []
  for (const raw of days) {
    const n = typeof raw === 'number' ? raw : Number(raw)
    if (!Number.isInteger(n) || n < 1 || n > 7 || seen.has(n)) continue
    seen.add(n)
    out.push(n)
  }
  out.sort((a, b) => a - b)
  return out
}

/** Resolve ISO weekdays from a UI task. */
export function resolveTaskWeekdays(task: Pick<Task, 'repeatDays' | 'repeatCustom'>): number[] {
  if (task.repeatCustom?.weekdays?.length) {
    return normalizeRepeatWeekdays(task.repeatCustom.weekdays)
  }
  if (task.repeatDays?.length) return normalizeRepeatWeekdays(task.repeatDays)
  return []
}

/** @deprecated No-op — backend persists `repeat_weekdays`. */
export function persistTaskRepeatWeekdays(_task: unknown) {
  /* intentionally empty */
}

/** @deprecated No-op — API always returns `repeat_weekdays` (possibly `[]`). */
export function enrichTaskWithStoredRepeat(task: Task): Task {
  return task
}

/** @deprecated */
export function saveRepeatWeekdays(_key: string | null | undefined, _days: number[]) {
  /* intentionally empty */
}

/** @deprecated */
export function loadRepeatWeekdays(_key: string | null | undefined): number[] | null {
  return null
}
