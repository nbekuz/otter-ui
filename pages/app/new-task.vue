<template>
  <div
    class="page-container flex flex-col bg-sber-gray-light max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:z-[25] max-lg:mx-auto max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:w-full max-lg:max-w-[430px] max-lg:!min-h-0 max-lg:overflow-hidden max-lg:!pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:static lg:!h-auto lg:!max-h-none lg:!overflow-visible"
  >
    <div class="shrink-0 bg-white px-4 pb-1.5 pt-[max(2.75rem,env(safe-area-inset-top,0px)+1.25rem)] shadow-sm lg:pb-4 lg:pt-14">
      <div class="flex items-center gap-2 lg:gap-3">
        <button
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sber-gray-light lg:h-10 lg:w-10"
          type="button"
          @click="goBackToSource"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <div class="min-w-0">
          <h1 class="truncate text-lg font-bold text-sber-black lg:text-xl">
            {{ isEditMode ? 'Редактирование задачи' : 'Новая задача' }}
          </h1>
        </div>
      </div>
    </div>

    <div class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-3 py-1 lg:px-4 lg:py-4">
      <form
        class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-card lg:min-h-0 lg:overflow-visible lg:rounded-3xl"
        @submit.prevent="submit"
      >
        <div class="shrink-0 px-3 pb-1.5 pt-2 lg:px-5 lg:pb-4 lg:pt-5">
          <label class="mb-0.5 block text-xs font-semibold text-sber-black lg:mb-2 lg:text-sm">Название задачи</label>
          <input
            ref="titleInputRef"
            v-model="form.title"
            placeholder="Например: отчёт, созвон, встреча…"
            class="input-field py-2 text-sm font-medium !px-3 max-lg:py-2 max-lg:text-sm lg:py-3 lg:!px-4 lg:text-base"
            :class="{ 'border-red-400 bg-red-50 placeholder:text-red-300': errors.title }"
            @keydown.enter.prevent="focusDueDateField"
            @input="errors.title = ''"
          />
          <p v-if="errors.title" class="mt-1 text-xs font-medium text-red-500 lg:mt-2">{{ errors.title }}</p>

          <button
            v-if="!isEditMode"
            type="button"
            class="mt-1.5 text-left text-xs font-semibold text-sber-green lg:hidden"
            @click="mobileDescOpen = !mobileDescOpen"
          >
            {{ mobileDescOpen ? '− Скрыть описание' : '+ Описание (необязательно)' }}
          </button>
          <div
            class="lg:block"
            :class="(isEditMode || mobileDescOpen) ? 'max-lg:block' : 'max-lg:hidden'"
          >
            <label class="mb-0.5 mt-1.5 block text-xs font-semibold text-sber-black lg:mb-2 lg:mt-4 lg:text-sm">Описание</label>
            <textarea
              v-model="form.description"
              placeholder="Детали, ссылки…"
              class="input-field resize-none py-1.5 text-sm !px-3 max-lg:min-h-[52px] max-lg:py-2 lg:min-h-[88px] lg:py-3 lg:!px-4 lg:text-base"
              rows="2"
            />
          </div>

          <div class="mt-1.5 lg:mt-3">
            <input
              ref="attachmentInputRef"
              type="file"
              class="hidden"
              @change="handleAttachmentChange"
            >
            <button
              type="button"
              class="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-sber-green/40 bg-sber-green-light px-2 py-1 text-[11px] font-semibold leading-tight text-sber-green transition-colors hover:bg-sber-green/20 lg:gap-2 lg:rounded-xl lg:px-3 lg:py-2 lg:text-sm"
              @click="attachmentInputRef?.click()"
            >
              <Paperclip class="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
              <span class="truncate lg:hidden">Файл / фото</span>
              <span class="hidden truncate lg:inline">Добавить изображение или файл</span>
            </button>
          </div>

          <div v-if="attachmentName" class="mt-2 rounded-xl border border-sber-gray-light bg-sber-gray-light/60 p-2 lg:mt-3 lg:rounded-2xl lg:p-3">
            <div class="flex items-start gap-2 lg:gap-3">
              <img
                v-if="attachmentPreviewUrl"
                :src="attachmentPreviewUrl"
                alt="Предпросмотр вложения"
                class="h-12 w-12 rounded-lg object-cover lg:h-16 lg:w-16 lg:rounded-xl"
              >
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-medium text-sber-black lg:text-sm">{{ attachmentName }}</p>
                <p class="mt-0.5 text-[10px] text-sber-gray lg:mt-1 lg:text-xs">
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

        <div class="flex shrink-0 gap-0.5 overflow-x-auto border-b border-sber-gray-light px-2 no-scrollbar lg:mb-0 lg:gap-1 lg:px-4">
          <button
            v-for="tab in tabs" :key="tab.id"
            type="button"
            class="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-t-lg py-1.5 text-[10px] font-medium transition-colors lg:gap-1.5 lg:py-2 lg:text-xs"
            :class="[
              activeTab === tab.id
                ? 'text-sber-green bg-sber-green-light border-b-2 border-sber-green'
                : 'text-sber-gray',
              tab.iconOnly ? 'justify-center gap-0 px-2 lg:px-2.5' : 'px-2 lg:gap-1.5 lg:px-3',
            ]"
            :aria-label="tab.iconOnly ? tab.label : undefined"
            :title="tab.iconOnly ? tab.label : undefined"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
            <span :class="tab.iconOnly ? 'max-lg:sr-only' : ''">{{ tab.label }}</span>
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 lg:flex-none lg:overflow-visible lg:px-4">
        <div v-if="activeTab === 'date'" class="pb-1 pt-1.5 lg:pb-4 lg:pt-3">
          <p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Дата выполнения</p>
          <div class="mb-1.5 flex flex-wrap gap-1 lg:mb-4 lg:gap-2">
            <button v-for="quick in quickDates" :key="quick.id"
                    type="button"
                    class="rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors lg:rounded-xl lg:px-3 lg:py-1.5 lg:text-sm"
                    :class="isQuickDateActive(quick)
                      ? 'bg-sber-green text-white border-sber-green'
                      : 'bg-white text-sber-black border-sber-gray-mid'"
                    @click="toggleQuickDate(quick)">
              {{ quick.label }}
            </button>
          </div>

          <template v-if="!explicitNoDeadline">
            <div class="grid grid-cols-2 gap-x-2 gap-y-1.5 lg:gap-3">
              <div class="min-w-0">
                <p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:text-xs">Дата</p>
                <DateFieldRu
                  ref="dueDateFieldRef"
                  v-model="form.dueDate"
                  field-class="border-2 border-sber-green/50 py-2 text-xs max-lg:!px-2 lg:py-2.5 lg:text-base"
                  @keydown="onDueDateKeydown"
                />
              </div>
              <div class="min-w-0">
                <p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:text-xs">Время срока</p>
                <TimeFieldRu
                  ref="dueTimeFieldRef"
                  v-model="form.dueTime"
                  field-class="border-2 border-sber-green/50 py-2 text-xs max-lg:!px-2 lg:py-2.5 lg:text-base"
                  @keydown="onDueTimeKeydown"
                />
              </div>
              <div class="min-w-0">
                <p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:text-xs">Начало</p>
                <TimeFieldRu
                  ref="durationStartFieldRef"
                  v-model="form.durationStart"
                  field-class="border-2 border-sber-green/50 py-2 text-xs !px-2 max-lg:py-1.5 lg:py-2.5 lg:!px-4 lg:text-base"
                  @keydown="onDurationStartKeydown"
                  @update:model-value="errors.duration = ''"
                />
              </div>
              <div class="min-w-0">
                <p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-2 lg:text-xs">Конец</p>
                <TimeFieldRu
                  ref="durationEndFieldRef"
                  v-model="form.durationEnd"
                  field-class="border-2 border-sber-green/50 py-2 text-xs !px-2 max-lg:py-1.5 lg:py-2.5 lg:!px-4 lg:text-base"
                  @keydown="onDurationEndKeydown"
                  @update:model-value="errors.duration = ''"
                />
              </div>
            </div>
            <p v-if="errors.duration" class="mt-1 text-xs font-medium text-red-500 lg:mt-2">{{ errors.duration }}</p>
          </template>
        </div>

        <div v-if="activeTab === 'priority'" class="pb-3 pt-2 lg:px-0 lg:pb-4 lg:pt-3">
          <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Приоритет</p>
          <div class="flex flex-col gap-1.5 lg:gap-2">
            <button v-for="p in priorities" :key="p.value"
                    type="button"
                    class="flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition-all lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3"
                    :class="form.priority === p.value
                      ? 'border-current bg-opacity-10'
                      : 'border-sber-gray-light bg-white'"
                    :style="form.priority === p.value ? { borderColor: p.color, backgroundColor: p.color + '15' } : {}"
                    @click="form.priority = p.value">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: p.color }" />
              <span
                class="text-xs font-medium lg:text-sm"
                :class="form.priority === p.value ? '' : 'text-sber-black'"
                :style="form.priority === p.value ? { color: p.color } : undefined"
              >{{ p.label }}</span>
              <Check v-if="form.priority === p.value" class="ml-auto h-4 w-4 text-sber-green" />
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'notify'" class="pb-3 pt-2 lg:pb-4 lg:pt-3">
          <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Уведомление</p>
          <div class="flex flex-col gap-1.5 lg:gap-2">
            <button v-for="n in notifyOptions" :key="n.value"
                    type="button"
                    class="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3"
                    :class="form.notification === n.value
                      ? 'border-sber-green bg-sber-green-light'
                      : 'border-sber-gray-light bg-white'"
                    @click="form.notification = n.value">
              <Bell class="w-4 h-4" :class="form.notification === n.value ? 'text-sber-green' : 'text-sber-gray'" />
              <span class="text-xs lg:text-sm" :class="form.notification === n.value ? 'font-medium text-sber-green' : 'text-sber-black'">{{ n.label }}</span>
              <Check v-if="form.notification === n.value" class="ml-auto h-4 w-4 text-sber-green" />
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'repeat'" class="pb-3 pt-2 lg:pb-4 lg:pt-3">
          <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Повторение</p>
          <div class="flex flex-col gap-1.5 lg:gap-2">
            <button v-for="r in repeatOptions" :key="r.value"
                    type="button"
                    class="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3"
                    :class="form.repeat === r.value
                      ? 'border-sber-green bg-sber-green-light'
                      : 'border-sber-gray-light bg-white'"
                    @click="selectRepeatOption(r.value)">
              <RefreshCw class="w-4 h-4" :class="form.repeat === r.value ? 'text-sber-green' : 'text-sber-gray'" />
              <span class="text-xs lg:text-sm" :class="form.repeat === r.value ? 'font-medium text-sber-green' : 'text-sber-black'">{{ r.label }}</span>
              <Check v-if="form.repeat === r.value" class="ml-auto h-4 w-4 text-sber-green" />
            </button>
          </div>

          <div v-if="form.repeat === 'custom'" class="mt-2 rounded-xl border border-sber-green/30 bg-sber-green-light/30 p-3 lg:mt-3 lg:rounded-2xl lg:p-4">
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

        <div v-if="activeTab === 'matrix'" class="pb-3 pt-2 lg:pb-4 lg:pt-3">
          <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-sber-gray lg:mb-3 lg:text-xs">Блок матрицы</p>
          <div class="grid grid-cols-2 gap-1.5 lg:gap-2">
            <button v-for="block in matrixBlocks" :key="block.id"
                    type="button"
                    class="flex flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-left transition-all lg:gap-1 lg:rounded-2xl lg:px-3 lg:py-3"
                    :class="form.matrixBlock === block.id
                      ? 'border-current'
                      : 'border-sber-gray-light'"
                    :style="form.matrixBlock === block.id ? { borderColor: block.color, backgroundColor: block.color + '15' } : {}"
                    @click="form.matrixBlock = block.id">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: block.color }" />
              <span class="text-[10px] font-medium leading-tight text-sber-black lg:text-xs">{{ block.title }}</span>
            </button>
          </div>
        </div>
        </div>

        <div class="shrink-0 border-t border-sber-gray-light bg-white px-3 pb-2 pt-2 lg:px-4 lg:pb-4 lg:pt-3">
          <template v-if="isEditMode && editingTask">
            <!-- Мобильная панель: меньше по высоте, дата/время остаются в зоне прокрутки -->
            <div class="max-lg:space-y-2 lg:hidden">
              <button
                class="flex w-full items-center justify-center gap-2 rounded-2xl py-2 text-xs font-semibold transition-colors"
                :class="editingTask.completed ? 'bg-sber-gray-light text-sber-gray' : 'bg-sber-green-light text-sber-green'"
                type="button"
                @click="toggleEditComplete"
              >
                <Check class="h-4 w-4" />
                {{ editingTask.completed ? 'Восстановить' : 'Выполнено' }}
              </button>
              <div class="flex gap-1.5">
                <button
                  class="btn-secondary min-w-0 flex-1 !w-auto !py-2.5 !text-xs"
                  type="button"
                  @click="goBackToSource"
                >
                  Отмена
                </button>
                <button
                  class="flex min-w-0 flex-[0.9] items-center justify-center gap-1 rounded-2xl bg-red-50 py-2.5 text-[11px] font-semibold text-red-500 transition-colors"
                  type="button"
                  @click="deleteEditingTask"
                >
                  <Trash2 class="h-3.5 w-3.5 shrink-0" />
                  <span class="truncate">Удалить</span>
                </button>
                <button
                  ref="mobileSubmitRef"
                  class="btn-primary min-w-0 flex-[1.15] !w-auto !py-2.5 !text-xs"
                  type="submit"
                >
                  Сохранить
                </button>
              </div>
            </div>

            <div class="hidden lg:block">
              <div class="mb-3 space-y-2">
                <button
                  class="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-colors"
                  :class="editingTask.completed ? 'bg-sber-gray-light text-sber-gray' : 'bg-sber-green-light text-sber-green'"
                  type="button"
                  @click="toggleEditComplete"
                >
                  <Check class="h-5 w-5" />
                  {{ editingTask.completed ? 'Восстановить' : 'Выполнено' }}
                </button>
                <button
                  class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-semibold text-red-500 transition-colors"
                  type="button"
                  @click="deleteEditingTask"
                >
                  <Trash2 class="h-5 w-5" />
                  Удалить
                </button>
              </div>
              <div class="flex gap-3">
                <button class="btn-secondary !w-auto flex-1" type="button" @click="goBackToSource">
                  Отмена
                </button>
                <button ref="desktopSubmitRef" class="btn-primary !w-auto flex-1" type="submit">
                  Сохранить
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex gap-1.5 lg:hidden">
              <button
                class="btn-secondary min-w-0 flex-1 !w-auto !py-2.5 !text-sm"
                type="button"
                @click="goBackToSource"
              >
                Отмена
              </button>
              <button ref="mobileSubmitRef" class="btn-primary min-w-0 flex-[1.35] !w-auto !py-2.5 !text-sm" type="submit">
                Добавить задачу
              </button>
            </div>
            <div class="hidden lg:flex lg:gap-3">
              <button class="btn-secondary !w-auto flex-1" type="button" @click="goBackToSource">
                Отмена
              </button>
              <button ref="desktopSubmitRef" class="btn-primary !w-auto flex-1" type="submit">
                Добавить задачу
              </button>
            </div>
          </template>
        </div>
      </form>
    </div>

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
import { Check, Bell, RefreshCw, Calendar, Flag, Grid2x2, ChevronLeft, Paperclip, X, Trash2 } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Priority, RepeatType, Task } from '~/data/mockData'
import { matrixBlockDefaults } from '~/data/mockData'
import { addMinutesToTime, validateDurationFields } from '~/utils/time'
import { getApiErrorMessage, getApiFieldError } from '~/utils/api'

