/** Yangi parol qoidalari — bitta joydan barcha formalar */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 20

/**
 * `@returns` xatolik matni yoki `null` (to‘g‘ri bo‘lsa)
 */
export function validateNewPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Пароль должен содержать не менее ${PASSWORD_MIN_LENGTH} символов`
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Пароль должен содержать не более ${PASSWORD_MAX_LENGTH} символов`
  }
  if (!/[a-z]/.test(password)) {
    return 'Пароль должен содержать минимум одну строчную латинскую букву'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Пароль должен содержать минимум одну заглавную латинскую букву'
  }
  if (!/\d/.test(password)) {
    return 'Пароль должен содержать минимум одну цифру'
  }
  // Harflar va raqamlardan tashqari kamida bitta belgi (#, !, %, bo‘sh joy va h.k.)
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Пароль должен содержать минимум один специальный символ (!, @, # и т.п.)'
  }
  return null
}
