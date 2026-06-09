<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div class="overlay" @click="onCancel" />
    </Transition>
    <Transition name="modal">
      <div v-if="task" class="app-modal px-4 py-5" style="max-height: 85dvh; overflow-y: auto;" @click.stop>
        <div class="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
             :style="{ backgroundColor: priorityColor(form.priority) + '20' }">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: priorityColor(form.priority) }" />
          <select v-model="form.priority" class="bg-transparent text-xs font-medium outline-none"
                  :style="{ color: priorityColor(form.priority) }">
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
            <option value="none">Без приоритета</option>
          </select>
        </div>

        <div class="space-y-3">
          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Название</label>
            <input v-model="form.title" class="input-field py-3" type="text">
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-sber-gray">Описание</label>
            <textarea v-model="form.description" class="input-field min-h-[72px] resize-none py-3" />
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
              <TimeFieldRu v-model="form.durationEnd" field-class="py-3" />
            </div>
          </div>
          <p v-if="saveError" class="text-sm text-red-500">{{ saveError }}</p>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2">
          <button class="btn-primary !w-auto col-span-1 !py-3 text-sm" type="button" :disabled="saving" @click="saveTask">
            {{ saving ? '…' : 'Сохранить' }}
          </button>
          <button class="btn-secondary !w-auto col-span-1 !py-3 text-sm" type="button" @click="onCancel">
            Отмена
          </button>
          <button
            v-if="task.completed"
            class="col-span-1 rounded-2xl bg-sber-blue-light px-3 py-3 text-sm font-semibold text-sber-blue"
            type="button"
            @click="restoreTask"
          >
            Восстановить
          </button>
          <button
            v-else
            class="col-span-1 rounded-2xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-500"
            type="button"
            @click="deleteTask"
          >
            Удалить
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Priority, Task } from '~/data/mockData'
import { priorityColor } from '~/utils/priority-colors'
import { validateDurationFields } from '~/utils/time'
import { getApiErrorMessage, getApiFieldError } from '~/utils/api'

const props = defineProps<{ taskId: string }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const tasksStore = useTasksStore()

const task = computed(() => tasksStore.tasks.find(t => t.id === props.taskId))
const saving = ref(false)
const saveError = ref('')

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  durationStart: '',
  durationEnd: '',
  priority: 'none' as Priority,
})

useTaskTimeSync(form)

function syncFormFromTask(t: Task | undefined) {
  if (!t) return
  form.title = t.title
  form.description = t.description || ''
  form.dueDate = t.dueDate || ''
  form.dueTime = t.dueTime || ''
  form.durationStart = t.duration?.start || ''
  form.durationEnd = t.duration?.end || ''
  form.priority = t.priority || 'none'
}

watch(task, syncFormFromTask, { immediate: true })

function onCancel() {
  emit('close')
}

async function saveTask() {
  if (!task.value) return
  saveError.value = ''
  const durationError = validateDurationFields(form.durationStart, form.durationEnd)
  if (durationError) {
    saveError.value = durationError
    return
  }

  saving.value = true
  try {
    const updates: Partial<Task> = {
      title: form.title.trim() || task.value.title,
      description: form.description.trim() || undefined,
      dueDate: form.dueDate || undefined,
      dueTime: form.dueTime || undefined,
      priority: form.priority,
    }
    if (form.durationStart && form.durationEnd) {
      updates.duration = { start: form.durationStart, end: form.durationEnd }
    } else {
      updates.duration = undefined
    }
    await tasksStore.updateTask(task.value.id, updates)
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

async function deleteTask() {
  if (!task.value) return
  await tasksStore.deleteTask(task.value.id)
  emit('close')
}

async function restoreTask() {
  if (!task.value) return
  await tasksStore.completeTask(task.value.id)
  emit('close')
}
</script>
