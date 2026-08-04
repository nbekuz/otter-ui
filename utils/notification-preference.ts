import {
  enableWebPushNotifications,
  unregisterWebFcmDevice,
  type WebPushRegisterResult,
} from '~/utils/fcm-devices'

export type NotificationPreferenceResult = {
  ok: boolean
  enabled: boolean
  message: string
  push?: WebPushRegisterResult
}

/**
 * Turns app notifications on/off end-to-end for web:
 * - preference in settings API
 * - FCM device register / unregister
 * - notifications WSS reconnects/disconnects via plugin watch on `notifications`
 */
export async function setAppNotificationsEnabled(
  enabled: boolean,
): Promise<NotificationPreferenceResult> {
  const settingsStore = useSettingsStore()

  if (!enabled) {
    // 1) Stop push delivery first
    await unregisterWebFcmDevice()
    // 2) Persist preference — WSS plugin watches this and disconnects
    await settingsStore.updateSettings({ notifications: false })
    return {
      ok: true,
      enabled: false,
      message: 'Уведомления выключены',
    }
  }

  // Enable preference first so WSS can reconnect immediately
  await settingsStore.updateSettings({ notifications: true })

  // Browser push: request permission (user gesture) + register device
  const push = await enableWebPushNotifications()
  if (!push.ok) {
    return {
      ok: false,
      enabled: true,
      message: push.message,
      push,
    }
  }

  return {
    ok: true,
    enabled: true,
    message: 'Уведомления включены',
    push,
  }
}
