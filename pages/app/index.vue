<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'" @click="handlePageClick">
    <!-- Header -->
    <div class="page-header-top sticky top-0 z-20 px-4 pb-3 lg:px-6" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm font-semibold text-sber-black">{{ greeting }}</p>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/app/faq"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            title="Частые вопросы"
            @click.stop
          >
            <HelpCircle class="h-5 w-5 text-sber-gray" />
          </NuxtLink>
          <NuxtLink
            to="/app/legal"
            class="hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm sm:flex"
            title="Юридические документы"
            @click.stop
          >
            <FileText class="h-4 w-4 text-sber-gray" />
          </NuxtLink>
          <button
            class="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center"
            @click.stop="toggleSearch"
          >
            <Search class="w-5 h-5 text-sber-gray" />
          </button>
          <!-- <NuxtLink to="/app/profile" class="w-10 h-10 overflow-hidden rounded-full bg-sber-green
                                               flex items-center justify-center shadow-sm">
            <span v-if="!authStore.user?.avatar" class="text-white font-bold text-sm">
              {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
            </span>
            <img v-else :src="authStore.user.avatar" class="w-full h-full object-cover" />
          </NuxtLink> -->
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
      <div v-if="!showSearch" class="grid grid-cols-3 gap-2 lg:hidden">
        <div v-for="stat in stats" :key="stat.label"
             class="bg-white rounded-2xl px-3 py-2.5 text-center shadow-sm lg:px-5 lg:py-4">
          <p class="text-lg font-bold" :style="{ color: stat.color }">{{ stat.count }}</p>
          <p class="text-[10px] text-sber-gray font-medium">{{ stat.label }}</p>
        </div>
      </div>

      <div v-if="!showSearch" class="hidden lg:grid lg:grid-cols-6 lg:gap-3">
        <button
          v-for="group in desktopGroups"
          :key="group.id"
          class="rounded-2xl border px-3 py-3 text-left shadow-sm transition-colors"
          :class="[
            isDarkTheme ? 'bg-[#171a21]' : 'bg-white',
            activeDesktopGroupId === group.id
              ? 'border-sber-green bg-sber-green-light/40'
              : 'border-transparent hover:border-sber-gray-mid',
          ]"
          type="button"
          @click="selectDesktopGroup(group.id)"
        >
          <p class="text-lg font-bold" :style="{ color: group.color }">{{ group.tasks.length }}</p>
          <p class="text-[11px] font-semibold text-sber-gray">{{ group.title }}</p>
        </button>
      </div>
    </div>

    <!-- Search results -->
    <div v-if="showSearch && searchQuery" class="px-4 pb-8 lg:px-6 lg:pb-10">
      <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">
        Результаты ({{ searchResults.length }})
      </p>
      <div v-if="searchResults.length === 0" class="text-center py-8 text-sber-gray text-sm">
        Ничего не найдено
      </div>
      <div class="grid grid-cols-1 gap-3">
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
    <div v-else-if="tasksStore.loading && !tasksStore.initialized" class="px-4 py-16 text-center text-sm text-sber-gray">
      Загрузка задач...
    </div>
    <div v-else-if="tasksStore.error && !tasksStore.initialized" class="px-4 py-16 text-center">
      <p class="text-sm text-red-500">{{ tasksStore.error }}</p>
      <button class="mt-3 text-sm font-semibold text-sber-green" type="button" @click="tasksStore.fetchGrouped()">
        Повторить
      </button>
    </div>
    <div v-else class="px-4 pb-8 lg:px-6 lg:pb-10">
      <div class="grid grid-cols-1 gap-3 lg:hidden">
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

      <div
        ref="desktopSplitRef"
        class="hidden lg:flex lg:min-h-[calc(100dvh-9rem)] lg:rounded-3xl lg:border lg:border-sber-gray-mid/60 lg:shadow-card"
        :class="isDarkTheme ? 'lg:bg-[#171a21]' : 'lg:bg-white'"
      >
        <!-- Left: tasks list -->
        <section
          class="min-w-[360px] border-r border-sber-gray-light px-4 py-4"
          :style="{ width: `${leftPaneWidth}%` }"
        >
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: activeDesktopGroup?.color || '#8E8E93' }" />
              <p class="text-sm font-bold text-sber-black">{{ activeDesktopGroup?.title }}</p>
              <span class="rounded-full bg-sber-gray-light px-2 py-0.5 text-xs font-semibold text-sber-gray">
                {{ activeDesktopTasks.length }}
              </span>
            </div>
            <button class="text-xs font-semibold text-sber-green" type="button" @click="clearDesktopSelection">
              Снять выбор
            </button>
          </div>

          <div class="space-y-2 overflow-y-auto pr-1" style="max-height: calc(100dvh - 12.5rem);">
            <div
              v-for="task in activeDesktopTasks"
              :key="task.id"
              class="flex items-center gap-2 rounded-2xl border px-2 py-2 transition-colors"
              :class="desktopSelectedTaskId === task.id
                ? 'border-sber-green bg-sber-green-light/25'
                : isDarkTheme
                  ? 'border-[#2a303a] bg-[#10141b] hover:bg-[#1b212b]'
                  : 'border-sber-gray-light bg-white hover:bg-sber-gray-light/60'"
              :style="!task.completed && task.priority !== 'none'
                ? { borderLeftWidth: '3px', borderLeftColor: priorityColor(task.priority) }
                : undefined"
            >
              <button
                type="button"
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                :style="{
                  borderColor: priorityColor(task.priority),
                  backgroundColor: task.completed ? priorityColor(task.priority) : 'transparent',
                }"
                @click.stop="toggleDesktopTaskCheck(task.id)"
              >
                <Check v-if="task.completed" class="h-3 w-3 text-white" />
              </button>
              <button
                type="button"
                class="min-w-0 flex-1 text-left"
                @click="selectDesktopTask(task.id)"
              >
                <p
                  class="line-clamp-1 text-sm font-semibold"
                  :class="task.completed
                    ? 'text-sber-gray line-through'
                    : desktopSelectedTaskId === task.id
                      ? 'text-sber-green'
                      : 'text-sber-black'"
                >
                  {{ task.title }}
                </p>
              </button>
            </div>

            <div v-if="activeDesktopTasks.length === 0" class="rounded-2xl border border-dashed border-sber-gray-mid py-10 text-center text-sm text-sber-gray">
              В этом разделе пока нет задач
            </div>
          </div>
        </section>

        <!-- Resize handle -->
        <button
          class="w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-sber-green/20"
          type="button"
          @pointerdown="startResizing"
        />

        <!-- Right: task editor -->
        <section class="min-w-0 flex-1 px-5 py-4">
          <div v-if="desktopSelectedTask" class="flex h-full flex-col">
            <h2 class="mb-4 line-clamp-1 text-xl font-bold text-sber-black">{{ desktopSelectedTask.title }}</h2>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label>
                <input v-model="editorForm.title" class="input-field py-3" type="text">
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label>
                <textarea v-model="editorForm.description" class="input-field min-h-[92px] resize-none py-3" />
              </div>

              <div class="md:col-span-2 grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Дата</label>
                  <DateFieldRu v-model="editorForm.dueDate" field-class="py-3" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Время срока</label>
                  <TimeFieldRu v-model="editorForm.dueTime" field-class="py-3" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Начало</label>
                  <TimeFieldRu
                    v-model="editorForm.durationStart"
                    field-class="py-3"
                    @update:model-value="desktopEditorError = ''"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-sber-gray">Конец</label>
                  <TimeFieldRu
                    v-model="editorForm.durationEnd"
                    field-class="py-3"
                    @update:model-value="desktopEditorError = ''"
                  />
                </div>
              </div>

              <p v-if="desktopEditorError" class="md:col-span-2 text-sm font-medium text-red-500">
                {{ desktopEditorError }}
              </p>

              <div>
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Приоритет</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="opt in priorityOptions"
                    :key="opt.value"
                    type="button"
                    class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                    :class="editorForm.priority === opt.value
                      ? 'border-sber-green bg-sber-green text-white'
                      : isDarkTheme
                        ? 'border-[#2a303a] bg-[#10141b] text-slate-300'
                        : 'border-sber-gray-mid bg-white text-sber-black'"
                    @click="editorForm.priority = opt.value"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Уведомление</label>
                <select v-model="editorForm.notification" class="input-field appearance-none py-3">
                  <option value="">Без уведомления</option>
                  <option value="0">В момент срока</option>
                  <option value="5">За 5 минут</option>
                  <option value="15">За 15 минут</option>
                  <option value="30">За 30 минут</option>
                  <option value="60">За 1 час</option>
                  <option value="1440">За 1 день</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-semibold text-sber-gray">Повтор</label>
                <select v-model="editorForm.repeat" class="input-field appearance-none py-3">
                  <option value="none">Не повторять</option>
                  <option value="daily">Каждый день</option>
                  <option value="weekly">Каждую неделю</option>
                  <option value="monthly">Каждый месяц</option>
                  <option value="yearly">Каждый год</option>
                  <option value="custom">Настроить повторение</option>
                </select>
              </div>

              <div v-if="editorForm.repeat === 'custom'" class="md:col-span-2 rounded-2xl border border-sber-green/30 bg-sber-green-light/30 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Настроить повторение</p>

                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span class="text-sm text-sber-gray">Каждые</span>
                  <input
                    v-model.number="desktopCustomRepeat.interval"
                    type="number"
                    min="1"
                    max="31"
                    class="w-20 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"
                  >
                  <button
                    type="button"
                    class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                    :class="desktopCustomRepeat.unit === 'week' ? 'border-sber-green bg-sber-green text-white' : 'border-sber-gray-mid bg-white text-sber-black'"
                    @click="desktopCustomRepeat.unit = 'week'"
                  >
                    Недели
                  </button>
                  <button
                    type="button"
                    class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                    :class="desktopCustomRepeat.unit === 'month' ? 'border-sber-green bg-sber-green text-white' : 'border-sber-gray-mid bg-white text-sber-black'"
                    @click="desktopCustomRepeat.unit = 'month'"
                  >
                    Месяца
                  </button>
                </div>

                <div v-if="desktopCustomRepeat.unit === 'week'" class="mt-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Дни недели</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="day in weekDays"
                      :key="day.value"
                      type="button"
                      class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                      :class="desktopCustomRepeat.weekdays.includes(day.value)
                        ? 'border-sber-green bg-sber-green text-white'
                        : 'border-sber-gray-mid bg-white text-sber-gray'"
                      @click="toggleDesktopCustomWeekday(day.value)"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                </div>

                <div v-else class="mt-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">День месяца</p>
                  <input
                    v-model.number="desktopCustomRepeat.monthDay"
                    type="number"
                    min="1"
                    max="31"
                    class="w-28 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"
                  >
                </div>
              </div>

              <div class="md:col-span-2">
                <input ref="attachmentInputRef" type="file" class="hidden" @change="handleAttachmentChange">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-sber-green/40 bg-sber-green-light px-3 py-2 text-sm font-semibold text-sber-green transition-colors hover:bg-sber-green/20"
                  @click="attachmentInputRef?.click()"
                >
                  <Paperclip class="h-4 w-4" />
                  Добавить изображение или файл
                </button>
                <div v-if="attachmentName" class="mt-2 flex items-center gap-2 rounded-xl border border-sber-gray-light px-3 py-2">
                  <p class="min-w-0 flex-1 truncate text-sm text-sber-black">{{ attachmentName }}</p>
                  <button type="button" class="text-sber-gray hover:text-red-500" @click="clearAttachment">
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-auto grid grid-cols-3 gap-3 pt-5">
              <button class="btn-primary col-span-1" type="button" @click="saveDesktopTask">
                Сохранить
              </button>
              <button
                class="col-span-1 rounded-2xl px-4 py-4 text-sm font-semibold transition-colors"
                :class="desktopSelectedTask.completed ? 'bg-sber-blue-light text-sber-blue' : 'bg-sber-green-light text-sber-green'"
                type="button"
                @click="toggleDesktopTaskComplete"
              >
                {{ desktopSelectedTask.completed ? 'Восстановить' : 'Выполнено' }}
              </button>
              <button class="col-span-1 rounded-2xl bg-red-50 px-4 py-4 text-sm font-semibold text-red-500" type="button" @click="confirmDeleteDesktopTask">
                Удалить
              </button>
            </div>
          </div>

          <div v-else class="flex h-full items-center justify-center rounded-3xl border border-dashed border-sber-gray-mid text-sm text-sber-gray">
            Выберите задачу слева, чтобы открыть редактирование
          </div>
        </section>
      </div>
    </div>

    <!-- Unsaved changes -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="unsavedModal" class="overlay" @click="unsavedModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="unsavedModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-2 text-lg font-bold text-sber-black">Сохранить изменения?</h3>
          <p class="mb-5 text-sm text-sber-gray">Есть несохранённые правки в задаче.</p>
          <button class="btn-primary mb-2" type="button" @click="saveAndContinue">Сохранить</button>
          <button class="btn-secondary mb-2" type="button" @click="discardAndContinue">Нет</button>
          <button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button" @click="unsavedModal = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete recurring -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="deleteModal" class="overlay" @click="deleteModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="deleteModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-2 text-lg font-bold text-sber-black">Удалить повторяющуюся задачу?</h3>
          <button class="btn-primary mb-2" type="button" @click="deleteTaskOccurrence">Только эту</button>
          <button class="btn-secondary mb-2" type="button" @click="deleteAllOccurrences">Все повторения</button>
          <button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button" @click="deleteModal = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Search, X, AlertCircle, Sun, Sunset, Moon, Star, Clock, CheckCircle2, Calendar, HelpCircle, FileText, Paperclip, Check } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Priority, RepeatType, Task } from '~/data/mockData'
