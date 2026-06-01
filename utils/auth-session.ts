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
let onTokensChanged: (() => void) | null = null

export function onAuthTokensChanged(callback: () => void) {
  onTokensChanged = callback
}

export interface AuthTokens {
  access: string
  refresh: string
}

/** VueUse JSON va oddiy string formatlarini o‘qish. */
function readStoredToken(key: string): string | null {
  if (!import.meta.client) return null
  const raw = localStorage.getItem(key)
  if (!raw) return null

  const trimmed = raw.trim()
  if (!trimmed || trimmed === 'null') return null

  if (trimmed.startsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed)
      return typeof parsed === 'string' && parsed.length > 0 ? parsed : null
    }
    catch {
      return null
    }
  }

  return trimmed
}

function writeStoredToken(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function migrateLegacyTokens() {
  if (!import.meta.client || legacyMigrated) return
  legacyMigrated = true

  if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
    const old = readStoredToken(LEGACY_ACCESS_KEY)
      || localStorage.getItem(LEGACY_ACCESS_KEY)
    if (old) writeStoredToken(ACCESS_TOKEN_KEY, old)
  }
  localStorage.removeItem(LEGACY_ACCESS_KEY)

  if (!localStorage.getItem(REFRESH_TOKEN_KEY)) {
    const old = readStoredToken(LEGACY_REFRESH_KEY)
      || localStorage.getItem(LEGACY_REFRESH_KEY)
    if (old) writeStoredToken(REFRESH_TOKEN_KEY, old)
  }
  localStorage.removeItem(LEGACY_REFRESH_KEY)

  const access = readStoredToken(ACCESS_TOKEN_KEY)
  if (access) writeStoredToken(ACCESS_TOKEN_KEY, access)
  const refresh = readStoredToken(REFRESH_TOKEN_KEY)
  if (refresh) writeStoredToken(REFRESH_TOKEN_KEY, refresh)
}

export function getAccessToken() {
  if (!import.meta.client) return null
  migrateLegacyTokens()
  return readStoredToken(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  if (!import.meta.client) return null
  migrateLegacyTokens()
  return readStoredToken(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(tokens: AuthTokens) {
  if (!import.meta.client) return
  writeStoredToken(ACCESS_TOKEN_KEY, tokens.access)
  writeStoredToken(REFRESH_TOKEN_KEY, tokens.refresh)
  onTokensChanged?.()
}

export function clearAuthSession() {
  if (!import.meta.client) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(LEGACY_ACCESS_KEY)
  localStorage.removeItem(LEGACY_REFRESH_KEY)
  localStorage.removeItem('otter.auth.user')
  localStorage.removeItem(FIREBASE_ID_TOKEN_STORAGE_KEY)
  onTokensChanged?.()
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
