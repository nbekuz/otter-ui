import dayjs from 'dayjs'
import type { Priority, RepeatType, Task } from '~/data/mockData'
import { enrichTaskWithStoredRepeat, persistTaskRepeatWeekdays, resolveTaskWeekdays } from '~/utils/repeat-weekdays'
import { hasTaskClockTime, parseReminderOffset } from '~/utils/task-reminder'
import { parseApiWallClock, parseTimeToMinutes } from '~/utils/time'
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

function resolveRepeatApi(task: Partial<Task>): {
  unit: ApiRepeatUnit
  interval: number
  weekdays: number[] | null
} {
  const repeat = task.repeat || 'none'
  const weekdays = resolveTaskWeekdays(task as Task)

  if (repeat === 'custom' && task.repeatCustom) {
    const unit: ApiRepeatUnit = task.repeatCustom.unit === 'month' ? 'month' : 'week'
    return {
      unit,
      interval: Math.max(1, Math.min(31, task.repeatCustom.interval || 1)),
      weekdays: unit === 'week' && weekdays.length ? weekdays : null,
    }
  }
  if (repeat !== 'none' && task.repeatCustom?.interval) {
    return {
      unit: REPEAT_TO_API[repeat],
      interval: Math.max(1, Math.min(31, task.repeatCustom.interval)),
      weekdays: repeat === 'weekly' && weekdays.length ? weekdays : null,
    }
  }
  return {
    unit: REPEAT_TO_API[repeat],
    interval: 1,
    weekdays: (repeat === 'custom' || repeat === 'weekly') && weekdays.length ? weekdays : null,
  }
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

function formatLocalOffset(date: Date): string {
  // getTimezoneOffset: UTC − local (minutes). ISO needs local − UTC.
  const total = -date.getTimezoneOffset()
  const sign = total >= 0 ? '+' : '-'
  const abs = Math.abs(total)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const minutes = String(abs % 60).padStart(2, '0')
  return `${sign}${hours}:${minutes}`
}

/** Wall-clock date+time with the user's local timezone offset (e.g. +05:00). */
function toApiDateTime(dueDate: string, time: string): string {
  const hhmm = time.length >= 5 ? time.slice(0, 5) : time
  const local = new Date(`${dueDate}T${hhmm}:00`)
  const offset = Number.isNaN(local.getTime())
    ? formatLocalOffset(new Date())
    : formatLocalOffset(local)
  return `${dueDate}T${hhmm}:00.000${offset}`
}

function buildDueAt(dueDate?: string, dueTime?: string): string | null {
  if (!dueDate) return null
  return toApiDateTime(dueDate, dueTime || '00:00')
}

/**
 * Prefer schedule fields we just wrote/had locally.
 * Skip keys whose client value is `undefined` — otherwise a lost local dueDate
 * (e.g. completed list omit due_at) would wipe a valid date from the API on restore.
 */
export function preferClientSchedule(fromApi: Task, client: Partial<Task>): Task {
  const has = <K extends keyof Task>(key: K) =>
    Object.prototype.hasOwnProperty.call(client, key) && client[key] !== undefined

  return {
    ...fromApi,
    dueDate: has('dueDate') ? client.dueDate : fromApi.dueDate,
    dueTime: has('dueTime') ? client.dueTime : fromApi.dueTime,
    duration: has('duration') ? client.duration : fromApi.duration,
    repeat: has('repeat') && client.repeat ? client.repeat : fromApi.repeat,
    repeatDays: has('repeatDays') ? client.repeatDays : fromApi.repeatDays,
    repeatCustom: has('repeatCustom') ? client.repeatCustom : fromApi.repeatCustom,
  }
}

function buildStartEnd(
  dueDate: string | undefined,
  duration?: { start: string; end: string },
): { start_at: string | null; end_at: string | null } {
  if (!dueDate || !duration?.start || !duration?.end) {
    return { start_at: null, end_at: null }
  }

  if (parseTimeToMinutes(duration.end) <= parseTimeToMinutes(duration.start)) {
    return { start_at: null, end_at: null }
  }

  return {
    start_at: toApiDateTime(dueDate, duration.start),
    end_at: toApiDateTime(dueDate, duration.end),
  }
}

export function apiTaskToUi(task: ApiTask): Task {
  const dueFields = task.due_at ? parseApiWallClock(task.due_at) : null
  const startFields = task.start_at ? parseApiWallClock(task.start_at) : null
  const endFields = task.end_at ? parseApiWallClock(task.end_at) : null
  const scheduleDay = startFields ?? dueFields
  const repeat = REPEAT_TO_UI[task.repeat_unit] || 'none'
  const apiWeekdays = Array.isArray((task as ApiTask & { repeat_weekdays?: number[] }).repeat_weekdays)
    ? (task as ApiTask & { repeat_weekdays?: number[] }).repeat_weekdays!.filter(d => d >= 1 && d <= 7)
    : []
  const hasCustomInterval = task.repeat_unit !== 'none' && task.repeat_interval > 1
  const hasCustomWeekdays = task.repeat_unit === 'week' && apiWeekdays.length > 0
  const customUnit: 'week' | 'month' =
    task.repeat_unit === 'month' ? 'month' : 'week'
  const firstAttachment = task.attachments?.[0]
  const imageUrl = task.image_url || task.image || firstAttachment?.file_url || undefined

  const mapped: Task = {
    id: String(task.id),
    title: task.title,
    description: task.description || undefined,
    dueDate: scheduleDay?.date,
    dueTime: dueFields && dueFields.time !== '00:00' ? dueFields.time : undefined,
    duration: startFields && endFields
      ? { start: startFields.time, end: endFields.time }
      : undefined,
    priority: apiPriorityToUi(task.priority),
    completed: task.is_completed,
    completedAt: task.completed_at
      ? (() => {
        const d = new Date(task.completed_at)
        if (Number.isNaN(d.getTime())) return undefined
        const y = d.getFullYear()
        const mo = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${mo}-${day}`
      })()
      : undefined,
    notification: task.reminder_offset_minutes != null
      ? String(task.reminder_offset_minutes)
      : reminderMinutes(task.due_at, task.reminder_at),
    repeat: hasCustomInterval || hasCustomWeekdays ? 'custom' : repeat,
    repeatDays: apiWeekdays.length ? apiWeekdays : undefined,
    repeatCustom: hasCustomInterval || hasCustomWeekdays
      ? {
          interval: Math.max(1, task.repeat_interval || 1),
          unit: customUnit,
          weekdays: apiWeekdays.length ? apiWeekdays : undefined,
        }
      : undefined,
    imageUrl,
    isAllDay: Boolean(task.is_all_day),
    listKey: task.list_key ? groupKeyToUi(task.list_key) as Task['listKey'] : undefined,
    attachments: (task.attachments || []).map(a => ({
      id: a.id,
      fileUrl: a.file_url,
      originalName: a.original_name,
      contentType: a.content_type,
      size: a.size,
    })),
    attachment: imageUrl
      ? {
          name: firstAttachment?.original_name || 'attachment',
          mimeType: firstAttachment?.content_type || 'image/*',
          dataUrl: imageUrl,
        }
      : undefined,
    matrixBlock: MATRIX_TO_UI[task.matrix_block],
    seriesId: task.series_id ?? null,
    parentTaskId: task.parent_task != null ? String(task.parent_task) : null,
    createdAt: task.created_at,
  }

  return enrichTaskWithStoredRepeat(mapped)
}

export function uiTaskToApiPayload(
  task: Partial<Task>,
  options?: { includeMatrixBlock?: boolean },
): Record<string, unknown> {
  const due_at = buildDueAt(task.dueDate, task.dueTime)
  const { start_at, end_at } = buildStartEnd(task.dueDate, task.duration)
  const { unit: repeat_unit, interval: repeat_interval, weekdays } = resolveRepeatApi(task)

  const payload: Record<string, unknown> = {
    title: task.title,
    description: task.description ?? null,
    due_at,
    start_at,
    end_at,
    repeat_unit,
    repeat_interval,
    priority: uiPriorityToApi(task.priority || 'none'),
  }

  if (options?.includeMatrixBlock !== false) {
    payload.matrix_block = MATRIX_TO_API[task.matrixBlock || 'not-urgent-not-important']
  }

  if (weekdays?.length) {
    payload.repeat_weekdays = weekdays
  }

  const timed = hasTaskClockTime(task)
  if (task.dueDate) {
    payload.is_all_day = !timed
  } else if (task.isAllDay !== undefined) {
    payload.is_all_day = task.isAllDay
  }

  // Reminder only when the user enabled it AND there is a real clock time.
  // Date-only + offset 0 against 00:00 used to fire an immediate push.
  const hasSchedule = Boolean(due_at || start_at)
  const offset = parseReminderOffset(task.notification)
  if (!hasSchedule || !timed || offset == null) {
    payload.reminder_at = null
    payload.reminder_offset_minutes = null
  } else {
    payload.reminder_offset_minutes = offset
  }

  if (task.completed !== undefined) {
    payload.is_completed = task.completed
  }

  // Keep weekdays available for spawn-on-complete even if API drops them.
  if (task.repeat === 'custom' || weekdays?.length) {
    persistTaskRepeatWeekdays(task)
  }

  return payload
}

export async function dataUrlToFile(
  dataUrl: string,
  name: string,
  mimeType: string,
): Promise<File | null> {
  if (!dataUrl.startsWith('data:')) return null
  try {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], name || 'attachment', { type: mimeType || blob.type || 'application/octet-stream' })
  }
  catch {
    return null
  }
}

export function uiTaskToFormData(
  task: Partial<Task>,
  imageFile?: File,
  options?: { clearImage?: boolean, includeMatrixBlock?: boolean },
): FormData {
  const formData = new FormData()
  const payload = uiTaskToApiPayload(task, {
    includeMatrixBlock: options?.includeMatrixBlock,
  })

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value))
      continue
    }
    formData.append(key, String(value))
  }

  if (imageFile) {
    formData.append('image', imageFile)
  }
  else if (options?.clearImage) {
    // Legacy single-image field — empty string clears it on the API.
    formData.append('image', '')
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
