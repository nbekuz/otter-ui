import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'
import type { FirebaseApp } from 'firebase/app'
import { apiDelete, apiPost } from '~/utils/api'
import type { ApiFcmDevice } from '~/types/mobile-api'
import { BRAND_NAME } from '~/utils/site-info'

const DEVICE_ID_KEY = 'otter.web.device_id'
const DEVICE_DB_ID_KEY = 'otter.web.device_db_id'
const LOG_TAG = '[otter:fcm]'

let foregroundListenerBound = false

export type WebPushRegisterResult = {
  ok: boolean
  reason?:
    | 'no-vapid'
    | 'unsupported'
    | 'no-notification-api'
    | 'permission-denied'
    | 'permission-default'
    | 'no-token'
    | 'api-error'
    | 'unknown'
  permission?: NotificationPermission
  message: string
}

function log(...args: unknown[]) {
  if (import.meta.dev || import.meta.client) {
    console.info(LOG_TAG, ...args)
  }
}

function warn(...args: unknown[]) {
  console.warn(LOG_TAG, ...args)
}

function getStableDeviceId(): string {
  if (!import.meta.client) return 'web'
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

function storeDeviceDbId(id: number | null) {
  if (!import.meta.client) return
  if (id == null) {
    localStorage.removeItem(DEVICE_DB_ID_KEY)
    return
  }
  localStorage.setItem(DEVICE_DB_ID_KEY, String(id))
}

function getDeviceDbId(): number | null {
  if (!import.meta.client) return null
  const raw = localStorage.getItem(DEVICE_DB_ID_KEY)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function showForegroundNotification(payload: {
  notification?: { title?: string; body?: string }
  data?: Record<string, string>
}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const taskId = payload.data?.task_id || ''
  const title =
    payload.notification?.title
    || payload.data?.title
    || `${BRAND_NAME} — напоминание`
  const body =
    payload.notification?.body
    || payload.data?.body
    || payload.data?.task_title
    || ''
  try {
    const n = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: taskId ? `task-${taskId}` : undefined,
    })
    if (taskId) {
      n.onclick = () => {
        window.focus()
        void navigateTo({
          path: '/app/new-task',
          query: { id: taskId, returnTo: '/app' },
        })
      }
    }
  }
  catch (err) {
    warn('foreground Notification failed', err)
  }
}

async function resolveFcmToken(
  app: FirebaseApp,
  vapidKey?: string,
  options: { requestPermission?: boolean } = {},
): Promise<{ token: string | null; result: WebPushRegisterResult }> {
  const requestPermission = options.requestPermission ?? false

  if (!import.meta.client) {
    return {
      token: null,
      result: { ok: false, reason: 'unknown', message: 'Not in browser' },
    }
  }
  if (!vapidKey) {
    warn('missing VAPID key')
    return {
      token: null,
      result: {
        ok: false,
        reason: 'no-vapid',
        message: 'VAPID ключ не настроен (NUXT_PUBLIC_FIREBASE_VAPID_KEY)',
      },
    }
  }

  try {
    const supported = await isSupported()
    if (!supported) {
      warn('Firebase Messaging isSupported() === false')
      return {
        token: null,
        result: {
          ok: false,
          reason: 'unsupported',
          message: 'Этот браузер не поддерживает Web Push / FCM',
        },
      }
    }
    if (!('Notification' in window)) {
      warn('Notification API missing')
      return {
        token: null,
        result: {
          ok: false,
          reason: 'no-notification-api',
          message: 'Notification API недоступен',
        },
      }
    }

    let permission = Notification.permission
    log('permission before', permission)

    if (permission === 'default' && requestPermission) {
      permission = await Notification.requestPermission()
      log('permission after request', permission)
    }

    if (permission === 'denied') {
      warn('notification permission denied')
      return {
        token: null,
        result: {
          ok: false,
          reason: 'permission-denied',
          permission,
          message: 'Уведомления заблокированы в настройках браузера',
        },
      }
    }
    if (permission !== 'granted') {
      warn('notification permission not granted yet', permission)
      return {
        token: null,
        result: {
          ok: false,
          reason: 'permission-default',
          permission,
          message: 'Разрешите уведомления в браузере',
        },
      }
    }

    log('registering service worker /firebase-messaging-sw.js')
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    await navigator.serviceWorker.ready
    log('service worker ready', registration.scope)

    const messaging = getMessaging(app)

    if (!foregroundListenerBound) {
      foregroundListenerBound = true
      onMessage(messaging, (payload) => {
        log('foreground FCM message', payload)
        showForegroundNotification({
          notification: payload.notification
            ? {
                title: payload.notification.title,
                body: payload.notification.body,
              }
            : undefined,
          data: payload.data as Record<string, string> | undefined,
        })
      })
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })
    if (!token) {
      warn('getToken returned empty')
      return {
        token: null,
        result: {
          ok: false,
          reason: 'no-token',
          permission,
          message: 'Не удалось получить FCM token',
        },
      }
    }

    log('FCM token acquired', `${token.slice(0, 12)}…(${token.length})`)
    return {
      token,
      result: {
        ok: true,
        permission,
        message: 'FCM token получен',
      },
    }
  }
  catch (err) {
    warn('resolveFcmToken failed', err)
    return {
      token: null,
      result: {
        ok: false,
        reason: 'unknown',
        permission: typeof Notification !== 'undefined' ? Notification.permission : undefined,
        message: err instanceof Error ? err.message : 'Ошибка получения FCM token',
      },
    }
  }
}

