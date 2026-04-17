<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div class="overlay" @click="$emit('close')" />
    </Transition>
    <Transition name="modal">
      <div v-if="task" class="app-modal" style="max-height: 80dvh; overflow-y: auto;" @click.stop>

        <!-- Priority banner -->
        <div class="mx-4 rounded-2xl px-4 py-2 mb-4 flex items-center gap-2"
             :style="{ backgroundColor: priorityColor + '20' }">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: priorityColor }" />
          <span class="text-xs font-medium" :style="{ color: priorityColor }">
            {{ priorityLabel }}
          </span>
        </div>

        <!-- Title -->
        <div class="px-4 mb-4">
          <h2 class="text-lg font-bold text-sber-black leading-snug">{{ task.title }}</h2>
          <p v-if="task.description" class="text-sm text-sber-gray mt-1">{{ task.description }}</p>
        </div>

        <!-- Details -->
        <div class="px-4 space-y-3 mb-6">
          <div v-if="task.dueDate" class="flex items-center gap-3 py-2 border-b border-sber-gray-light">
            <Calendar class="w-4 h-4 text-sber-gray" />
            <span class="text-sm text-sber-gray">{{ formatDate }}</span>
          </div>
          <div v-if="task.dueTime" class="flex items-center gap-3 py-2 border-b border-sber-gray-light">
            <Clock class="w-4 h-4 text-sber-gray" />
            <span class="text-sm text-sber-gray">{{ task.dueTime }}</span>
          </div>
          <div v-if="task.duration" class="flex items-center gap-3 py-2 border-b border-sber-gray-light">
            <Timer class="w-4 h-4 text-sber-gray" />
            <span class="text-sm text-sber-gray">{{ task.duration.start }} – {{ task.duration.end }}</span>
          </div>
          <div v-if="task.repeat !== 'none'" class="flex items-center gap-3 py-2 border-b border-sber-gray-light">
            <RefreshCw class="w-4 h-4 text-sber-gray" />
            <span class="text-sm text-sber-gray">{{ repeatLabel }}</span>
          </div>
          <div v-if="task.notification" class="flex items-center gap-3 py-2 border-b border-sber-gray-light">
            <Bell class="w-4 h-4 text-sber-gray" />
            <span class="text-sm text-sber-gray">{{ notifyLabel }}</span>
          </div>
          <div v-if="task.attachment" class="flex items-center gap-3 py-2 border-b border-sber-gray-light">
            <Paperclip class="w-4 h-4 text-sber-gray" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm text-sber-gray">{{ task.attachment.name }}</p>
            </div>
            <button
              type="button"
              class="rounded-lg bg-sber-green-light px-3 py-1 text-xs font-semibold text-sber-green"
              @click="openAttachment"
            >
              Открыть
            </button>
          </div>
          <div v-if="task.attachment && isAttachmentImage" class="overflow-hidden rounded-2xl border border-sber-gray-light">
            <img :src="task.attachment.dataUrl" alt="Вложение задачи" class="h-36 w-full object-cover" />
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 pb-6 flex flex-col gap-2">
          <button
            class="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-colors"
            :class="task.completed
              ? 'bg-sber-gray-light text-sber-gray'
              : 'bg-sber-green-light text-sber-green'"
            @click="toggleComplete"
          >
            <CheckCircle class="w-5 h-5" />
            {{ task.completed ? 'Снять отметку' : 'Отметить выполненной' }}
          </button>
          <button
            class="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm"
            @click="deleteTask"
          >
            <Trash2 class="w-5 h-5" />
            Удалить задачу
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Calendar, Clock, Timer, RefreshCw, Bell, CheckCircle, Trash2, Paperclip } from 'lucide-vue-next'
import dayjs from 'dayjs'

const props = defineProps<{ taskId: string }>()
const emit = defineEmits<{ close: [] }>()
const tasksStore = useTasksStore()

const task = computed(() => tasksStore.tasks.find(t => t.id === props.taskId))

const priorityColor = computed(() => {
  switch (task.value?.priority) {
    case 'high': return '#FF3B30'
    case 'medium': return '#FF9500'
    case 'low': return '#34C759'
    default: return '#C7C7CC'
  }
})

const priorityLabel = computed(() => {
  switch (task.value?.priority) {
    case 'high': return 'Высокий приоритет'
    case 'medium': return 'Средний приоритет'
    case 'low': return 'Низкий приоритет'
    default: return 'Без приоритета'
  }
})

const formatDate = computed(() => {
  if (!task.value?.dueDate) return ''
  return dayjs(task.value.dueDate).format('D MMMM YYYY')
})

const repeatLabel = computed(() => {
  const labels: Record<string, string> = {
    daily: 'Каждый день',
    weekly: 'Каждую неделю',
    monthly: 'Каждый месяц',
    yearly: 'Каждый год',
  }
  if (task.value?.repeat === 'custom' && task.value.repeatCustom) {
    const { interval, unit, weekdays, monthDay } = task.value.repeatCustom
    if (unit === 'week') {
      const dayNames: Record<number, string> = {
        1: 'Пн',
        2: 'Вт',
        3: 'Ср',
        4: 'Чт',
        5: 'Пт',
        6: 'Сб',
        7: 'Вс',
      }
      const selectedDays = (weekdays || []).map(d => dayNames[d]).filter(Boolean).join(', ')
      return selectedDays
        ? `Каждые ${interval} нед. (${selectedDays})`
        : `Каждые ${interval} нед.`
    }
    return `Каждые ${interval} мес. (день ${monthDay || 1})`
  }
  return labels[task.value?.repeat || ''] || ''
})

const notifyLabel = computed(() => {
  const v = task.value?.notification
  if (!v || v === '0') return 'В момент срока'
  if (v === '5') return 'За 5 минут'
  if (v === '15') return 'За 15 минут'
  if (v === '30') return 'За 30 минут'
  if (v === '60') return 'За 1 час'
  if (v === '1440') return 'За 1 день'
  return `За ${v} минут`
})

const isAttachmentImage = computed(() =>
  task.value?.attachment?.mimeType?.startsWith('image/') ?? false
)

function toggleComplete() {
  if (task.value) {
    tasksStore.completeTask(task.value.id)
    emit('close')
  }
}

function deleteTask() {
  if (task.value) {
    tasksStore.deleteTask(task.value.id)
    emit('close')
  }
}

function openAttachment() {
  const dataUrl = task.value?.attachment?.dataUrl
  if (!dataUrl) return
  window.open(dataUrl, '_blank')
}
</script>
