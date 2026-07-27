<script setup lang="ts">
import dayjs from 'dayjs'
import { Trash2 } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import type { ApiNotificationItem } from '~/types/mobile-api'

const props = withDefaults(defineProps<{
  /** Anchor element for fixed positioning (desktop popover). */
  anchorEl?: HTMLElement | null
  /** When true, render as a panel without fixed positioning (unused; kept for flexibility). */
  embedded?: boolean
}>(), {
  anchorEl: null,
  embedded: false,
})

const emit = defineEmits<{
  close: []
  open: [item: ApiNotificationItem]
}>()

const settingsStore = useSettingsStore()
const store = useNotificationsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const panelRef = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})

function formatDate(value: string) {
  return dayjs(value).format('DD.MM.YYYY HH:mm')
}

function updatePosition() {
  const el = props.anchorEl
  if (!el) return
  const rect = el.getBoundingClientRect()
  const width = 300
  const left = Math.min(
    Math.max(8, rect.right - width),
    window.innerWidth - width - 8,
  )
  menuStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${left}px`,
    width: `${width}px`,
    zIndex: '80',
  }
}

watch(
  () => [props.anchorEl, store.popoverOpen] as const,
  ([, open]) => {
    if (!open) return
    nextTick(() => updatePosition())
  },
  { immediate: true },
)

onClickOutside(panelRef, (event) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('[data-notifications-bell]')) return
  emit('close')
})

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

onMounted(() => {
  if (!store.items.length) void store.fetchList({ limit: 20 })
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})
</script>

<template>
  <div
    ref="panelRef"
    data-notifications-popover
    class="overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
    :class="isDarkTheme ? 'border border-[#2a303a] bg-[#171a21]' : 'border border-black/5 bg-white'"
    :style="menuStyle"
  >
    <div
      class="flex items-center justify-between gap-2 border-b px-4 py-3"
      :class="isDarkTheme ? 'border-[#2a303a]' : 'border-sber-gray-light'"
    >
      <p class="text-sm font-semibold" :class="isDarkTheme ? 'text-white' : 'text-sber-black'">
        Уведомления
      </p>
      <button
        v-if="store.unreadCount > 0"
        type="button"
        class="text-xs font-medium text-sber-green hover:underline"
        @click="onReadAll"
      >
        Прочитать все
      </button>
    </div>

    <div class="max-h-[min(60vh,360px)] overflow-y-auto">
      <p v-if="store.loading && !store.items.length" class="px-4 py-8 text-center text-sm text-sber-gray">
        Загрузка…
      </p>
      <p v-else-if="store.error && !store.items.length" class="px-4 py-6 text-center text-sm text-red-500">
        {{ store.error }}
      </p>
      <p v-else-if="!store.items.length" class="px-4 py-8 text-center text-sm text-sber-gray">
        Нет уведомлений
      </p>
      <button
        v-for="item in store.items"
        :key="item.id"
        type="button"
        class="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-0"
        :class="[
          isDarkTheme ? 'border-[#2a303a]' : 'border-sber-gray-light',
          !item.is_read
            ? (isDarkTheme ? 'bg-[#1c2230]' : 'bg-sber-gray-light/70')
            : (isDarkTheme ? 'hover:bg-[#20242d]' : 'hover:bg-sber-gray-light/50'),
        ]"
        @click="emit('open', item)"
      >
        <div
          class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
          :class="item.is_read ? 'bg-transparent' : 'bg-sber-green'"
        />
        <div class="min-w-0 flex-1">
          <p
            class="text-sm font-medium leading-snug"
            :class="isDarkTheme ? 'text-white' : 'text-sber-black'"
          >
            {{ item.title }}
          </p>
          <p v-if="item.body" class="mt-0.5 line-clamp-2 text-xs text-sber-gray">
            {{ item.body }}
          </p>
          <p class="mt-1 text-[11px] text-sber-gray-mid">
            {{ formatDate(item.created_at) }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 p-1 text-sber-gray hover:text-red-500"
          aria-label="Удалить"
          @click.stop="onDelete(item.id)"
        >
          <Trash2 class="h-3.5 w-3.5" />
        </button>
      </button>
    </div>
  </div>
</template>
