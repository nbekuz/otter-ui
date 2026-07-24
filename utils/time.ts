/** Дата и время «как в строке API», без сдвига в локальную TZ браузера. */
export function parseApiWallClock(iso: string): { date: string; time: string } | null {
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/)
  if (match) {
    return { date: match[1], time: `${match[2]}:${match[3]}` }
  }
  return null
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(v => parseInt(v, 10))
  const hours = Number.isFinite(h) ? h : 0
  const minutes = Number.isFinite(m) ? m : 0
  return hours * 60 + minutes
}

export function formatMinutesToTime(totalMinutes: number): string {
  // Never roll into the next day — clamp to 23:59.
  const clamped = Math.max(0, Math.min(23 * 60 + 59, totalMinutes))
  const hours = Math.floor(clamped / 60)
  const minutes = clamped % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/** Add minutes to HH:mm; results past 23:59 are clamped to 23:59 (no day rollover). */
export function addMinutesToTime(time: string, deltaMinutes: number): string {
  return formatMinutesToTime(parseTimeToMinutes(time) + deltaMinutes)
}

/** Default duration end = start + 1 hour (clamped to 23:59). */
export function defaultDurationEnd(start: string): string {
  return addMinutesToTime(start, 60)
}

export const DURATION_END_AFTER_START_MESSAGE =
  'Время окончания должно быть позже времени начала.'

const DURATION_BOTH_REQUIRED_MESSAGE = 'Укажите и начало, и конец длительности'

export const REPEAT_INTERVAL_MAX = 31
export const REPEAT_INTERVAL_MAX_MESSAGE =
  'Интервал повторения не может превышать 31.'

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

/** Custom repeat interval must be 1…31 (weeks or months). */
export function validateRepeatInterval(interval: number): string | null {
  if (!Number.isFinite(interval) || interval < 1) {
    return 'Интервал повторения должен быть не меньше 1'
  }
  if (interval > REPEAT_INTERVAL_MAX) {
    return REPEAT_INTERVAL_MAX_MESSAGE
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

/** Длительность задачи в минутах по полям duration (включая переход через полночь). */
export function getTaskDurationMinutes(task: {
  dueTime?: string
  duration?: { start: string; end: string }
}): number {
  if (task.duration?.start && task.duration?.end) {
    const start = parseTimeToMinutes(task.duration.start)
    const end = parseTimeToMinutes(task.duration.end)
    if (end > start) return end - start
    if (end < start) return (24 * 60 - start) + end
  }
  return 60
}
