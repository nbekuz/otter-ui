<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div class="overlay" @click="onCancel" />
    </Transition>
    <Transition name="modal">
      <div
        v-if="task"
        class="app-modal flex flex-col overflow-hidden p-0"
        :class="isDarkTheme ? 'border border-[#2a303a]' : ''"
        style="max-height: 85dvh;"
        @click.stop
      >
        <div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-3 pt-5">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
             :style="{ backgroundColor: priorityColor(form.priority) + '20' }">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: priorityColor(form.priority) }" />
          <UiAppSelect
            v-model="form.priority"
            variant="inline"
            :options="prioritySelectOptions"
            :trigger-class="'!w-auto'"
          />
        </div>

        <div class="space-y-3">
          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label>
            <input v-model="form.title" class="input-field py-3" type="text">
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="input-field min-h-[52px] max-h-[80px] resize-y py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Вложение</label>
            <input
              ref="attachmentInputRef"
              type="file"
              class="hidden"
              @change="handleAttachmentChange"
            >
            <button
              type="button"
              class="inline-flex max-w-full items-center gap-2 truncate rounded-xl border border-sber-green/40 bg-sber-green-light px-3 py-2 text-sm font-semibold text-sber-green transition-colors hover:bg-sber-green/20"
              @click="attachmentInputRef?.click()"
            >
              <Paperclip class="h-4 w-4 shrink-0" />
              <span class="truncate">{{ attachmentName ? 'Заменить файл' : 'Добавить изображение или файл' }}</span>
            </button>

            <div
              v-if="attachmentName"
              class="mt-2 rounded-2xl border p-3"
              :class="isDarkTheme
                ? 'border-[#2a303a] bg-[#11151b]'
                : 'border-sber-gray-light bg-sber-gray-light/60'"
            >
              <div class="flex items-start gap-3">
                <a
                  v-if="attachmentPreviewUrl"
                  :href="attachmentDataUrl"
                  target="_blank"
                  rel="noopener"
                >
                  <img
                    :src="attachmentPreviewUrl"
                    alt="Предпросмотр вложения"
                    class="h-14 w-14 rounded-xl object-cover"
                  >
                </a>
                <div class="min-w-0 flex-1">
                  <a
                    v-if="attachmentDataUrl"
                    :href="attachmentDataUrl"
                    target="_blank"
                    rel="noopener"
                    class="block truncate text-sm font-medium text-sber-green hover:underline"
                  >{{ attachmentName }}</a>
                  <p v-else class="truncate text-sm font-medium text-sber-black">{{ attachmentName }}</p>
                  <p class="mt-0.5 text-xs text-sber-gray">
                    {{ attachmentPreviewUrl ? 'Изображение прикреплено' : 'Файл прикреплен' }}
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-sber-gray transition-colors hover:bg-white hover:text-red-500"
                  :class="isDarkTheme ? 'hover:bg-[#20242d]' : ''"
                  title="Удалить вложение"
                  @click="clearAttachment"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1 block text-xs font-semibold text-sber-gray">Дата</label>
              <DateFieldRu v-model="form.dueDate" field-class="py-3" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-sber-gray">Время срока</label>
              <TimeFieldRu v-model="form.dueTime" field-class="py-3" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-sber-gray">Начало</label>
              <TimeFieldRu v-model="form.durationStart" field-class="py-3" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-sber-gray">Конец</label>
              <TimeFieldRu
                v-model="form.durationEnd"
                field-class="py-3"
                @update:model-value="onDurationEndInput"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Уведомление</label>
            <UiAppSelect v-model="form.notification" :options="notificationSelectOptions" />
            <div v-if="form.notification === 'custom' || isCustomNotification" class="mt-2 flex items-center gap-2">
              <input
                v-model.number="customNotifyMinutes"
                type="number"
                min="0"
                max="10080"
                class="input-field w-28 py-2 text-sm"
                placeholder="мин"
              >
              <span class="text-xs text-sber-gray">минут до срока</span>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Повтор</label>
            <UiAppSelect v-model="form.repeat" :options="repeatSelectOptions" />
            <div
              v-if="form.repeat === 'custom'"
              class="mt-2 rounded-2xl border p-3"
              :class="isDarkTheme
                ? 'border-sber-green/30 bg-sber-green/10'
                : 'border-sber-green/30 bg-sber-green-light/30'"
            >
              <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Настроить повторение</p>

              <div class="mt-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm text-sber-gray">Каждые</span>
                  <input
                    v-model.number="customRepeat.interval"
                    type="number"
                    min="1"
                    max="31"
                    class="w-20 rounded-xl border px-3 py-2 text-sm font-semibold"
                    :class="repeatIntervalError
                      ? 'border-red-400 bg-red-50'
                      : (isDarkTheme
                        ? 'border-[#2a303a] bg-[#11151b] text-sber-black'
                        : 'border-sber-gray-mid bg-white')"
                    @input="repeatIntervalError = ''"
                  >
                  <button
                    type="button"
                    class="rounded-xl border px-3 py-2 text-sm font-medium"
                    :class="customRepeat.unit === 'week'
                      ? 'border-sber-green bg-sber-green text-white'
                      : (isDarkTheme
                        ? 'border-[#2a303a] bg-[#20242d] text-sber-black'
                        : 'border-sber-gray-mid bg-white')"
                    @click="customRepeat.unit = 'week'; repeatIntervalError = ''; repeatWeekdaysError = ''"
                  >
                    Недели
                  </button>
                  <button
                    type="button"
                    class="rounded-xl border px-3 py-2 text-sm font-medium"
                    :class="customRepeat.unit === 'month'
                      ? 'border-sber-green bg-sber-green text-white'
                      : (isDarkTheme
                        ? 'border-[#2a303a] bg-[#20242d] text-sber-black'
                        : 'border-sber-gray-mid bg-white')"
                    @click="customRepeat.unit = 'month'; repeatIntervalError = ''; repeatWeekdaysError = ''"
                  >
                    Месяца
                  </button>
                </div>
                <p
                  v-if="repeatIntervalError"
                  class="mt-1.5 text-xs font-medium text-red-500"
                >
                  {{ repeatIntervalError }}
                </p>
              </div>

              <div v-if="customRepeat.unit === 'week'" class="mt-3">
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Дни недели</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="day in repeatWeekDayOptions"
                    :key="day.value"
                    type="button"
                    class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                    :class="customRepeat.weekdays.includes(day.value)
                      ? 'border-sber-green bg-sber-green text-white'
                      : repeatWeekdaysError
                        ? 'border-red-400 bg-red-50 text-sber-gray'
                        : (isDarkTheme
                          ? 'border-[#2a303a] bg-[#20242d] text-sber-gray'
                          : 'border-sber-gray-mid bg-white text-sber-gray')"
                    @click="toggleCustomWeekday(day.value)"
                  >
                    {{ day.label }}
                  </button>
                </div>
                <p
                  v-if="repeatWeekdaysError"
                  class="mt-1.5 text-xs font-medium text-red-500"
                >
                  {{ repeatWeekdaysError }}
                </p>
              </div>

              <div v-else class="mt-3">
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">День месяца</p>
                <div class="flex flex-wrap items-center gap-2">
                  <input
                    v-model.number="customRepeat.monthDay"
                    type="number"
                    min="1"
                    max="31"
                    class="w-28 rounded-xl border px-3 py-2 text-sm font-semibold"
                    :class="isDarkTheme
                      ? 'border-[#2a303a] bg-[#11151b] text-sber-black'
                      : 'border-sber-gray-mid bg-white text-sber-black'"
                  >
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Матрица Эйзенхауэра</label>
            <div class="grid grid-cols-4 gap-1">
              <button
                v-for="block in matrixBlocks"
                :key="block.id"
                type="button"
                class="flex min-w-0 flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-1.5 text-center transition-all"
                :class="form.matrixBlock === block.id
                  ? 'border-current'
                  : (isDarkTheme ? 'border-[#2a303a]' : 'border-sber-gray-light')"
                :style="form.matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + '15' } : {}"
                @click="selectMatrixBlock(block.id)"
              >
                <div class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: block.color }" />
                <span class="line-clamp-2 text-[9px] font-medium leading-tight text-sber-black">{{ block.title }}</span>
              </button>
            </div>
          </div>

          <p v-if="saveError" class="text-sm text-red-500">{{ saveError }}</p>
        </div>
        </div>

        <div
          class="grid shrink-0 grid-cols-4 gap-2 border-t px-4 py-3"
          :class="isDarkTheme ? 'border-[#2a303a] bg-[#171a21]' : 'border-sber-gray-light bg-white'"
        >
          <button class="btn-primary !w-auto col-span-1 !px-2 !py-3 !text-xs sm:!text-sm" type="button" :disabled="saving" @click="saveTask">
            {{ saving ? '…' : 'Сохранить' }}
          </button>
          <button
            class="col-span-1 rounded-2xl px-2 py-3 text-xs font-semibold transition-colors sm:text-sm"
            :class="task.completed
              ? (isDarkTheme ? 'bg-sber-blue/20 text-sber-blue' : 'bg-sber-blue-light text-sber-blue')
              : (isDarkTheme ? 'bg-sber-green/20 text-sber-green' : 'bg-sber-green-light text-sber-green')"
            type="button"
            :disabled="completing"
            @click="toggleComplete"
          >
            {{ completing ? '…' : (task.completed ? 'Восстановить' : 'Выполнено') }}
          </button>
          <button
            class="col-span-1 rounded-2xl px-2 py-3 text-xs font-semibold text-red-500 sm:text-sm"
            :class="isDarkTheme ? 'bg-red-500/15' : 'bg-red-50'"
            type="button"
            @click="requestDelete"
          >
            Удалить
          </button>
          <button
            class="btn-secondary col-span-1 !w-auto !px-2 !py-3 !text-xs sm:!text-sm"
            type="button"
            @click="onCancel"
          >
            Отмена
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="overlay">
      <div v-if="unsavedModal" class="overlay z-[60]" @click="unsavedModal = false" />
    </Transition>
    <Transition name="modal">
      <div
        v-if="unsavedModal"
        class="app-modal z-[70] px-5 py-5"
        :class="isDarkTheme ? 'border border-[#2a303a]' : ''"
        @click.stop
      >
        <h3 class="mb-2 text-lg font-bold text-sber-black">Сохранить изменения?</h3>
        <p class="mb-5 text-sm text-sber-gray">Есть несохранённые правки в задаче.</p>
        <button class="btn-primary mb-2" type="button" @click="saveAndClose">Сохранить</button>
        <button class="btn-secondary mb-2" type="button" @click="discardAndClose">Не сохранять</button>
        <button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button" @click="unsavedModal = false">Отмена</button>
      </div>
    </Transition>

    <Transition name="overlay">
      <div v-if="deleteModal" class="overlay z-[60]" @click="deleteModal = false" />
    </Transition>
    <Transition name="modal">
      <div
        v-if="deleteModal"
        class="app-modal z-[70] px-5 py-5"
        :class="isDarkTheme ? 'border border-[#2a303a]' : ''"
        @click.stop
      >
        <h3 class="mb-2 text-lg font-bold text-sber-black">Удалить повторяющуюся задачу?</h3>
        <p class="mb-4 text-sm text-sber-gray">Выберите, что именно удалить.</p>
        <button class="btn-primary mb-2" type="button" @click="deleteOccurrence">Удалить только этот повтор</button>
        <button class="btn-secondary mb-2" type="button" @click="deleteSeries">Удалить все повторения</button>
        <button class="w-full rounded-2xl py-4 text-sm font-semibold text-sber-gray" type="button" @click="deleteModal = false">Отмена</button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Paperclip, X } from 'lucide-vue-next'
