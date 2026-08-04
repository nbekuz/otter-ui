import {
  canUseNativeShare,
  copyTextToClipboard,
  getAppSharePayload,
  openShareUrl,
  SHARE_NETWORKS,
  type ShareNetworkId,
} from '~/utils/share-app'

/**
 * Reusable «Поделиться» flow:
 * 1) Web Share API when available
 * 2) Otherwise open ShareAppModal (social + copy)
 */
export function useAppShare() {
  const modalOpen = useState('appShare.modalOpen', () => false)
  const { showToast } = useAppToast()
  const payload = computed(() => getAppSharePayload())

  function openShareModal() {
    modalOpen.value = true
  }

  function closeShareModal() {
    modalOpen.value = false
  }

  async function shareApp() {
    const data = payload.value

    if (canUseNativeShare()) {
      try {
        const nav = navigator as Navigator & {
          canShare?: (data: ShareData) => boolean
        }
        const shareData: ShareData = {
          title: data.title,
          text: data.text,
          url: data.url,
        }
        if (typeof nav.canShare === 'function' && !nav.canShare(shareData)) {
          openShareModal()
          return
        }
        await navigator.share(shareData)
        return
      }
      catch (err) {
        // User cancelled the system sheet — do nothing.
        if (err instanceof DOMException && err.name === 'AbortError') return
        // Other failures → custom modal fallback.
      }
    }

    openShareModal()
  }

  async function copyShareLink() {
    const ok = await copyTextToClipboard(payload.value.url)
    if (ok) {
      showToast('Ссылка скопирована', 'success')
      closeShareModal()
      return true
    }
    showToast('Не удалось скопировать ссылку', 'error')
    return false
  }

  function shareViaNetwork(id: ShareNetworkId) {
    if (id === 'copy') {
      void copyShareLink()
      return
    }
    const network = SHARE_NETWORKS.find(n => n.id === id)
    const href = network?.href?.(payload.value)
    if (!href) {
      showToast('Не удалось открыть приложение', 'error')
      return
    }
    try {
      openShareUrl(href)
      closeShareModal()
    }
    catch {
      showToast('Не удалось открыть приложение', 'error')
    }
  }

  return {
    modalOpen,
    payload,
    networks: SHARE_NETWORKS,
    shareApp,
    openShareModal,
    closeShareModal,
    copyShareLink,
    shareViaNetwork,
  }
}
