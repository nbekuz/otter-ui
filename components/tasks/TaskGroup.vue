<template>
  <div class="mb-3 h-fit lg:mb-0">
    <!-- Group Header -->
    <button
      class="task-group-header w-full shadow-sm mb-0"
      :class="isOpen ? 'rounded-b-none rounded-t-2xl shadow-none border-b border-sber-gray-light' : 'rounded-2xl'"
      @click="toggle"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl flex items-center justify-center"
             :style="{ backgroundColor: color + '20' }">
          <component :is="icon" class="w-4 h-4" :style="{ color }" />
        </div>
        <div class="text-left">
          <span class="text-sm font-semibold text-sber-black">{{ title }}</span>
          <span class="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: color + '20', color }">
            {{ tasks.length }}
          </span>
        </div>
      </div>
      <ChevronDown class="w-5 h-5 text-sber-gray transition-transform duration-200"
                   :class="isOpen ? 'rotate-180' : ''" />
    </button>

    <!-- Task List -->
    <Transition name="slide-down">
      <div v-if="isOpen" class="bg-white rounded-b-2xl px-3 pb-3 pt-2 shadow-sm">
        <TasksTaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @complete="tasksStore.completeTask($event)"
          @delete="tasksStore.deleteTask($event)"
          @open="$emit('openTask', $event)"
        />

        <div v-if="tasks.length === 0" class="text-center py-4 text-sber-gray text-sm">
          Нет задач
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import type { Task } from '~/data/mockData'
import type { Component } from 'vue'

defineProps<{
  title: string
  tasks: Task[]
  color: string
  icon: Component
}>()

defineEmits<{ openTask: [id: string] }>()

const tasksStore = useTasksStore()
const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>
