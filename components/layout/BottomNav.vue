<template>
  <nav class="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-sber-gray-mid bg-white safe-bottom lg:hidden">
    <div class="grid grid-flow-col auto-cols-fr items-center justify-items-center px-2 py-2">
      <div
        v-show="bottomEnabled.tasks"
        class="flex justify-center"
        :style="{ order: bottomOrder.tasks ?? 0 }"
      >
        <NavItemTasks mode="bottom" :active="activeNavId === 'tasks'" />
      </div>
      <div
        v-show="bottomEnabled.calendar"
        class="flex justify-center"
        :style="{ order: bottomOrder.calendar ?? 1 }"
      >
        <NavItemCalendar mode="bottom" :active="activeNavId === 'calendar'" />
      </div>
      <div
        v-show="bottomEnabled.matrix"
        class="flex justify-center"
        :style="{ order: bottomOrder.matrix ?? 2 }"
      >
        <NavItemMatrix mode="bottom" :active="activeNavId === 'matrix'" />
      </div>
      <div
        v-show="bottomEnabled.pomodoro"
        class="flex justify-center"
        :style="{ order: bottomOrder.pomodoro ?? 3 }"
      >
        <NavItemPomodoro mode="bottom" :active="activeNavId === 'pomodoro'" />
      </div>
      <div
        v-show="bottomEnabled.settings"
        class="flex justify-center"
        :style="{ order: bottomOrder.settings ?? 4 }"
      >
        <NavItemSettings mode="bottom" :active="activeNavId === 'settings'" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  orderNavItems,
  buildNavOrderMap,
  resolveActiveNavId,
  type AppNavItemId,
} from '~/utils/nav-items'

const route = useRoute()
const settingsStore = useSettingsStore()

const activeNavId = ref<AppNavItemId | null>(null)

watch(
  () => route.path,
  (path) => {
    activeNavId.value = resolveActiveNavId(path)
  },
  { immediate: true },
)

const bottomOrderedIds = computed(() =>
  orderNavItems(settingsStore.appSettings.bottomNavItems || [], { includeProfile: false })
    .filter(item => item.id !== 'profile')
    .map(item => item.id),
)

const bottomOrder = computed(() => buildNavOrderMap(bottomOrderedIds.value))

const bottomEnabled = computed(() => {
  const set = new Set(bottomOrderedIds.value)
  return {
    tasks: set.has('tasks'),
    calendar: set.has('calendar'),
    matrix: set.has('matrix'),
    pomodoro: set.has('pomodoro'),
    settings: set.has('settings'),
  }
})
</script>