import { getApiErrorMessage, getApiFieldError } from '~/utils/api'
import { validateDurationFields } from '~/utils/time'
import { priorityColor } from '~/utils/priority-colors'

definePageMeta({ layout: 'app' })

const route = useRoute()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const priorityOptions = [
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
  { value: 'none', label: 'Без приоритета' },
] as const

const attachmentInputRef = ref<HTMLInputElement | null>(null)
const attachmentName = ref('')
const attachmentMimeType = ref('')
const attachmentDataUrl = ref('')
const attachmentRemoved = ref(false)

const showSearch = ref(false)
const searchQuery = ref('')
const desktopSelectedTaskId = ref<string | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isDesktop = ref(false)
const desktopSplitRef = ref<HTMLElement | null>(null)
const leftPaneWidth = ref(52)
let removeResizeListeners: (() => void) | null = null

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

const allTasksList = computed(() => [...tasksStore.tasks])

const desktopGroups = computed(() => ([
  { id: 'overdue', title: 'Просрочено', color: '#FF3B30', tasks: tasksStore.overdueTasks },
  { id: 'today', title: 'Сегодня', color: '#FF9500', tasks: tasksStore.todayTasks },
  { id: 'tomorrow', title: 'Завтра', color: '#007AFF', tasks: tasksStore.tomorrowTasks },
  { id: 'later', title: 'Позже', color: '#AF52DE', tasks: tasksStore.laterTasks },
  { id: 'nodate', title: 'Без срока', color: '#8E8E93', tasks: tasksStore.noDateTasks },
  { id: 'completed', title: 'Готово', color: '#21A038', tasks: tasksStore.completedTasks },
  { id: 'all', title: 'Все задачи', color: '#5856D6', tasks: allTasksList.value },
]))

