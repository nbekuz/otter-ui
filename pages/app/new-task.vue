<template>
  <div class="page-container bg-sber-gray-light">
    <div class="bg-white px-4 pt-14 pb-4 shadow-sm">
      <div class="flex items-center gap-3">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light"
          type="button"
          @click="goBackToSource"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <div>
          <h1 class="text-xl font-bold text-sber-black">Новая задача</h1>
          <p class="text-sm text-sber-gray">Заполните название и при необходимости добавьте детали.</p>
        </div>
      </div>
    </div>

    <div class="mx-auto w-full max-w-3xl px-4 py-4">
      <form class="rounded-3xl bg-white shadow-card" @submit.prevent="submit">
        <div class="px-5 pt-5 pb-4">
          <label class="mb-2 block text-sm font-semibold text-sber-black">Название задачи</label>
          <input
            ref="titleInputRef"
            v-model="form.title"
            placeholder="Например: подготовить отчёт или созвониться с клиентом"
            class="input-field py-3 text-base font-medium"
            :class="{ 'border-red-400 bg-red-50 placeholder:text-red-300': errors.title }"
            @keydown.enter.prevent="focusDueDateField"
            @input="errors.title = ''"
          />
          <p v-if="errors.title" class="mt-2 text-xs font-medium text-red-500">{{ errors.title }}</p>

          <div class="mt-3">
            <input
              ref="attachmentInputRef"
              type="file"
              class="hidden"
              @change="handleAttachmentChange"
            >
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-sber-green/40 bg-sber-green-light px-3 py-2 text-sm font-semibold text-sber-green transition-colors hover:bg-sber-green/20"
              @click="attachmentInputRef?.click()"
            >
              <Paperclip class="h-4 w-4" />
              Добавить изображение или файл
            </button>
          </div>

          <div v-if="attachmentName" class="mt-3 rounded-2xl border border-sber-gray-light bg-sber-gray-light/60 p-3">
            <div class="flex items-start gap-3">
              <img
                v-if="attachmentPreviewUrl"
                :src="attachmentPreviewUrl"
                alt="Предпросмотр вложения"
                class="h-16 w-16 rounded-xl object-cover"
              >
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-sber-black">{{ attachmentName }}</p>
                <p class="mt-1 text-xs text-sber-gray">
                  {{ attachmentPreviewUrl ? 'Изображение прикреплено' : 'Файл прикреплен' }}
                </p>
              </div>
              <button
                type="button"
                class="rounded-lg p-1 text-sber-gray transition-colors hover:bg-white hover:text-red-500"
                @click="clearAttachment"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="mb-4 flex border-b border-sber-gray-light px-4 gap-1 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs" :key="tab.id"
            type="button"
            class="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-t-lg transition-colors"
            :class="activeTab === tab.id
              ? 'text-sber-green bg-sber-green-light border-b-2 border-sber-green'
              : 'text-sber-gray'"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'date'" class="px-4 pb-4">
          <p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Дата выполнения</p>
          <div class="flex gap-2 flex-wrap mb-4">
            <button v-for="quick in quickDates" :key="quick.value"
                    type="button"
                    class="px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors"
                    :class="form.dueDate === quick.value
                      ? 'bg-sber-green text-white border-sber-green'
                      : 'bg-white text-sber-black border-sber-gray-mid'"
                    @click="selectQuickDate(quick.value)">
              {{ quick.label }}
            </button>
          </div>

          <div class="relative mb-3">
            <input
              ref="dueDateInputRef"
              v-model="form.dueDate"
              type="date"
              class="input-field border-2 border-sber-green/50 pr-12 focus:border-sber-green focus:ring-2 focus:ring-sber-green/20"
              @keydown.enter.prevent="focusDueTimeField"
            />
            <Calendar class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-green" />
          </div>

          <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">Время срока</p>
          <div class="relative mb-3">
            <input
              ref="dueTimeInputRef"
              v-model="form.dueTime"
              type="time"
              class="input-field border-2 border-sber-green/50 pr-12 focus:border-sber-green focus:ring-2 focus:ring-sber-green/20"
              @keydown.enter.prevent="focusDurationStartField"
            />
            <Clock class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-green" />
          </div>

          <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">Длительность</p>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-xs text-sber-gray mb-1 block">Начало</label>
              <input
                ref="durationStartInputRef"
                v-model="form.durationStart"
                type="time"
                class="input-field"
                @keydown.enter.prevent="focusDurationEndField"
                @input="errors.duration = ''"
              />
            </div>
            <div class="flex-1">
              <label class="text-xs text-sber-gray mb-1 block">Конец</label>
              <input
                ref="durationEndInputRef"
                v-model="form.durationEnd"
                type="time"
                class="input-field"
                @keydown.enter.prevent="focusSubmitButton"
                @input="errors.duration = ''"
              />
            </div>
          </div>
          <p v-if="errors.duration" class="mt-2 text-xs font-medium text-red-500">{{ errors.duration }}</p>
        </div>

        <div v-if="activeTab === 'priority'" class="px-4 pb-4">
          <p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Приоритет</p>
          <div class="flex flex-col gap-2">
            <button v-for="p in priorities" :key="p.value"
                    type="button"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
                    :class="form.priority === p.value
                      ? 'border-current bg-opacity-10'
                      : 'border-sber-gray-light bg-white'"
                    :style="form.priority === p.value ? { borderColor: p.color, backgroundColor: p.color + '15' } : {}"
                    @click="form.priority = p.value">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: p.color }" />
              <span class="text-sm font-medium text-sber-black">{{ p.label }}</span>
              <Check v-if="form.priority === p.value" class="w-4 h-4 ml-auto text-sber-green" />
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'notify'" class="px-4 pb-4">
          <p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Уведомление</p>
          <div class="flex flex-col gap-2">
            <button v-for="n in notifyOptions" :key="n.value"
                    type="button"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"
                    :class="form.notification === n.value
                      ? 'border-sber-green bg-sber-green-light'
                      : 'border-sber-gray-light bg-white'"
                    @click="form.notification = n.value">
              <Bell class="w-4 h-4" :class="form.notification === n.value ? 'text-sber-green' : 'text-sber-gray'" />
              <span class="text-sm text-sber-black">{{ n.label }}</span>
              <Check v-if="form.notification === n.value" class="w-4 h-4 ml-auto text-sber-green" />
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'repeat'" class="px-4 pb-4">
          <p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Повторение</p>
          <div class="flex flex-col gap-2">
            <button v-for="r in repeatOptions" :key="r.value"
                    type="button"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all"
                    :class="form.repeat === r.value
                      ? 'border-sber-green bg-sber-green-light'
                      : 'border-sber-gray-light bg-white'"
                    @click="selectRepeatOption(r.value)">
              <RefreshCw class="w-4 h-4" :class="form.repeat === r.value ? 'text-sber-green' : 'text-sber-gray'" />
              <span class="text-sm text-sber-black">{{ r.label }}</span>
              <Check v-if="form.repeat === r.value" class="w-4 h-4 ml-auto text-sber-green" />
            </button>
          </div>

          <div v-if="form.repeat === 'custom'" class="mt-3 rounded-2xl border border-sber-green/30 bg-sber-green-light/30 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Настроить повторение</p>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="text-sm text-sber-gray">Каждые</span>
              <input
                v-model.number="customRepeat.interval"
                type="number"
                min="1"
                max="31"
                class="w-20 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"
              />
              <button
                type="button"
                class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                :class="customRepeat.unit === 'week' ? 'border-sber-green bg-sber-green text-white' : 'border-sber-gray-mid bg-white text-sber-black'"
                @click="customRepeat.unit = 'week'"
              >
                Недели
              </button>
              <button
                type="button"
                class="rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
                :class="customRepeat.unit === 'month' ? 'border-sber-green bg-sber-green text-white' : 'border-sber-gray-mid bg-white text-sber-black'"
                @click="customRepeat.unit = 'month'"
              >
                Месяца
              </button>
            </div>

            <div v-if="customRepeat.unit === 'week'" class="mt-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Дни недели</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="day in weekDays"
                  :key="day.value"
                  type="button"
                  class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                  :class="customRepeat.weekdays.includes(day.value)
                    ? 'border-sber-green bg-sber-green text-white'
                    : 'border-sber-gray-mid bg-white text-sber-gray'"
                  @click="toggleCustomWeekday(day.value)"
                >
                  {{ day.label }}
                </button>
              </div>
            </div>

            <div v-else class="mt-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">День месяца</p>
              <input
                v-model.number="customRepeat.monthDay"
                type="number"
                min="1"
                max="31"
                class="w-28 rounded-xl border border-sber-gray-mid bg-white px-3 py-2 text-sm font-semibold text-sber-black"
              />
            </div>

            <p v-if="errors.repeat" class="mt-2 text-xs font-medium text-red-500">{{ errors.repeat }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'matrix'" class="px-4 pb-4">
          <p class="text-xs font-semibold text-sber-gray mb-3 uppercase tracking-wide">Блок матрицы</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="block in matrixBlocks" :key="block.id"
                    type="button"
                    class="flex flex-col gap-1 px-3 py-3 rounded-2xl border-2 text-left transition-all"
                    :class="form.matrixBlock === block.id
                      ? 'border-current'
                      : 'border-sber-gray-light'"
                    :style="form.matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + '15' } : {}"
                    @click="form.matrixBlock = block.id">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: block.color }" />
              <span class="text-xs font-medium text-sber-black leading-tight">{{ block.title }}</span>
            </button>
          </div>
        </div>

        <div class="px-4 pb-6 pt-2">
          <button class="btn-secondary mb-3" type="button" @click="goBackToSource">
            Отмена
          </button>
          <button ref="submitButtonRef" class="btn-primary" type="submit">
            Добавить задачу
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Bell, RefreshCw, Calendar, Flag, Grid2x2, ChevronLeft, Clock, Paperclip, X } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Priority, RepeatType } from '~/data/mockData'

