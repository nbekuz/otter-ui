<template>
  <div class="min-h-dvh lg:px-3 lg:py-2" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <div class="mx-auto flex min-h-dvh w-full max-w-none lg:h-[calc(100dvh-1rem)] lg:min-h-[calc(100dvh-1rem)] lg:gap-4">
      <aside
        class="hidden lg:flex lg:h-full lg:w-72 lg:flex-shrink-0 lg:flex-col lg:rounded-[32px] lg:p-6"
        :class="isDarkTheme ? 'lg:bg-[#171a21] lg:text-white lg:border lg:border-[#2a303a]' : 'lg:bg-white lg:shadow-card'"
      >
        <div class="mb-2">
          <BrandLogo size="md" show-name-from="md" :text-class="isDarkTheme ? 'text-white' : 'text-sber-black'" />
        </div>

        <NuxtLink
          to="/app/profile"
          class="mb-3 flex items-center gap-3 rounded-2xl p-3 transition-colors"
          :class="[
            route.path.startsWith('/app/profile')
              ? 'bg-sber-green-light'
              : isDarkTheme ? 'bg-[#10141b] border border-[#222833] hover:bg-[#20242d]' : 'bg-sber-gray-light hover:bg-sber-gray-light/70',
          ]"
        >
          <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sber-green"
               :class="premiumStore.isPremium ? 'ring-2 ring-yellow-400 ring-offset-1' : ''">
            <div v-if="!authStore.user?.avatar" class="flex h-full w-full items-center justify-center text-base font-bold text-white">
              {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
            </div>
            <img v-else :src="authStore.user.avatar" class="h-full w-full object-cover" alt="">
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex min-w-0 items-center gap-1.5">
              <p class="truncate text-sm font-semibold" :class="isDarkTheme ? 'text-white' : 'text-sber-black'">
                {{ authStore.user?.name || 'Профиль' }}
              </p>
              <span
                v-if="premiumStore.isPremium"
                class="shrink-0 text-[13px] leading-none"
                title="Премиум"
                aria-label="Премиум"
              >⭐</span>
            </div>
            <p class="truncate text-xs" :class="isDarkTheme ? 'text-slate-400' : 'text-sber-gray'">
              {{ authStore.user?.email || 'Профиль' }}
            </p>
          </div>
          <ChevronRight class="h-4 w-4 shrink-0" :class="isDarkTheme ? 'text-slate-400' : 'text-sber-gray-mid'" />
        </NuxtLink>

        <nav
          class="flex min-h-0 flex-1 flex-col justify-start gap-1 overflow-y-auto rounded-[28px] p-1"
          :class="isDarkTheme ? 'bg-[#10141b] border border-[#222833]' : 'bg-transparent'"
        >
          <div
            v-if="sidebarEnabled.tasks"
            class="h-auto w-full shrink-0 grow-0 basis-auto"
            :style="{ order: sidebarOrder.tasks ?? 0 }"
          >
            <NavItemTasks
              mode="sidebar"
              :active="activeNavId === 'tasks'"
              :is-dark-theme="isDarkTheme"
            />
          </div>
          <div
            v-if="sidebarEnabled.calendar"
            class="h-auto w-full shrink-0 grow-0 basis-auto"
            :style="{ order: sidebarOrder.calendar ?? 1 }"
          >
            <NavItemCalendar
              mode="sidebar"
              :active="activeNavId === 'calendar'"
              :is-dark-theme="isDarkTheme"
            />
          </div>
          <div
            v-if="sidebarEnabled.matrix"
            class="h-auto w-full shrink-0 grow-0 basis-auto"
            :style="{ order: sidebarOrder.matrix ?? 2 }"
          >
            <NavItemMatrix
              mode="sidebar"
              :active="activeNavId === 'matrix'"
              :is-dark-theme="isDarkTheme"
            />
          </div>
          <div
            v-if="sidebarEnabled.pomodoro"
            class="h-auto w-full shrink-0 grow-0 basis-auto"
            :style="{ order: sidebarOrder.pomodoro ?? 3 }"
          >
            <NavItemPomodoro
              mode="sidebar"
              :active="activeNavId === 'pomodoro'"
              :is-dark-theme="isDarkTheme"
            />
          </div>
          <div
            v-if="sidebarEnabled.settings"
            class="h-auto w-full shrink-0 grow-0 basis-auto"
            :style="{ order: sidebarOrder.settings ?? 4 }"
          >
            <NavItemSettings
              mode="sidebar"
              :active="activeNavId === 'settings'"
              :is-dark-theme="isDarkTheme"
            />
          </div>
        </nav>

        <div
          class="mt-4 space-y-1 rounded-[20px] p-2"
          :class="isDarkTheme ? 'bg-[#10141b] border border-[#222833]' : 'bg-sber-gray-light'"
        >
          <NuxtLink
            to="/app/notifications"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="route.path === '/app/notifications'
              ? 'bg-sber-green text-white'
              : isDarkTheme
                ? 'text-slate-300 hover:bg-[#20242d]'
                : 'text-sber-gray hover:bg-white'"
          >
            <Bell class="h-4 w-4" />
            <span class="flex-1">Уведомления</span>
            <span
              v-if="notificationsStore.unreadCount > 0"
              class="min-w-[1.25rem] rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white"
            >
              {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
            </span>
          </NuxtLink>
          <NuxtLink
            to="/app/faq"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="route.path === '/app/faq'
              ? 'bg-sber-green text-white'
              : isDarkTheme
                ? 'text-slate-300 hover:bg-[#20242d]'
                : 'text-sber-gray hover:bg-white'"
          >
            <HelpCircle class="h-4 w-4" />
            <span>FAQ</span>
          </NuxtLink>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="isDarkTheme
              ? 'text-slate-300 hover:bg-[#20242d]'
              : 'text-sber-gray hover:bg-white'"
            @click="shareApp"
          >
            <Share2 class="h-4 w-4" />
            <span>Рекомендовать друзьям</span>
          </button>
        </div>

        <button class="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sber-green px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-sber-green-dark" @click="openNewTask">
          <Plus class="h-5 w-5" />
          Новая задача
        </button>
      </aside>

      <div
        class="phone-frame relative flex-1 lg:h-[calc(100dvh-1rem)] lg:rounded-3xl"
        :class="isDarkTheme ? 'bg-[#0f1115] lg:border lg:border-[#2a303a]' : 'bg-white lg:border lg:border-[#e9ebf1] lg:shadow-[0_20px_48px_rgba(15,23,42,0.10)]'"
      >
        <div class="min-h-dvh lg:h-full lg:min-h-0 lg:overflow-y-auto ">
          <slot />
        </div>

        <LayoutBottomNav />

        <button
          class="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-sber-green shadow-lg transition-transform active:scale-95 lg:hidden"
          @click="openNewTask"
        >
          <Plus class="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, ChevronRight, HelpCircle, Plus, Share2 } from 'lucide-vue-next'
import { BRAND_NAME } from '~/utils/site-info'
import {
  orderNavItems,
  buildNavOrderMap,
  resolveActiveNavId,
  type AppNavItemId,
} from '~/utils/nav-items'

const route = useRoute()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const premiumStore = usePremiumStore()
const notificationsStore = useNotificationsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

watch(
  () => authStore.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) void notificationsStore.fetchUnreadCount()
    else notificationsStore.reset()
  },
  { immediate: true },
)

/** Active tab from route.path only — never from list index. */
const activeNavId = ref<AppNavItemId | null>(null)

watch(
  () => route.path,
  (path) => {
    activeNavId.value = resolveActiveNavId(path)
  },
  { immediate: true },
)

/** Sidebar: fixed components + CSS order (no DOM reorder → icons stay intact). */
const sidebarOrderedIds = computed(() =>
  orderNavItems(settingsStore.appSettings.bottomNavItems || [], { includeProfile: false })
    .filter(item => item.id !== 'profile')
    .map(item => item.id),
)

const sidebarOrder = computed(() => buildNavOrderMap(sidebarOrderedIds.value))

const sidebarEnabled = computed(() => {
  const set = new Set(sidebarOrderedIds.value)
  return {
    tasks: set.has('tasks'),
    calendar: set.has('calendar'),
    matrix: set.has('matrix'),
    pomodoro: set.has('pomodoro'),
    settings: set.has('settings'),
  }
})

function shareApp() {
  if (navigator.share) {
    void navigator.share({ title: `${BRAND_NAME} - Планировщик`, url: window.location.origin })
  }
}

function openNewTask() {
  navigateTo(`/app/new-task?returnTo=${encodeURIComponent(route.fullPath)}`)
}
</script>