const activeDesktopGroupId = ref('overdue')
const activeDesktopGroup = computed(() =>
  desktopGroups.value.find(group => group.id === activeDesktopGroupId.value) || desktopGroups.value[0]
)
const activeDesktopTasks = computed(() => activeDesktopGroup.value?.tasks || [])
const desktopSelectedTask = computed(() =>
  tasksStore.tasks.find(task => task.id === desktopSelectedTaskId.value) || null
)

const searchResults = ref<Task[]>([])
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (query) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  searchDebounceTimer = setTimeout(async () => {
    try {
      searchResults.value = await tasksStore.searchTasks(query)
    }
    catch {
      searchResults.value = []
    }
  }, 300)
})

const desktopEditorError = ref('')

const editorForm = reactive({
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  durationStart: '',
  durationEnd: '',
  priority: 'none' as Priority,
  notification: '',
  repeat: 'none' as RepeatType,
})

const desktopCustomRepeat = reactive({
  interval: 1,
  unit: 'week' as 'week' | 'month',
  weekdays: [1] as number[],
  monthDay: dayjs().date(),
})

useTaskTimeSync(editorForm)

const editorSnapshot = ref('')
const unsavedModal = ref(false)
const deleteModal = ref(false)
let pendingUnsavedAction: (() => void) | null = null
let pendingDeleteTaskId: string | null = null

