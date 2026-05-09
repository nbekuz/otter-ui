import axios, { type AxiosRequestConfig } from 'axios'
import { clearAuthSession, getAccessToken } from '~/utils/auth-session'

const DEFAULT_API_BASE_URL = 'https://admin.skkamni.ru/api/v1/'
const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession()
      if (import.meta.client && window.location.pathname.startsWith('/app')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

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