import type { Priority, RepeatType, Task } from '~/data/mockData'
import { priorityColor } from '~/utils/priority-colors'
import { defaultDurationEnd, validateDurationFields, validateRepeatInterval } from '~/utils/time'
import { getApiErrorMessage, getApiFieldError } from '~/utils/api'
import { resolveMediaUrl } from '~/utils/media'

const props = defineProps<{ taskId: string }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()
const premiumStore = usePremiumStore()
const { openPremiumModal } = usePremiumModal()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

function findLocalTask(id: string): Task | undefined {
  const fromLists = tasksStore.tasks.find(t => t.id === id)
    || tasksStore.calendarTasks.find(t => t.id === id)
  if (fromLists) return fromLists
  for (const list of Object.values(tasksStore.matrixTasksByBlock)) {
    const hit = list.find(t => t.id === id)
    if (hit) return hit
  }
  return undefined
}

/** Live task from store — used for completed/restore UI, not for form sync. */
const task = computed(() => findLocalTask(props.taskId))
const saving = ref(false)
const completing = ref(false)
const saveError = ref('')
const repeatIntervalError = ref('')
const repeatWeekdaysError = ref('')
const customNotifyMinutes = ref(10)
const PRESET_NOTIFY = new Set(['', '0', '1', '5', '15', '30', '60', '1440'])
/** Prevents attachment hydrate from re-fetching the same task in a loop. */
const attachmentHydrateDone = new Set<string>()
let attachmentHydrateInFlight: string | null = null

