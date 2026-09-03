import type { Task } from '~/data/mockData'

/**
 * Resolve ISO weekdays (1=Mon … 7=Sun) from a UI task.
 * Backend is the source of truth for `repeat_weekdays` — no localStorage cache.
 */
export function resolveTaskWeekdays(task: Pick<Task, 'repeatDays' | 'repeatCustom'>): number[] {
  if (task.repeatCustom?.weekdays?.length) return [...task.repeatCustom.weekdays]
  if (task.repeatDays?.length) return [...task.repeatDays]
  return []
}

/** @deprecated No-op — backend persists `repeat_weekdays`. Kept for call-site compatibility. */
export function persistTaskRepeatWeekdays(_task: {
  id?: string
  seriesId?: string | null
  parentTaskId?: string | null
  repeat?: Task['repeat']
  repeatDays?: number[]
  repeatCustom?: Task['repeatCustom']
}) {
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
