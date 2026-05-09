/**
 * Firebase ilovasini faqat `initializeApp(config)` orqali ishga tushiradi.
 * Nuxt `app.head` yoki HTML orqali CDN / Hosting auto-init ulanmaydi.
 */
import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'

let cachedApp: FirebaseApp | null = null
let cachedKey = ''

function configKey(c: FirebaseOptions): string {
  return `${c.apiKey}|${c.projectId}|${c.appId}`
}

export function getFirebaseApp(config: FirebaseOptions): FirebaseApp {
  const key = configKey(config)
  if (cachedApp && cachedKey === key) {
    return cachedApp
  }

  const existing = getApps()[0]
  if (existing) {
    cachedApp = existing
    cachedKey = key
    return existing
  }

  cachedApp = initializeApp(config)
  cachedKey = key
  return cachedApp
}

export function resetFirebaseAppForTests() {
  cachedApp = null
  cachedKey = ''
}
