/**
 * Task reminder payload rules for web / desktop.
 *
 * - Offset is sent only when the user enabled a notification AND there is a clock time.
 * - Date-only (empty чч:мм) never sends reminder_offset_minutes: 0 against 00:00 —
 *   that used to schedule an immediate push.
 */

export const NOTIFY_NONE = ''
export const NOTIFY_AT_DUE = '0'

export const NOTIFY_NEEDS_CLOCK_MESSAGE =
  'Без времени срока напоминание не отправляется. Сначала укажите время срока.'

export function hasTaskClockTime(task: {
  dueTime?: string
  duration?: { start?: string }
  durationStart?: string
}): boolean {
  return Boolean(
    task.dueTime?.trim()
    || task.duration?.start?.trim()
    || task.durationStart?.trim(),
  )
}

/** Minutes-before offset, or null if the user did not enable a reminder. */
export function parseReminderOffset(notification?: string | null): number | null {
  if (notification == null || notification === '' || notification === 'custom') return null
  const minutes = Number(notification)
  if (!Number.isFinite(minutes) || minutes < 0) return null
  return minutes
}

/**
 * Value to persist on the task and send to the API.
 * Empty time → no reminder, even if the UI still shows «В момент срока».
 */
export function notificationForApi(
  notification: string | undefined,
  hasClock: boolean,
  customMinutes?: number,
): string | undefined {
  if (!hasClock) return undefined
  if (notification === 'custom') {
    const minutes = Math.max(0, Number(customMinutes) || 0)
    return String(minutes)
  }
  return notification || undefined
}

/** Empty time → «Без уведомления». Clock just appeared on create → «В момент срока». */
export function clampNotificationToClock(notification: string, hasClock: boolean): string {
  if (!hasClock) return NOTIFY_NONE
  return notification
}

/**
 * Default when the clock appears (create flow only). Does not override an
 * explicit «Без уведомления» on an existing timed task.
 */
export function syncNotificationWithClock(
  notification: string,
  hasClock: boolean,
  previousHasClock: boolean,
): string {
  if (!hasClock) return NOTIFY_NONE
  if (!previousHasClock && !notification) return NOTIFY_AT_DUE
  return notification
}

/** Reminder options other than «Без уведомления» need a clock time. */
export function canEnableTaskNotification(hasClock: boolean, value: string): boolean {
  if (hasClock) return true
  return !value || value === NOTIFY_NONE
}