definePageMeta({ layout: 'app' })

const route = useRoute()
const tasksStore = useTasksStore()
const titleInputRef = ref<HTMLInputElement | null>(null)
const dueDateInputRef = ref<HTMLInputElement | null>(null)
const dueTimeInputRef = ref<HTMLInputElement | null>(null)
const durationStartInputRef = ref<HTMLInputElement | null>(null)
const durationEndInputRef = ref<HTMLInputElement | null>(null)
const submitButtonRef = ref<HTMLButtonElement | null>(null)
const attachmentInputRef = ref<HTMLInputElement | null>(null)

const today = dayjs().format('YYYY-MM-DD')
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

const form = reactive({
  title: '',
  dueDate: '',
  dueTime: '',
  durationStart: '',
  durationEnd: '',
  priority: 'none' as Priority,
  notification: '',
  repeat: 'none' as RepeatType,
  matrixBlock: 'not-urgent-not-important',
})

const attachmentName = ref('')
const attachmentMimeType = ref('')
const attachmentDataUrl = ref('')

const errors = reactive({
  title: '',
  duration: '',
  repeat: '',
})

const activeTab = ref('date')

const tabs = [
  { id: 'date', label: 'Дата', icon: Calendar },
  { id: 'priority', label: 'Приоритет', icon: Flag },
  { id: 'notify', label: 'Уведомление', icon: Bell },
  { id: 'repeat', label: 'Повтор', icon: RefreshCw },
  { id: 'matrix', label: 'Матрица', icon: Grid2x2 },
]

