import {
  parseNotificationsWsMessage,
  resolveNotificationsWsUrl,
  type NotificationsWsEvent,
} from '~/utils/notifications-ws'
import { getAccessToken } from '~/utils/auth-session'
import type { ApiNotificationItem } from '~/types/mobile-api'

const PING_INTERVAL_MS = 25_000
const RECONNECT_BASE_MS = 1_000
const RECONNECT_MAX_MS = 30_000
const LOG_TAG = '[otter:notifications-ws]'

/**
 * Keeps a notifications WebSocket alive while the user is logged in.
 * Mobile uses FCM + REST instead — this plugin is web-only.
 *
 * URL: `wss://…/ws/notifications/?token=<access_jwt>`
 */
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()
  const settingsStore = useSettingsStore()
  const { showReminder } = useTaskReminderToast()

  let socket: WebSocket | null = null
  let pingTimer: ReturnType<typeof setInterval> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempt = 0
  let intentionalClose = false
  let connectedToken: string | null = null

  function clearPing() {
    if (pingTimer) {
      clearInterval(pingTimer)
      pingTimer = null
    }
  }

  function clearReconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function presentTaskReminder(notification: ApiNotificationItem, unreadCount: number) {
    notificationsStore.applyCreated(notification, unreadCount)
    if (settingsStore.appSettings.notifications === false) return

    // Compact in-app message only — no browser Notification popup on web.
    showReminder(notification)
    void useSoundsStore().playFeedbackSound('notification')
  }

  function handleEvent(msg: NotificationsWsEvent) {
    switch (msg.event) {
      case 'pong':
        break
      case 'unread_count':
        notificationsStore.setUnreadCount(msg.unread_count)
        break
      case 'notification.created':
        notificationsStore.applyCreated(msg.notification, msg.unread_count)
        break
      case 'notification.updated':
        notificationsStore.applyUpdated(msg.notification, msg.unread_count)
        break
      case 'notification.deleted':
        notificationsStore.applyDeleted(msg.id, msg.unread_count)
        break
      case 'notifications.read_all':
        notificationsStore.applyReadAll(msg.unread_count)
        break
      case 'task.reminder':
        presentTaskReminder(msg.notification, msg.unread_count)
        break
      default:
        break
    }
  }

  function scheduleReconnect() {
    clearReconnect()
    const delay = Math.min(
      RECONNECT_MAX_MS,
      RECONNECT_BASE_MS * 2 ** reconnectAttempt,
    )
    reconnectAttempt += 1
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
    }, delay)
  }

  function disconnect() {
    intentionalClose = true
    clearPing()
    clearReconnect()
    connectedToken = null
    if (socket) {
      try {
        socket.close()
      }
      catch {
        /* ignore */
      }
      socket = null
    }
  }

  function connect() {
    const token = getAccessToken()
    if (!token) {
      disconnect()
      return
    }

    if (
      socket
      && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
      && connectedToken === token
    ) {
      return
    }

    intentionalClose = false
    clearPing()
    clearReconnect()

    if (socket) {
      try {
        socket.close()
      }
      catch {
        /* ignore */
      }
      socket = null
    }

    connectedToken = token
    let ws: WebSocket
    try {
      ws = new WebSocket(resolveNotificationsWsUrl(token))
    }
    catch (err) {
      console.error(LOG_TAG, 'construct failed', err)
      scheduleReconnect()
      return
    }
    socket = ws

    ws.onopen = () => {
      console.info(LOG_TAG, 'WS ok')
      reconnectAttempt = 0
      clearPing()
      pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'ping' }))
        }
      }, PING_INTERVAL_MS)
    }

    ws.onmessage = (event) => {
      if (typeof event.data !== 'string') return
      const msg = parseNotificationsWsMessage(event.data)
      if (msg) handleEvent(msg)
    }

    ws.onclose = (event) => {
      console.info(LOG_TAG, 'WS close', event.code, event.reason || '')
      clearPing()
      if (socket === ws) socket = null
      if (intentionalClose || event.code === 4401) return
      if (!getAccessToken()) return
      scheduleReconnect()
    }

    ws.onerror = (event) => {
      console.error(LOG_TAG, 'WS error', event)
    }
  }

  watch(
    () => authStore.isLoggedIn,
    (loggedIn) => {
      if (loggedIn) connect()
      else disconnect()
    },
    { immediate: true },
  )

  watch(
    () => authStore.tokenRevision,
    () => {
      if (!authStore.isLoggedIn) return
      const token = getAccessToken()
      if (token && token !== connectedToken) connect()
    },
  )

  if (import.meta.hot) {
    import.meta.hot.dispose(() => disconnect())
  }
})
