import dayjs from 'dayjs'

const firedKeys = new Set<string>()

function taskReminderKey(taskId: string, dueAt: string) {
  return `${taskId}:${dueAt}`
}

function getNotifyAt(task: { dueDate?: string; dueTime?: string; notification?: string }) {
  if (!task.dueDate || !task.notification) return null
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

  function checkDueNotifications() {
    if (!settingsStore.appSettings.notifications) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const now = dayjs()

    for (const task of tasksStore.tasks) {
      if (task.completed || !task.notification) continue

      const notifyAt = getNotifyAt(task)
      if (!notifyAt) continue

      const dueKey = taskReminderKey(task.id, notifyAt.format())
      if (firedKeys.has(dueKey)) continue

      if (now.isBefore(notifyAt) || now.diff(notifyAt, 'minute') > 2) continue

      firedKeys.add(dueKey)
      try {
        new Notification('Otter — напоминание', {
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

  const timer = window.setInterval(checkDueNotifications, 30_000)
  watch(() => tasksStore.tasks.length, checkDueNotifications)

  nuxtApp.hook('app:unmounted', () => {
    window.clearInterval(timer)
  })
})