const quickDates = [
  { label: 'Сегодня', value: today },
  { label: 'Завтра', value: tomorrow },
  { label: 'Без срока', value: '' },
]

const priorities = [
  { value: 'high', label: 'Высокий', color: '#FF3B30' },
  { value: 'medium', label: 'Средний', color: '#FF9500' },
  { value: 'low', label: 'Низкий', color: '#34C759' },
  { value: 'none', label: 'Без приоритета', color: '#C7C7CC' },
]

const notifyOptions = [
  { label: 'В момент срока', value: '0' },
  { label: 'За 5 минут', value: '5' },
  { label: 'За 15 минут', value: '15' },
  { label: 'За 30 минут', value: '30' },
  { label: 'За 1 час', value: '60' },
  { label: 'За 1 день', value: '1440' },
  { label: 'Без уведомления', value: '' },
]

const repeatOptions = [
  { label: 'Не повторять', value: 'none' },
  { label: 'Каждый день', value: 'daily' },
  { label: 'Каждую неделю', value: 'weekly' },
  { label: 'Каждый месяц', value: 'monthly' },
  { label: 'Каждый год', value: 'yearly' },
  { label: 'Настроить повторение', value: 'custom' },
]

const weekDays = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 7 },
]

const customRepeat = reactive({
  interval: 1,
  unit: 'week' as 'week' | 'month',
  weekdays: [1] as number[],
  monthDay: dayjs().date(),
})

const matrixBlocks = [
  { id: 'urgent-important', title: 'Срочно и важно', color: '#FF3B30' },
  { id: 'not-urgent-important', title: 'Не срочно, но важно', color: '#007AFF' },
  { id: 'urgent-not-important', title: 'Срочно, не важно', color: '#FF9500' },
  { id: 'not-urgent-not-important', title: 'Не срочно, не важно', color: '#8E8E93' },
]

const attachmentPreviewUrl = computed(() =>
  attachmentMimeType.value.startsWith('image/') ? attachmentDataUrl.value : ''
)

watch(() => form.dueTime, (newTime) => {
  if (!newTime) return
  if (!form.durationStart) {
    form.durationStart = newTime
  }
})

onMounted(async () => {
  applyPrefillFromQuery()
  await nextTick()
  titleInputRef.value?.focus()
})