const weekDays = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 7 },
]

function captureEditorSnapshot() {
  editorSnapshot.value = JSON.stringify({
    ...editorForm,
    customRepeat: { ...desktopCustomRepeat },
    attachment: attachmentDataUrl.value,
    attachmentRemoved: attachmentRemoved.value,
  })
}

const editorDirty = computed(() => {
  if (!desktopSelectedTaskId.value) return false
  const current = JSON.stringify({
    ...editorForm,
    customRepeat: { ...desktopCustomRepeat },
    attachment: attachmentDataUrl.value,
    attachmentRemoved: attachmentRemoved.value,
  })
  return current !== editorSnapshot.value
})

function runWithUnsavedGuard(action: () => void) {
  if (!editorDirty.value) {
    action()
    return
  }
  pendingUnsavedAction = action
  unsavedModal.value = true
}

function selectDesktopGroup(groupId: string) {
  runWithUnsavedGuard(() => {
    activeDesktopGroupId.value = groupId
    desktopSelectedTaskId.value = null
  })
}

function selectDesktopTask(id: string) {
  if (desktopSelectedTaskId.value === id) return
  runWithUnsavedGuard(() => {
    desktopSelectedTaskId.value = id
  })
}

async function saveAndContinue() {
  await saveDesktopTask()
  unsavedModal.value = false
  pendingUnsavedAction?.()
  pendingUnsavedAction = null
}

