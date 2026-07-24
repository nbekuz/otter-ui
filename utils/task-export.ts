import type { Priority, RepeatType, Task } from '~/data/mockData'

export const OTTER_TASKS_EXPORT_VERSION = 1

export interface OtterTasksExportPayload {
  version: number
  app: 'otter'
  exportedAt: string
  tasks: OtterExportedTask[]
}

export interface OtterExportedTask {
  title: string
  description?: string
  dueDate?: string
  dueTime?: string
  duration?: { start: string; end: string }
  priority?: Priority
  completed?: boolean
  notification?: string
  repeat?: RepeatType
  repeatDays?: number[]
  repeatCustom?: Task['repeatCustom']
  isAllDay?: boolean
  matrixBlock?: Task['matrixBlock']
}

export function tasksToExportPayload(tasks: Task[]): OtterTasksExportPayload {
  return {
    version: OTTER_TASKS_EXPORT_VERSION,
    app: 'otter',
    exportedAt: new Date().toISOString(),
    tasks: tasks.map(task => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      duration: task.duration ? { ...task.duration } : undefined,
      priority: task.priority,
      completed: task.completed,
      notification: task.notification,
      repeat: task.repeat,
      repeatDays: task.repeatDays ? [...task.repeatDays] : undefined,
      repeatCustom: task.repeatCustom ? { ...task.repeatCustom } : undefined,
      isAllDay: task.isAllDay,
      matrixBlock: task.matrixBlock,
    })),
  }
}

export function parseTasksExport(raw: unknown): OtterExportedTask[] {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Неверный формат файла')
  }
  const data = raw as Record<string, unknown>
  const list = Array.isArray(data.tasks)
    ? data.tasks
    : Array.isArray(raw)
      ? raw
      : null
  if (!list) {
    throw new Error('В файле нет списка задач')
  }

  const tasks: OtterExportedTask[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const title = typeof row.title === 'string' ? row.title.trim() : ''
    if (!title) continue
    tasks.push({
      title,
      description: typeof row.description === 'string' ? row.description : undefined,
      dueDate: typeof row.dueDate === 'string' ? row.dueDate : undefined,
      dueTime: typeof row.dueTime === 'string' ? row.dueTime : undefined,
      duration: isDuration(row.duration) ? row.duration : undefined,
      priority: isPriority(row.priority) ? row.priority : 'none',
      completed: Boolean(row.completed),
      notification: typeof row.notification === 'string' ? row.notification : undefined,
      repeat: isRepeat(row.repeat) ? row.repeat : 'none',
      repeatDays: Array.isArray(row.repeatDays)
        ? row.repeatDays.filter((d): d is number => typeof d === 'number')
        : undefined,
      repeatCustom: isRepeatCustom(row.repeatCustom) ? row.repeatCustom : undefined,
      isAllDay: Boolean(row.isAllDay),
      matrixBlock: isMatrixBlock(row.matrixBlock) ? row.matrixBlock : undefined,
    })
  }
  if (!tasks.length) {
    throw new Error('В файле нет задач для импорта')
  }
  return tasks
}

function isDuration(value: unknown): value is { start: string; end: string } {
  if (!value || typeof value !== 'object') return false
  const d = value as Record<string, unknown>
  return typeof d.start === 'string' && typeof d.end === 'string'
}

function isPriority(value: unknown): value is Priority {
  return value === 'high' || value === 'medium' || value === 'low' || value === 'none'
}

function isRepeat(value: unknown): value is RepeatType {
  return value === 'none'
    || value === 'daily'
    || value === 'weekly'
    || value === 'monthly'
    || value === 'yearly'
    || value === 'custom'
}

function isRepeatCustom(value: unknown): value is NonNullable<Task['repeatCustom']> {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return typeof c.interval === 'number' && (c.unit === 'week' || c.unit === 'month')
}

function isMatrixBlock(value: unknown): value is NonNullable<Task['matrixBlock']> {
  return value === 'urgent-important'
    || value === 'not-urgent-important'
    || value === 'urgent-not-important'
    || value === 'not-urgent-not-important'
}

export function downloadTasksExportJson(tasks: Task[], filename?: string) {
  const payload = tasksToExportPayload(tasks)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `otter-tasks-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
