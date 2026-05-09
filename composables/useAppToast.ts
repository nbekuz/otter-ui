export type AppToastType = 'success' | 'error'

const DEFAULT_MS = 4500

/**
 * Barcha sahifalardan foydalanish mumkin — `AppGlobalToast` `app.vue` da ulangan.
 */
export function useAppToast() {
  const toast = useState('app-global-toast', () => ({
    visible: false,
    message: '',
    type: 'success' as AppToastType,
  }))

  let timer: ReturnType<typeof setTimeout> | null = null

  function hideToast() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    toast.value.visible = false
  }

  function showToast(message: string, type: AppToastType = 'success', durationMs = DEFAULT_MS) {
    if (import.meta.server)
      return
    hideToast()
    toast.value.message = message
    toast.value.type = type
    toast.value.visible = true
    timer = setTimeout(() => {
      toast.value.visible = false
      timer = null
    }, durationMs)
  }

  return { toast, showToast, hideToast }
}