definePageMeta({ layout: 'app' })

const route = useRoute()
const tasksStore = useTasksStore()

const deleteModal = ref(false)

const editTaskId = computed(() => {
  const raw = route.query.id
  const id = Array.isArray(raw) ? raw[0] : raw
  return typeof id === 'string' && id.length > 0 ? id : null
})
const isEditMode = computed(() => !!editTaskId.value)
const editingTask = computed(() =>
  editTaskId.value ? tasksStore.tasks.find(t => t.id === editTaskId.value) ?? null : null,
)
const titleInputRef = ref<HTMLInputElement | null>(null)
const dueDateFieldRef = ref<{ focus: () => void } | null>(null)
const dueTimeFieldRef = ref<{ focus: () => void } | null>(null)
const durationStartFieldRef = ref<{ focus: () => void } | null>(null)
const durationEndFieldRef = ref<{ focus: () => void } | null>(null)
const mobileSubmitRef = ref<HTMLButtonElement | null>(null)
const desktopSubmitRef = ref<HTMLButtonElement | null>(null)
const attachmentInputRef = ref<HTMLInputElement | null>(null)

const today = dayjs().format('YYYY-MM-DD')
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  durationStart: '',
  durationEnd: '',
  priority: 'none' as Priority,
  notification: '0',
  repeat: 'none' as RepeatType,
  matrixBlock: 'not-urgent-not-important',
})

