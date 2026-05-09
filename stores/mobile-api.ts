import { defineStore } from 'pinia'
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '~/utils/api'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export const useMobileApiStore = defineStore('mobile-api', () => {
  const data = ref<unknown>(null)
  const error = ref<string>('')
  const loading = ref(false)
  const lastMethod = ref<HttpMethod | null>(null)

  async function runRequest<T>(method: HttpMethod, request: () => Promise<T>) {
    loading.value = true
    error.value = ''
    lastMethod.value = method

    try {
      const response = await request()
      data.value = response
      return response
    }
    catch (err: any) {
      error.value = err?.response?.data?.detail || err?.message || 'Request failed'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  function getRequest<T>(url: string, params?: Record<string, unknown>) {
    return runRequest('get', () => apiGet<T>(url, { params }))
  }

  function postRequest<T>(url: string, payload?: unknown) {
    return runRequest('post', () => apiPost<T>(url, payload))
  }

  function putRequest<T>(url: string, payload?: unknown) {
    return runRequest('put', () => apiPut<T>(url, payload))
  }

  function patchRequest<T>(url: string, payload?: unknown) {
    return runRequest('patch', () => apiPatch<T>(url, payload))
  }

  function deleteRequest<T>(url: string) {
    return runRequest('delete', () => apiDelete<T>(url))
  }

  return {
    data,
    error,
    loading,
    lastMethod,
    getRequest,
    postRequest,
    putRequest,
    patchRequest,
    deleteRequest,
  }
})
