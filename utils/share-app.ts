import { APP_SHARE } from '~/utils/site-info'

export type AppSharePayload = {
  title: string
  text: string
  url: string
}

export type ShareNetworkId =
  | 'telegram'
  | 'whatsapp'
  | 'vk'
  | 'x'
  | 'facebook'
  | 'email'
  | 'copy'

export type ShareNetwork = {
  id: ShareNetworkId
  label: string
  /** Build absolute share URL; `copy` has no external URL. */
  href?: (payload: AppSharePayload) => string
}

export function getAppSharePayload(): AppSharePayload {
  return {
    title: APP_SHARE.title,
    text: APP_SHARE.text,
    url: APP_SHARE.url,
  }
}

export function canUseNativeShare(): boolean {
  return import.meta.client && typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export function buildShareMessage(payload: AppSharePayload): string {
  return `${payload.text}\n${payload.url}`
}

export const SHARE_NETWORKS: ShareNetwork[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: (p) => {
      const params = new URLSearchParams({
        url: p.url,
        text: p.text,
      })
      return `https://t.me/share/url?${params.toString()}`
    },
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: (p) => {
      const params = new URLSearchParams({ text: buildShareMessage(p) })
      return `https://wa.me/?${params.toString()}`
    },
  },
  {
    id: 'vk',
    label: 'VK',
    href: (p) => {
      const params = new URLSearchParams({
        url: p.url,
        title: p.title,
        comment: p.text,
      })
      return `https://vk.com/share.php?${params.toString()}`
    },
  },
  {
    id: 'x',
    label: 'X',
    href: (p) => {
      const params = new URLSearchParams({
        url: p.url,
        text: p.text,
      })
      return `https://twitter.com/intent/tweet?${params.toString()}`
    },
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: (p) => {
      const params = new URLSearchParams({ u: p.url })
      return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
    },
  },
  {
    id: 'email',
    label: 'Email',
    href: (p) => {
      const params = new URLSearchParams({
        subject: p.title,
        body: buildShareMessage(p),
      })
      return `mailto:?${params.toString()}`
    },
  },
  {
    id: 'copy',
    label: 'Копировать ссылку',
  },
]

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!import.meta.client) return false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  }
  catch {
    /* fall through */
  }

  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
  catch {
    return false
  }
}

export function openShareUrl(href: string) {
  if (!import.meta.client) return
  if (href.startsWith('mailto:')) {
    window.location.href = href
    return
  }
  window.open(href, '_blank', 'noopener,noreferrer')
}
