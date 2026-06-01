import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { Task } from '~/data/mockData'
import type { ApiMatrixBlock, ApiTask, ApiTaskGroup } from '~/types/mobile-api'
import { apiDelete, apiGet, apiPatch, apiPost, getApiErrorMessage } from '~/utils/api'
import { apiMatrixBlockToUi, apiTaskToUi, groupKeyToUi, uiTaskToApiPayload } from '~/utils/task-mapper'

type GroupKey = 'overdue' | 'today' | 'tomorrow' | 'later' | 'nodate' | 'completed'

const GROUP_ORDER: GroupKey[] = ['overdue', 'today', 'tomorrow', 'later', 'nodate', 'completed']

function flattenGroups(groups: ApiTaskGroup[]): Task[] {
  const seen = new Set<number>()
  const result: Task[] = []
  for (const group of groups) {
    for (const task of group.tasks) {
      if (seen.has(task.id)) continue
      seen.add(task.id)
      result.push(apiTaskToUi(task))
    }
  }
  return result
}

function groupTasksByKey(allTasks: Task[]) {
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  return {
    overdue: allTasks.filter(t =>
      !t.completed && t.dueDate && dayjs(t.dueDate).isBefore(today, 'day'),
    ),
    today: allTasks.filter(t =>
      !t.completed && t.dueDate === today,
    ),
    tomorrow: allTasks.filter(t =>
      !t.completed && t.dueDate === tomorrow,
    ),
    later: allTasks.filter(t =>
      !t.completed && t.dueDate && dayjs(t.dueDate).isAfter(tomorrow, 'day'),
    ),
    nodate: allTasks.filter(t => !t.completed && !t.dueDate),
    completed: allTasks.filter(t => t.completed),
  }
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const groupedFromApi = ref<Record<GroupKey, Task[]>>({
    overdue: [],
    today: [],
    tomorrow: [],
    later: [],
    nodate: [],
    completed: [],
  })
  const matrixTasksByBlock = ref<Record<string, Task[]>>({})
  const calendarTasks = ref<Task[]>([])
  const calendarCacheKey = ref('')
  const loading = ref(false)
  const error = ref('')
  const initialized = ref(false)

  const today = computed(() => dayjs().format('YYYY-MM-DD'))
  const tomorrow = computed(() => dayjs().add(1, 'day').format('YYYY-MM-DD'))

  const overdueTasks = computed(() => groupedFromApi.value.overdue)
  const todayTasks = computed(() => groupedFromApi.value.today)
  const tomorrowTasks = computed(() => groupedFromApi.value.tomorrow)
  const laterTasks = computed(() => groupedFromApi.value.later)
  const noDateTasks = computed(() => groupedFromApi.value.nodate)
  const completedTasks = computed(() => groupedFromApi.value.completed)

  function applyGrouped(groups: ApiTaskGroup[]) {
    const next: Record<GroupKey, Task[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      later: [],
      nodate: [],
      completed: [],
    }
    for (const group of groups) {
      const uiKey = groupKeyToUi(group.key) as GroupKey
      if (uiKey in next) {
        next[uiKey] = group.tasks.map(apiTaskToUi)
      }
    }
    groupedFromApi.value = next
    tasks.value = flattenGroups(groups)
  }

  function upsertTaskInState(updated: Task) {
    const idx = tasks.value.findIndex(t => t.id === updated.id)
    if (idx === -1) {
      tasks.value.unshift(updated)
    }
    else {
      tasks.value[idx] = updated
    }
    groupedFromApi.value = groupTasksByKey(tasks.value)
  }

  function removeTaskFromState(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    groupedFromApi.value = groupTasksByKey(tasks.value)
  }

  async function fetchGrouped() {
    loading.value = true
    error.value = ''
    try {
      const groups = await apiGet<ApiTaskGroup[]>('tasks/grouped/')
      applyGrouped(groups)
      initialized.value = true
    }
    catch (err) {
      error.value = getApiErrorMessage(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function fetchMatrix() {
    const blocks = await apiGet<Array<{
      block: ApiMatrixBlock
      tasks: ApiTask[]
    }>>('matrix/')

    const next: Record<string, Task[]> = {}
    for (const block of blocks) {
      next[apiMatrixBlockToUi(block.block)] = block.tasks.map(apiTaskToUi)
    }
    matrixTasksByBlock.value = next
    return next
  }

  async function fetchCalendar(view: 'day' | 'week' | 'month' | 'year', date: string) {
    const response = await apiGet<{
      tasks: ApiTask[]
    }>('calendar/', { params: { view, date } })

    calendarTasks.value = response.tasks.map(apiTaskToUi)
    calendarCacheKey.value = `${view}:${date}`
    return calendarTasks.value
  }

  function getTasksForDate(date: string) {
    if (calendarTasks.value.length > 0) {
      const fromCalendar = calendarTasks.value.filter(t => t.dueDate === date)
      if (fromCalendar.length > 0) return fromCalendar
    }
    return tasks.value.filter(t => t.dueDate === date)
  }

  function getTasksForWeek(startDate: string, endDate: string) {
    const source = calendarTasks.value.length > 0 ? calendarTasks.value : tasks.value
    return source.filter(t =>
      t.dueDate
      && !dayjs(t.dueDate).isBefore(startDate, 'day')
      && !dayjs(t.dueDate).isAfter(endDate, 'day'),
    )
  }

  function getTasksForMatrix(blockId: string) {
    if (matrixTasksByBlock.value[blockId]?.length) {
      return matrixTasksByBlock.value[blockId]
    }
    return tasks.value.filter(t => !t.completed && t.matrixBlock === blockId)
  }

  async function addTask(taskData: Partial<Task>) {
    const payload = uiTaskToApiPayload(taskData)
    const created = await apiPost<ApiTask>('tasks/', payload)
    const task = apiTaskToUi(created)
    upsertTaskInState(task)
    await fetchGrouped()
    return task
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const existing = tasks.value.find(t => t.id === id)
    const merged = { ...existing, ...updates, id } as Partial<Task>
    const payload = uiTaskToApiPayload(merged)
    const updated = await apiPatch<ApiTask>(`tasks/${id}/`, payload)
    const task = apiTaskToUi(updated)
    upsertTaskInState(task)
    await fetchGrouped()
    return task
  }

  async function deleteTask(id: string) {
    await apiDelete(`tasks/${id}/`)
    removeTaskFromState(id)
    await fetchGrouped()
  }

  async function completeTask(id: string) {
    const existing = tasks.value.find(t => t.id === id)
    if (!existing) return

    const endpoint = existing.completed ? 'uncomplete' : 'complete'
    const updated = await apiPost<ApiTask>(`tasks/${id}/${endpoint}/`)
    const task = apiTaskToUi(updated)
    upsertTaskInState(task)
    await fetchGrouped()
    return task
  }

  async function moveToMatrix(taskId: string, blockId: string) {
    const matrix_block = blockId.replace(/-/g, '_') as ApiMatrixBlock
    const updated = await apiPatch<ApiTask>(`tasks/${taskId}/`, { matrix_block })
    const task = apiTaskToUi(updated)
    upsertTaskInState(task)
    await fetchMatrix()
    await fetchGrouped()
    return task
  }

  async function fetchTask(id: string) {
    const task = await apiGet<ApiTask>(`tasks/${id}/`)
    const ui = apiTaskToUi(task)
    upsertTaskInState(ui)
    return ui
  }

  async function searchTasks(query: string) {
    if (!query.trim()) return []
    const response = await apiGet<{ results: ApiTask[] }>('tasks/', {
      params: { search: query.trim(), limit: 50 },
    })
    return (response.results || []).map(apiTaskToUi)
  }

  function reset() {
    tasks.value = []
    groupedFromApi.value = GROUP_ORDER.reduce((acc, key) => {
      acc[key] = []
      return acc
    }, {} as Record<GroupKey, Task[]>)
    matrixTasksByBlock.value = {}
    calendarTasks.value = []
    calendarCacheKey.value = ''
    initialized.value = false
    error.value = ''
  }

  return {
    tasks,
    groupedFromApi,
    matrixTasksByBlock,
    calendarTasks,
    calendarCacheKey,
    loading,
    error,
    initialized,
    today,
    tomorrow,
    overdueTasks,
    todayTasks,
    tomorrowTasks,
    laterTasks,
    noDateTasks,
    completedTasks,
    fetchGrouped,
    fetchMatrix,
    fetchCalendar,
    getTasksForDate,
    getTasksForWeek,
    getTasksForMatrix,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveToMatrix,
    fetchTask,
    searchTasks,
    reset,
  }
})
