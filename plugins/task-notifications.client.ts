import dayjs from 'dayjs'
import { BRAND_NAME } from '~/utils/site-info'
import { apiGet, apiPost } from '~/utils/api'
import { getAccessToken } from '~/utils/auth-session'
import { hasTaskClockTime } from '~/utils/task-reminder'

const firedKeys = new Set<string>()
const ackedDueIds = new Set<string>()

function taskReminderKey(taskId: string, dueAt: string) {
  return `${taskId}:${dueAt}`
}

function getNotifyAt(task: { dueDate?: string; dueTime?: string; duration?: { start?: string }; notification?: string }) {
  if (!task.dueDate || task.notification === undefined || task.notification === '') return null
  if (!hasTaskClockTime(task)) return null
  const time = task.dueTime || task.duration?.start
  if (!time) return null
  const dueAt = dayjs(`${task.dueDate}T${time}`)
  if (!dueAt.isValid()) return null
  const minutes = Number(task.notification)
  if (!Number.isFinite(minutes) || minutes < 0) return null
  return dueAt.subtract(minutes, 'minute')
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  const tasksStore = useTasksStore()
  const settingsStore = useSettingsStore()
  const authStore = useAuthStore()

  function collectTasks() {
    const byId = new Map<string, (typeof tasksStore.tasks)[number]>()
    for (const task of tasksStore.tasks) byId.set(task.id, task)
    for (const task of tasksStore.calendarTasks) {
      if (!byId.has(task.id)) byId.set(task.id, task)
    }
    return Array.from(byId.values())
  }

  function showBrowserNotification(title: string, body: string, tag: string, taskId?: string) {
    try {
      const n = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag,
        silent: true,
      })
      void useSoundsStore().playFeedbackSound('notification')
      if (taskId) {
        n.onclick = () => {
          window.focus()
          void navigateTo({ path: '/app/new-task', query: { id: taskId, returnTo: '/app' } })
        }
      }
    }
    catch {
      /* ignore */
    }
  }

  function checkDueNotifications() {
    if (!settingsStore.appSettings.notifications) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const now = dayjs()

    for (const task of collectTasks()) {
      if (task.completed || task.notification === undefined || task.notification === '') continue

      const notifyAt = getNotifyAt(task)
      if (!notifyAt) continue

      const dueKey = taskReminderKey(task.id, notifyAt.format())
      if (firedKeys.has(dueKey)) continue

      if (now.isBefore(notifyAt) || now.diff(notifyAt, 'minute') > 5) continue

      firedKeys.add(dueKey)
      showBrowserNotification(`${BRAND_NAME} — напоминание`, task.title, dueKey, task.id)
    }
  }

  async function pollServerDueReminders() {
    if (!getAccessToken()) return
    if (!settingsStore.appSettings.notifications) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    try {
      const due = await apiGet<Array<{ id?: number; task_id?: number; title?: string; task?: number }>>('reminders/due/')
      for (const item of due || []) {
        const taskId = String(item.task_id ?? item.task ?? item.id ?? '')
        if (!taskId || ackedDueIds.has(taskId)) continue
        ackedDueIds.add(taskId)
        showBrowserNotification(
          `${BRAND_NAME} — напоминание`,
          item.title || 'Напоминание о задаче',
          `due-${taskId}`,
          taskId,
        )
        try {
          await apiPost(`reminders/${taskId}/ack/`, {})
        }
        catch {
          /* ignore */
        }
      }
    }
    catch {
      /* polling is a fallback */
    }
  }

  async function syncPushIfLoggedIn() {
    if (!authStore.isLoggedIn) return
    if (!settingsStore.appSettings.notifications) return
    try {
      const { getFirebaseApp } = await import('~/lib/firebase')
      const { registerWebFcmDevice } = await import('~/utils/fcm-devices')
      const runtime = useRuntimeConfig()
      const fb = runtime.public.firebase as { vapidKey?: string } & Record<string, string>
      const app = getFirebaseApp(fb as never)
      // Do not auto-prompt: only register if permission already granted.
      const result = await registerWebFcmDevice(app, fb.vapidKey, {
        requestPermission: false,
      })
      if (!result.ok) {
        console.warn('[otter:fcm] auto-register skipped/failed:', result.reason, result.message)
      }
    }
    catch (err) {
      console.warn('[otter:fcm] syncPushIfLoggedIn error', err)
    }
  }

  // Permission prompt only from Settings (user gesture). Auto-register if already granted.
  void syncPushIfLoggedIn()
  void useSoundsStore().ensureFeedbackLoaded().catch(() => undefined)

  const localTimer = window.setInterval(checkDueNotifications, 15_000)
  const dueTimer = window.setInterval(() => { void pollServerDueReminders() }, 45_000)
  watch(() => tasksStore.tasks.length, checkDueNotifications)
  watch(() => settingsStore.appSettings.notifications, (enabled) => {
    if (enabled) {
      void syncPushIfLoggedIn()
      void checkDueNotifications()
      void pollServerDueReminders()
    }
  })
  watch(() => authStore.isLoggedIn, (loggedIn) => {
    if (loggedIn) {
      void syncPushIfLoggedIn()
      void pollServerDueReminders()
    }
  })

  nuxtApp.hook('app:unmounted', () => {
    window.clearInterval(localTimer)
    window.clearInterval(dueTimer)
  })
})
