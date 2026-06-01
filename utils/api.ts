import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '~/utils/auth-session'

const DEFAULT_API_BASE_URL = 'https://admin.skkamni.ru/api/v1/'

function resolveApiBaseUrl(): string {
  if (import.meta.client) {
    try {
      const config = useRuntimeConfig()
      const fromConfig = config.public.apiBaseUrl as string | undefined
      if (fromConfig) return fromConfig.endsWith('/') ? fromConfig : `${fromConfig}/`
    }
    catch {
      // useRuntimeConfig unavailable outside Nuxt context
    }
  }
  const fromEnv = process.env.NUXT_PUBLIC_API_BASE_URL
  if (fromEnv) return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  return DEFAULT_API_BASE_URL
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseUrl()
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  const baseURL = resolveApiBaseUrl()
  const { data } = await axios.post<{ access: string; refresh?: string }>(
    `${baseURL}auth/token/refresh/`,
    { refresh },
    { headers: { 'Content-Type': 'application/json' } },
  )

  setAuthTokens({
    access: data.access,
    refresh: data.refresh || refresh,
  })

  return data.access
}

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error?.config as RetryConfig | undefined
    const status = error?.response?.status

    if (
      status === 401
      && originalRequest
      && !originalRequest._retry
      && !String(originalRequest.url || '').includes('auth/token/refresh/')
      && !String(originalRequest.url || '').includes('auth/login/')
      && !String(originalRequest.url || '').includes('auth/register/')
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }
        const access = await refreshPromise
        if (access) {
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      }
      catch {
        // fall through to logout
      }
    }

    if (status === 401) {
      clearAuthSession()
      if (import.meta.client && window.location.pathname.startsWith('/app')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown, fallback = 'Ошибка запроса'): string {
  const err = error as { response?: { data?: Record<string, unknown> }; message?: string }
  const data = err?.response?.data
  if (!data) return err?.message || fallback
  if (typeof data.detail === 'string') return data.detail
  const firstKey = Object.keys(data)[0]
  const firstVal = firstKey ? data[firstKey] : null
  if (Array.isArray(firstVal) && typeof firstVal[0] === 'string') return firstVal[0]
  if (typeof firstVal === 'string') return firstVal
  return fallback
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  const response = await api.get<T>(url, config)
  return response.data
}

export async function apiPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await api.post<T>(url, data, config)
  return response.data
}

export async function apiPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await api.put<T>(url, data, config)
  return response.data
}

export async function apiPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await api.patch<T>(url, data, config)
  return response.data
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  const response = await api.delete<T>(url, config)
  return response.data
}
