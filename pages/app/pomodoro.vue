<template>
  <div class="page-container flex min-h-0 flex-col bg-sber-gray-light lg:h-full">
    <!-- Header -->
    <div class="page-header-top flex shrink-0 items-center justify-between px-4 pb-3 lg:px-6">
      <h1 class="text-xl font-bold text-sber-black">Помодоро</h1>
      <button class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition-colors active:bg-sber-gray-light"
              @click="settingsOpen = true">
        <Settings class="w-5 h-5 text-sber-black" />
      </button>
    </div>

    <div class="flex min-h-0 flex-1 flex-col px-4 pb-4 lg:px-6">
      <div class="mx-auto flex w-full max-w-4xl min-h-0 flex-1 flex-col gap-4">
        <div class="grid gap-3 lg:grid-cols-2">
          <button
            class="flex min-w-0 w-full items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm transition-colors active:bg-sber-gray-light"
            @click="taskPickerOpen = true"
          >
            <Target class="h-5 w-5 shrink-0 text-sber-green" />
            <div class="min-w-0 flex-1 text-left">
              <p class="text-xs text-sber-gray">Задача для фокуса</p>
              <p class="truncate text-sm font-medium text-sber-black">
                {{ selectedTask?.title || 'Выбрать задачу...' }}
              </p>
            </div>
            <ChevronRight class="h-4 w-4 text-sber-gray" />
          </button>

          <div class="flex items-center gap-3 rounded-[28px] border border-sber-gray-light bg-white px-4 py-4 shadow-sm">
            <Music class="h-5 w-5 text-sber-gray" />
            <span class="flex-1 text-sm text-sber-gray">Звук фоновый</span>
            <div class="flex flex-wrap justify-end gap-2">
              <button
                v-for="s in soundsStore.workBackground"
                :key="s.key"
                type="button"
                class="rounded-lg px-2 py-1 text-sm transition-colors"
                :class="pomodoroStore.settings.workingSound === s.key
                  ? 'bg-sber-green text-white'
                  : 'bg-sber-gray-light text-sber-gray'"
                :title="s.title"
                @click="selectWorkSound(s)"
              >
                {{ s.emoji }}
              </button>
            </div>
          </div>
        </div>

        <div class="mx-auto flex w-full min-h-0 flex-1 flex-col justify-center rounded-[32px] bg-white px-6 py-6 shadow-card lg:px-10 lg:py-8">
          <!-- Session count -->
          <div class="mb-4 flex justify-center gap-2 lg:mb-6">
            <div v-for="i in pomodoroStore.settings.sessionsUntilLong" :key="i"
                 class="h-2 w-8 rounded-full transition-colors"
                 :class="i <= pomodoroStore.sessionCount % pomodoroStore.settings.sessionsUntilLong || (pomodoroStore.sessionCount > 0 && pomodoroStore.sessionCount % pomodoroStore.settings.sessionsUntilLong === 0)
                  ? 'bg-sber-green'
                  : 'bg-sber-gray-mid'" />
          </div>

          <!-- Timer circle -->
          <div class="flex flex-col items-center justify-center">
            <div class="relative mb-6 flex h-64 w-64 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light/60 p-3 shadow-inner lg:mb-8 lg:h-[min(52vh,28rem)] lg:w-[min(52vh,28rem)] lg:p-4">
              <div class="relative h-[224px] w-[224px] overflow-hidden rounded-full bg-white lg:h-[calc(100%-1.5rem)] lg:w-[calc(100%-1.5rem)]">
                <div class="absolute inset-x-0 bottom-0 transition-all duration-500" :style="waterFillStyle">
                  <div class="water-wave water-wave-1" />
                  <div class="water-wave water-wave-2" />
                </div>
              </div>

              <!-- Time display -->
              <div class="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <p class="text-5xl font-bold tracking-tight text-sber-black lg:text-7xl">{{ pomodoroStore.displayTime }}</p>
                <p v-if="pomodoroStore.state === 'paused'" class="mt-1 text-sm text-sber-gray">На паузе</p>
                <p v-else-if="pomodoroStore.isBreak" class="mt-1 text-sm text-sber-blue">Перерыв</p>
                <p v-else class="mt-1 text-sm text-sber-gray">
                  {{ pomodoroStore.state === 'running' ? 'Фокус' : 'Готов' }}
                </p>
              </div>
            </div>

            <!-- Controls -->
            <div class="flex items-center gap-6">
              <!-- Stop -->
              <button
                class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid disabled:opacity-50"
                :disabled="pomodoroStore.state === 'idle'"
                @click="pomodoroStore.stop()"
              >
                <Square class="h-5 w-5 text-sber-black" />
              </button>

              <!-- Play/Pause (main) -->
              <button
                class="flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
                :class="pomodoroStore.state === 'running' ? 'bg-sber-blue' : 'bg-sber-green'"
                @click="toggleTimer"
              >
                <Pause v-if="pomodoroStore.state === 'running'" class="h-8 w-8 text-white" />
                <Play v-else class="ml-1 h-8 w-8 text-white" />
              </button>

              <!-- Skip -->
              <button
                class="flex h-12 w-12 items-center justify-center rounded-full border border-sber-gray-light bg-sber-gray-light transition-colors active:bg-sber-gray-mid"
                @click="pomodoroStore.stop()"
              >
                <SkipForward class="h-5 w-5 text-sber-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task picker modal -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="taskPickerOpen" class="overlay" @click="taskPickerOpen = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="taskPickerOpen" class="app-modal flex max-h-[75dvh] flex-col px-4 py-5" @click.stop>
          <h3 class="mb-3 text-lg font-bold text-sber-black">Выбрать задачу</h3>

          <div class="sticky top-0 z-10 shrink-0 bg-white pb-2">
            <div class="relative mb-3">
              <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-gray" />
              <input v-model="taskSearch" placeholder="Поиск..." class="input-field py-3 pl-11 text-sm" />
            </div>

            <button
              class="mb-2 flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-sm text-sber-gray"
              @click="selectTask(null)"
            >
              <X class="h-4 w-4" /> Без задачи
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <div
              v-for="task in filteredTasks"
              :key="task.id"
              class="mb-2 flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition-colors active:bg-sber-gray-light"
              :class="pomodoroStore.selectedTaskId === task.id ? 'bg-sber-green-light' : 'border border-sber-gray-light bg-white'"
              @click="selectTask(task.id)"
            >
              <div
                class="h-3 w-3 shrink-0 rounded-full"
                :style="{ backgroundColor: getPriorityColor(task.priority) }"
              />
              <p class="flex-1 truncate text-sm font-medium text-sber-black">{{ task.title }}</p>
              <Check v-if="pomodoroStore.selectedTaskId === task.id" class="h-4 w-4 text-sber-green" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Settings modal -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="settingsOpen" class="overlay" @click="settingsOpen = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="settingsOpen" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold text-sber-black mb-5">Настройки Помодоро</h3>

          <!-- Duration -->
          <div class="mb-5">
            <label class="text-sm font-semibold text-sber-black mb-3 block">
              Длительность: {{ pomodoroStore.settings.duration }} мин
            </label>
            <div class="flex gap-2 flex-wrap">
              <button v-for="d in [15, 20, 25, 30, 45, 60]" :key="d"
                      class="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                      :class="pomodoroStore.settings.duration === d
                        ? 'bg-sber-green text-white border-sber-green'
                        : 'border-sber-gray-mid text-sber-black'"
                      @click="pomodoroStore.updateSettings({ duration: d })">
                {{ d }} мин
              </button>
            </div>
          </div>

          <!-- Short break -->
          <div class="mb-5">
            <label class="text-sm font-semibold text-sber-black mb-3 block">
              Короткий перерыв: {{ pomodoroStore.settings.shortBreak }} мин
            </label>
            <div class="flex gap-2">
              <button v-for="d in [3, 5, 7, 10]" :key="d"
                      class="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                      :class="pomodoroStore.settings.shortBreak === d
                        ? 'bg-sber-blue text-white border-sber-blue'
                        : 'border-sber-gray-mid text-sber-black'"
                      @click="pomodoroStore.updateSettings({ shortBreak: d })">
                {{ d }} мин
              </button>
            </div>
          </div>

          <!-- Show on lock screen -->
          <div class="flex items-center justify-between py-3 border-b border-sber-gray-light mb-5">
            <div>
              <p class="text-sm font-medium text-sber-black">Показывать при блокировке</p>
              <p class="text-xs text-sber-gray">На экране блокировки смартфона</p>
            </div>
            <button
              class="w-12 h-6 rounded-full transition-colors relative"
              :class="pomodoroStore.settings.showOnLockScreen ? 'bg-sber-green' : 'bg-sber-gray-mid'"
              @click="pomodoroStore.updateSettings({ showOnLockScreen: !pomodoroStore.settings.showOnLockScreen })"
            >
              <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                   :class="pomodoroStore.settings.showOnLockScreen ? 'translate-x-7' : 'translate-x-1'" />
            </button>
          </div>

          <!-- Completion sound -->
          <div class="mb-5">
            <label class="text-sm font-semibold text-sber-black mb-3 block">Звук завершения</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="s in soundsStore.timerEnd"
                :key="s.key"
                type="button"
                class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
                :class="pomodoroStore.settings.sound === s.key
                  ? 'bg-sber-green text-white border-sber-green'
                  : 'border-sber-gray-mid text-sber-black'"
                @click="selectTimerEndSound(s)"
              >
                {{ s.emoji }} {{ s.title }}
              </button>
            </div>
          </div>

          <button class="btn-primary" @click="settingsOpen = false">Готово</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Settings, Play, Pause, Square, SkipForward,
  Target, Music, Search, Check, X, ChevronRight,
} from 'lucide-vue-next'
import type { ApiSound } from '~/types/mobile-api'

