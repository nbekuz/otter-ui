import dayjs from 'dayjs'
import { BRAND_NAME } from '~/utils/site-info'

const firedKeys = new Set<string>()

function taskReminderKey(taskId: string, dueAt: string) {
  return `${taskId}:${dueAt}`
}

function getNotifyAt(task: { dueDate?: string; dueTime?: string; notification?: string }) {
  if (!task.dueDate || task.notification === undefined || task.notification === '') return null
  const time = task.dueTime || '00:00'
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

  async function ensurePermission() {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  function collectTasks() {
    const byId = new Map<string, (typeof tasksStore.tasks)[number]>()
    for (const task of tasksStore.tasks) byId.set(task.id, task)
    for (const task of tasksStore.calendarTasks) {
      if (!byId.has(task.id)) byId.set(task.id, task)
    }
    return Array.from(byId.values())
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

      // Fire within a 5-minute window after the reminder time
      if (now.isBefore(notifyAt) || now.diff(notifyAt, 'minute') > 5) continue

      firedKeys.add(dueKey)
      try {
        new Notification(`${BRAND_NAME} — напоминание`, {
          body: task.title,
          icon: '/favicon.ico',
          tag: dueKey,
        })
      }
      catch {
        /* ignore */
      }
    }
  }

  void ensurePermission()

  const timer = window.setInterval(checkDueNotifications, 15_000)
  watch(() => tasksStore.tasks.length, checkDueNotifications)
  watch(() => settingsStore.appSettings.notifications, (enabled) => {
    if (enabled) void ensurePermission().then(() => checkDueNotifications())
  })

  nuxtApp.hook('app:unmounted', () => {
    window.clearInterval(timer)
  })
})