const attachmentRemoved = ref(false)
/** «Без срока» как осознанный выбор: скрывает поля даты. Пустая дата без флага — ничего не выбрано, можно ввести любую дату. */
const explicitNoDeadline = ref(false)
/** Создание задачи: описание по умолчанию свёрнуто на телефоне, чтобы влезала вкладка «Дата». */
const mobileDescOpen = ref(false)

watch(isEditMode, (editing) => {
  mobileDescOpen.value = editing
}, { immediate: true })

const attachmentName = ref('')
const attachmentMimeType = ref('')
const attachmentDataUrl = ref('')

const errors = reactive({
  title: '',
  duration: '',
  repeat: '',
})

const activeTab = ref('date')

const tabs: Array<{
  id: 'date' | 'priority' | 'notify' | 'repeat' | 'matrix'
  label: string
  icon: typeof Calendar
  iconOnly?: boolean
}> = [
  { id: 'date', label: 'Дата', icon: Calendar },
  { id: 'priority', label: 'Приоритет', icon: Flag },
  { id: 'notify', label: 'Уведомление', icon: Bell, iconOnly: true },
  { id: 'repeat', label: 'Повтор', icon: RefreshCw, iconOnly: true },
  { id: 'matrix', label: 'Матрица', icon: Grid2x2, iconOnly: true },
]