definePageMeta({ layout: 'app' })

const pomodoroStore = usePomodoroStore()
const soundsStore = useSoundsStore()
const tasksStore = useTasksStore()

const settingsOpen = ref(false)
const taskPickerOpen = ref(false)
const taskSearch = ref('')
const progressPercent = computed(() => Math.round(Math.max(0, Math.min(1, pomodoroStore.progress)) * 100))

const waterFillStyle = computed(() => {
  const activeColor = pomodoroStore.isBreak ? '#007AFF' : '#21A038'
  return {
    height: `${progressPercent.value}%`,
    background: `linear-gradient(180deg, ${activeColor}CC 0%, ${activeColor}99 100%)`,
  }
})

const selectedTask = computed(() =>
  tasksStore.tasks.find(t => t.id === pomodoroStore.selectedTaskId)
)

const filteredTasks = computed(() => {
  const activeTasks = tasksStore.tasks.filter(t => !t.completed)
  if (!taskSearch.value) return activeTasks
  return activeTasks.filter(t => t.title.toLowerCase().includes(taskSearch.value.toLowerCase()))
})

function toggleTimer() {
  if (pomodoroStore.state === 'running') {
    pomodoroStore.pause()
  }
  else {
    void pomodoroStore.start()
  }
}

onMounted(async () => {
  await Promise.all([
    pomodoroStore.fetchSettings(),
    soundsStore.fetchAll(),
    pomodoroStore.fetchSessions(),
  ])
  if (!tasksStore.initialized) {
    void tasksStore.fetchGrouped()
  }
})

