/**
 * Faqat `runtimeConfig.public.firebase` — Vercel/local uchun manual init.
 */
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApps, initializeApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'

export default defineNuxtPlugin({
  name: 'firebase',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig().public.firebase as FirebaseOptions

    const app: FirebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(config)
    const auth: Auth = getAuth(app)

    try {
      await setPersistence(auth, browserLocalPersistence)
    }
    catch {
      /* ba’zi muhitlarda — davom etamiz */
    }

    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: auth,
      },
    }
  },
})
