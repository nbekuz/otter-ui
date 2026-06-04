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

  function findTaskById(id: string) {
    return tasks.value.find(t => t.id === id)
      ?? calendarTasks.value.find(t => t.id === id)
  }

  function taskScheduleKey(task: Task) {
    return [
      task.dueDate,
      task.dueTime,
      task.duration?.start,
      task.duration?.end,
      task.completed,
      task.title,
      task.priority,
      task.matrixBlock,
    ].join('|')
  }

  function mergeTaskFields(
    existing: Task | undefined,
    updates: Partial<Task>,
    id: string,
  ): Task {
    return {
      ...(existing || {
        id,
        title: '',
        priority: 'medium',
        completed: false,
        repeat: 'none',
        createdAt: '',
      }),
      ...updates,
      id,
      duration: updates.duration ?? existing?.duration,
      dueTime: updates.dueTime ?? existing?.dueTime,
      dueDate: updates.dueDate ?? existing?.dueDate,
    } as Task
  }

  function mergeTaskFromApi(
    existing: Task | undefined,
    updates: Partial<Task>,
    fromApi: Task,
  ): Task {
    return {
      ...existing,
      ...fromApi,
      ...updates,
      id: fromApi.id,
      duration: fromApi.duration ?? updates.duration ?? existing?.duration,
      dueTime: fromApi.dueTime ?? updates.dueTime ?? existing?.dueTime,
      dueDate: fromApi.dueDate ?? updates.dueDate ?? existing?.dueDate,
    }
  }

  /** Matrix kesh bo‘lsa — vazifani to‘g‘ri blokка optimistik joylashtirish. */
  function applyTaskToMatrixState(updated: Task) {
    if (Object.keys(matrixTasksByBlock.value).length === 0) return

    const next: Record<string, Task[]> = {}
    for (const [blockId, list] of Object.entries(matrixTasksByBlock.value)) {
      next[blockId] = list.filter(t => t.id !== updated.id)
    }

    if (!updated.completed && updated.matrixBlock) {
      const blockId = updated.matrixBlock
      next[blockId] = [updated, ...(next[blockId] || [])]
    }

    matrixTasksByBlock.value = next
  }

  function removeTaskFromMatrixState(id: string) {
    if (Object.keys(matrixTasksByBlock.value).length === 0) return
    const next: Record<string, Task[]> = {}
    for (const [blockId, list] of Object.entries(matrixTasksByBlock.value)) {
      next[blockId] = list.filter(t => t.id !== id)
    }
    matrixTasksByBlock.value = next
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

    const calIdx = calendarTasks.value.findIndex(t => t.id === updated.id)
    if (calIdx !== -1) {
      calendarTasks.value[calIdx] = updated
    }

    applyTaskToMatrixState(updated)
  }

  async function refreshCalendarIfCached() {
    const key = calendarCacheKey.value
    if (!key) return

    const colon = key.indexOf(':')
    if (colon === -1) return

    const view = key.slice(0, colon) as 'day' | 'week' | 'month' | 'year'
    const date = key.slice(colon + 1)
    if (!date) return

    await fetchCalendar(view, date)
  }

  function refreshMatrixIfCached() {
    if (Object.keys(matrixTasksByBlock.value).length === 0) return undefined
    return fetchMatrix()
  }

  async function refreshTaskLists(options: {
    grouped?: boolean
    calendar?: boolean
    matrix?: boolean
  } = {}) {
    const { grouped = true, calendar = true, matrix = true } = options
    const jobs: Promise<unknown>[] = []
    if (grouped) jobs.push(fetchGrouped())
    if (calendar) jobs.push(refreshCalendarIfCached())
    if (matrix) {
      const matrixJob = refreshMatrixIfCached()
      if (matrixJob) jobs.push(matrixJob)
    }
    if (jobs.length === 0) return
    await Promise.all(jobs)
  }

  function removeTaskFromState(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    calendarTasks.value = calendarTasks.value.filter(t => t.id !== id)
    groupedFromApi.value = groupTasksByKey(tasks.value)
    removeTaskFromMatrixState(id)
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

    const prevById = new Map<string, Task>()
    for (const list of Object.values(matrixTasksByBlock.value)) {
      for (const task of list) prevById.set(task.id, task)
    }

    const next: Record<string, Task[]> = {}
    for (const block of blocks) {
      next[apiMatrixBlockToUi(block.block)] = block.tasks.map((apiTask) => {
        const task = apiTaskToUi(apiTask)
        const prev = prevById.get(task.id)
        return prev && taskScheduleKey(prev) === taskScheduleKey(task) ? prev : task
      })
    }
    matrixTasksByBlock.value = next
    return next
  }

  async function fetchCalendar(view: 'day' | 'week' | 'month' | 'year', date: string) {
    const response = await apiGet<{
      tasks: ApiTask[]
    }>('calendar/', { params: { view, date } })

    const incoming = response.tasks.map(apiTaskToUi)
    calendarCacheKey.value = `${view}:${date}`

    if (calendarTasks.value.length === 0) {
      calendarTasks.value = incoming
      return calendarTasks.value
    }

    const prevById = new Map(calendarTasks.value.map(task => [task.id, task]))
    calendarTasks.value = incoming.map((task) => {
      const prev = prevById.get(task.id)
      if (prev && taskScheduleKey(prev) === taskScheduleKey(task)) {
        return prev
      }
      return task
    })
    return calendarTasks.value
  }

  function parseCalendarCacheKey() {
    const colon = calendarCacheKey.value.indexOf(':')
    if (colon === -1) return null
    return {
      view: calendarCacheKey.value.slice(0, colon),
      date: calendarCacheKey.value.slice(colon + 1),
    }
  }

  function taskScheduleDate(task: Task): string | undefined {
    return task.dueDate
  }

  function getTasksForDate(date: string) {
    const cache = parseCalendarCacheKey()
    if (cache?.view === 'day' && cache.date === date) {
      return calendarTasks.value.slice()
    }

    return tasks.value.filter(t => taskScheduleDate(t) === date)
  }

  function getTasksForWeek(startDate: string, endDate: string) {
    const cache = parseCalendarCacheKey()
    if (cache?.view === 'week') {
      const weekStart = dayjs(cache.date).startOf('week').format('YYYY-MM-DD')
      const weekEnd = dayjs(cache.date).endOf('week').format('YYYY-MM-DD')
      if (!dayjs(startDate).isAfter(weekEnd, 'day') && !dayjs(endDate).isBefore(weekStart, 'day')) {
        return calendarTasks.value.filter((t) => {
          const d = taskScheduleDate(t)
          return !!d
            && !dayjs(d).isBefore(startDate, 'day')
            && !dayjs(d).isAfter(endDate, 'day')
        })
      }
    }

    return tasks.value.filter(t =>
      taskScheduleDate(t)
      && !dayjs(taskScheduleDate(t)).isBefore(startDate, 'day')
      && !dayjs(taskScheduleDate(t)).isAfter(endDate, 'day'),
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
    await refreshTaskLists()
    return task
  }

  type RefreshOptions = { grouped?: boolean, calendar?: boolean, matrix?: boolean }

  async function updateTask(
    id: string,
    updates: Partial<Task>,
    refresh: RefreshOptions = {},
  ) {
    const existing = findTaskById(id)
    const optimistic = mergeTaskFields(existing, updates, id)
    upsertTaskInState(optimistic)

    const merged = { ...existing, ...updates, id } as Partial<Task>
    const payload = uiTaskToApiPayload(merged)
    const updated = await apiPatch<ApiTask>(`tasks/${id}/`, payload)
    const task = mergeTaskFromApi(existing, updates, apiTaskToUi(updated))
    upsertTaskInState(task)
    await refreshTaskLists(refresh)
    return task
  }

  async function deleteTask(id: string, refresh: RefreshOptions = {}) {
    removeTaskFromState(id)
    await apiDelete(`tasks/${id}/`)
    await refreshTaskLists(refresh)
  }

  async function completeTask(id: string, refresh: RefreshOptions = {}) {
    const existing = findTaskById(id)
    if (!existing) return

    upsertTaskInState({
      ...existing,
      completed: !existing.completed,
      completedAt: !existing.completed
        ? dayjs().format('YYYY-MM-DD')
        : undefined,
    })

    const endpoint = existing.completed ? 'uncomplete' : 'complete'
    const updated = await apiPost<ApiTask>(`tasks/${id}/${endpoint}/`)
    const task = apiTaskToUi(updated)
    upsertTaskInState(task)
    await refreshTaskLists(refresh)
    return task
  }

  async function moveToMatrix(taskId: string, blockId: string) {
    const existing = findTaskById(taskId)
    const uiBlock = blockId as NonNullable<Task['matrixBlock']>
    if (existing) {
      upsertTaskInState({ ...existing, matrixBlock: uiBlock })
    }

    const matrix_block = blockId.replace(/-/g, '_') as ApiMatrixBlock
    const updated = await apiPatch<ApiTask>(`tasks/${taskId}/`, { matrix_block })
    const task = apiTaskToUi(updated)
    upsertTaskInState(task)
    await refreshTaskLists({ grouped: false, calendar: false, matrix: true })
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
    refreshCalendarIfCached,
    refreshTaskLists,
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
