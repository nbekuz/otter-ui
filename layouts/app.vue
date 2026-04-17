<template>
  <div class="min-h-dvh lg:px-6 lg:py-6" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <div class="mx-auto flex min-h-dvh max-w-[1440px] lg:h-[calc(100dvh-3rem)] lg:min-h-[calc(100dvh-3rem)] lg:gap-6 rounded">
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

        <NuxtLink
          to="/app/profile"
          class="mb-6 block rounded-[28px] p-4 transition-colors"
          :class="isDarkTheme ? 'bg-[#10141b] border border-[#2a303a] hover:bg-[#1b212b]' : 'bg-sber-gray-light hover:bg-[#ececef]'"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Профиль</p>
          <div class="mt-4 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-sber-green text-base font-bold text-white">
              <span v-if="!authStore.user?.avatar">{{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}</span>
              <img v-else :src="authStore.user.avatar" class="h-full w-full object-cover" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate text-sm font-semibold text-sber-black">{{ authStore.user?.name || 'Пользователь' }}</p>
                <span v-if="authStore.user?.isPremium" class="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-700">
                  Pro
                </span>
              </div>
              <p class="truncate text-xs text-sber-gray">{{ authStore.user?.email || 'demo@otter.app' }}</p>
            </div>
          </div>
        </NuxtLink>

        <nav
          class="flex flex-1 flex-col gap-2 rounded-[28px] p-2"
          :class="isDarkTheme ? 'bg-[#10141b] border border-[#222833]' : 'bg-transparent'"
        >
          <NuxtLink
            v-for="item in navItems"
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

        <button class="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sber-green px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-sber-green-dark" @click="openNewTask">
          <Plus class="h-5 w-5" />
          Новая задача
        </button>
      </aside>

      <div
        class="phone-frame relative flex-1 lg:h-[calc(100dvh-3rem)]  lg:rounded-3xl"
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
import { Calendar, CheckSquare, Grid2x2, Plus, Settings, Timer } from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')
const isTasksPage = computed(() => route.path === '/app')

const navItems = [
  { id: 'tasks', to: '/app', icon: CheckSquare, label: 'Задачи' },
  { id: 'calendar', to: '/app/calendar', icon: Calendar, label: 'Календарь' },
  { id: 'matrix', to: '/app/matrix', icon: Grid2x2, label: 'Матрица' },
  { id: 'pomodoro', to: '/app/pomodoro', icon: Timer, label: 'Помодоро' },
  { id: 'settings', to: '/app/settings', icon: Settings, label: 'Настройки' },
]

function isActive(to: string) {
  if (to === '/app') return route.path === '/app'
  return route.path.startsWith(to)
}

function openNewTask() {
  navigateTo(`/app/new-task?returnTo=${encodeURIComponent(route.fullPath)}`)
}
</script>
