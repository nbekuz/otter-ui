<template>
  <div class="page-container bg-sber-gray-light" @click="handlePageClick">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-sber-gray-light px-4 pt-14 pb-3 lg:px-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-xs text-sber-gray">{{ greeting }}</p>
          <h1 class="text-xl font-bold text-sber-black">Мои задачи</h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center"
            @click.stop="toggleSearch"
          >
            <Search class="w-5 h-5 text-sber-gray" />
          </button>
          <NuxtLink to="/app/profile" class="w-10 h-10 overflow-hidden rounded-full bg-sber-green
                                               flex items-center justify-center shadow-sm">
            <span v-if="!authStore.user?.avatar" class="text-white font-bold text-sm">
              {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
            </span>
            <img v-else :src="authStore.user.avatar" class="w-full h-full object-cover" />
          </NuxtLink>
        </div>
      </div>

      <!-- Search bar -->
      <Transition name="slide-down">
        <div v-if="showSearch" class="relative mb-1" @click.stop>
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Поиск задач..."
            class="input-field pl-11 py-3 text-sm"
          />
          <button v-if="searchQuery" class="absolute right-4 top-1/2 -translate-y-1/2"
                  @click="searchQuery = ''">
            <X class="w-4 h-4 text-sber-gray" />
          </button>
        </div>
      </Transition>

      <!-- Stats row -->
      <div v-if="!showSearch" class="grid grid-cols-3 gap-2 lg:max-w-[520px] lg:gap-3">
        <div v-for="stat in stats" :key="stat.label"
             class="bg-white rounded-2xl px-3 py-2.5 text-center shadow-sm lg:px-5 lg:py-4">
          <p class="text-lg font-bold" :style="{ color: stat.color }">{{ stat.count }}</p>
          <p class="text-[10px] text-sber-gray font-medium">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Search results -->
    <div v-if="showSearch && searchQuery" class="px-4 pb-4 lg:px-6">
      <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">
        Результаты ({{ searchResults.length }})
      </p>
      <div v-if="searchResults.length === 0" class="text-center py-8 text-sber-gray text-sm">
        Ничего не найдено
      </div>
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        <TasksTaskItem
          v-for="task in searchResults"
          :key="task.id"
          :task="task"
          @complete="tasksStore.completeTask($event)"
          @delete="tasksStore.deleteTask($event)"
          @open="openTask"
        />
      </div>
    </div>

    <!-- Task groups -->
    <div v-else class="px-4 pb-4 lg:px-6">
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3 lg:gap-4">
      <TasksTaskGroup
        v-for="group in visibleGroups"
        :key="group.id"
        :title="group.title"
        :tasks="group.tasks"
        :color="group.color"
        :icon="group.icon"
        @open-task="openTask"
      />
      </div>
    </div>

    <!-- Task detail modal -->
    <TasksTaskDetailModal
      v-if="selectedTaskId"
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { Search, X, AlertCircle, Sun, Sunset, Moon, Star, Clock, CheckCircle2, Calendar } from 'lucide-vue-next'
import dayjs from 'dayjs'

definePageMeta({ layout: 'app' })

const authStore = useAuthStore()
const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()

const showSearch = ref(false)
const searchQuery = ref('')
const selectedTaskId = ref<string | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const hour = dayjs().hour()
const greeting = computed(() => {
  if (hour < 16) return 'Доброй ночи 🌙'
  if (hour < 12) return 'Доброе утро ☀️'
  if (hour < 18) return 'Добрый день 🌤'
  return 'Добрый вечер 🌙'
})

const stats = computed(() => [
  { label: 'Просрочено', count: tasksStore.overdueTasks.length, color: '#FF3B30' },
  { label: 'Сегодня', count: tasksStore.todayTasks.length, color: '#FF9500' },
  { label: 'Выполнено', count: tasksStore.completedTasks.length, color: '#21A038' },
])

const allGroups = computed(() => [
  {
    id: 'overdue',
    title: 'Просрочено',
    tasks: tasksStore.overdueTasks,
    color: '#FF3B30',
    icon: AlertCircle,
  },
  {
    id: 'today',
    title: 'Сегодня',
    tasks: tasksStore.todayTasks,
    color: '#FF9500',
    icon: Sun,
  },
  {
    id: 'tomorrow',
    title: 'Завтра',
    tasks: tasksStore.tomorrowTasks,
    color: '#007AFF',
    icon: Sunset,
  },
  {
    id: 'later',
    title: 'Позже',
    tasks: tasksStore.laterTasks,
    color: '#AF52DE',
    icon: Calendar,
  },
  {
    id: 'nodate',
    title: 'Без срока',
    tasks: tasksStore.noDateTasks,
    color: '#8E8E93',
    icon: Clock,
  },
  {
    id: 'completed',
    title: 'Выполнено',
    tasks: tasksStore.completedTasks,
    color: '#21A038',
    icon: CheckCircle2,
  },
])

const visibleGroups = computed(() =>
  allGroups.value.filter(g => settingsStore.isGroupVisible(g.id))
)

const searchResults = computed(() => tasksStore.searchTasks(searchQuery.value))

function openTask(id: string) {
  selectedTaskId.value = id
}

async function toggleSearch() {
  showSearch.value = !showSearch.value

  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

function handlePageClick() {
  if (showSearch.value) {
    showSearch.value = false
  }
}
</script>
