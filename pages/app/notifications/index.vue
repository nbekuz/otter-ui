<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <div
      class="page-header-top px-4 pb-4"
      :class="isDarkTheme ? 'bg-[#171a21] border-b border-[#2a303a] shadow-none' : 'bg-white shadow-sm'"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light"
          @click="$router.back()"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <h1 class="flex-1 text-xl font-bold text-sber-black">Уведомления</h1>
        <button
          v-if="store.unreadCount > 0"
          type="button"
          class="text-sm font-medium text-sber-green"
          @click="onReadAll"
        >
          Прочитать все
        </button>
      </div>
    </div>

    <div class="px-4 py-4">
      <p v-if="store.loading" class="py-10 text-center text-sm text-sber-gray">Загрузка…</p>
      <p v-else-if="store.error" class="px-2 py-6 text-center text-sm text-red-500">
        {{ store.error }}
      </p>
      <p
        v-else-if="store.items.length === 0"
        class="py-10 text-center text-sm text-sber-gray"
      >
        Нет уведомлений
      </p>
      <div
        v-else
        class="overflow-hidden rounded-2xl"
        :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
      >
        <button
          v-for="item in store.items"
          :key="item.id"
          type="button"
          class="flex w-full items-start gap-3 border-b border-sber-gray-light px-4 py-3 text-left last:border-0"
          :class="!item.is_read ? (isDarkTheme ? 'bg-[#1c2230]' : 'bg-sber-green-light/40') : ''"
          @click="onOpen(item)"
        >
          <div
            class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            :class="item.is_read ? 'bg-transparent' : 'bg-sber-green'"
          />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-sber-black">{{ item.title }}</p>
            <p class="mt-0.5 text-sm text-sber-gray">{{ item.body }}</p>
            <p class="mt-1 text-xs text-sber-gray-mid">{{ formatDate(item.created_at) }}</p>
          </div>
          <button
            type="button"
            class="shrink-0 p-1 text-sber-gray hover:text-red-500"
            aria-label="Удалить"
            @click.stop="onDelete(item.id)"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ChevronLeft, Trash2 } from 'lucide-vue-next'
import { useMediaQuery } from '@vueuse/core'
import type { ApiNotificationItem } from '~/types/mobile-api'

definePageMeta({ layout: 'app' })

const settingsStore = useSettingsStore()
const store = useNotificationsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')
const isDesktop = useMediaQuery('(min-width: 640px)')

function formatDate(value: string) {
  return dayjs(value).format('DD.MM.YYYY HH:mm')
}

async function onOpen(item: ApiNotificationItem) {
  await navigateTo(`/app/notifications/${item.id}`)
}

async function onReadAll() {
  try {
    await store.markAllRead()
  }
  catch {
    /* ignore */
  }
}

async function onDelete(id: number) {
  try {
    await store.remove(id)
  }
  catch {
    /* ignore */
  }
}

watch(
  isDesktop,
  (desktop) => {
    if (desktop) void navigateTo('/app')
  },
  { immediate: true },
)

onMounted(() => {
  if (!isDesktop.value) void store.fetchList({ limit: 20 })
})
</script>