const attachmentInputRef = ref<HTMLInputElement | null>(null)
const attachmentName = ref('')
const attachmentMimeType = ref('')
const attachmentDataUrl = ref('')
const attachmentRemoved = ref(false)

const attachmentPreviewUrl = computed(() => {
  if (!attachmentDataUrl.value) return ''
  if (attachmentMimeType.value.startsWith('image/')) return attachmentDataUrl.value
  if (/\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?|$)/i.test(attachmentDataUrl.value)) {
    return attachmentDataUrl.value
  }
  return ''
})

function resetAttachmentFields() {
  attachmentName.value = ''
  attachmentMimeType.value = ''
  attachmentDataUrl.value = ''
  if (attachmentInputRef.value) attachmentInputRef.value.value = ''
}

function clearAttachment() {
  resetAttachmentFields()
  attachmentRemoved.value = true
}

function handleAttachmentChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
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

function applyAttachmentFromTask(t: Task) {
  attachmentRemoved.value = false
  if (t.attachment?.dataUrl) {
    attachmentName.value = t.attachment.name || 'Вложение'
    attachmentMimeType.value = t.attachment.mimeType || 'application/octet-stream'
    attachmentDataUrl.value = resolveMediaUrl(t.attachment.dataUrl) || t.attachment.dataUrl
    return
  }
  if (t.imageUrl) {
    attachmentName.value = t.attachments?.[0]?.originalName || 'Вложение'
    attachmentMimeType.value = t.attachments?.[0]?.contentType || 'image/*'
    attachmentDataUrl.value = resolveMediaUrl(t.imageUrl) || t.imageUrl
    return
  }
  if (t.attachments?.length) {
    const first = t.attachments[0]
    attachmentName.value = first.originalName || 'Вложение'
    attachmentMimeType.value = first.contentType || 'application/octet-stream'
    attachmentDataUrl.value = resolveMediaUrl(first.fileUrl) || first.fileUrl
    return
  }
  resetAttachmentFields()
}

