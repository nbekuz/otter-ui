<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import { useMediaQuery } from '@vueuse/core'
import type { ApiNotificationItem } from '~/types/mobile-api'

const props = withDefaults(defineProps<{
  /** Visual variant for sidebar vs compact header button. */
  variant?: 'sidebar' | 'icon'
  isDarkTheme?: boolean
}>(), {
  variant: 'icon',
  isDarkTheme: false,
})

const route = useRoute()
const store = useNotificationsStore()
const isDesktop = useMediaQuery('(min-width: 640px)')

const triggerRef = ref<HTMLElement | null>(null)

/** Header icon owns the popover; sidebar only toggles the same open state. */
const showPopover = computed(() =>
  props.variant === 'icon' && isDesktop.value && store.popoverOpen,
)

const isSidebarActive = computed(
  () => route.path === '/app/notifications' || route.path.startsWith('/app/notifications/'),
)

async function onTriggerClick() {
  if (isDesktop.value) {
    if (!store.popoverOpen) {
      void store.fetchList({ limit: 20 })
    }
    store.togglePopover()
    return
  }
  store.closePopover()
  await navigateTo('/app/notifications')
}

async function onOpenItem(item: ApiNotificationItem) {
  store.closePopover()
  if (isDesktop.value) {
    try {
      await store.fetchById(item.id)
    }
    catch {
      if (!item.is_read) {
        try { await store.markRead(item.id) }
        catch { /* ignore */ }
      }
    }
    const taskId = item.data?.task_id || (item.task != null ? String(item.task) : '')
    if (taskId) {
      await navigateTo({ path: '/app/new-task', query: { id: taskId, returnTo: route.fullPath } })
    }
    return
  }
  await navigateTo(`/app/notifications/${item.id}`)
}
</script>

<template>
  <div class="relative" data-notifications-bell>
    <!-- Sidebar row -->
    <button
      v-if="variant === 'sidebar'"
      ref="triggerRef"
      type="button"
      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
      :class="isSidebarActive || store.popoverOpen
        ? 'bg-sber-green text-white'
        : isDarkTheme
          ? 'text-slate-300 hover:bg-[#20242d]'
          : 'text-sber-gray hover:bg-white'"
      @click="onTriggerClick"
    >
      <Bell class="h-4 w-4" />
      <span class="flex-1 text-left">Уведомления</span>
      <span
        v-if="store.unreadCount > 0"
        class="min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white"
        :class="isSidebarActive || store.popoverOpen ? 'bg-white/25' : 'bg-red-500'"
      >
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
      </span>
    </button>

    <!-- Compact header icon -->
    <button
      v-else
      ref="triggerRef"
      type="button"
      class="relative flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
      :class="isDarkTheme ? 'bg-[#171a21] text-white' : 'bg-white text-sber-gray'"
      aria-label="Уведомления"
      @click="onTriggerClick"
    >
      <Bell class="h-5 w-5" />
      <span
        v-if="store.unreadCount > 0"
        class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
        :class="isDarkTheme ? 'ring-[#0f1115]' : 'ring-white'"
        aria-hidden="true"
      />
      <span class="sr-only" v-if="store.unreadCount > 0">
        {{ store.unreadCount }} непрочитанных
      </span>
    </button>

    <Teleport to="body">
      <NotificationsPopover
        v-if="showPopover"
        :anchor-el="triggerRef"
        @close="store.closePopover()"
        @open="onOpenItem"
      />
    </Teleport>
  </div>
</template>
