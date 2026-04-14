<template>
  <div class="page-container bg-sber-gray-light">
    <div class="bg-white px-4 pt-14 pb-4 shadow-sm">
      <div class="flex items-center gap-3">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light"
          type="button"
          @click="navigateTo('/app')"
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
            v-model="form.title"
            placeholder="Например: подготовить отчёт или созвониться с клиентом"
            class="input-field py-3 text-base font-medium"
            :class="{ 'border-red-400 bg-red-50 placeholder:text-red-300': errors.title }"
            autofocus
            @input="errors.title = ''"
          />
          <p v-if="errors.title" class="mt-2 text-xs font-medium text-red-500">{{ errors.title }}</p>
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
                    @click="form.dueDate = quick.value">
              {{ quick.label }}
            </button>
          </div>

          <input v-model="form.dueDate" type="date" class="input-field mb-3" />

          <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">Время срока</p>
          <input v-model="form.dueTime" type="time" class="input-field mb-3" />

          <p class="text-xs font-semibold text-sber-gray mb-2 uppercase tracking-wide">Длительность</p>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-xs text-sber-gray mb-1 block">Начало</label>
              <input v-model="form.durationStart" type="time" class="input-field" @input="errors.duration = ''" />
            </div>
            <div class="flex-1">
              <label class="text-xs text-sber-gray mb-1 block">Конец</label>
              <input v-model="form.durationEnd" type="time" class="input-field" @input="errors.duration = ''" />
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
                    @click="form.repeat = r.value">
              <RefreshCw class="w-4 h-4" :class="form.repeat === r.value ? 'text-sber-green' : 'text-sber-gray'" />
              <span class="text-sm text-sber-black">{{ r.label }}</span>
              <Check v-if="form.repeat === r.value" class="w-4 h-4 ml-auto text-sber-green" />
            </button>
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
          <button class="btn-secondary mb-3" type="button" @click="navigateTo('/app')">
            Отмена
          </button>
          <button class="btn-primary" type="submit">
            Добавить задачу
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Bell, RefreshCw, Calendar, Flag, Grid2x2, ChevronLeft } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Priority, RepeatType } from '~/data/mockData'

definePageMeta({ layout: 'app' })

const tasksStore = useTasksStore()

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

const errors = reactive({
  title: '',
  duration: '',
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
]

const matrixBlocks = [
  { id: 'urgent-important', title: 'Срочно и важно', color: '#FF3B30' },
  { id: 'not-urgent-important', title: 'Не срочно, но важно', color: '#007AFF' },
  { id: 'urgent-not-important', title: 'Срочно, не важно', color: '#FF9500' },
  { id: 'not-urgent-not-important', title: 'Не срочно, не важно', color: '#8E8E93' },
]

function submit() {
  errors.title = ''
  errors.duration = ''

  if (!form.title.trim()) {
    errors.title = 'Введите название задачи'
  }

  if ((form.durationStart && !form.durationEnd) || (!form.durationStart && form.durationEnd)) {
    errors.duration = 'Укажите и начало, и конец длительности'
  }

  if (errors.title || errors.duration) return

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
    matrixBlock: form.matrixBlock as any,
  })

  navigateTo('/app')
}
</script>
