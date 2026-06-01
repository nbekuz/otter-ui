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
})
