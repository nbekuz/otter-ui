import {
  fetchMobileStoreLinks,
  fetchWindowsDownloadInfo,
  type MobileStoreLinks,
  type WindowsDownloadInfo,
} from '~/utils/app-download'
import { DESKTOP_APP } from '~/utils/site-info'

type StoreKey = 'rustore' | 'google_play' | 'app_store'


export function useAppDownloads() {
  const { showToast } = useAppToast()

  const windows = useState<WindowsDownloadInfo | null>('appDownloads.windows', () => null)
  const mobile = useState<MobileStoreLinks | null>('appDownloads.mobile', () => null)
  const loadingWindows = useState('appDownloads.loadingWindows', () => false)
  const loadingMobile = useState('appDownloads.loadingMobile', () => false)

  async function loadWindows(force = false): Promise<WindowsDownloadInfo | null> {
    if (!force && windows.value) return windows.value
    if (loadingWindows.value) return windows.value
    loadingWindows.value = true
    try {
      windows.value = await fetchWindowsDownloadInfo()
      return windows.value
    }
    catch {
      windows.value = null
      return null
    }
    finally {
      loadingWindows.value = false
    }
  }

  async function loadMobile(force = false): Promise<MobileStoreLinks | null> {
    if (!force && mobile.value) return mobile.value
    if (loadingMobile.value) return mobile.value
    loadingMobile.value = true
    try {
      mobile.value = await fetchMobileStoreLinks()
      return mobile.value
    }
    catch {
      mobile.value = null
      return null
    }
    finally {
      loadingMobile.value = false
    }
  }

  async function downloadWindowsApp() {
    const info = await loadWindows(true)
    const url = info?.download_url
    if (!url) {
      showToast(DESKTOP_APP.unavailableMessage, 'error', 4500)
      return false
    }
    if (import.meta.client) {
      // Prefer same-tab <a> click over window.open: cross-origin .exe/.zip
      // opens a blank tab that instantly closes (COOP / download handler).
      const a = document.createElement('a')
      a.href = url
      a.rel = 'noopener'
      const name = url.split('/').pop()?.split('?')[0]
      if (name) a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      showToast('Скачивание началось…', 'success', 2500)
    }
    return true
  }

  function preferredMobileUrl(links: MobileStoreLinks | null): string | null {
    if (!links) return null
    return links.rustore || links.google_play || links.app_store || null
  }

  async function openMobileStore(prefer: StoreKey = 'rustore') {
    const links = await loadMobile(true)
    const url = prefer === 'rustore'
      ? links?.rustore
      : (links?.[prefer] || preferredMobileUrl(links))
    if (!url) {
      showToast(
        prefer === 'rustore'
          ? DESKTOP_APP.rustoreUnavailableMessage
          : 'Мобильное приложение пока недоступно для скачивания.',
        'error',
        4500,
      )
      return false
    }
    if (import.meta.client) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    return true
  }

  /** Landing / footer: open RuStore catalog link only. */
  async function openRustoreDownload() {
    return openMobileStore('rustore')
  }

  const hasMobileStoreLink = computed(() => Boolean(preferredMobileUrl(mobile.value)))
  const hasWindowsDownload = computed(() => Boolean(windows.value?.download_url))

  return {
    windows,
    mobile,
    loadingWindows,
    loadingMobile,
    hasWindowsDownload,
    hasMobileStoreLink,
    loadWindows,
    loadMobile,
    downloadWindowsApp,
    openMobileStore,
    openRustoreDownload,
  }
}
