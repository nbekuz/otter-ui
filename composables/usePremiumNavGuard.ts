const PREMIUM_NAV_PATHS = new Set(['/app/calendar', '/app/matrix', '/app/pomodoro'])

export function isPremiumNavPath(path: string) {
  const normalized = (path.split('?')[0] || '/').replace(/\/+$/, '') || '/'
  return PREMIUM_NAV_PATHS.has(normalized)
    || normalized.startsWith('/app/calendar/')
    || normalized.startsWith('/app/matrix/')
    || normalized.startsWith('/app/pomodoro/')
}

export function usePremiumNavGuard() {
  const premiumStore = usePremiumStore()
  const { openPremiumModal } = usePremiumModal()

  function guardPremiumNav(event: Event, navigate: () => void, to: string) {
    if (!isPremiumNavPath(to) || premiumStore.isPremium) {
      navigate()
      return
    }

    event.preventDefault()
    openPremiumModal()
  }

  return { guardPremiumNav }
}
