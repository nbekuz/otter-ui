import dayjs, { type Dayjs } from 'dayjs'
import type { Task } from '~/data/mockData'

/** ISO weekday: 1=Mon … 7=Sun (matches UI weekDays). */
function isoWeekday(d: Dayjs): number {
  const wd = d.day()
  return wd === 0 ? 7 : wd
}

function matchesCustom(task: Task, date: Dayjs, anchor: Dayjs): boolean {
  const custom = task.repeatCustom
  if (!custom) return false
  const interval = Math.max(1, custom.interval || 1)

  if (custom.unit === 'week') {
    const weekdays = custom.weekdays?.length
      ? custom.weekdays
      : task.repeatDays?.length
        ? task.repeatDays
        : [isoWeekday(anchor)]
    if (!weekdays.includes(isoWeekday(date))) return false
    const weeksDiff = date.startOf('week').diff(anchor.startOf('week'), 'week')
    return weeksDiff >= 0 && weeksDiff % interval === 0
  }

  const monthDay = custom.monthDay || anchor.date()
  if (date.date() !== Math.min(monthDay, date.daysInMonth())) return false
  const monthsDiff = (date.year() - anchor.year()) * 12 + (date.month() - anchor.month())
  return monthsDiff >= 0 && monthsDiff % interval === 0
}

export function taskOccursOnDate(task: Task, dateStr: string): boolean {
  const due = task.dueDate
  if (!due) return false
  if (task.completed) return due === dateStr

  const date = dayjs(dateStr)
  const anchor = dayjs(due)
  if (!date.isValid() || !anchor.isValid()) return false
  if (date.isBefore(anchor, 'day')) return false
  if (due === dateStr) return true

  const repeat = task.repeat || 'none'
  if (repeat === 'none') return false

  if (repeat === 'daily') {
    const interval = task.repeatCustom?.interval || 1
    const days = date.diff(anchor, 'day')
    return days >= 0 && days % Math.max(1, interval) === 0
  }

  if (repeat === 'weekly') {
    if (isoWeekday(date) !== isoWeekday(anchor)) return false
    const weeks = date.startOf('week').diff(anchor.startOf('week'), 'week')
    return weeks >= 0 && weeks % Math.max(1, task.repeatCustom?.interval || 1) === 0
  }

  if (repeat === 'monthly') {
    if (date.date() !== Math.min(anchor.date(), date.daysInMonth())) return false
    const months = (date.year() - anchor.year()) * 12 + (date.month() - anchor.month())
    return months >= 0 && months % Math.max(1, task.repeatCustom?.interval || 1) === 0
  }

  if (repeat === 'yearly') {
    if (date.month() !== anchor.month()) return false
    if (date.date() !== Math.min(anchor.date(), date.daysInMonth())) return false
    const years = date.year() - anchor.year()
    return years >= 0 && years % Math.max(1, task.repeatCustom?.interval || 1) === 0
  }

  if (repeat === 'custom') {
    return matchesCustom(task, date, anchor)
  }

  return false
}

/** Next date a recurring task should appear on after its current occurrence. */
export function computeNextOccurrenceDate(task: Task): string | null {
  if (!task.repeat || task.repeat === 'none') return null

  const today = dayjs().startOf('day')
  const anchor = task.dueDate && dayjs(task.dueDate).isValid()
    ? dayjs(task.dueDate).startOf('day')
    : today
  // Overdue: schedule the next open occurrence on/after today.
  // On-time/future: first occurrence strictly after the anchor date.
  let cursor = anchor.isBefore(today, 'day') ? today : anchor.add(1, 'day')
  const probe: Task = {
    ...task,
    completed: false,
    dueDate: anchor.format('YYYY-MM-DD'),
  }
  const limit = anchor.add(3, 'year')
  while (!cursor.isAfter(limit, 'day')) {
    const dateStr = cursor.format('YYYY-MM-DD')
    if (taskOccursOnDate(probe, dateStr)) return dateStr
    cursor = cursor.add(1, 'day')
  }
  return null
}

export function isRecurringTask(task: Pick<Task, 'repeat'> | null | undefined): boolean {
  return !!(task?.repeat && task.repeat !== 'none')
}

/**
 * Calendar/list helpers: show only real persisted instances on their dueDate.
 * Recurring tasks are NOT virtually expanded onto future dates — the next
 * occurrence is created on complete / delete-this instead.
 */
export function expandTasksForDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter((task) => {
    if (!task.dueDate) return false
    return task.dueDate === dateStr
  })
}

export function expandTasksForRange(tasks: Task[], startDate: string, endDate: string): Task[] {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  if (!start.isValid() || !end.isValid()) return []

  const result: Task[] = []
  const seen = new Set<string>()
  for (const task of tasks) {
    if (!task.dueDate) continue
    const due = dayjs(task.dueDate)
    if (!due.isValid()) continue
    if (due.isBefore(start, 'day') || due.isAfter(end, 'day')) continue
    if (seen.has(task.id)) continue
    seen.add(task.id)
    result.push(task)
  }
  return result
}

export function resolveRealTaskId(taskId: string): string {
  const sep = taskId.indexOf('__')
  if (sep === -1) return taskId
  const maybeDate = taskId.slice(sep + 2)
  if (/^\d{4}-\d{2}-\d{2}$/.test(maybeDate)) {
    return taskId.slice(0, sep)
  }
  return taskId
}
