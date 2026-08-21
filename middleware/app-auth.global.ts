import { isPremiumNavPath } from '~/composables/usePremiumNavGuard'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  authStore.syncTokensFromStorage()

  if ((to.path.startsWith('/app') || to.path === '/profile-fill') && !authStore.isLoggedIn) {
    return navigateTo('/')
  }

  if (!authStore.isLoggedIn) return

  if (!authStore.profileLoaded) {
    try {
      await authStore.fetchMyProfile()
    }
    catch {
      authStore.logout()
      return
    }
  }

  if (to.path.startsWith('/app') && authStore.requiresProfileFill) {
    return navigateTo('/profile-fill')
  }

  if (to.path === '/profile-fill' && !authStore.requiresProfileFill) {
    return navigateTo('/app')
  }

  if (isPremiumNavPath(to.path)) {
    const premiumStore = usePremiumStore()
    if (!premiumStore.subscription) {
      try {
        await premiumStore.fetchSubscription()
      }
      catch {
        // Fall through: allow the page and let 403 open the paywall.
      }
    }
    if (premiumStore.subscription && !premiumStore.isPremium) {
      usePremiumModal().openPremiumModal()
      return navigateTo('/app')
    }
  }
})
