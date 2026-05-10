export const ACCESS_TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

/** Debug: Google redirectdan keyin Firebase ID token (faqat ko‘rish / tekshirish). */
export const FIREBASE_ID_TOKEN_STORAGE_KEY = 'otter.firebase.id_token'

/** «Запомнить» — email va parol (faqat client, mahalliy qurilma). */
const REMEMBER_LOGIN_FLAG = 'otter.auth.remember-login'
const REMEMBER_LOGIN_EMAIL = 'otter.auth.saved-login-email'
const REMEMBER_LOGIN_PASSWORD = 'otter.auth.saved-login-password'

const LEGACY_ACCESS_KEY = 'otter.auth.access-token'
const LEGACY_REFRESH_KEY = 'otter.auth.refresh-token'

let legacyMigrated = false

export interface AuthTokens {
  access: string
  refresh: string
}

export function migrateLegacyTokens() {
  if (!import.meta.client || legacyMigrated) return
  legacyMigrated = true

  if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
    const old = localStorage.getItem(LEGACY_ACCESS_KEY)
    if (old) localStorage.setItem(ACCESS_TOKEN_KEY, old)
  }
  localStorage.removeItem(LEGACY_ACCESS_KEY)

  if (!localStorage.getItem(REFRESH_TOKEN_KEY)) {
    const old = localStorage.getItem(LEGACY_REFRESH_KEY)
    if (old) localStorage.setItem(REFRESH_TOKEN_KEY, old)
  }
  localStorage.removeItem(LEGACY_REFRESH_KEY)
}

export function getAccessToken() {
  if (!import.meta.client) return null
  migrateLegacyTokens()
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  if (!import.meta.client) return null
  migrateLegacyTokens()
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(tokens: AuthTokens) {
  if (!import.meta.client) return
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
}

export function clearAuthSession() {
  if (!import.meta.client) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(LEGACY_ACCESS_KEY)
  localStorage.removeItem(LEGACY_REFRESH_KEY)
  localStorage.removeItem('otter.auth.user')
  localStorage.removeItem(FIREBASE_ID_TOKEN_STORAGE_KEY)
}

if (import.meta.client) {
  migrateLegacyTokens()
}

export function readRememberedLogin(): { email: string, password: string } | null {
  if (!import.meta.client) return null
  if (localStorage.getItem(REMEMBER_LOGIN_FLAG) !== '1') return null
  const email = localStorage.getItem(REMEMBER_LOGIN_EMAIL) || ''
  const password = localStorage.getItem(REMEMBER_LOGIN_PASSWORD) || ''
  if (!email) return null
  return { email, password }
}

export function writeRememberedLogin(email: string, password: string) {
  if (!import.meta.client) return
  localStorage.setItem(REMEMBER_LOGIN_FLAG, '1')
  localStorage.setItem(REMEMBER_LOGIN_EMAIL, email)
  localStorage.setItem(REMEMBER_LOGIN_PASSWORD, password)
}

export function clearRememberedLogin() {
  if (!import.meta.client) return
  localStorage.removeItem(REMEMBER_LOGIN_FLAG)
  localStorage.removeItem(REMEMBER_LOGIN_EMAIL)
  localStorage.removeItem(REMEMBER_LOGIN_PASSWORD)
}