/**
 * Register / upsert web FCM device.
 * By default does NOT prompt for permission (avoids blocked auto-prompts).
 * Pass `{ requestPermission: true }` from a user click.
 */
export async function registerWebFcmDevice(
  app: FirebaseApp,
  vapidKey?: string,
  options: { requestPermission?: boolean } = {},
): Promise<WebPushRegisterResult> {
  if (!import.meta.client) {
    return { ok: false, reason: 'unknown', message: 'Not in browser' }
  }

  try {
    const { token, result } = await resolveFcmToken(app, vapidKey, options)
    if (!token) {
      warn('skip POST devices/ — no token', result.reason, result.message)
      return result
    }

    log('POST devices/ …')
    const device = await apiPost<Partial<ApiFcmDevice>>('devices/', {
      token,
      device_id: getStableDeviceId(),
      platform: 'web',
      name: 'Web',
      app_version: '1.0.0',
    })
    if (typeof device?.id === 'number') {
      storeDeviceDbId(device.id)
      log('device registered id=', device.id)
    }
    else {
      log('device registered (no numeric id in response)', device)
    }
    return {
      ok: true,
      permission: Notification.permission,
      message: 'Устройство зарегистрировано для push',
    }
  }
  catch (err) {
    warn('POST devices/ failed', err)
    return {
      ok: false,
      reason: 'api-error',
      permission: typeof Notification !== 'undefined' ? Notification.permission : undefined,
      message: err instanceof Error ? err.message : 'Ошибка регистрации устройства',
    }
  }
}

/** User-gesture entry: request permission + register device. */
export async function enableWebPushNotifications(): Promise<WebPushRegisterResult> {
  if (!import.meta.client) {
    return { ok: false, reason: 'unknown', message: 'Not in browser' }
  }
  try {
    const { getFirebaseApp } = await import('~/lib/firebase')
    const runtime = useRuntimeConfig()
    const fb = runtime.public.firebase as { vapidKey?: string } & Record<string, string>
    const app = getFirebaseApp(fb as never)
    return await registerWebFcmDevice(app, fb.vapidKey, { requestPermission: true })
  }
  catch (err) {
    warn('enableWebPushNotifications failed', err)
    return {
      ok: false,
      reason: 'unknown',
      message: err instanceof Error ? err.message : 'Не удалось включить уведомления',
    }
  }
}

/** Delete registered device on logout. Non-fatal. */
export async function unregisterWebFcmDevice() {
  if (!import.meta.client) return
  const id = getDeviceDbId()
  if (id == null) return
  try {
    await apiDelete(`devices/${id}/`)
    log('device unregistered', id)
  }
  catch (err) {
    warn('unregister device failed', err)
  }
  finally {
    storeDeviceDbId(null)
  }
}
