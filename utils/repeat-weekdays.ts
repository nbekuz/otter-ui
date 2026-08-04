import type { Task } from '~/data/mockData'

const STORAGE_KEY = 'otter.repeat.weekdays.v1'

type WeekdayStore = Record<string, number[]>

function readStore(): WeekdayStore {
  if (!import.meta.client) return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as WeekdayStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  }
  catch {
    return {}
  }
}

function writeStore(store: WeekdayStore) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }
  catch {
    /* ignore quota */
  }
}

export function saveRepeatWeekdays(key: string | null | undefined, days: number[]) {
  if (!key || !days.length) return
  const normalized = [...new Set(days.filter(d => d >= 1 && d <= 7))].sort((a, b) => a - b)
  if (!normalized.length) return
  const store = readStore()
  store[key] = normalized
  writeStore(store)
}

export function loadRepeatWeekdays(key: string | null | undefined): number[] | null {
  if (!key) return null
  const days = readStore()[key]
  return days?.length ? [...days] : null
}

export function persistTaskRepeatWeekdays(task: {
  id?: string
  seriesId?: string | null
  parentTaskId?: string | null
  repeat?: Task['repeat']
  repeatDays?: number[]
  repeatCustom?: Task['repeatCustom']
}) {
  const days = task.repeatCustom?.weekdays?.length
    ? task.repeatCustom.weekdays
    : task.repeatDays
  if (!days?.length) return
  if (task.repeat && task.repeat !== 'custom' && task.repeat !== 'weekly') return

  saveRepeatWeekdays(task.id, days)
  saveRepeatWeekdays(task.seriesId, days)
  saveRepeatWeekdays(task.parentTaskId, days)
}

/** Restore custom weekdays lost by API (no repeat_weekdays field). */
export function enrichTaskWithStoredRepeat(task: Task): Task {
  const keys = [task.seriesId, task.parentTaskId, task.id]
  let stored: number[] | null = null
  for (const key of keys) {
    stored = loadRepeatWeekdays(key)
    if (stored?.length) break
  }

  const fromTask = task.repeatCustom?.weekdays?.length
    ? task.repeatCustom.weekdays
    : task.repeatDays
  const weekdays = (fromTask?.length ? fromTask : stored) || null
  if (!weekdays?.length) return task

  // Keep weekdays linked across the series for future completes.
  persistTaskRepeatWeekdays({
    id: task.id,
    seriesId: task.seriesId,
    parentTaskId: task.parentTaskId,
    repeat: 'custom',
    repeatDays: weekdays,
  })

  const interval = Math.max(1, task.repeatCustom?.interval || 1)
  return {
    ...task,
    repeat: 'custom',
    repeatDays: [...weekdays],
    repeatCustom: {
      interval,
      unit: task.repeatCustom?.unit || 'week',
      weekdays: [...weekdays],
      monthDay: task.repeatCustom?.monthDay,
    },
  }
}

export function resolveTaskWeekdays(task: Pick<Task, 'repeatDays' | 'repeatCustom'>): number[] {
  if (task.repeatCustom?.weekdays?.length) return [...task.repeatCustom.weekdays]
  if (task.repeatDays?.length) return [...task.repeatDays]
  return []
}
