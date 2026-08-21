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

  async function guardPremiumNav(
    event: Event,
    navigate: (e?: MouseEvent) => void,
    to: string,
  ) {
    if (!isPremiumNavPath(to)) {
      navigate(event as MouseEvent)
      return
    }

    if (premiumStore.isPremium) {
      navigate(event as MouseEvent)
      return
    }

    event.preventDefault()
    if (!premiumStore.subscription) {
      try {
        await premiumStore.fetchSubscription()
      }
      catch {
        // Network error: still block until we know Premium is active.
      }
    }

    if (premiumStore.isPremium) {
      await navigateTo(to)
      return
    }

    openPremiumModal()
  }

  return { guardPremiumNav }
}
