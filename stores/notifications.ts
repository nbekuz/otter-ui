import { defineStore } from 'pinia'
import type { ApiNotificationItem, ApiNotificationsResponse } from '~/types/mobile-api'
import { apiDelete, apiGet, apiPost, getApiErrorMessage } from '~/utils/api'

const MAX_ITEMS = 20

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<ApiNotificationItem[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref('')
  /** Desktop popover open state (shared across layout / pages). */
  const popoverOpen = ref(false)

  function setUnreadCount(count: number) {
    unreadCount.value = Math.max(0, count)
  }

  function upsertItem(notification: ApiNotificationItem) {
    const rest = items.value.filter(n => n.id !== notification.id)
    items.value = [notification, ...rest].slice(0, MAX_ITEMS)
  }

  function applyCreated(notification: ApiNotificationItem, nextUnread: number) {
    upsertItem(notification)
    setUnreadCount(nextUnread)
  }

  function applyUpdated(notification: ApiNotificationItem, nextUnread: number) {
    const idx = items.value.findIndex(n => n.id === notification.id)
    if (idx >= 0) {
      items.value[idx] = notification
    }
    else {
      upsertItem(notification)
    }
    setUnreadCount(nextUnread)
  }

  function applyDeleted(id: number, nextUnread: number) {
    items.value = items.value.filter(n => n.id !== id)
    setUnreadCount(nextUnread)
  }

  function applyReadAll(nextUnread = 0) {
    const now = new Date().toISOString()
    items.value = items.value.map(n => ({
      ...n,
      is_read: true,
      read_at: n.read_at || now,
    }))
    setUnreadCount(nextUnread)
  }

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
      const data = await apiGet<ApiNotificationsResponse>('notifications/', {
        params: { limit: MAX_ITEMS, ...params },
      })
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

  /** GET by id — server auto-marks unread as read. */
  async function fetchById(id: number) {
    const item = await apiGet<ApiNotificationItem>(`notifications/${id}/`)
    const prev = items.value.find(n => n.id === id)
    upsertItem(item)
    if (prev && !prev.is_read && item.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
    return item
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
    applyReadAll(data.unread_count ?? 0)
  }

  async function remove(id: number) {
    await apiDelete(`notifications/${id}/`)
    const removed = items.value.find(n => n.id === id)
    items.value = items.value.filter(n => n.id !== id)
    if (removed && !removed.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  function openPopover() {
    popoverOpen.value = true
  }

  function closePopover() {
    popoverOpen.value = false
  }

  function togglePopover() {
    popoverOpen.value = !popoverOpen.value
  }

  function reset() {
    items.value = []
    unreadCount.value = 0
    error.value = ''
    popoverOpen.value = false
  }

  return {
    items,
    unreadCount,
    loading,
    error,
    popoverOpen,
    setUnreadCount,
    applyCreated,
    applyUpdated,
    applyDeleted,
    applyReadAll,
    fetchList,
    fetchById,
    fetchUnreadCount,
    markRead,
    markAllRead,
    remove,
    openPopover,
    closePopover,
    togglePopover,
    reset,
  }
})
