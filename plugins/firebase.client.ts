/**
 * Faqat `runtimeConfig.public.firebase` — Vercel/local uchun manual init.
 *
 * `setPersistence` IndexedDB/Google storage ga bog‘liq. Yandex Protect buni
 * osiltirishi mumkin — await qilinsa Vue mount/hydration bloklanadi va
 * login/register submit ishlamaydi. Persistence fonida ketadi.
 */
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApps, initializeApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'

export default defineNuxtPlugin({
  name: 'firebase',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig().public.firebase as FirebaseOptions

    const app: FirebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(config)
    const auth: Auth = getAuth(app)

    void setPersistence(auth, browserLocalPersistence).catch(() => {
      /* Yandex Protect / blocked IndexedDB — login/register davom etsin */
    })

    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: auth,
      },
    }
  },
})
