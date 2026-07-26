import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { User } from '~/data/mockData'
import { apiDelete, apiGet, apiPost, apiPut } from '~/utils/api'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '~/utils/auth-session'
import { resolveMediaUrl } from '~/utils/media'
import { registerWebFcmDevice, unregisterWebFcmDevice } from '~/utils/fcm-devices'
import { getFirebaseApp } from '~/lib/firebase'
import type { FirebaseOptions } from 'firebase/app'

interface BackendUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string | null
}

interface LoginResponse {
  tokens: {
    access: string
    refresh: string
  }
}

interface RegisterResponse extends LoginResponse {
  user: BackendUser
}

interface GoogleLoginPayload {
  firebase_token: string
}

interface GoogleLoginResponse extends RegisterResponse {}
interface RegisterOptions {
  navigateOnSuccess?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<User | null>('otter.auth.user', null)
  const accessToken = ref<string | null>(import.meta.client ? getAccessToken() : null)
  const refreshToken = ref<string | null>(import.meta.client ? getRefreshToken() : null)
  const tokenRevision = ref(0)
  const profileFirstName = useLocalStorage<string>('otter.auth.first-name', '')
  const profileLastName = useLocalStorage<string>('otter.auth.last-name', '')
  const profileLoaded = ref(false)

  function syncTokensFromStorage() {
    accessToken.value = getAccessToken()
    refreshToken.value = getRefreshToken()
    tokenRevision.value += 1
  }

  const isLoggedIn = computed(() => {
    tokenRevision.value
    return !!getAccessToken()
  })
  const requiresProfileFill = computed(() =>
    isLoggedIn.value && (!profileFirstName.value.trim() || !profileLastName.value.trim())
  )

  function mapBackendUser(nextUser: BackendUser): User {
    const fullName = `${nextUser.first_name || ''} ${nextUser.last_name || ''}`.trim()
    return {
      id: String(nextUser.id),
      email: nextUser.email,
      name: fullName || nextUser.email.split('@')[0] || 'User',
      avatar: resolveMediaUrl(nextUser.avatar) || undefined,
      isPremium: user.value?.isPremium || false,
      premiumExpiresAt: user.value?.premiumExpiresAt,
    }
  }

  function applyTokens(tokens: LoginResponse['tokens']) {
    setAuthTokens(tokens)
    syncTokensFromStorage()
  }

  async function syncPushDevice() {
    if (!import.meta.client) return
    try {
      const runtime = useRuntimeConfig()
      const firebaseConfig = runtime.public.firebase as FirebaseOptions & { vapidKey?: string }
      const app = getFirebaseApp(firebaseConfig)
      const result = await registerWebFcmDevice(app, firebaseConfig.vapidKey, {
        requestPermission: false,
      })
      if (!result.ok) {
        console.warn('[otter:fcm] login register:', result.reason, result.message)
      }
    }
    catch (err) {
      console.warn('[otter:fcm] syncPushDevice error', err)
    }
  }

  function setSession(nextUser: BackendUser, tokens: LoginResponse['tokens']) {
    applyTokens(tokens)
    profileFirstName.value = nextUser.first_name || ''
    profileLastName.value = nextUser.last_name || ''
    profileLoaded.value = true
    user.value = mapBackendUser(nextUser)
  }

  async function fetchMyProfile() {
    const profile = await apiGet<BackendUser>('profile/')
    profileFirstName.value = profile.first_name || ''
    profileLastName.value = profile.last_name || ''
    profileLoaded.value = true
    user.value = mapBackendUser(profile)

    // Profile API premium bermaydi — settings / subscription dan qayta sync
    const settingsStore = useSettingsStore()
    if (settingsStore.isPremium && user.value) {
      user.value.isPremium = true
      user.value.premiumExpiresAt = settingsStore.premiumActivatedAt || user.value.premiumExpiresAt
    }

    return profile
  }

  async function updateProfile(first_name: string, last_name: string, avatar?: File) {
    const formData = new FormData()
    formData.append('first_name', first_name)
    formData.append('last_name', last_name)
    if (avatar) {
      formData.append('avatar', avatar)
    }

    const profile = await apiPut<BackendUser>('profile/', formData)

    profileFirstName.value = profile.first_name || ''
    profileLastName.value = profile.last_name || ''
    profileLoaded.value = true
    user.value = mapBackendUser(profile)
    return profile
  }

