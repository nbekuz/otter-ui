<template>
  <div class="relative mb-2 h-full overflow-hidden rounded-2xl">
    <!-- Swipe background: complete (right) -->
    <div class="swipe-complete" :style="{ width: swipeOffset > 0 ? `${Math.min(swipeOffset, 100)}px` : '0' }">
      <CheckCircle class="w-5 h-5" />
      <span v-if="swipeOffset > 50" class="ml-2 text-sm">Готово</span>
    </div>
    <!-- Swipe background: delete (left) -->
    <div class="swipe-delete" :style="{ width: swipeOffset < 0 ? `${Math.min(-swipeOffset, 100)}px` : '0' }">
      <span v-if="swipeOffset < -50" class="mr-2 text-sm">Удалить</span>
      <Trash2 class="w-5 h-5" />
    </div>

    <!-- Task card -->
    <div
      class="bg-white rounded-2xl px-4 py-3 flex items-start gap-3 relative z-10
             transition-transform active:scale-[0.99]"
      :style="{ transform: `translateX(${swipeOffset}px)` }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @click="$emit('open', task.id)"
    >
      <!-- Checkbox -->
      <button
        class="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
        :class="[
          task.completed ? 'border-sber-green bg-sber-green' : `border-2 ${priorityCheckboxClass}`,
        ]"
        @click.stop="$emit('complete', task.id)"
      >
        <Check v-if="task.completed" class="w-3.5 h-3.5 text-white" />
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium leading-snug line-clamp-2"
           :class="task.completed ? 'line-through text-sber-gray' : 'text-sber-black'">
          {{ task.title }}
        </p>

        <!-- Meta info -->
        <div class="flex items-center gap-2 mt-1.5 flex-wrap">
          <!-- Date/time -->
          <span v-if="task.dueDate" class="flex items-center gap-1 text-xs text-sber-gray">
            <Clock class="w-3 h-3" />
            {{ formatDateTime }}
          </span>

          <!-- Duration -->
          <span v-if="task.duration" class="text-xs text-sber-gray font-medium">
            {{ task.duration.start }}–{{ task.duration.end }}
          </span>

          <!-- Notification bell -->
          <span v-if="task.notification" class="text-sber-gray">
            <Bell class="w-3 h-3" />
          </span>

          <!-- Repeat -->
          <span v-if="task.repeat && task.repeat !== 'none'" class="text-sber-gray">
            <RefreshCw class="w-3 h-3" />
          </span>
        </div>
      </div>

      <!-- Priority dot -->
      <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
           :class="priorityDotClass" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, CheckCircle, Clock, Bell, RefreshCw, Trash2 } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Task } from '~/data/mockData'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  complete: [id: string]
  delete: [id: string]
  open: [id: string]
}>()

const priorityCheckboxClass = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'border-red-400 bg-red-50'
    case 'medium': return 'border-orange-400 bg-orange-50'
    case 'low': return 'border-green-400 bg-green-50'
    default: return 'border-sber-gray-mid bg-white'
  }
})

const priorityDotClass = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'bg-red-400'
    case 'medium': return 'bg-orange-400'
    case 'low': return 'bg-green-400'
    default: return 'bg-transparent'
  }
})

const formatDateTime = computed(() => {
  if (!props.task.dueDate) return ''
  const d = dayjs(props.task.dueDate)
  const dateStr = d.format('D MMM')
  return props.task.dueTime ? `${dateStr}, ${props.task.dueTime}` : dateStr
})

// ─── Swipe logic ──────────────────────────────────────────────────────────────
const swipeOffset = ref(0)
let startX = 0
let startY = 0
let isSwipingH = false

function onTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  isSwipingH = false
}

function onTouchMove(e: TouchEvent) {
  const dx = e.touches[0].clientX - startX
  const dy = e.touches[0].clientY - startY

  if (!isSwipingH && Math.abs(dy) > Math.abs(dx)) return
  isSwipingH = true
  e.preventDefault()

  swipeOffset.value = Math.max(-120, Math.min(120, dx))
}

function onTouchEnd() {
  if (swipeOffset.value > 70) {
    emit('complete', props.task.id)
  } else if (swipeOffset.value < -70) {
    emit('delete', props.task.id)
  }
  swipeOffset.value = 0
}
</script>
