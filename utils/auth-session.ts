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

/** localStorage bloklanganda (Yandex Protect) sessiya shu xotirada saqlanadi. */
const memoryStore: Record<string, string> = {}

export function onAuthTokensChanged(callback: () => void) {
  onTokensChanged = callback
}

export interface AuthTokens {
  access: string
  refresh: string
}

function readRaw(key: string): string | null {
  if (!import.meta.client) return null
  try {
    const fromLs = localStorage.getItem(key)
    if (fromLs != null) return fromLs
  }
  catch {
    /* SecurityError / Yandex Protect */
  }
  return memoryStore[key] ?? null
}

function writeRaw(key: string, value: string) {
  memoryStore[key] = value
  try {
    localStorage.setItem(key, value)
  }
  catch {
    /* SecurityError / Yandex Protect — memory fallback */
  }
}

function removeRaw(key: string) {
  delete memoryStore[key]
  try {
    localStorage.removeItem(key)
  }
  catch {
    /* ignore */
  }
}

/** VueUse JSON va oddiy string formatlarini o‘qish. */
function readStoredToken(key: string): string | null {
  if (!import.meta.client) return null
  const raw = readRaw(key)
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
  writeRaw(key, value)
}

export function migrateLegacyTokens() {
  if (!import.meta.client || legacyMigrated) return
  legacyMigrated = true

  if (!readRaw(ACCESS_TOKEN_KEY)) {
    const old = readStoredToken(LEGACY_ACCESS_KEY)
      || readRaw(LEGACY_ACCESS_KEY)
    if (old) writeStoredToken(ACCESS_TOKEN_KEY, old)
  }
  removeRaw(LEGACY_ACCESS_KEY)

  if (!readRaw(REFRESH_TOKEN_KEY)) {
    const old = readStoredToken(LEGACY_REFRESH_KEY)
      || readRaw(LEGACY_REFRESH_KEY)
    if (old) writeStoredToken(REFRESH_TOKEN_KEY, old)
  }
  removeRaw(LEGACY_REFRESH_KEY)

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
  removeRaw(ACCESS_TOKEN_KEY)
  removeRaw(REFRESH_TOKEN_KEY)
  removeRaw(LEGACY_ACCESS_KEY)
  removeRaw(LEGACY_REFRESH_KEY)
  removeRaw('otter.auth.user')
  removeRaw(FIREBASE_ID_TOKEN_STORAGE_KEY)
  onTokensChanged?.()
}

if (import.meta.client) {
  migrateLegacyTokens()
}

export function readRememberedLogin(): { email: string, password: string } | null {
  if (!import.meta.client) return null
  if (readRaw(REMEMBER_LOGIN_FLAG) !== '1') return null
  const email = readRaw(REMEMBER_LOGIN_EMAIL) || ''
  const password = readRaw(REMEMBER_LOGIN_PASSWORD) || ''
  if (!email) return null
  return { email, password }
}

export function writeRememberedLogin(email: string, password: string) {
  if (!import.meta.client) return
  writeRaw(REMEMBER_LOGIN_FLAG, '1')
  writeRaw(REMEMBER_LOGIN_EMAIL, email)
  writeRaw(REMEMBER_LOGIN_PASSWORD, password)
}

export function clearRememberedLogin() {
  if (!import.meta.client) return
  removeRaw(REMEMBER_LOGIN_FLAG)
  removeRaw(REMEMBER_LOGIN_EMAIL)
  removeRaw(REMEMBER_LOGIN_PASSWORD)
}
