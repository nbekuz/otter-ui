import dayjs from 'dayjs'
import type { Priority, RepeatType, Task } from '~/data/mockData'
import type {
  ApiMatrixBlock,
  ApiPriority,
  ApiRepeatUnit,
  ApiTask,
} from '~/types/mobile-api'

const MATRIX_TO_UI: Record<ApiMatrixBlock, NonNullable<Task['matrixBlock']>> = {
  urgent_important: 'urgent-important',
  not_urgent_important: 'not-urgent-important',
  urgent_not_important: 'urgent-not-important',
  not_urgent_not_important: 'not-urgent-not-important',
}

const MATRIX_TO_API: Record<NonNullable<Task['matrixBlock']>, ApiMatrixBlock> = {
  'urgent-important': 'urgent_important',
  'not-urgent-important': 'not_urgent_important',
  'urgent-not-important': 'urgent_not_important',
  'not-urgent-not-important': 'not_urgent_not_important',
}

const REPEAT_TO_UI: Record<ApiRepeatUnit, RepeatType> = {
  none: 'none',
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'yearly',
}

const REPEAT_TO_API: Record<RepeatType, ApiRepeatUnit> = {
  none: 'none',
  daily: 'day',
  weekly: 'week',
  monthly: 'month',
  yearly: 'year',
  custom: 'week',
}

function apiPriorityToUi(priority: ApiPriority): Priority {
  if (priority === 'critical') return 'high'
  if (priority === 'low' || priority === 'medium' || priority === 'high') return priority
  return 'medium'
}

function uiPriorityToApi(priority: Priority): ApiPriority {
  if (priority === 'none') return 'medium'
  if (priority === 'high') return 'high'
  if (priority === 'low') return 'low'
  return 'medium'
}

function reminderMinutes(dueAt: string | null, reminderAt: string | null): string | undefined {
  if (!dueAt || !reminderAt) return undefined
  const diff = dayjs(dueAt).diff(dayjs(reminderAt), 'minute')
  if (diff < 0) return undefined
  return String(diff)
}

function buildDueAt(dueDate?: string, dueTime?: string): string | null {
  if (!dueDate) return null
  const time = dueTime || '00:00'
  return dayjs(`${dueDate}T${time}`).format()
}

function buildReminderAt(
  dueAt: string | null,
  notification?: string,
): string | null {
  if (!dueAt || !notification) return null
  const minutes = Number(notification)
  if (!Number.isFinite(minutes) || minutes < 0) return null
  return dayjs(dueAt).subtract(minutes, 'minute').format()
}

function buildStartEnd(
  dueDate: string | undefined,
  duration?: { start: string; end: string },
): { start_at: string | null; end_at: string | null } {
  if (!dueDate || !duration?.start || !duration?.end) {
    return { start_at: null, end_at: null }
  }
  return {
    start_at: dayjs(`${dueDate}T${duration.start}`).format(),
    end_at: dayjs(`${dueDate}T${duration.end}`).format(),
  }
}

export function apiTaskToUi(task: ApiTask): Task {
  const due = task.due_at ? dayjs(task.due_at) : null
  const start = task.start_at ? dayjs(task.start_at) : null
  const end = task.end_at ? dayjs(task.end_at) : null

  return {
    id: String(task.id),
    title: task.title,
    description: task.description || undefined,
    dueDate: due?.isValid() ? due.format('YYYY-MM-DD') : undefined,
    dueTime: due?.isValid() && !(due.hour() === 0 && due.minute() === 0)
      ? due.format('HH:mm')
      : undefined,
    duration: start?.isValid() && end?.isValid()
      ? { start: start.format('HH:mm'), end: end.format('HH:mm') }
      : undefined,
    priority: apiPriorityToUi(task.priority),
    completed: task.is_completed,
    completedAt: task.completed_at
      ? dayjs(task.completed_at).format('YYYY-MM-DD')
      : undefined,
    notification: reminderMinutes(task.due_at, task.reminder_at),
    repeat: REPEAT_TO_UI[task.repeat_unit] || 'none',
    repeatCustom: task.repeat_unit !== 'none' && task.repeat_interval > 1
      ? { interval: task.repeat_interval, unit: 'week' }
      : undefined,
    imageUrl: task.image || undefined,
    matrixBlock: MATRIX_TO_UI[task.matrix_block],
    createdAt: task.created_at,
  }
}

export function uiTaskToApiPayload(task: Partial<Task>): Record<string, unknown> {
  const due_at = buildDueAt(task.dueDate, task.dueTime)
  const { start_at, end_at } = buildStartEnd(task.dueDate, task.duration)

  const payload: Record<string, unknown> = {
    title: task.title,
    description: task.description ?? null,
    due_at,
    start_at,
    end_at,
    reminder_at: buildReminderAt(due_at, task.notification),
    repeat_unit: REPEAT_TO_API[task.repeat || 'none'],
    repeat_interval: task.repeatCustom?.interval ?? 1,
    priority: uiPriorityToApi(task.priority || 'none'),
    matrix_block: MATRIX_TO_API[task.matrixBlock || 'not-urgent-not-important'],
  }

  if (task.completed !== undefined) {
    payload.is_completed = task.completed
  }

  return payload
}

export function uiTaskToFormData(task: Partial<Task>, imageFile?: File): FormData {
  const formData = new FormData()
  const payload = uiTaskToApiPayload(task)

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue
    formData.append(key, String(value))
  }

  if (imageFile) {
    formData.append('image', imageFile)
  }

  return formData
}

export function groupKeyToUi(key: string): string {
  if (key === 'no_deadline') return 'nodate'
  return key
}

export function apiMatrixBlockToUi(block: ApiMatrixBlock): NonNullable<Task['matrixBlock']> {
  return MATRIX_TO_UI[block]
}