async function focusDueDateField() {
  activeTab.value = 'date'
  await nextTick()
  dueDateInputRef.value?.focus()
}

async function focusDueTimeField() {
  await nextTick()
  dueTimeInputRef.value?.focus()
}

async function focusDurationStartField() {
  await nextTick()
  durationStartInputRef.value?.focus()
}

async function focusDurationEndField() {
  await nextTick()
  durationEndInputRef.value?.focus()
}

async function focusSubmitButton() {
  await nextTick()
  submitButtonRef.value?.focus()
}

function submit() {
  errors.title = ''
  errors.duration = ''
  errors.repeat = ''

  if (!form.title.trim()) {
    errors.title = 'Введите название задачи'
  }

  if ((form.durationStart && !form.durationEnd) || (!form.durationStart && form.durationEnd)) {
    errors.duration = 'Укажите и начало, и конец длительности'
  }

  if (form.repeat === 'custom') {
    if (customRepeat.interval < 1) {
      errors.repeat = 'Интервал повторения должен быть не меньше 1'
    }
    if (customRepeat.unit === 'week' && customRepeat.weekdays.length === 0) {
      errors.repeat = 'Выберите хотя бы один день недели'
    }
    if (customRepeat.unit === 'month' && (customRepeat.monthDay < 1 || customRepeat.monthDay > 31)) {
      errors.repeat = 'День месяца должен быть от 1 до 31'
    }
  }

  if (errors.title || errors.duration || errors.repeat) return

  tasksStore.addTask({
    title: form.title.trim(),
    dueDate: form.dueDate || undefined,
    dueTime: form.dueTime || undefined,
    duration: form.durationStart && form.durationEnd
      ? { start: form.durationStart, end: form.durationEnd }
      : undefined,
    priority: form.priority,
    notification: form.notification || undefined,
    repeat: form.repeat,
    repeatDays: form.repeat === 'custom' && customRepeat.unit === 'week'
      ? [...customRepeat.weekdays]
      : undefined,
    repeatCustom: form.repeat === 'custom'
      ? {
          interval: customRepeat.interval,
          unit: customRepeat.unit,
          weekdays: customRepeat.unit === 'week' ? [...customRepeat.weekdays] : undefined,
          monthDay: customRepeat.unit === 'month' ? customRepeat.monthDay : undefined,
        }
      : undefined,
    attachment: attachmentDataUrl.value
      ? {
          name: attachmentName.value,
          mimeType: attachmentMimeType.value || 'application/octet-stream',
          dataUrl: attachmentDataUrl.value,
        }
      : undefined,
    matrixBlock: form.matrixBlock as any,
  })

  navigateTo(resolveReturnPath())
}

function selectQuickDate(value: string) {
  form.dueDate = value

  if (value === '') {
    form.dueTime = ''
    form.durationStart = ''
    form.durationEnd = ''
  }
}

function selectRepeatOption(value: RepeatType) {
  form.repeat = value
  errors.repeat = ''
}

function toggleCustomWeekday(day: number) {
  if (customRepeat.weekdays.includes(day)) {
    customRepeat.weekdays = customRepeat.weekdays.filter(v => v !== day)
    return
  }
  customRepeat.weekdays = [...customRepeat.weekdays, day].sort((a, b) => a - b)
}

function clearAttachment() {
  attachmentName.value = ''
  attachmentMimeType.value = ''
  attachmentDataUrl.value = ''
  if (attachmentInputRef.value) {
    attachmentInputRef.value.value = ''
  }
}

function handleAttachmentChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  attachmentName.value = file.name
  attachmentMimeType.value = file.type || 'application/octet-stream'

  const reader = new FileReader()
  reader.onload = () => {
    attachmentDataUrl.value = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

function resolveReturnPath() {
  const raw = Array.isArray(route.query.returnTo) ? route.query.returnTo[0] : route.query.returnTo
  if (typeof raw === 'string' && raw.startsWith('/app')) {
    return raw
  }
  return '/app'
}

function goBackToSource() {
  navigateTo(resolveReturnPath())
}

function applyPrefillFromQuery() {
  const dueDateParam = Array.isArray(route.query.dueDate) ? route.query.dueDate[0] : route.query.dueDate
  const dueTimeParam = Array.isArray(route.query.dueTime) ? route.query.dueTime[0] : route.query.dueTime

  if (typeof dueDateParam === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDateParam)) {
    form.dueDate = dueDateParam
  }

  if (typeof dueTimeParam === 'string' && /^\d{2}:\d{2}$/.test(dueTimeParam)) {
    form.dueTime = dueTimeParam
    if (!form.durationStart) {
      form.durationStart = dueTimeParam
    }
  }
}
</script>
