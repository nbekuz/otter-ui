export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  if (to.path.startsWith('/app') && !authStore.isLoggedIn) {
    return navigateTo('/')
  }
})
