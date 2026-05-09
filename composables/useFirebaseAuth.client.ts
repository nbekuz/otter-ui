import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type { Auth } from 'firebase/auth'
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth'
import { FIREBASE_ID_TOKEN_STORAGE_KEY } from '~/utils/auth-session'

/** Redirect boshlanganda yoziladi — qaytishdan keyin fallback va tozalash uchun */
export const GOOGLE_REDIRECT_PENDING_KEY = 'otter:googleRedirectStartedAt'

const REDIRECT_FALLBACK_MAX_MS = 6 * 60 * 1000

let analyticsInitialized = false

function readRedirectPendingFresh(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  const raw = sessionStorage.getItem(GOOGLE_REDIRECT_PENDING_KEY)
  if (!raw) return false
  const ts = Number(raw)
  if (Number.isNaN(ts)) {
    sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY)
    return false
  }
  if (Date.now() - ts > REDIRECT_FALLBACK_MAX_MS) {
    sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY)
    return false
  }
  return true
}

function clearRedirectPending() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY)
  }
}

function authHasGoogleProvider(auth: Auth): boolean {
  return auth.currentUser?.providerData?.some(p => p.providerId === 'google.com') ?? false
}

async function ensureAnalytics(app: FirebaseApp) {
  if (!import.meta.client || analyticsInitialized) return
  if (await isSupported()) {
    getAnalytics(app)
    analyticsInitialized = true
  }
}

export function useFirebaseAuth() {
  const nuxtApp = useNuxtApp()
  const runtime = useRuntimeConfig()

  function getFirebaseApp(): FirebaseApp {
    const fromPlugin = nuxtApp.$firebaseApp
    if (fromPlugin) {
      void ensureAnalytics(fromPlugin)
      return fromPlugin
    }

    const existing = getApps()[0]
    if (existing) {
      void ensureAnalytics(existing)
      return existing
    }

    const firebaseConfig = runtime.public.firebase as FirebaseOptions
    const app = initializeApp(firebaseConfig)
    void ensureAnalytics(app)
    return app
  }

  function getFirebaseAuth(): Auth {
    const fromPlugin = nuxtApp.$firebaseAuth
    if (fromPlugin)
      return fromPlugin
    return getAuth(getFirebaseApp())
  }

  /**
   * To‘liq sahifa redirect — COOP / popup muammolaridan qochadi.
   * Qaytganidan keyin `tryFinishGoogleRedirect()` chaqiriladi (plugin yoki sahifa).
   */
  async function startGoogleRedirect(): Promise<void> {
    if (import.meta.server) {
      throw new Error('Google sign-in is only available in the browser')
    }

    console.log('[otter:google] startGoogleRedirect → signInWithRedirect', {
      origin: typeof window !== 'undefined' ? window.location.origin : null,
      projectId: (runtime.public.firebase as FirebaseOptions)?.projectId,
    })

    const auth = getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, String(Date.now()))
    await signInWithRedirect(auth, provider)
  }

  /**
   * Google OAuth redirect tugagach — bir marta ID token qaytaradi yoki `null`.
   */
  async function tryFinishGoogleRedirect(): Promise<string | null> {
    if (import.meta.server) return null

    const auth = getFirebaseAuth()
    const expectingRedirectFallback = readRedirectPendingFresh()

    console.log('[otter:google] tryFinishGoogleRedirect: authStateReady + getRedirectResult…')

    try {
      await auth.authStateReady()
    }
    catch (e) {
      console.warn('[otter:google] authStateReady:', e)
    }

    try {
      const result = await getRedirectResult(auth)
      let user = result?.user ?? null

      if (!user && expectingRedirectFallback && auth.currentUser && authHasGoogleProvider(auth)) {
        console.warn(
          '[otter:google] getRedirectResult bo‘sh, lekin Yangi sahifa/auth tugagach currentUser qoldi — token shundan olinadi. (HMR yoki race baribir bo‘lishi mumkin.)',
          { uid: auth.currentUser.uid }
        )
        user = auth.currentUser
      }

      if (expectingRedirectFallback) {
        clearRedirectPending()
      }

      if (!user) {
        console.log('[otter:google] getRedirectResult: foydalanuvchi yo‘q', {
          expectingRedirectFallback,
          hadCurrentUser: !!auth.currentUser,
          googleLinked: authHasGoogleProvider(auth),
        })
        return null
      }

      const token = await user.getIdToken()
      console.log('[otter:google] Firebase user + ID token OK', {
        uid: user.uid,
        email: user.email,
        tokenLength: token?.length ?? 0,
        storageKey: FIREBASE_ID_TOKEN_STORAGE_KEY,
      })
      localStorage.setItem(FIREBASE_ID_TOKEN_STORAGE_KEY, token)
      return token
    }
    catch (err) {
      if (expectingRedirectFallback) {
        clearRedirectPending()
      }
      console.error('[otter:google] getRedirectResult xato:', err)
      return null
    }
  }

  return {
    getFirebaseApp,
    getFirebaseAuth,
    startGoogleRedirect,
    tryFinishGoogleRedirect,
  }
}
