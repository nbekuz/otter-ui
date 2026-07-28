import type { ApiNotificationItem } from '~/types/mobile-api'
import { resolveApiBaseUrl } from '~/utils/api'

export type NotificationsWsEvent =
  | { event: 'ping' }
  | { event: 'pong' }
  | { event: 'unread_count'; unread_count: number }
  | {
    event: 'notification.created'
    notification: ApiNotificationItem
    unread_count: number
  }
  | {
    event: 'notification.updated'
    notification: ApiNotificationItem
    unread_count: number
  }
  | {
    event: 'notification.deleted'
    id: number
    unread_count: number
  }
  | {
    event: 'notifications.read_all'
    unread_count: number
  }
  | {
    event: 'task.reminder'
    notification: ApiNotificationItem
    unread_count: number
  }

/** Derive `wss://host/ws/notifications/?token=<jwt>` from the REST API base URL. */
export function resolveNotificationsWsUrl(accessToken: string): string {
  const apiBase = resolveApiBaseUrl()
  let origin = 'https://admin.ottertime.ru'
  try {
    origin = new URL(apiBase).origin
  }
  catch {
    /* keep default */
  }
  const wsOrigin = origin.replace(/^http/i, 'ws')
  return `${wsOrigin}/ws/notifications/?token=${encodeURIComponent(accessToken)}`
}

export function parseNotificationsWsMessage(raw: string): NotificationsWsEvent | null {
  try {
    const msg = JSON.parse(raw) as NotificationsWsEvent
    if (!msg || typeof msg !== 'object' || typeof (msg as { event?: unknown }).event !== 'string') {
      return null
    }
    return msg
  }
  catch {
    return null
  }
}

export function taskIdFromNotification(item: ApiNotificationItem): string {
  return item.data?.task_id || (item.task != null ? String(item.task) : '')
}
