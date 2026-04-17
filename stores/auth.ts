import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { mockUser, type User } from '~/data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<User | null>('otter.auth.user', null)
  const demoToken = useLocalStorage<string | null>('otter.auth.demo-token', null)
  const isLoggedIn = computed(() => !!user.value && !!demoToken.value)

  function setSession(nextUser: User) {
    user.value = nextUser
    demoToken.value = `demo_${Date.now()}`
  }

  // Mock login (always succeeds)
  function login(email: string, _password: string) {
    setSession({ ...mockUser, email })
    navigateTo('/app')
  }

  // Mock register
  function register(email: string, _password: string) {
    setSession({ ...mockUser, email, name: email.split('@')[0] })
    navigateTo('/app')
  }

  // Mock Google login
  function loginWithGoogle() {
    setSession({ ...mockUser })
    navigateTo('/app')
  }

  function logout() {
    user.value = null
    demoToken.value = null
    navigateTo('/')
  }

  function updateAvatar(url: string) {
    if (user.value) user.value.avatar = url
  }

  function updateName(name: string) {
    if (user.value) user.value.name = name
  }

  function activatePremium() {
    if (user.value) {
      const premiumExpiresAt = new Date()
      premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1)
      user.value.isPremium = true
      user.value.premiumExpiresAt = premiumExpiresAt.toISOString()
    }
  }

  return {
    user,
    demoToken,
    isLoggedIn,
    login,
    register,
    loginWithGoogle,
    logout,
    updateAvatar,
    updateName,
    activatePremium,
  }
})