async function hydrateAttachment(taskId: string, t: Task) {
  applyAttachmentFromTask(t)
  if (attachmentDataUrl.value || attachmentRemoved.value) {
    attachmentHydrateDone.add(taskId)
    return
  }
  if (attachmentHydrateDone.has(taskId) || attachmentHydrateInFlight === taskId) return
  attachmentHydrateInFlight = taskId
  try {
    const detail = await tasksStore.fetchTask(taskId)
    attachmentHydrateDone.add(taskId)
    if (attachmentRemoved.value || attachmentDataUrl.value) return
    applyAttachmentFromTask(detail)
  }
  catch {
    // Mark done so a 429/network error cannot spin into an infinite fetch loop.
    attachmentHydrateDone.add(taskId)
  }
  finally {
    if (attachmentHydrateInFlight === taskId) attachmentHydrateInFlight = null
  }
}

const prioritySelectOptions = [
  { value: 'high', label: 'Высокий', color: '#FF3B30' },
  { value: 'medium', label: 'Средний', color: '#FF9500' },
  { value: 'low', label: 'Низкий', color: '#34C759' },
  { value: 'none', label: 'Без приоритета', color: '#8E8E93' },
]

const notificationSelectOptions = [
  { value: '', label: 'Без уведомления' },
  { value: '0', label: 'В момент срока' },
  { value: '1', label: 'За 1 минуту' },
  { value: '5', label: 'За 5 минут' },
  { value: '15', label: 'За 15 минут' },
  { value: '30', label: 'За 30 минут' },
  { value: '60', label: 'За 1 час' },
  { value: '1440', label: 'За 1 день' },
  { value: 'custom', label: 'Своё время…' },
]

const repeatSelectOptions = [
  { value: 'none', label: 'Не повторять' },
  { value: 'daily', label: 'Каждый день' },
  { value: 'weekly', label: 'Каждую неделю' },
  { value: 'monthly', label: 'Каждый месяц' },
  { value: 'yearly', label: 'Каждый год' },
  { value: 'custom', label: 'Настроить повторение' },
]

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  durationStart: '',
  durationEnd: '',
  priority: 'none' as Priority,
  notification: '' as string,
  repeat: 'none' as RepeatType,
  matrixBlock: 'not-urgent-not-important' as NonNullable<Task['matrixBlock']>,
})

