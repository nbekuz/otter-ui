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

/** Начало отображения в календаре: слот длительности, иначе время срока (старые задачи). */
export function getTaskScheduleStart(task: {
  dueTime?: string
  duration?: { start: string; end: string }
}): string | undefined {
  return task.duration?.start || task.dueTime
}