async function selectWorkSound(sound: ApiSound) {
  if (pomodoroStore.settings.workingSound === sound.key) {
    pomodoroStore.stopBackgroundAudio()
    await pomodoroStore.setWorkSound('none')
    return
  }
  await pomodoroStore.setWorkSound(sound.key, sound)
}

async function selectTimerEndSound(sound: ApiSound) {
  await pomodoroStore.setTimerEndSound(sound.key, sound)
}

function selectTask(taskId: string | null) {
  pomodoroStore.selectTask(taskId)
  taskPickerOpen.value = false
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    high: '#FF3B30',
    medium: '#FF9500',
    low: '#34C759',
    none: '#8E8E93',
  }
  return colors[priority] || '#8E8E93'
}
</script>

<style scoped>
.water-wave {
  position: absolute;
  left: -25%;
  width: 150%;
  border-radius: 40%;
  background: rgba(255, 255, 255, 0.28);
}

.water-wave-1 {
  top: -12px;
  height: 26px;
  animation: waveDrift 7s linear infinite;
}

.water-wave-2 {
  top: -18px;
  height: 34px;
  opacity: 0.55;
  animation: waveDriftReverse 10s linear infinite;
}

@keyframes waveDrift {
  from { transform: translateX(-6%) rotate(0deg); }
  to { transform: translateX(6%) rotate(360deg); }
}

@keyframes waveDriftReverse {
  from { transform: translateX(6%) rotate(360deg); }
  to { transform: translateX(-6%) rotate(0deg); }
}
</style>