const customRepeat = reactive({
  interval: 1,
  unit: 'week' as 'week' | 'month',
  weekdays: [1] as number[],
  monthDay: 1,
})

/** Named distinctly to avoid clashing with calendar page `weekDays`. */
const repeatWeekDayOptions = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 7 },
]

const matrixBlocks = [
  { id: 'urgent-important' as const, title: 'Срочно и важно', color: '#FF3B30' },
  { id: 'not-urgent-important' as const, title: 'Не срочно, но важно', color: '#007AFF' },
  { id: 'urgent-not-important' as const, title: 'Срочно, не важно', color: '#FF9500' },
  { id: 'not-urgent-not-important' as const, title: 'Не срочно, не важно', color: '#8E8E93' },
]

function selectMatrixBlock(blockId: NonNullable<Task['matrixBlock']>) {
  if (!premiumStore.isPremium) {
    openPremiumModal()
    return
  }
  form.matrixBlock = blockId
}

const isCustomNotification = computed(() => {
  const n = form.notification
  return n !== '' && n !== 'custom' && !PRESET_NOTIFY.has(n)
})

const { pauseSync, resumeSync, markEndEdited, resetEndEdited, adoptLoadedDuration } = useTaskTimeSync(form)

function onDurationEndInput(val: string) {
  if (!val?.trim()) resetEndEdited()
  else markEndEdited()
}

function syncFormFromTask(t: Task | undefined) {
  if (!t) return
  pauseSync()
  form.title = t.title
  form.description = t.description || ''
  form.dueDate = t.dueDate || ''
  form.dueTime = t.dueTime || ''
  form.durationStart = t.duration?.start || ''
  form.durationEnd = t.duration?.end || ''
  if (form.durationStart && !form.durationEnd) {
    form.durationEnd = defaultDurationEnd(form.durationStart)
  }
  adoptLoadedDuration(form.durationStart, form.durationEnd)
  form.priority = t.priority || 'none'
  const notify = t.notification ?? ''
  if (notify && !PRESET_NOTIFY.has(notify)) {
    form.notification = 'custom'
    customNotifyMinutes.value = Number(notify) || 10
  } else {
    form.notification = notify
  }
  form.repeat = t.repeat || 'none'
  form.matrixBlock = t.matrixBlock || 'not-urgent-not-important'
  customRepeat.interval = t.repeatCustom?.interval || 1
  customRepeat.unit = t.repeatCustom?.unit || 'week'
  customRepeat.weekdays = t.repeatCustom?.weekdays?.length
    ? [...t.repeatCustom.weekdays]
    : t.repeatDays?.length
      ? [...t.repeatDays]
      : [1]
  customRepeat.monthDay = t.repeatCustom?.monthDay
    || (t.dueDate ? Number(t.dueDate.slice(8, 10)) || 1 : 1)
  applyAttachmentFromTask(t)
  nextTick(() => resumeSync())
}

function toggleCustomWeekday(day: number) {
  repeatWeekdaysError.value = ''
  if (customRepeat.weekdays.includes(day)) {
    customRepeat.weekdays = customRepeat.weekdays.filter(v => v !== day)
    if (customRepeat.weekdays.length === 0) customRepeat.weekdays = [1]
    return
  }
  customRepeat.weekdays = [...customRepeat.weekdays, day].sort((a, b) => a - b)
}

/**
 * Sync the form only when the opened task id changes.
 * Watching the task object used to re-run on every store upsert (incl. fetchTask
 * from hydrateAttachment) — that reset fields while typing and flooded the API → 429.
 */
watch(
  () => props.taskId,
  async (id) => {
    saveError.value = ''
    attachmentHydrateDone.clear()
    attachmentHydrateInFlight = null

    let t = findLocalTask(id)
    if (!t) {
      try {
        t = await tasksStore.fetchTask(id)
      }
      catch {
        /* stay empty — user can close */
      }
    }
    syncFormFromTask(t)
    if (t) await hydrateAttachment(id, t)
    await nextTick()
    captureSnapshot()
  },
  { immediate: true },
)

const formSnapshot = ref('')
const unsavedModal = ref(false)
const deleteModal = ref(false)

function captureSnapshot() {
  formSnapshot.value = JSON.stringify({
    ...form,
    customRepeat: { ...customRepeat },
    customNotifyMinutes: customNotifyMinutes.value,
    attachment: attachmentDataUrl.value,
    attachmentRemoved: attachmentRemoved.value,
    attachmentName: attachmentName.value,
  })
}

