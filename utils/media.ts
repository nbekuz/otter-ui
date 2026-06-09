/** Resolve relative media URLs from the API (e.g. `/media/avatars/...`). */
export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }

  let apiBase = 'https://admin.skkamni.ru/api/v1/'
  if (import.meta.client) {
    try {
      const config = useRuntimeConfig()
      const fromConfig = config.public.apiBaseUrl as string | undefined
      if (fromConfig) apiBase = fromConfig.endsWith('/') ? fromConfig : `${fromConfig}/`
    }
    catch {
      // ignore
    }
  }
  else {
    const fromEnv = process.env.NUXT_PUBLIC_API_BASE_URL
    if (fromEnv) apiBase = fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  }

  const origin = apiBase.replace(/\/api\/v1\/?$/, '')
  return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`
}
