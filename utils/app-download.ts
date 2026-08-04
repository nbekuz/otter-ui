import { resolveApiBaseUrl } from '~/utils/api'

/** Public app distribution endpoints live under `/api/app/`, not `/api/v1/`. */
export function resolveAppDistributionBaseUrl(): string {
  const v1 = resolveApiBaseUrl()
  // https://admin.ottertime.ru/api/v1/ → https://admin.ottertime.ru/api/
  const stripped = v1.replace(/\/v1\/?$/, '/')
  return stripped.endsWith('/') ? stripped : `${stripped}/`
}

export type WindowsDownloadInfo = {
  version: string
  download_url: string | null
  force_update: boolean
}

export type MobileStoreLinks = {
  rustore: string | null
  google_play: string | null
  app_store: string | null
}

function asNullableUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function fetchWindowsDownloadInfo(): Promise<WindowsDownloadInfo> {
  const base = resolveAppDistributionBaseUrl()
  const data = await $fetch<Partial<WindowsDownloadInfo>>(`${base}app/windows`)
  return {
    version: typeof data?.version === 'string' ? data.version : '',
    download_url: asNullableUrl(data?.download_url),
    force_update: Boolean(data?.force_update),
  }
}

export async function fetchMobileStoreLinks(): Promise<MobileStoreLinks> {
  const base = resolveAppDistributionBaseUrl()
  const data = await $fetch<Partial<MobileStoreLinks>>(`${base}app/mobile`)
  return {
    rustore: asNullableUrl(data?.rustore),
    google_play: asNullableUrl(data?.google_play),
    app_store: asNullableUrl(data?.app_store),
  }
}