const isDirty = computed(() => {
  const current = JSON.stringify({
    ...form,
    customRepeat: { ...customRepeat },
    customNotifyMinutes: customNotifyMinutes.value,
    attachment: attachmentDataUrl.value,
    attachmentRemoved: attachmentRemoved.value,
    attachmentName: attachmentName.value,
  })
  return current !== formSnapshot.value
})

function onCancel() {
  if (isDirty.value) {
    unsavedModal.value = true
    return
  }
  emit('close')
}

function discardAndClose() {
  unsavedModal.value = false
  emit('close')
}

async function saveAndClose() {
  await saveTask()
}

async function saveTask() {
  if (!task.value) return
  saveError.value = ''
  repeatIntervalError.value = ''
  repeatWeekdaysError.value = ''
  const durationError = validateDurationFields(form.durationStart, form.durationEnd)
  if (durationError) {
    saveError.value = durationError
    return
  }
  if (form.repeat === 'custom') {
    const intervalError = validateRepeatInterval(customRepeat.interval)
    if (intervalError) {
      repeatIntervalError.value = intervalError
      return
    }
    if (customRepeat.unit === 'week' && customRepeat.weekdays.length === 0) {
      repeatWeekdaysError.value = 'Выберите хотя бы один день недели'
      return
    }
  }

  saving.value = true
  try {
    let notification: string | undefined
    if (form.notification === 'custom') {
      notification = String(Math.max(0, customNotifyMinutes.value || 0))
    } else if (form.notification) {
      notification = form.notification
    }

    const updates: Partial<Task> = {
      title: form.title.trim() || task.value.title,
      description: form.description.trim() || undefined,
      dueDate: form.dueDate || undefined,
      dueTime: form.dueTime || undefined,
      priority: form.priority,
      notification,
      repeat: form.repeat,
      matrixBlock: form.matrixBlock,
    }
    if (form.durationStart && form.durationEnd) {
      updates.duration = { start: form.durationStart, end: form.durationEnd }
    } else {
      updates.duration = undefined
    }
    if (form.repeat === 'custom') {
      const weekdays = [...customRepeat.weekdays].sort((a, b) => a - b)
      updates.repeatCustom = {
        interval: customRepeat.interval,
        unit: customRepeat.unit,
        weekdays: customRepeat.unit === 'week' ? weekdays : undefined,
        monthDay: customRepeat.unit === 'month' ? customRepeat.monthDay : undefined,
      }
      updates.repeatDays = customRepeat.unit === 'week' ? weekdays : undefined
    } else {
      updates.repeatCustom = undefined
      updates.repeatDays = undefined
    }

    if (attachmentDataUrl.value?.startsWith('data:')) {
      updates.attachment = {
        name: attachmentName.value,
        mimeType: attachmentMimeType.value || 'application/octet-stream',
        dataUrl: attachmentDataUrl.value,
      }
    } else if (attachmentRemoved.value) {
      updates.attachment = undefined
      updates.imageUrl = undefined
      updates.attachments = []
    }

    // Skip calendar refresh here — modal callers are tasks/matrix; avoids extra 429 pressure.
    await tasksStore.updateTask(task.value.id, updates, { calendar: false })
    unsavedModal.value = false
    emit('saved')
    emit('close')
  }
  catch (err: unknown) {
    saveError.value = getApiFieldError(err, 'end_at') || getApiErrorMessage(err, 'Не удалось сохранить')
  }
  finally {
    saving.value = false
  }
}

async function requestDelete() {
  if (!task.value) return
  if (tasksStore.isRecurringTask(task.value)) {
    deleteModal.value = true
    return
  }
  await tasksStore.deleteTask(task.value.id)
  emit('close')
}

async function deleteOccurrence() {
  if (!task.value) return
  deleteModal.value = false
  await tasksStore.deleteOccurrence(task.value.id)
  emit('close')
}

async function deleteSeries() {
  if (!task.value) return
  deleteModal.value = false
  await tasksStore.deleteSeries(task.value.id)
  emit('close')
}

async function toggleComplete() {
  if (!task.value || completing.value) return
  completing.value = true
  try {
    await tasksStore.completeTask(task.value.id, {
      grouped: false,
      calendar: true,
      matrix: false,
    })
    emit('saved')
    emit('close')
  }
  catch (err: unknown) {
    saveError.value = getApiErrorMessage(err, 'Не удалось изменить статус задачи')
  }
  finally {
    completing.value = false
  }
}
</script>
