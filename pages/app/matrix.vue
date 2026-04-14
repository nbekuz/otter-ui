<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <!-- Header -->
    <div class="px-4 pt-14 pb-4" :class="isDarkTheme ? 'bg-[#171a21] border-b border-[#2a303a]' : 'bg-white shadow-sm'">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-sber-black">Матрица Эйзенхауэра</h1>
        <button class="w-9 h-9 rounded-xl flex items-center justify-center"
                :class="isDarkTheme ? 'bg-[#20242d]' : 'bg-sber-gray-light'"
                @click="settingsOpen = true">
          <Settings class="w-5 h-5 text-sber-gray" />
        </button>
      </div>
      <p class="text-xs text-sber-gray mt-1">Приоритизируйте задачи по важности и срочности</p>
    </div>

    <!-- Matrix 2x2 grid -->
    <div class="p-3 grid grid-cols-2 gap-3">
      <div
        v-for="block in blocks"
        :key="block.id"
        class="rounded-2xl overflow-hidden border"
        :style="getBlockContainerStyle(block)"
      >
        <!-- Block header -->
        <div class="px-3 pt-3 pb-2 border-b"
             :style="{ borderColor: block.color + '30' }">
          <div class="flex items-center justify-between mb-1">
            <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: block.color }" />
            <span class="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                  :style="{ backgroundColor: block.color }">
              {{ getBlockTasks(block.id).length }}
            </span>
          </div>
          <p class="text-xs font-bold leading-tight" :style="{ color: block.color }">{{ block.title }}</p>
          <p class="text-[10px] text-sber-gray">{{ block.description }}</p>
        </div>

        <!-- Tasks in block -->
        <div class="px-2 py-2 min-h-[100px] max-h-[220px] overflow-y-auto no-scrollbar">
          <div
            v-for="task in getBlockTasks(block.id)"
            :key="task.id"
            class="rounded-xl px-3 py-2 mb-1.5 cursor-pointer active:opacity-70 border"
            :class="isDarkTheme ? 'bg-[#171a21] border-[#2a303a]' : 'bg-white border-transparent'"
            draggable="true"
            @dragstart="onDragStart($event, task.id)"
            @click="selectedTaskId = task.id"
          >
            <div class="flex items-start gap-2">
              <button
                class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5"
                :style="{ borderColor: block.color, backgroundColor: task.completed ? block.color : 'transparent' }"
                @click.stop="tasksStore.completeTask(task.id)"
              >
                <Check v-if="task.completed" class="w-2.5 h-2.5 text-white" />
              </button>
              <p class="text-xs font-medium text-sber-black line-clamp-2 leading-snug"
                 :class="task.completed ? 'line-through text-sber-gray' : ''">
                {{ task.title }}
              </p>
            </div>
            <div v-if="task.dueDate" class="flex items-center gap-1 mt-1 ml-6">
              <Clock class="w-2.5 h-2.5 text-sber-gray" />
              <span class="text-[10px] text-sber-gray">{{ formatDate(task.dueDate) }}</span>
            </div>
          </div>

          <!-- Drop zone -->
          <div
            class="border-2 border-dashed rounded-xl py-4 flex items-center justify-center
                   transition-colors mt-1"
            :style="{ borderColor: block.color + '50' }"
            :class="dragTarget === block.id ? (isDarkTheme ? 'bg-[#20242d]' : 'bg-white/80') : ''"
            @dragover.prevent="dragTarget = block.id"
            @dragleave="dragTarget = null"
            @drop.prevent="onDrop(block.id)"
          >
            <span class="text-[10px]" :style="{ color: block.color }">
              {{ dragTarget === block.id ? 'Отпустите здесь' : '+ перетащите' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Block Settings Modal -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="settingsOpen" class="overlay" @click="settingsOpen = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="settingsOpen" class="app-modal px-5 py-5" style="max-height: 85dvh; overflow-y: auto;" @click.stop>
          <h3 class="text-lg font-bold text-sber-black mb-4">Настройки блоков</h3>

          <div v-for="block in blocks" :key="block.id" class="mb-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: block.color }" />
              <p class="text-sm font-semibold text-sber-black">{{ block.title }}</p>
            </div>

            <div class="space-y-2">
              <div>
                <label class="text-xs text-sber-gray mb-1 block">Название блока</label>
                <input
                  :value="block.title"
                  type="text"
                  class="input-field text-sm py-2.5"
                  @input="updateBlock(block.id, 'title', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div>
                <label class="text-xs text-sber-gray mb-1 block">Фильтр по дате</label>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="df in dateFilters"
                    :key="df.value"
                    class="px-3 py-1 rounded-xl text-xs font-medium border transition-colors"
                    :class="block.dateFilter?.includes(df.value)
                      ? 'text-white border-transparent'
                      : 'border-sber-gray-mid text-sber-gray bg-white'"
                    :style="block.dateFilter?.includes(df.value) ? { backgroundColor: block.color } : {}"
                    @click="toggleDateFilter(block.id, df.value)"
                  >
                    {{ df.label }}
                  </button>
                </div>
              </div>
              <div>
                <label class="text-xs text-sber-gray mb-1 block">Фильтр по приоритету</label>
                <div class="flex gap-1.5">
                  <button
                    v-for="pf in priorityFilters"
                    :key="pf.value"
                    class="px-3 py-1 rounded-xl text-xs font-medium border transition-colors"
                    :class="block.priorityFilter?.includes(pf.value)
                      ? 'text-white border-transparent'
                      : 'border-sber-gray-mid text-sber-gray bg-white'"
                    :style="block.priorityFilter?.includes(pf.value) ? { backgroundColor: pf.color } : {}"
                    @click="togglePriorityFilter(block.id, pf.value)"
                  >
                    {{ pf.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="h-px bg-sber-gray-light mt-4" />
          </div>

          <button class="btn-primary" @click="settingsOpen = false">Сохранить</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Task Detail -->
    <TasksTaskDetailModal
      v-if="selectedTaskId"
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { Settings, Check, Clock } from 'lucide-vue-next'
import dayjs from 'dayjs'

definePageMeta({ layout: 'app' })

const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const settingsOpen = ref(false)
const selectedTaskId = ref<string | null>(null)
const dragTarget = ref<string | null>(null)
let draggedTaskId: string | null = null

const blocks = computed(() => Object.values(settingsStore.matrixBlocks))

function getBlockTasks(blockId: string) {
  return tasksStore.getTasksForMatrix(blockId)
}

function getBlockContainerStyle(block: typeof blocks.value[number]) {
  if (!isDarkTheme.value) {
    return {
      backgroundColor: block.bgColor,
      borderColor: `${block.color}25`,
    }
  }

  return {
    backgroundColor: `${block.color}12`,
    borderColor: `${block.color}40`,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
  }
}

function formatDate(date: string) {
  return dayjs(date).format('D MMM')
}

function onDragStart(e: DragEvent, taskId: string) {
  draggedTaskId = taskId
}

function onDrop(blockId: string) {
  if (draggedTaskId) {
    tasksStore.moveToMatrix(draggedTaskId, blockId)
    draggedTaskId = null
    dragTarget.value = null
  }
}

const dateFilters = [
  { value: 'overdue', label: 'Просроч.' },
  { value: 'today', label: 'Сегодня' },
  { value: 'tomorrow', label: 'Завтра' },
  { value: 'later', label: 'Позже' },
  { value: 'nodate', label: 'Без даты' },
]

const priorityFilters = [
  { value: 'high', label: 'Высок.', color: '#FF3B30' },
  { value: 'medium', label: 'Средн.', color: '#FF9500' },
  { value: 'low', label: 'Низкий', color: '#34C759' },
  { value: 'none', label: 'Без', color: '#8E8E93' },
]

function updateBlock(blockId: string, field: string, value: string) {
  settingsStore.updateMatrixBlock(blockId, { [field]: value })
}

function toggleDateFilter(blockId: string, filter: string) {
  const block = settingsStore.matrixBlocks[blockId as keyof typeof settingsStore.matrixBlocks]
  if (!block) return
  const filters = [...(block.dateFilter || [])]
  const idx = filters.indexOf(filter)
  if (idx === -1) filters.push(filter)
  else filters.splice(idx, 1)
  settingsStore.updateMatrixBlock(blockId, { dateFilter: filters })
}

function togglePriorityFilter(blockId: string, filter: string) {
  const block = settingsStore.matrixBlocks[blockId as keyof typeof settingsStore.matrixBlocks]
  if (!block) return
  const filters = [...(block.priorityFilter || [])]
  const idx = filters.indexOf(filter)
  if (idx === -1) filters.push(filter)
  else filters.splice(idx, 1)
  settingsStore.updateMatrixBlock(blockId, { priorityFilter: filters })
}
</script>
