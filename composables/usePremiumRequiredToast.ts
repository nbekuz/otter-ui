import { getApiErrorCode } from '~/utils/api'
import { isPremiumNavPath } from '~/composables/usePremiumNavGuard'

export type PremiumFeature = 'pomodoro' | 'calendar' | 'matrix' | 'taskAttachments'

export const PREMIUM_REQUIRED_MESSAGES: Record<PremiumFeature, string> = {
  pomodoro: 'Таймер Помодоро доступен с подключенным Premium',
  calendar: 'Календарь доступен с подключенным Premium',
  matrix: 'Матрица Эйзенхауэра доступна с подключенным Premium',
  taskAttachments: 'Добавление файлов к задаче доступно только с Premium',
}

/**
 * Opens the Premium modal on PREMIUM_REQUIRED and leaves gated sections.
 * Every click / 403 shows the modal again (not once per session).
 */
export function usePremiumRequiredToast() {
  const { openPremiumModal } = usePremiumModal()

  function handlePremiumRequired(
    feature: PremiumFeature,
    error: unknown,
    _options: { once?: boolean } = {},
  ): boolean {
    if (getApiErrorCode(error) !== 'PREMIUM_REQUIRED')
      return false

    if (feature === 'taskAttachments')
      return false

    openPremiumModal()

    if (import.meta.client) {
      const route = useRoute()
      if (isPremiumNavPath(route.path)) {
        void navigateTo('/app')
      }
    }

    return true
  }

  return { handlePremiumRequired, PREMIUM_REQUIRED_MESSAGES }
}
