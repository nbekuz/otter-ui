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
          @click="goBack"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <h1 class="flex-1 text-xl font-bold text-sber-black">Уведомление</h1>
        <button
          v-if="item"
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full text-sber-gray hover:text-red-500"
          aria-label="Удалить"
          @click="onDelete"
        >
          <Trash2 class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="px-4 py-4">
      <p v-if="loading" class="py-10 text-center text-sm text-sber-gray">Загрузка…</p>
      <p v-else-if="error" class="px-2 py-6 text-center text-sm text-red-500">
        {{ error }}
      </p>
      <div
        v-else-if="item"
        class="rounded-2xl p-5"
        :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
      >
        <p class="text-lg font-semibold text-sber-black">{{ item.title }}</p>
        <p class="mt-2 text-sm leading-relaxed text-sber-gray whitespace-pre-wrap">{{ item.body }}</p>
        <p class="mt-4 text-xs text-sber-gray-mid">{{ formatDate(item.created_at) }}</p>
        <p v-if="item.type" class="mt-1 text-xs text-sber-gray-mid">Тип: {{ item.type }}</p>

        <button
          v-if="taskId"
          type="button"
          class="btn-primary mt-6 w-full"
          @click="openTask"
        >
          Открыть задачу
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
import { getApiErrorMessage } from '~/utils/api'

definePageMeta({ layout: 'app' })

const route = useRoute()
const settingsStore = useSettingsStore()
const store = useNotificationsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')
const isDesktop = useMediaQuery('(min-width: 640px)')

const loading = ref(true)
const error = ref('')
const item = ref<ApiNotificationItem | null>(null)

const notificationId = computed(() => Number(route.params.id))

const taskId = computed(() => {
  const n = item.value
  if (!n) return ''
  return n.data?.task_id || (n.task != null ? String(n.task) : '')
})

function formatDate(value: string) {
  return dayjs(value).format('DD.MM.YYYY HH:mm')
}

function goBack() {
  void navigateTo('/app/notifications')
}

async function openTask() {
  if (!taskId.value) return
  await navigateTo({
    path: '/app/new-task',
    query: { id: taskId.value, returnTo: `/app/notifications/${notificationId.value}` },
  })
}

async function onDelete() {
  if (!item.value) return
  try {
    await store.remove(item.value.id)
    await navigateTo('/app/notifications')
  }
  catch (err) {
    error.value = getApiErrorMessage(err, 'Не удалось удалить')
  }
}

async function load() {
  const id = notificationId.value
  if (!Number.isFinite(id) || id <= 0) {
    error.value = 'Уведомление не найдено'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    item.value = await store.fetchById(id)
  }
  catch (err) {
    error.value = getApiErrorMessage(err, 'Не удалось загрузить уведомление')
    item.value = null
  }
  finally {
    loading.value = false
  }
}

watch(
  isDesktop,
  (desktop) => {
    if (desktop) void navigateTo('/app')
  },
  { immediate: true },
)

watch(notificationId, () => {
  if (!isDesktop.value) void load()
}, { immediate: true })
</script>