type QuickDatePreset = { id: 'today' | 'tomorrow' | 'none'; label: string; value: string }

const quickDates: QuickDatePreset[] = [
  { id: 'today', label: 'Сегодня', value: today },
  { id: 'tomorrow', label: 'Завтра', value: tomorrow },
  { id: 'none', label: 'Без срока', value: '' },
]

const priorities: Array<{ value: Priority; label: string; color: string }> = [
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

const repeatOptions: Array<{ label: string; value: RepeatType }> = [
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

useTaskTimeSync(form)

const matrixBlocks = [
  { id: 'urgent-important', title: 'Срочно и важно', color: '#FF3B30' },
  { id: 'not-urgent-important', title: 'Не срочно, но важно', color: '#007AFF' },
  { id: 'urgent-not-important', title: 'Срочно, не важно', color: '#FF9500' },
  { id: 'not-urgent-not-important', title: 'Не срочно, не важно', color: '#8E8E93' },
]

const attachmentPreviewUrl = computed(() =>
  attachmentMimeType.value.startsWith('image/') ? attachmentDataUrl.value : ''
)

watch(() => form.dueDate, (newDate) => {
  if (newDate !== '') {
    explicitNoDeadline.value = false
    return
  }
  form.dueTime = ''
  form.durationStart = ''
  form.durationEnd = ''
})

onMounted(async () => {
  applyPrefillFromQuery()
  loadEditTaskFromRoute()
  await nextTick()
  titleInputRef.value?.focus()
})

watch(editTaskId, () => {
  loadEditTaskFromRoute()
})

watch(
  () => route.query.matrixBlock,
  () => {
    if (!editTaskId.value) applyPrefillFromQuery()
  },
)

async function focusDueDateField() {
  activeTab.value = 'date'
  await nextTick()
  dueDateFieldRef.value?.focus()
}

function onDueDateKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  focusDueTimeField()
}

async function focusDueTimeField() {
  await nextTick()
  dueTimeFieldRef.value?.focus()
}

async function focusDurationStartField() {
  await nextTick()
  durationStartFieldRef.value?.focus()
}

async function focusDurationEndField() {
  await nextTick()
  durationEndFieldRef.value?.focus()
}

function onDueTimeKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  focusDurationStartField()
}

function onDurationStartKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  focusDurationEndField()
}

function onDurationEndKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  focusSubmitButton()
}

async function focusSubmitButton() {
  await nextTick()
  const mobile = mobileSubmitRef.value
  const desktop = desktopSubmitRef.value
  if (mobile && mobile.offsetParent !== null) {
    mobile.focus()
    return
  }
  desktop?.focus()
}

const submitting = ref(false)
const submitError = ref('')

async function submit() {
  errors.title = ''
  errors.duration = ''
  errors.repeat = ''
  submitError.value = ''

  if (!form.title.trim()) {
    errors.title = 'Введите название задачи'
  }

  const durationError = validateDurationFields(form.durationStart, form.durationEnd)
  if (durationError) {
    errors.duration = durationError
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

  submitting.value = true
  try {
  const description = form.description.trim() || undefined
  const duration = form.durationStart && form.durationEnd
    ? { start: form.durationStart, end: form.durationEnd }
    : undefined

  if (isEditMode.value && editTaskId.value) {
    const updates: Partial<Task> = {
      title: form.title.trim(),
      description,
      dueDate: form.dueDate || undefined,
      dueTime: form.dueTime || undefined,
      duration,
      priority: form.priority,
      notification: form.notification || undefined,
      repeat: form.repeat,
      matrixBlock: form.matrixBlock as Task['matrixBlock'],
    }

    if (form.repeat === 'custom') {
      updates.repeatDays = customRepeat.unit === 'week' ? [...customRepeat.weekdays] : undefined
      updates.repeatCustom = {
        interval: customRepeat.interval,
        unit: customRepeat.unit,
        weekdays: customRepeat.unit === 'week' ? [...customRepeat.weekdays] : undefined,
        monthDay: customRepeat.unit === 'month' ? customRepeat.monthDay : undefined,
      }
    } else {
      updates.repeatCustom = undefined
      updates.repeatDays = undefined
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

    await tasksStore.updateTask(editTaskId.value, updates)
    navigateTo(resolveReturnPath())
    return
  }

  await tasksStore.addTask({
    title: form.title.trim(),
    description,
    dueDate: form.dueDate || undefined,
    dueTime: form.dueTime || undefined,
    duration,
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
    matrixBlock: form.matrixBlock as Task['matrixBlock'],
  })

  navigateTo(resolveReturnPath())
  }
  catch (err: unknown) {
    const endAtError = getApiFieldError(err, 'end_at')
    if (endAtError) {
      errors.duration = endAtError
      return
    }
    submitError.value = getApiErrorMessage(err, 'Не удалось сохранить задачу')
  }
  finally {
    submitting.value = false
  }
}

function isQuickDateActive(quick: QuickDatePreset) {
  if (quick.id === 'none') return explicitNoDeadline.value
  if (explicitNoDeadline.value) return false
  return form.dueDate === quick.value
}

function toggleQuickDate(quick: QuickDatePreset) {
  if (quick.id === 'none') {
    if (explicitNoDeadline.value) {
      explicitNoDeadline.value = false
    } else {
      explicitNoDeadline.value = true
      form.dueDate = ''
      form.dueTime = ''
      form.durationStart = ''
      form.durationEnd = ''
    }
    return
  }
  if (!explicitNoDeadline.value && form.dueDate === quick.value) {
    form.dueDate = ''
    form.dueTime = ''
    form.durationStart = ''
    form.durationEnd = ''
    return
  }
  explicitNoDeadline.value = false
  form.dueDate = quick.value
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

function resetAttachmentFields() {
  attachmentName.value = ''
  attachmentMimeType.value = ''
  attachmentDataUrl.value = ''
  if (attachmentInputRef.value) {
    attachmentInputRef.value.value = ''
  }
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

function readTimeQuery(key: string): string | undefined {
  const raw = route.query[key]
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value) ? value : undefined
}

const MATRIX_BLOCK_IDS = new Set([
  'urgent-important',
  'not-urgent-important',
  'urgent-not-important',
  'not-urgent-not-important',
])

const PRIORITY_VALUES = new Set<Priority>(['high', 'medium', 'low', 'none'])

function getMatrixBlockDefaultPriority(blockId: string): Priority {
  const block = matrixBlockDefaults[blockId as keyof typeof matrixBlockDefaults]
  const priority = block?.priorityFilter?.[0]
  return priority && PRIORITY_VALUES.has(priority as Priority)
    ? priority as Priority
    : 'none'
}

function applyPrefillFromQuery() {
  const matrixBlockParam = Array.isArray(route.query.matrixBlock)
    ? route.query.matrixBlock[0]
    : route.query.matrixBlock
  if (typeof matrixBlockParam === 'string' && MATRIX_BLOCK_IDS.has(matrixBlockParam)) {
    form.matrixBlock = matrixBlockParam as Task['matrixBlock']
    form.priority = getMatrixBlockDefaultPriority(matrixBlockParam)
    activeTab.value = 'matrix'
  }

  const priorityParam = Array.isArray(route.query.priority)
    ? route.query.priority[0]
    : route.query.priority
  if (typeof priorityParam === 'string' && PRIORITY_VALUES.has(priorityParam as Priority)) {
    form.priority = priorityParam as Priority
  }

  const dueDateParam = Array.isArray(route.query.dueDate) ? route.query.dueDate[0] : route.query.dueDate
  const dueTimeParam = readTimeQuery('dueTime')
  const durationStartParam = readTimeQuery('durationStart')
  const durationEndParam = readTimeQuery('durationEnd')

  if (typeof dueDateParam === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDateParam)) {
    form.dueDate = dueDateParam
  }

  if (durationStartParam) {
    form.durationStart = durationStartParam
    form.durationEnd = durationEndParam ?? addMinutesToTime(durationStartParam, 60)
    if (dueTimeParam) form.dueTime = dueTimeParam
    return
  }

  if (dueTimeParam && form.dueDate) {
    form.dueTime = dueTimeParam
    form.durationStart = dueTimeParam
    form.durationEnd = addMinutesToTime(dueTimeParam, 60)
    return
  }

  if (dueTimeParam) {
    form.dueTime = dueTimeParam
    form.durationStart = dueTimeParam
    form.durationEnd = addMinutesToTime(dueTimeParam, 60)
  }
}

function hydrateFromTask(task: Task) {
  form.title = task.title
  form.description = task.description || ''
  form.dueDate = task.dueDate || ''
  form.dueTime = task.dueTime || ''
  form.durationStart = task.duration?.start || ''
  form.durationEnd = task.duration?.end || ''
  form.priority = task.priority || 'none'
  form.notification = task.notification || ''
  form.repeat = task.repeat || 'none'
  form.matrixBlock = task.matrixBlock || 'not-urgent-not-important'

  customRepeat.interval = task.repeatCustom?.interval || 1
  customRepeat.unit = task.repeatCustom?.unit || (task.repeatDays?.length ? 'week' : 'week')
  customRepeat.weekdays = task.repeatCustom?.weekdays?.length
    ? [...task.repeatCustom.weekdays]
    : task.repeatDays?.length
      ? [...task.repeatDays]
      : [1]
  customRepeat.monthDay = task.repeatCustom?.monthDay || dayjs().date()

  attachmentRemoved.value = false
  if (task.attachment) {
    attachmentName.value = task.attachment.name
    attachmentMimeType.value = task.attachment.mimeType
    attachmentDataUrl.value = task.attachment.dataUrl
  } else {
    resetAttachmentFields()
  }

  explicitNoDeadline.value = !task.dueDate
}

async function loadEditTaskFromRoute() {
  if (!editTaskId.value) return
  let task = tasksStore.tasks.find(t => t.id === editTaskId.value)
  if (!task) {
    try {
      task = await tasksStore.fetchTask(editTaskId.value)
    }
    catch {
      navigateTo('/app', { replace: true })
      return
    }
  }
  hydrateFromTask(task)
}

async function toggleEditComplete() {
  if (!editTaskId.value) return
  await tasksStore.completeTask(editTaskId.value)
}

async function deleteEditingTask() {
  if (!editTaskId.value || !editingTask.value) return
  if (editingTask.value.repeat && editingTask.value.repeat !== 'none') {
    deleteModal.value = true
    return
  }
  await tasksStore.deleteTask(editTaskId.value)
  navigateTo(resolveReturnPath())
}

async function deleteTaskOccurrence() {
  if (!editTaskId.value) return
  deleteModal.value = false
  await tasksStore.updateTask(editTaskId.value, { repeat: 'none', repeatCustom: undefined, repeatDays: undefined })
  await tasksStore.deleteTask(editTaskId.value)
  navigateTo(resolveReturnPath())
}

async function deleteAllOccurrences() {
  if (!editTaskId.value) return
  deleteModal.value = false
  await tasksStore.deleteTask(editTaskId.value)
  navigateTo(resolveReturnPath())
}
</script>
