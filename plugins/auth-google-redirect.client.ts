function logGoogleAxiosLikeError(prefix: string, e: unknown) {
  const err = e as {
    message?: string
    response?: { status?: number; statusText?: string; data?: unknown }
    config?: { baseURL?: string; url?: string; method?: string }
  }
  console.error(prefix, {
    message: err?.message,
    status: err?.response?.status,
    statusText: err?.response?.statusText,
    responseData: err?.response?.data,
    request: err?.config
      ? `${String(err.config.method || 'post').toUpperCase()} ${err.config.baseURL || ''}${err.config.url || ''}`
      : undefined,
  })
}

function formatGoogleBackendError(e: unknown): string {
  const err = e as { response?: { data?: { detail?: unknown } }; message?: string }
  const d = err?.response?.data?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map(String).join(' ')
  if (d && typeof d === 'object') return JSON.stringify(d)
  return err?.message || "Server xatoligi (auth/google/). Backend loglarini tekshiring."
}

/**
 * Google OAuth redirect tugagach Firebase ID token olinadi va backend `auth/google/` chaqiriladi.
 */
export default defineNuxtPlugin({
  name: 'auth-google-redirect',
  /** Hydratsiya/auth URL qayta ishlashi tugaguncha boshqa pluginlar keyin ishga tushsin */
  enforce: 'post',
  async setup() {
    const authStore = useAuthStore()
    if (authStore.isLoggedIn) {
      console.log('[otter:google] plugin skip: allaqachon logged in')
      return
    }

    const { tryFinishGoogleRedirect } = useFirebaseAuth()
    const firebase_token = await tryFinishGoogleRedirect()
    if (!firebase_token) {
      console.log('[otter:google] plugin: firebase_token yo‘q — backend chaqirilmaydi')
      return
    }

    console.log('[otter:google] plugin: POST auth/google/…', {
      firebaseTokenLength: firebase_token.length,
    })

    try {
      await authStore.loginWithGoogle({ firebase_token })
      console.log('[otter:google] plugin: loginWithGoogle muvaffaqiyat')
    }
    catch (e) {
      logGoogleAxiosLikeError('[otter:google] loginWithGoogle backend xato:', e)
      const pending = useState<string | null>('googleBackendError', () => null)
      pending.value = formatGoogleBackendError(e)
    }
  },
})
