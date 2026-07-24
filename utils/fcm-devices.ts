import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'
import type { FirebaseApp } from 'firebase/app'
import { apiDelete, apiPost } from '~/utils/api'
import type { ApiFcmDevice } from '~/types/mobile-api'
import { BRAND_NAME } from '~/utils/site-info'

const DEVICE_ID_KEY = 'otter.web.device_id'
const DEVICE_DB_ID_KEY = 'otter.web.device_db_id'

let foregroundListenerBound = false

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
  catch {
    /* ignore */
  }
}

async function resolveFcmToken(app: FirebaseApp, vapidKey?: string): Promise<string | null> {
  if (!import.meta.client || !vapidKey) return null
  try {
    const supported = await isSupported()
    if (!supported) return null
    if (!('Notification' in window)) return null
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
    if (Notification.permission !== 'granted') return null

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    await navigator.serviceWorker.ready
    const messaging = getMessaging(app)

    if (!foregroundListenerBound) {
      foregroundListenerBound = true
      onMessage(messaging, (payload) => {
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
    return token || null
  }
  catch {
    return null
  }
}

/** Register / upsert web FCM device. Non-fatal on failure. */
export async function registerWebFcmDevice(app: FirebaseApp, vapidKey?: string) {
  if (!import.meta.client) return
  try {
    const token = await resolveFcmToken(app, vapidKey)
    if (!token) return

    const device = await apiPost<Partial<ApiFcmDevice>>('devices/', {
      token,
      device_id: getStableDeviceId(),
      platform: 'web',
      name: 'Web',
      app_version: '1.0.0',
    })
    if (typeof device?.id === 'number') {
      storeDeviceDbId(device.id)
    }
  }
  catch {
    /* push registration is optional */
  }
}

/** Delete registered device on logout. Non-fatal. */
export async function unregisterWebFcmDevice() {
  if (!import.meta.client) return
  const id = getDeviceDbId()
  if (id == null) return
  try {
    await apiDelete(`devices/${id}/`)
  }
  catch {
    /* ignore */
  }
  finally {
    storeDeviceDbId(null)
  }
}
