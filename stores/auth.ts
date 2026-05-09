import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { User } from '~/data/mockData'
import { apiGet, apiPost, apiPut } from '~/utils/api'
import { clearAuthSession, setAuthTokens } from '~/utils/auth-session'

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
  const accessToken = useLocalStorage<string | null>('access_token', null)
  const refreshToken = useLocalStorage<string | null>('refresh_token', null)
  const profileFirstName = useLocalStorage<string>('otter.auth.first-name', '')
  const profileLastName = useLocalStorage<string>('otter.auth.last-name', '')
  const profileLoaded = ref(false)
  const isLoggedIn = computed(() => !!accessToken.value)
  const requiresProfileFill = computed(() =>
    isLoggedIn.value && (!profileFirstName.value.trim() || !profileLastName.value.trim())
  )

  function mapBackendUser(nextUser: BackendUser): User {
    const fullName = `${nextUser.first_name || ''} ${nextUser.last_name || ''}`.trim()
    return {
      id: String(nextUser.id),
      email: nextUser.email,
      name: fullName || nextUser.email.split('@')[0] || 'User',
      avatar: nextUser.avatar || undefined,
      isPremium: user.value?.isPremium || false,
      premiumExpiresAt: user.value?.premiumExpiresAt,
    }
  }

  function setSession(nextUser: BackendUser, tokens: LoginResponse['tokens']) {
    setAuthTokens(tokens)
    profileFirstName.value = nextUser.first_name || ''
    profileLastName.value = nextUser.last_name || ''
    profileLoaded.value = true
    user.value = mapBackendUser(nextUser)
    accessToken.value = tokens.access
    refreshToken.value = tokens.refresh
  }

  async function fetchMyProfile() {
    const profile = await apiGet<BackendUser>('profile/')
    profileFirstName.value = profile.first_name || ''
    profileLastName.value = profile.last_name || ''
    profileLoaded.value = true
    user.value = mapBackendUser(profile)
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
    accessToken.value = response.tokens.access
    refreshToken.value = response.tokens.refresh
    setAuthTokens(response.tokens)
    await fetchMyProfile()
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

  function logout() {
    clearAuthSession()
    user.value = null
    accessToken.value = null
    refreshToken.value = null
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
    accessToken,
    refreshToken,
    profileFirstName,
    profileLastName,
    profileLoaded,
    isLoggedIn,
    requiresProfileFill,
    fetchMyProfile,
    updateProfile,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    forgotPasswordVerify,
    forgotPasswordConfirm,
    changePassword,
    logout,
    updateAvatar,
    updateName,
    activatePremium,
  }
})
