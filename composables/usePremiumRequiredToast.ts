import { getApiErrorCode } from '~/utils/api'

export type PremiumFeature = 'pomodoro' | 'calendar' | 'matrix' | 'taskAttachments'

export const PREMIUM_REQUIRED_MESSAGES: Record<PremiumFeature, string> = {
  pomodoro: 'Таймер Помодоро доступен с подключенным Premium',
  calendar: 'Календарь доступен с подключенным Premium',
  matrix: 'Матрица Эйзенхауэра доступна с подключенным Premium',
  taskAttachments: 'Добавление файлов к задаче доступно только с Premium',
}

/**
 * Открывает окно Premium при PREMIUM_REQUIRED (calendar/matrix/pomodoro).
 * Для calendar/matrix — один раз за сессию (чтобы не спамить при смене даты/вида).
 * Для pomodoro — каждый клик Play.
 */
export function usePremiumRequiredToast() {
  const shown = useState<Partial<Record<PremiumFeature, boolean>>>('premium-required-modal-shown', () => ({}))
  const { openPremiumModal } = usePremiumModal()

  function handlePremiumRequired(
    feature: PremiumFeature,
    error: unknown,
    options: { once?: boolean } = {},
  ): boolean {
    if (getApiErrorCode(error) !== 'PREMIUM_REQUIRED')
      return false

    if (feature === 'taskAttachments')
      return false

    const once = options.once ?? feature !== 'pomodoro'
    if (once && shown.value[feature])
      return true

    shown.value = { ...shown.value, [feature]: true }
    openPremiumModal()
    return true
  }

  return { handlePremiumRequired, PREMIUM_REQUIRED_MESSAGES }
}
