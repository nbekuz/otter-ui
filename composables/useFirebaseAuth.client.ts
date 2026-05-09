import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type { Auth } from 'firebase/auth'
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth'
import { FIREBASE_ID_TOKEN_STORAGE_KEY } from '~/utils/auth-session'

/** Redirect boshlanganda — `currentUser` fallback uchun */
export const GOOGLE_REDIRECT_PENDING_KEY = 'otter:googleRedirectStartedAt'

const REDIRECT_FALLBACK_MAX_MS = 6 * 60 * 1000

/** `getRedirectResult` faqat 1× bir mount sikli uchun */
let finishRedirectInFlight: Promise<string | null> | null = null

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

/**
 * Redirect qaytishi: `getRedirectResult` birinchi (Firebase tavsiyasi), keyin `authStateReady`.
 * Marker bor bo‘lsa — qisqa kechikish (router / storage sinxroni uchun).
 */
async function finishRedirectFlowOnce(auth: Auth): Promise<string | null> {
  const expectingRedirectFallback = readRedirectPendingFresh()

  console.log('[otter:google] finishRedirectFlow', {
    origin: typeof window !== 'undefined' ? window.location.origin : null,
    href: typeof window !== 'undefined' ? window.location.href.slice(0, 120) : null,
    appName: auth?.app?.name,
    configAuthDomain: auth?.config?.authDomain,
    pendingMarker: expectingRedirectFallback,
    currentUserUid: auth.currentUser?.uid ?? null,
  })

  if (expectingRedirectFallback) {
    await new Promise<void>(resolve => setTimeout(resolve, 120))
  }

  let result: Awaited<ReturnType<typeof getRedirectResult>> | null = null
  try {
    result = await getRedirectResult(auth)
    console.log('[otter:google] getRedirectResult:', result ? { uid: result.user?.uid } : 'NO_REDIRECT_RESULT (null)')
  }
  catch (err) {
    if (expectingRedirectFallback)
      clearRedirectPending()
    console.error('[otter:google] getRedirectResult error:', err)
    return null
  }

  try {
    await auth.authStateReady()
    console.log('[otter:google] authStateReady OK')
  }
  catch (e) {
    console.warn('[otter:google] authStateReady:', e)
  }

  let user = result?.user ?? null

  if (!user && expectingRedirectFallback && auth.currentUser && authHasGoogleProvider(auth)) {
    console.warn('[otter:google] fallback: currentUser', { uid: auth.currentUser.uid })
    user = auth.currentUser
  }

  if (expectingRedirectFallback) {
    clearRedirectPending()
  }

  if (!user) {
    if (expectingRedirectFallback) {
      console.warn(
        '[otter:google] redirect marker bor edi, lekin token yo‘q. Tekshiring: bir xil host (localhost vs 127.0.0.1), '
        + 'Firebase Authorized domains (Vercel domeni), Google OAuth redirect URI.',
      )
    }
    return null
  }

  const token = await user.getIdToken()
  console.log('[otter:google] ID token OK', {
    uid: user.uid,
    email: user.email,
    tokenLength: token?.length ?? 0,
  })
  localStorage.setItem(FIREBASE_ID_TOKEN_STORAGE_KEY, token)
  return token
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

  async function loginWithGoogleRedirect(): Promise<void> {
    if (import.meta.server) {
      throw new Error('Google sign-in is only available in the browser')
    }

    finishRedirectInFlight = null

    console.log('[otter:google] loginWithGoogleRedirect → signInWithRedirect', {
      origin: typeof window !== 'undefined' ? window.location.origin : null,
      projectId: (runtime.public.firebase as FirebaseOptions)?.projectId,
      authFromPlugin: !!nuxtApp.$firebaseAuth,
    })

    const auth = nuxtApp.$firebaseAuth ?? getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, String(Date.now()))
    try {
      await signInWithRedirect(auth, provider)
    }
    catch (e) {
      clearRedirectPending()
      throw e
    }
  }

  async function loginWithGooglePopup(): Promise<string> {
    if (import.meta.server) {
      throw new Error('Google sign-in is only available in the browser')
    }
    const auth = nuxtApp.$firebaseAuth ?? getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const credential = await signInWithPopup(auth, provider)
    const token = await credential.user.getIdToken()
    localStorage.setItem(FIREBASE_ID_TOKEN_STORAGE_KEY, token)
    console.log('[otter:google] popup: ID token OK', { tokenLength: token.length })
    return token
  }

  async function tryFinishGoogleRedirect(): Promise<string | null> {
    if (import.meta.server) return null

    const auth = nuxtApp.$firebaseAuth ?? getFirebaseAuth()

    if (!finishRedirectInFlight) {
      finishRedirectInFlight = finishRedirectFlowOnce(auth).finally(() => {
        finishRedirectInFlight = null
      })
    }

    return finishRedirectInFlight
  }

  return {
    getFirebaseApp,
    getFirebaseAuth,
    startGoogleRedirect: loginWithGoogleRedirect,
    loginWithGoogleRedirect,
    loginWithGooglePopup,
    tryFinishGoogleRedirect,
  }
}