function discardAndContinue() {
  unsavedModal.value = false
  const task = desktopSelectedTask.value
  syncEditorForm(task)
  captureEditorSnapshot()
  pendingUnsavedAction?.()
  pendingUnsavedAction = null
}

function openTask(id: string) {
  if (isDesktop.value) {
    selectDesktopTask(id)
    return
  }
  navigateTo({ path: '/app/new-task', query: { id, returnTo: '/app' } })
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

function syncEditorForm(task: Task | null) {
  desktopEditorError.value = ''
  editorForm.title = task?.title || ''
  editorForm.description = task?.description || ''
  editorForm.dueDate = task?.dueDate || ''
  editorForm.dueTime = task?.dueTime || ''
  editorForm.durationStart = task?.duration?.start || ''
  editorForm.durationEnd = task?.duration?.end || ''
  editorForm.priority = task?.priority || 'none'
  editorForm.notification = task?.notification || ''
  editorForm.repeat = task?.repeat || 'none'

  desktopCustomRepeat.interval = task?.repeatCustom?.interval || 1
  desktopCustomRepeat.unit = task?.repeatCustom?.unit || (task?.repeatDays?.length ? 'week' : 'week')
  desktopCustomRepeat.weekdays = task?.repeatCustom?.weekdays?.length
    ? [...task.repeatCustom.weekdays]
    : task?.repeatDays?.length
      ? [...task.repeatDays]
      : [1]
  desktopCustomRepeat.monthDay = task?.repeatCustom?.monthDay || dayjs().date()

  attachmentRemoved.value = false
  if (task?.attachment) {
    attachmentName.value = task.attachment.name
    attachmentMimeType.value = task.attachment.mimeType
    attachmentDataUrl.value = task.attachment.dataUrl
  } else {
    clearAttachment()
  }
  nextTick(() => captureEditorSnapshot())
}

function handleAttachmentChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (input) input.value = ''
  if (!file) return

  attachmentRemoved.value = false
  attachmentName.value = file.name
  attachmentMimeType.value = file.type || 'application/octet-stream'
  const reader = new FileReader()
  reader.onload = () => {
    attachmentDataUrl.value = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

function clearAttachment() {
  attachmentName.value = ''
  attachmentMimeType.value = ''
  attachmentDataUrl.value = ''
  attachmentRemoved.value = true
  if (attachmentInputRef.value) attachmentInputRef.value.value = ''
}

async function saveDesktopTask() {
  const task = desktopSelectedTask.value
  if (!task) return

  desktopEditorError.value = ''
  const durationError = validateDurationFields(editorForm.durationStart, editorForm.durationEnd)
  if (durationError) {
    desktopEditorError.value = durationError
    return
  }

  const updates: Partial<Task> = {
    title: editorForm.title.trim() || task.title,
    description: editorForm.description.trim() || undefined,
    dueDate: editorForm.dueDate || undefined,
    dueTime: editorForm.dueTime || undefined,
    priority: editorForm.priority,
    notification: editorForm.notification || undefined,
    repeat: editorForm.repeat,
  }

  if (editorForm.repeat === 'custom') {
    const interval = Math.max(1, Number(desktopCustomRepeat.interval) || 1)
    const monthDay = Number(desktopCustomRepeat.monthDay) || 1
    if (desktopCustomRepeat.unit === 'month' && (monthDay < 1 || monthDay > 31)) {
      desktopEditorError.value = 'День месяца должен быть от 1 до 31'
      return
    }
    const clampedMonthDay = Math.min(31, Math.max(1, monthDay))
    const weekdays = [...desktopCustomRepeat.weekdays].sort((a, b) => a - b)

    updates.repeatCustom = {
      interval,
      unit: desktopCustomRepeat.unit,
      weekdays: desktopCustomRepeat.unit === 'week' ? weekdays : undefined,
      monthDay: desktopCustomRepeat.unit === 'month' ? clampedMonthDay : undefined,
    }
    updates.repeatDays = desktopCustomRepeat.unit === 'week' ? weekdays : undefined
  } else {
    updates.repeatCustom = undefined
    updates.repeatDays = undefined
  }

  if (editorForm.durationStart && editorForm.durationEnd) {
    updates.duration = { start: editorForm.durationStart, end: editorForm.durationEnd }
  } else {
    updates.duration = undefined
  }

  if (attachmentDataUrl.value) {
    updates.attachment = {
      name: attachmentName.value,
      mimeType: attachmentMimeType.value || 'application/octet-stream',
      dataUrl: attachmentDataUrl.value,
    }
  } else if (attachmentRemoved.value) {
    updates.attachment = undefined
  }

  try {
    await tasksStore.updateTask(task.id, updates)
    captureEditorSnapshot()
  }
  catch (err: unknown) {
    desktopEditorError.value = getApiFieldError(err, 'end_at')
      || getApiErrorMessage(err, 'Не удалось сохранить задачу')
  }
}

function toggleDesktopTaskCheck(id: string) {
  tasksStore.completeTask(id)
}

function toggleDesktopTaskComplete() {
  const task = desktopSelectedTask.value
  if (!task) return
  tasksStore.completeTask(task.id)
}

function confirmDeleteDesktopTask() {
  const task = desktopSelectedTask.value
  if (!task) return
  if (task.repeat && task.repeat !== 'none') {
    pendingDeleteTaskId = task.id
    deleteModal.value = true
    return
  }
  deleteDesktopTask(task.id)
}

function deleteDesktopTask(id: string) {
  tasksStore.deleteTask(id)
  if (desktopSelectedTaskId.value === id) {
    desktopSelectedTaskId.value = null
  }
}

async function deleteTaskOccurrence() {
  if (!pendingDeleteTaskId) return
  const id = pendingDeleteTaskId
  deleteModal.value = false
  pendingDeleteTaskId = null
  await tasksStore.updateTask(id, { repeat: 'none', repeatCustom: undefined, repeatDays: undefined })
  deleteDesktopTask(id)
}

function deleteAllOccurrences() {
  if (!pendingDeleteTaskId) return
  const id = pendingDeleteTaskId
  deleteModal.value = false
  pendingDeleteTaskId = null
  deleteDesktopTask(id)
}

function clearDesktopSelection() {
  desktopSelectedTaskId.value = null
}

function toggleDesktopCustomWeekday(day: number) {
  if (desktopCustomRepeat.weekdays.includes(day)) {
    desktopCustomRepeat.weekdays = desktopCustomRepeat.weekdays.filter(v => v !== day)
    if (desktopCustomRepeat.weekdays.length === 0) {
      desktopCustomRepeat.weekdays = [1]
    }
    return
  }
  desktopCustomRepeat.weekdays = [...desktopCustomRepeat.weekdays, day].sort((a, b) => a - b)
}

function formatTaskDate(task: Task) {
  if (!task.dueDate) return ''
  return dayjs(task.dueDate).format('DD.MM.YY')
}

function formatNotification(value?: string) {
  if (!value) return ''
  if (value === '0') return 'в срок'
  if (value === '60') return 'за 1ч'
  if (value === '1440') return 'за 1д'
  return `за ${value}м`
}

function formatRepeat(task: Task) {
  const labels: Record<string, string> = {
    daily: 'ежедневно',
    weekly: 'еженед.',
    monthly: 'ежемес.',
    yearly: 'ежегодно',
    custom: 'кастом',
  }
  return labels[task.repeat] || ''
}

function formatPriority(priority: Priority) {
  const labels: Record<Priority, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    none: 'Без приор.',
  }
  return labels[priority]
}

function updateDesktopFlag() {
  isDesktop.value = window.innerWidth >= 1024
}

function startResizing(event: PointerEvent) {
  const container = desktopSplitRef.value
  if (!container) return
  event.preventDefault()

  const onMove = (moveEvent: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    const nextWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100
    leftPaneWidth.value = Math.max(34, Math.min(72, nextWidth))
  }
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    removeResizeListeners = null
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp, { once: true })
  removeResizeListeners = onUp
}

watch(desktopSelectedTask, (task) => {
  syncEditorForm(task)
}, { immediate: true })

watch(() => editorForm.dueDate, (newDate) => {
  if (newDate !== '') return
  editorForm.dueTime = ''
  editorForm.durationStart = ''
  editorForm.durationEnd = ''
})

watch(activeDesktopTasks, (tasks) => {
  if (!desktopSelectedTaskId.value) return
  if (!tasks.some(task => task.id === desktopSelectedTaskId.value)) {
    desktopSelectedTaskId.value = null
  }
})

watch(desktopGroups, (groups) => {
  if (groups.some(group => group.id === activeDesktopGroupId.value)) return
  activeDesktopGroupId.value = groups[0]?.id || 'overdue'
}, { immediate: true })

watch(
  () => route.query.group,
  (group) => {
    if (group === 'all') {
      activeDesktopGroupId.value = 'all'
    }
  },
  { immediate: true },
)

onMounted(() => {
  updateDesktopFlag()
  window.addEventListener('resize', updateDesktopFlag)
  if (!tasksStore.initialized) {
    void tasksStore.fetchGrouped()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDesktopFlag)
  removeResizeListeners?.()
})
</script>
