/** Email format check for auth forms */
export function validateEmail(email: string): string | null {
  const value = email.trim()
  if (!value)
    return 'Введите email'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
    return 'Введите корректный email'
  return null
}
