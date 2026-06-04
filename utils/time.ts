export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(v => parseInt(v, 10))
  const hours = Number.isFinite(h) ? h : 0
  const minutes = Number.isFinite(m) ? m : 0
  return hours * 60 + minutes
}

export function formatMinutesToTime(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, totalMinutes))
  const hours = Math.floor(clamped / 60)
  const minutes = clamped % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function addMinutesToTime(time: string, deltaMinutes: number): string {
  return formatMinutesToTime(parseTimeToMinutes(time) + deltaMinutes)
}

export const DURATION_END_AFTER_START_MESSAGE =
  'Время окончания должно быть позже времени начала.'

const DURATION_BOTH_REQUIRED_MESSAGE = 'Укажите и начало, и конец длительности'

/** Длительность: оба поля и конец строго позже начала (как на бэкенде). */
export function validateDurationFields(start: string, end: string): string | null {
  const hasStart = !!start?.trim()
  const hasEnd = !!end?.trim()

  if (hasStart !== hasEnd) {
    return DURATION_BOTH_REQUIRED_MESSAGE
  }

  if (hasStart && hasEnd && parseTimeToMinutes(end) <= parseTimeToMinutes(start)) {
    return DURATION_END_AFTER_START_MESSAGE
  }

  return null
}

/** Начало отображения в календаре: слот длительности, иначе время срока (старые задачи). */
export function getTaskScheduleStart(task: {
  dueTime?: string
  duration?: { start: string; end: string }
}): string | undefined {
  return task.duration?.start || task.dueTime
}
