import type { ApiNotificationItem } from '~/types/mobile-api'

export type TaskReminderToastState = {
  visible: boolean
  title: string
  body: string
  taskId: string
  notificationId: number | null
}

const DEFAULT_MS = 3_000

/** Shared across plugin + component so dismiss cancels the auto-hide timer. */
let hideTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Compact ant-message-style reminder for WS `task.reminder` (web only).
 */
export function useTaskReminderToast() {
  const toast = useState<TaskReminderToastState>('app-task-reminder-toast', () => ({
    visible: false,
    title: '',
    body: '',
    taskId: '',
    notificationId: null,
  }))

  function hideReminder() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    toast.value.visible = false
  }

  function showReminder(
    notification: ApiNotificationItem,
    options: { durationMs?: number } = {},
  ) {
    if (import.meta.server) return

    hideReminder()
    const taskId = notification.data?.task_id
      || (notification.task != null ? String(notification.task) : '')

    toast.value = {
      visible: true,
      title: notification.title || 'Напоминание о задаче',
      body: notification.body || '',
      taskId,
      notificationId: notification.id ?? null,
    }

    hideTimer = setTimeout(() => {
      toast.value.visible = false
      hideTimer = null
    }, options.durationMs ?? DEFAULT_MS)
  }

  return { toast, showReminder, hideReminder }
}
