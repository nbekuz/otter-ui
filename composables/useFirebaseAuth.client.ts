import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type { Auth } from 'firebase/auth'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { FIREBASE_ID_TOKEN_STORAGE_KEY } from '~/utils/auth-session'

let analyticsInitialized = false

async function ensureAnalytics(app: FirebaseApp) {
  if (!import.meta.client || analyticsInitialized) return
  if (await isSupported()) {
    getAnalytics(app)
    analyticsInitialized = true
  }
}

/**
 * Firebase Auth — faqat **popup** (Vercel’da `__/auth/iframe` + X-Frame-Options muammosiz).
 */
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
   * Google popup → Firebase ID token (keyin `authStore.loginWithGoogle({ firebase_token })`).
   */
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
    console.log('[otter:google] popup OK', { tokenLength: token.length })

    return token
  }

  return {
    getFirebaseApp,
    getFirebaseAuth,
    loginWithGooglePopup,
  }
}
