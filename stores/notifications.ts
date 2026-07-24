import { defineStore } from 'pinia'
import type { ApiNotificationItem, ApiNotificationsResponse } from '~/types/mobile-api'
import { apiDelete, apiGet, apiPost, getApiErrorMessage } from '~/utils/api'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<ApiNotificationItem[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref('')

  async function fetchUnreadCount() {
    try {
      const data = await apiGet<{ unread_count: number }>('notifications/unread-count/')
      unreadCount.value = data.unread_count ?? 0
    }
    catch {
      /* non-fatal */
    }
  }

  async function fetchList(params: { is_read?: boolean; limit?: number; offset?: number } = {}) {
    loading.value = true
    error.value = ''
    try {
      const data = await apiGet<ApiNotificationsResponse>('notifications/', { params })
      items.value = data.results || []
      if (typeof data.unread_count === 'number') {
        unreadCount.value = data.unread_count
      }
      else {
        await fetchUnreadCount()
      }
      return items.value
    }
    catch (err) {
      error.value = getApiErrorMessage(err, 'Не удалось загрузить уведомления')
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function markRead(id: number) {
    await apiPost(`notifications/${id}/read/`)
    const item = items.value.find(n => n.id === id)
    if (item && !item.is_read) {
      item.is_read = true
      item.read_at = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  async function markAllRead() {
    const data = await apiPost<{ updated?: number; unread_count?: number }>('notifications/read-all/')
    items.value = items.value.map(n => ({
      ...n,
      is_read: true,
      read_at: n.read_at || new Date().toISOString(),
    }))
    unreadCount.value = data.unread_count ?? 0
  }

  async function remove(id: number) {
    await apiDelete(`notifications/${id}/`)
    const removed = items.value.find(n => n.id === id)
    items.value = items.value.filter(n => n.id !== id)
    if (removed && !removed.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  function reset() {
    items.value = []
    unreadCount.value = 0
    error.value = ''
  }

  return {
    items,
    unreadCount,
    loading,
    error,
    fetchList,
    fetchUnreadCount,
    markRead,
    markAllRead,
    remove,
    reset,
  }
})
