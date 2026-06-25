<template>
  <div class="min-h-dvh lg:px-3 lg:py-2" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <div class="mx-auto flex min-h-dvh w-full max-w-none lg:h-[calc(100dvh-1rem)] lg:min-h-[calc(100dvh-1rem)] lg:gap-4">
      <aside
        class="hidden lg:flex lg:h-full lg:w-72 lg:flex-shrink-0 lg:flex-col lg:rounded-[32px] lg:p-6"
        :class="isDarkTheme ? 'lg:bg-[#171a21] lg:text-white lg:border lg:border-[#2a303a]' : 'lg:bg-white lg:shadow-card'"
      >
        <div class="mb-2">
          <BrandLogo size="md" show-name-from="md" :text-class="isDarkTheme ? 'text-white' : 'text-sber-black'" />
          <!-- <h2 class="mt-2 text-3xl font-bold text-sber-black">Рабочее пространство</h2>
          <p class="mt-2 text-sm leading-relaxed text-sber-gray">
            Все основные разделы всегда под рукой и удобно выглядят на широком экране.
          </p> -->
        </div>

        <nav
          class="flex flex-1 flex-col gap-2 rounded-[28px] p-2"
          :class="isDarkTheme ? 'bg-[#10141b] border border-[#222833]' : 'bg-transparent'"
        >
          <NuxtLink
            v-for="item in sidebarNavItems"
            :key="item.id"
            :to="item.to"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
            :class="isActive(item.to)
              ? 'bg-sber-green text-white shadow-sm'
              : isDarkTheme
                ? 'text-slate-300 hover:bg-[#20242d] hover:text-white'
                : 'text-sber-gray hover:bg-sber-gray-light hover:text-sber-black'"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div
          class="mt-4 space-y-1 rounded-[20px] p-2"
          :class="isDarkTheme ? 'bg-[#10141b] border border-[#222833]' : 'bg-sber-gray-light'"
        >
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
import { Calendar, CheckSquare, Crown, Grid2x2, HelpCircle, List, Plus, Settings, Share2, Timer } from 'lucide-vue-next'
import { BRAND_NAME } from '~/utils/site-info'

const route = useRoute()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')
const isTasksPage = computed(() => route.path === '/app')

const allNavItems = [
  { id: 'tasks', to: '/app', icon: CheckSquare, label: 'Задачи' },
  { id: 'calendar', to: '/app/calendar', icon: Calendar, label: 'Календарь' },
  { id: 'matrix', to: '/app/matrix', icon: Grid2x2, label: 'Матрица' },
  { id: 'pomodoro', to: '/app/pomodoro', icon: Timer, label: 'Помодоро' },
  { id: 'settings', to: '/app/settings', icon: Settings, label: 'Настройки' },
]

const sidebarExtraItems = [
  { id: 'all-tasks', to: '/app?group=all', icon: List, label: 'Все задачи' },
  { id: 'premium', to: '/app/settings?openPremium=1', icon: Crown, label: 'Premium' },
]

const sidebarNavItems = computed(() => {
  const order = settingsStore.appSettings.bottomNavItems || []
  const byId = new Map(allNavItems.map(item => [item.id, item]))
  const ordered = order.map(id => byId.get(id)).filter(Boolean) as typeof allNavItems
  if (!ordered.some(item => item.id === 'settings')) {
    ordered.push(byId.get('settings')!)
  }
  return [...ordered, ...sidebarExtraItems]
})

function shareApp() {
  if (navigator.share) {
    void navigator.share({ title: `${BRAND_NAME} - Планировщик`, url: window.location.origin })
  }
}

function isActive(to: string) {
  if (to.startsWith('/app?group=all')) {
    return route.path === '/app' && route.query.group === 'all'
  }
  if (to.startsWith('/app/settings')) {
    return route.path.startsWith('/app/settings')
  }
  if (to === '/app') return route.path === '/app' && route.query.group !== 'all'
  return route.path.startsWith(to)
}

function openNewTask() {
  navigateTo(`/app/new-task?returnTo=${encodeURIComponent(route.fullPath)}`)
}
</script>
