export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const tasksStore = useTasksStore()
  const settingsStore = useSettingsStore()
  const pomodoroStore = usePomodoroStore()

  async function loadAppData() {
    if (!authStore.isLoggedIn) {
      tasksStore.reset()
      return
    }

    await Promise.all([
      tasksStore.fetchGrouped().catch(() => undefined),
      settingsStore.fetchFromApi().catch(() => undefined),
      pomodoroStore.fetchSettings().catch(() => undefined),
      pomodoroStore.fetchSessions().catch(() => undefined),
    ])
  }

  watch(
    () => authStore.isLoggedIn,
    loggedIn => {
      if (loggedIn) void loadAppData()
      else tasksStore.reset()
    },
    { immediate: true },
  )
})