  async function login(email: string, password: string) {
    const response = await apiPost<LoginResponse>('auth/login/', {
      email,
      password,
    })
    applyTokens(response.tokens)
    await fetchMyProfile()
    void syncPushDevice()
    navigateTo('/app')
  }

  async function register(
    email: string,
    password: string,
    first_name = '',
    last_name = '',
    options: RegisterOptions = {}
  ) {
    const { navigateOnSuccess = true } = options
    const response = await apiPost<RegisterResponse>('auth/register/', {
      email,
      password,
      first_name,
      last_name,
    })
    setSession(response.user, response.tokens)
    void syncPushDevice()
    if (navigateOnSuccess) {
      navigateTo('/app')
    }
    return response
  }

  async function loginWithGoogle(payload?: GoogleLoginPayload) {
    if (!payload?.firebase_token) {
      console.warn('[otter:google] loginWithGoogle: firebase_token yo‘q, chiqildi')
      return
    }

    console.log('[otter:google] loginWithGoogle: auth/google/ so‘rov yuborilmoqda…')
    const response = await apiPost<GoogleLoginResponse>('auth/google/', payload)
    console.log('[otter:google] loginWithGoogle: javob keldi', {
      userId: response?.user?.id,
      email: response?.user?.email,
      hasAccess: !!response?.tokens?.access,
      hasRefresh: !!response?.tokens?.refresh,
    })

    setSession(response.user, response.tokens)
    await fetchMyProfile()
    void syncPushDevice()
    console.log('[otter:google] navigateTo(/app)')
    navigateTo('/app')
  }

  async function forgotPassword(email: string) {
    return apiPost<{ detail: string }>('auth/forgot-password/', { email })
  }

  async function forgotPasswordVerify(email: string, code: string) {
    return apiPost<{ reset_token: string }>('auth/forgot-password/verify/', {
      email,
      code,
    })
  }

  async function forgotPasswordConfirm(reset_token: string, new_password: string) {
    return apiPost<{ detail: string }>('auth/forgot-password/confirm/', {
      reset_token,
      new_password,
    })
  }

  /** POST `profile/change-password/` — Bearer access; body: faqat `new_password` (Swagger). */
  async function changePassword(newPassword: string) {
    return apiPost<{ detail?: string }>('profile/change-password/', {
      new_password: newPassword,
    })
  }

  /** DELETE `profile/` — permanently removes the account. */
  async function deleteAccount() {
    await apiDelete('profile/')
    logout()
  }

  async function logout() {
    try {
      await unregisterWebFcmDevice()
    }
    catch {
      /* ignore */
    }
    const tasksStore = useTasksStore()
    const premiumStore = usePremiumStore()
    const settingsStore = useSettingsStore()
    const notificationsStore = useNotificationsStore()
    tasksStore.reset()
    premiumStore.reset()
    notificationsStore.reset()
    settingsStore.isPremium = false
    settingsStore.premiumActivatedAt = null
    clearAuthSession()
    syncTokensFromStorage()
    user.value = null
    profileFirstName.value = ''
    profileLastName.value = ''
    profileLoaded.value = false
    navigateTo('/')
  }

  function updateAvatar(url: string) {
    if (user.value) user.value.avatar = url
  }

  function updateName(name: string) {
    if (user.value) user.value.name = name
  }

  async function startPremiumCheckout(
    tariff = 'monthly',
    options: { recurringConsent?: boolean } = {},
  ) {
    const premiumStore = usePremiumStore()
    return premiumStore.checkout(tariff, options)
  }

  async function refreshPremiumSubscription() {
    const premiumStore = usePremiumStore()
    return premiumStore.fetchSubscription()
  }

  async function startPremiumTrial(tariff = 'monthly', recurringConsent = false) {
    const premiumStore = usePremiumStore()
    return premiumStore.startTrial(tariff, recurringConsent)
  }

  async function cancelPremiumSubscription() {
    const premiumStore = usePremiumStore()
    return premiumStore.cancel()
  }

  return {
    user,
    accessToken,
    refreshToken,
    profileFirstName,
    profileLastName,
    profileLoaded,
    isLoggedIn,
    requiresProfileFill,
    syncTokensFromStorage,
    fetchMyProfile,
    updateProfile,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    forgotPasswordVerify,
    forgotPasswordConfirm,
    changePassword,
    deleteAccount,
    logout,
    updateAvatar,
    updateName,
    startPremiumCheckout,
    refreshPremiumSubscription,
    startPremiumTrial,
    cancelPremiumSubscription,
  }
})
