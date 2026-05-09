/**
 * Faqat `runtimeConfig.public.firebase` — Vercel/local uchun manual init.
 * `init.js` / Hosting auto-config Nuxt’da kerak emas; 404 ko‘rinsa, odatda `*.firebaseapp.com` iframe.
 */
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApps, initializeApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin({
  name: 'firebase',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig().public.firebase as FirebaseOptions

    const app: FirebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(config)
    const auth: Auth = getAuth(app)

    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: auth,
      },
    }
  },
})
