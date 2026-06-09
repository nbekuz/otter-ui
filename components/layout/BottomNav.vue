<template>
  <nav class="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-sber-gray-mid bg-white safe-bottom lg:hidden">
    <div class="flex items-center justify-around px-2 py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="flex flex-col items-center gap-1 min-w-[52px] py-1 px-2 rounded-xl
               transition-colors active:bg-sber-gray-light relative"
        :class="isActive(item.to) ? 'text-sber-green' : 'text-sber-gray'"
      >
        <component :is="item.icon" class="w-6 h-6" :stroke-width="isActive(item.to) ? 2.5 : 1.8" />
        <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
        <!-- Today's date badge on calendar -->
        <span v-if="item.id === 'calendar' && !isActive(item.to)"
              class="absolute top-0.5 right-0.5 text-[8px] font-bold text-sber-gray
                     bg-sber-gray-light rounded px-0.5">
          {{ todayDate }}
        </span>
        <span v-if="item.id === 'calendar' && isActive(item.to)"
              class="absolute top-0.5 right-0.5 text-[8px] font-bold text-sber-green
                     bg-sber-green-light rounded px-0.5">
          {{ todayDate }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { CheckSquare, Calendar, Grid2x2, Timer, Settings } from 'lucide-vue-next'
import dayjs from 'dayjs'

const route = useRoute()
const settingsStore = useSettingsStore()
const todayDate = dayjs().format('D')

const allNavItems = [
  { id: 'tasks', to: '/app', icon: CheckSquare, label: 'Задачи' },
  { id: 'calendar', to: '/app/calendar', icon: Calendar, label: 'Календарь' },
  { id: 'matrix', to: '/app/matrix', icon: Grid2x2, label: 'Матрица' },
  { id: 'pomodoro', to: '/app/pomodoro', icon: Timer, label: 'Помодоро' },
  { id: 'settings', to: '/app/settings', icon: Settings, label: 'Настройки' },
]

const navItems = computed(() => {
  const order = settingsStore.appSettings.bottomNavItems || []
  const byId = new Map(allNavItems.map(item => [item.id, item]))
  const items = order.map(id => byId.get(id)).filter(Boolean) as typeof allNavItems
  if (!items.some(item => item.id === 'settings')) {
    const settingsItem = byId.get('settings')
    if (settingsItem) items.push(settingsItem)
  }
  return items
})

function isActive(to: string) {
  if (to === '/app') return route.path === '/app'
  return route.path.startsWith(to)
}
</script>
