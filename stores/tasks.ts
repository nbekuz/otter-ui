import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { Task } from '~/data/mockData'
import type { ApiMatrixBlock, ApiTask, ApiTaskGroup } from '~/types/mobile-api'
import { apiDelete, apiGet, apiPatch, apiPost, getApiErrorCode, getApiErrorMessage } from '~/utils/api'
import { apiMatrixBlockToUi, apiTaskToUi, dataUrlToFile, groupKeyToUi, preferClientSchedule, uiTaskToApiPayload, uiTaskToFormData } from '~/utils/task-mapper'
import { computeNextOccurrenceDate, expandTasksForDate, expandTasksForRange, isRecurringTask } from '~/utils/recurrence'
import { resolveTaskWeekdays } from '~/utils/repeat-weekdays'

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

function normalizeDueDate(dueDate?: string) {
  if (!dueDate) return ''
  const parsed = dayjs(dueDate)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : ''
}

function groupTasksByKey(allTasks: Task[]) {
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  return {
    overdue: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate)
      return !t.completed && !!d && dayjs(d).isBefore(today, 'day')
    }),
    today: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate)
      return !t.completed && d === today
    }),
    tomorrow: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate)
      return !t.completed && d === tomorrow
    }),
    later: allTasks.filter((t) => {
      const d = normalizeDueDate(t.dueDate)
      return !t.completed && !!d && dayjs(d).isAfter(tomorrow, 'day')
    }),
    nodate: allTasks.filter(t => !t.completed && !normalizeDueDate(t.dueDate)),
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
  const calendarPremiumBlocked = ref(false)
  const matrixPremiumBlocked = ref(false)
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

  /**
   * List endpoints may omit the image; keep a previously known attachment.
   * Do not restore when the cached task was intentionally cleared — otherwise
   * remove+save looks like a no-op.
   * Also keep due/schedule when grouped/completed payloads omit due_at — otherwise
   * «Восстановить» cannot put the task back into Позже/Сегодня/etc.
   */
  function preserveImages(incoming: Task[]) {
    const prevById = new Map(tasks.value.map(t => [t.id, t]))
    for (const task of incoming) {
      const prev = prevById.get(task.id)
      if (!prev) continue

      if (!task.dueDate && prev.dueDate) {
        task.dueDate = prev.dueDate
        if (!task.dueTime && prev.dueTime) task.dueTime = prev.dueTime
        if (!task.duration && prev.duration) task.duration = prev.duration
      }

      if (task.imageUrl || task.attachment) continue
      const prevCleared = !prev.imageUrl
        && !prev.attachment
        && !(prev.attachments && prev.attachments.length > 0)
      if (prevCleared) continue
      if (prev.imageUrl || prev.attachment) {
        task.imageUrl = prev.imageUrl
        task.attachment = prev.attachment
        if (prev.attachments?.length) task.attachments = prev.attachments
      }
    }
    return incoming
  }

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
    tasks.value = preserveImages(flattenGroups(groups))
    groupedFromApi.value = groupTasksByKey(tasks.value)
  }

  function findTaskById(id: string) {
    const realId = id.includes('__') && /^\d{4}-\d{2}-\d{2}$/.test(id.split('__').pop() || '')
      ? id.slice(0, id.lastIndexOf('__'))
      : id
    const fromGrouped = tasks.value.find(t => t.id === realId)
    const fromCalendar = calendarTasks.value.find(t => t.id === realId)
    if (!fromGrouped) return fromCalendar
    if (!fromCalendar) return fromGrouped
    // Calendar drag updates calendarTasks first — prefer fresher schedule on complete.
    if (taskScheduleKey(fromGrouped) !== taskScheduleKey(fromCalendar)) {
      return fromCalendar
    }
    return fromGrouped
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
    const has = (key: keyof Task) => Object.prototype.hasOwnProperty.call(updates, key)
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
      // Allow explicit undefined to clear schedule (e.g. drop onto «Без времени»).
      duration: has('duration') ? updates.duration : existing?.duration,
      dueTime: has('dueTime') ? updates.dueTime : existing?.dueTime,
      dueDate: has('dueDate') ? updates.dueDate : existing?.dueDate,
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
      // Prefer the schedule we just wrote so a remapped API timezone cannot
      // jump the block on the calendar after drag/resize.
      duration: 'duration' in updates
        ? updates.duration
        : (fromApi.duration ?? existing?.duration),
      dueTime: 'dueTime' in updates
        ? updates.dueTime
        : (fromApi.dueTime ?? existing?.dueTime),
      dueDate: 'dueDate' in updates
        ? updates.dueDate
        : (fromApi.dueDate ?? existing?.dueDate),
      repeat: 'repeat' in updates
        ? updates.repeat!
        : (fromApi.repeat ?? existing?.repeat ?? 'none'),
      repeatDays: 'repeatDays' in updates
        ? updates.repeatDays
        : (fromApi.repeatDays ?? existing?.repeatDays),
      repeatCustom: 'repeatCustom' in updates
        ? updates.repeatCustom
        : (fromApi.repeatCustom ?? existing?.repeatCustom),
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
    else if (calendarCacheKey.value && !updated.completed && updated.dueDate) {
      calendarTasks.value = [...calendarTasks.value, updated]
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
    try {
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
      matrixPremiumBlocked.value = false
      matrixTasksByBlock.value = next
      return next
    }
    catch (err) {
      if (getApiErrorCode(err) === 'PREMIUM_REQUIRED') {
        matrixPremiumBlocked.value = true
        matrixTasksByBlock.value = {}
      }
      throw err
    }
  }

  async function fetchCalendar(view: 'day' | 'week' | 'month' | 'year', date: string) {
    try {
    const response = await apiGet<{
      tasks?: ApiTask[]
      all_day_tasks?: ApiTask[]
      timed_tasks?: ApiTask[]
    }>('calendar/', { params: { view, date } })

    const allDay = (response.all_day_tasks || []).map(t => ({
      ...apiTaskToUi(t),
      isAllDay: true,
    }))
    const timed = (response.timed_tasks || []).map(apiTaskToUi)
    const flat = (response.tasks || []).map(apiTaskToUi)
    const preferSplit = allDay.length > 0 || timed.length > 0
    const merged = preferSplit ? [...allDay, ...timed] : flat
    const seen = new Set<string>()
    const incoming = merged.filter((t) => {
      if (seen.has(t.id)) return false
      seen.add(t.id)
      return true
    })
    calendarCacheKey.value = `${view}:${date}`
    calendarPremiumBlocked.value = false

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
    catch (err) {
      if (getApiErrorCode(err) === 'PREMIUM_REQUIRED') {
        calendarPremiumBlocked.value = true
        calendarTasks.value = []
      }
      throw err
    }
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
    if (calendarPremiumBlocked.value) return []
    const pool = new Map<string, Task>()
    for (const t of tasks.value) pool.set(t.id, t)
    for (const t of calendarTasks.value) {
      if (!pool.has(t.id)) pool.set(t.id, t)
    }
    return expandTasksForDate(Array.from(pool.values()), date)
  }

  function getTasksForWeek(startDate: string, endDate: string) {
    if (calendarPremiumBlocked.value) return []
    const pool = new Map<string, Task>()
    for (const t of tasks.value) pool.set(t.id, t)
    for (const t of calendarTasks.value) {
      if (!pool.has(t.id)) pool.set(t.id, t)
    }
    return expandTasksForRange(Array.from(pool.values()), startDate, endDate)
  }

  function getTasksForMatrix(blockId: string) {
    if (matrixPremiumBlocked.value) return []
    const settingsStore = useSettingsStore()
    const block = settingsStore.matrixBlocks[blockId as keyof typeof settingsStore.matrixBlocks]
    const dateFilters = block?.dateFilter || []
    const priorityFilters = block?.priorityFilter || []

    const groups = groupTasksByKey(tasks.value)
    const incomplete = tasks.value.filter(t => !t.completed)

    const hasDateFilters = dateFilters.length > 0
    const hasPriorityFilters = priorityFilters.length > 0

    // Multiple filters are OR: task matches if it fits any selected date rule
    // OR any selected priority (each chip is an independent condition).
    if (hasDateFilters || hasPriorityFilters) {
      const dateMatchedIds = new Set<string>()
      if (hasDateFilters) {
        for (const key of dateFilters) {
          const list = groups[key as GroupKey]
          if (list) {
            for (const t of list) dateMatchedIds.add(t.id)
          }
        }
      }

      const matched = incomplete.filter((t) => {
        const byDate = hasDateFilters && dateMatchedIds.has(t.id)
        const byPriority = hasPriorityFilters && priorityFilters.includes(t.priority)
        if (hasDateFilters && hasPriorityFilters) return byDate || byPriority
        if (hasDateFilters) return byDate
        return byPriority
      })

      const assigned = incomplete.filter(t => t.matrixBlock === blockId)
      const byId = new Map<string, Task>()
      for (const t of matched) {
        // Drag = move: don't keep a task here via filters when it is assigned elsewhere.
        if (t.matrixBlock && t.matrixBlock !== blockId) continue
        byId.set(t.id, t)
      }
      for (const t of assigned) byId.set(t.id, t)
      return Array.from(byId.values())
    }

    if (matrixTasksByBlock.value[blockId]?.length) {
      return matrixTasksByBlock.value[blockId]
    }
    return incomplete.filter(t => t.matrixBlock === blockId)
  }

  async function resolveAttachmentFile(taskData: Partial<Task>): Promise<File | undefined> {
    const att = taskData.attachment
    if (!att?.dataUrl?.startsWith('data:')) return undefined
    const file = await dataUrlToFile(att.dataUrl, att.name, att.mimeType)
    return file || undefined
  }

  async function uploadAttachment(taskId: string, file: File) {
    const form = new FormData()
    form.append('file', file)
    return apiPost(`tasks/${taskId}/attachments/`, form)
  }

  async function deleteAttachment(taskId: string, attachmentId: number) {
    await apiDelete(`tasks/${taskId}/attachments/${attachmentId}/`)
  }

  function includeMatrixInApiPayload() {
    return usePremiumStore().isPremium
  }

  async function addTask(taskData: Partial<Task>) {
    const matrixOpts = { includeMatrixBlock: includeMatrixInApiPayload() }
    const imageFile = await resolveAttachmentFile(taskData)
    const created = imageFile
      ? await apiPost<ApiTask>('tasks/', uiTaskToFormData(taskData, imageFile, matrixOpts))
      : await apiPost<ApiTask>('tasks/', uiTaskToApiPayload(taskData, matrixOpts))
    let task = preferClientSchedule(apiTaskToUi(created), taskData)
    if (imageFile) {
      try {
        await uploadAttachment(task.id, imageFile)
        const refreshed = await apiGet<ApiTask>(`tasks/${task.id}/`)
        task = preferClientSchedule(apiTaskToUi(refreshed), taskData)
      }
      catch {
        /* legacy image field may already hold the file */
      }
    }
    task = {
      ...task,
      repeat: taskData.repeat || task.repeat,
      repeatDays: taskData.repeatDays || task.repeatDays,
      repeatCustom: taskData.repeatCustom || task.repeatCustom,
    }
    upsertTaskInState(task)
    await refreshTaskLists()
    // Re-pin after refresh — calendar/grouped may briefly echo UTC wall digits.
    upsertTaskInState(preferClientSchedule(task, taskData))
    return task
  }

  const completeInFlight = new Set<string>()

  type RefreshOptions = { grouped?: boolean, calendar?: boolean, matrix?: boolean }

  function isClearingAttachment(updates: Partial<Task>, imageFile?: File) {
    if (imageFile) return false
    return Object.prototype.hasOwnProperty.call(updates, 'attachment')
      && !updates.attachment
  }

  function clearedAttachmentFields(): Pick<Task, 'attachment' | 'imageUrl' | 'attachments'> {
    return {
      attachment: undefined,
      imageUrl: undefined,
      attachments: [],
    }
  }

  function recurringRepeatFields(source: Task) {
    const weekdays = resolveTaskWeekdays(source)
    if (!weekdays.length) {
      return {
        repeat: source.repeat,
        repeatDays: source.repeatDays,
        repeatCustom: source.repeatCustom,
      }
    }
    return {
      repeat: 'custom' as const,
      repeatDays: weekdays,
      repeatCustom: {
        interval: source.repeatCustom?.interval || 1,
        unit: source.repeatCustom?.unit || 'week',
        weekdays,
      },
    }
  }

  async function finalizeNextRecurringTask(
    nextApi: ApiTask,
    enrichedExisting: Task,
  ): Promise<Task> {
    let nextUi = apiTaskToUi(nextApi)
    const nextDate = computeNextOccurrenceDate(enrichedExisting)
    const targetDueDate = nextDate ?? nextUi.dueDate
    const targetDueTime = enrichedExisting.dueTime ?? nextUi.dueTime
    const targetDuration = enrichedExisting.duration ?? nextUi.duration
    const repeatFields = recurringRepeatFields(enrichedExisting)

    const scheduleChanged = Boolean(
      targetDueDate
      && (
        targetDueDate !== nextUi.dueDate
        || targetDueTime !== nextUi.dueTime
        || JSON.stringify(targetDuration) !== JSON.stringify(nextUi.duration)
      ),
    )

    if (scheduleChanged && targetDueDate) {
      try {
        const payload = uiTaskToApiPayload({
          ...nextUi,
          title: nextUi.title,
          description: nextUi.description,
          dueDate: targetDueDate,
          dueTime: targetDueTime,
          duration: targetDuration,
          priority: enrichedExisting.priority,
          notification: enrichedExisting.notification,
          matrixBlock: enrichedExisting.matrixBlock,
          ...repeatFields,
        }, { includeMatrixBlock: includeMatrixInApiPayload() })
        const patched = await apiPatch<ApiTask>(`tasks/${nextUi.id}/`, payload)
        nextUi = preferClientSchedule(apiTaskToUi(patched), {
          dueDate: targetDueDate,
          dueTime: targetDueTime,
          duration: targetDuration,
          ...repeatFields,
        })
      }
      catch {
        nextUi = {
          ...nextUi,
          dueDate: targetDueDate,
          dueTime: targetDueTime,
          duration: targetDuration,
          ...repeatFields,
        }
      }
    }
    else {
      nextUi = {
        ...nextUi,
        dueTime: targetDueTime,
        duration: targetDuration,
        ...repeatFields,
      }
    }

    return nextUi
  }

  async function spawnNextRecurringTask(enrichedExisting: Task): Promise<Task | null> {
    const nextDate = computeNextOccurrenceDate(enrichedExisting)
    if (!nextDate) return null

    const repeatFields = recurringRepeatFields(enrichedExisting)
    const payloadData: Partial<Task> = {
      title: enrichedExisting.title,
      description: enrichedExisting.description,
      dueDate: nextDate,
      dueTime: enrichedExisting.dueTime,
      duration: enrichedExisting.duration,
      priority: enrichedExisting.priority,
      notification: enrichedExisting.notification,
      matrixBlock: enrichedExisting.matrixBlock,
      ...repeatFields,
    }

    const matrixOpts = { includeMatrixBlock: includeMatrixInApiPayload() }
    const apiPayload = uiTaskToApiPayload(payloadData, matrixOpts)
    const parentId = Number(enrichedExisting.id)
    if (!Number.isNaN(parentId)) {
      apiPayload.parent_task = parentId
    }
    if (enrichedExisting.seriesId) {
      apiPayload.series_id = enrichedExisting.seriesId
    }

    try {
      const created = await apiPost<ApiTask>('tasks/', apiPayload)
      return preferClientSchedule(apiTaskToUi(created), {
        dueDate: nextDate,
        dueTime: enrichedExisting.dueTime,
        duration: enrichedExisting.duration,
        ...repeatFields,
      })
    }
    catch {
      return null
    }
  }

  async function upsertNextRecurringOccurrence(
    enrichedExisting: Task,
    nextApi: ApiTask | null | undefined,
  ) {
    if (nextApi) {
      const nextUi = await finalizeNextRecurringTask(nextApi, enrichedExisting)
      upsertTaskInState(nextUi)
      return
    }

    const spawned = await spawnNextRecurringTask(enrichedExisting)
    if (spawned) upsertTaskInState(spawned)
  }

  async function updateTask(
    id: string,
    updates: Partial<Task>,
    refresh: RefreshOptions = {},
  ) {
    const existing = findTaskById(id)
    const imageFile = await resolveAttachmentFile(updates)
    const clearingAttachment = isClearingAttachment(updates, imageFile)

    const optimisticUpdates = clearingAttachment
      ? { ...updates, ...clearedAttachmentFields() }
      : updates
    const optimistic = mergeTaskFields(existing, optimisticUpdates, id)
    upsertTaskInState(optimistic)

    const merged = { ...existing, ...updates, id } as Partial<Task>
    const matrixOpts = { includeMatrixBlock: includeMatrixInApiPayload() }

    // Remove server attachments so list refresh cannot resurrect the old file.
    if (clearingAttachment) {
      const ids = new Set<number>()
      for (const a of existing?.attachments || []) ids.add(a.id)
      for (const attachmentId of ids) {
        try {
          await deleteAttachment(id, attachmentId)
        }
        catch {
          /* continue — still clear legacy image field below */
        }
      }
    }

    let updated: ApiTask
    if (imageFile) {
      const prevIds = existing?.attachments?.map(a => a.id) || []
      for (const attachmentId of prevIds) {
        try {
          await deleteAttachment(id, attachmentId)
        }
        catch { /* ignore */ }
      }
      updated = await apiPatch<ApiTask>(`tasks/${id}/`, uiTaskToFormData(merged, imageFile, matrixOpts))
      try {
        await uploadAttachment(id, imageFile)
        updated = await apiGet<ApiTask>(`tasks/${id}/`)
      }
      catch {
        /* keep patched response */
      }
    }
    else if (clearingAttachment) {
      updated = await apiPatch<ApiTask>(
        `tasks/${id}/`,
        uiTaskToFormData(merged, undefined, { clearImage: true, ...matrixOpts }),
      )
      try {
        updated = await apiGet<ApiTask>(`tasks/${id}/`)
      }
      catch {
        /* keep patched response */
      }
    }
    else {
      updated = await apiPatch<ApiTask>(`tasks/${id}/`, uiTaskToApiPayload(merged, matrixOpts))
    }

    let task = mergeTaskFromApi(existing, optimisticUpdates, apiTaskToUi(updated))
    if (clearingAttachment) {
      task = { ...task, ...clearedAttachmentFields() }
    }
    upsertTaskInState(task)
    await refreshTaskLists(refresh)
    return task
  }

  async function deleteTask(
    id: string,
    refresh: RefreshOptions = {},
    scope?: 'this' | 'series',
  ) {
    removeTaskFromState(id)
    const url = scope ? `tasks/${id}/?scope=${scope}` : `tasks/${id}/`
    await apiDelete(url)
    await refreshTaskLists(refresh)
  }

  /**
   * Delete only this occurrence (`?scope=this`).
   * Backend owns series continuation — do not POST a next task from the client.
   */
  async function deleteOccurrence(id: string, refresh: RefreshOptions = {}) {
    await deleteTask(id, refresh, 'this')
  }

  /** Delete the whole series (`?scope=series`). */
  async function deleteSeries(id: string, refresh: RefreshOptions = {}) {
    await deleteTask(id, refresh, 'series')
  }

  async function completeTask(id: string, refresh: RefreshOptions = {}) {
    if (completeInFlight.has(id)) return
    completeInFlight.add(id)
    try {
      const existing = findTaskById(id)
      if (!existing) return

      const willComplete = !existing.completed
      const scheduleSnapshot: Partial<Task> = {
        repeat: existing.repeat,
        repeatDays: existing.repeatDays,
        repeatCustom: existing.repeatCustom,
      }
      if (existing.dueDate) scheduleSnapshot.dueDate = existing.dueDate
      if (existing.dueTime) scheduleSnapshot.dueTime = existing.dueTime
      if (existing.duration) scheduleSnapshot.duration = existing.duration

      upsertTaskInState({
        ...existing,
        completed: willComplete,
        completedAt: willComplete
          ? dayjs().format('YYYY-MM-DD')
          : undefined,
        // Stale list_key: 'completed' would send the UI back to Готово after restore.
        listKey: willComplete ? 'completed' : undefined,
      })

      const endpoint = existing.completed ? 'uncomplete' : 'complete'
      const updated = await apiPost<ApiTask>(`tasks/${id}/${endpoint}/`)
      let task = preferClientSchedule(apiTaskToUi(updated), scheduleSnapshot)
      // Trust the action we just performed — grouped refresh can echo stale flags.
      task = {
        ...task,
        completed: willComplete,
        completedAt: willComplete
          ? (task.completedAt || dayjs().format('YYYY-MM-DD'))
          : undefined,
        listKey: willComplete ? 'completed' : undefined,
      }
      if (!task.dueDate && scheduleSnapshot.dueDate) {
        task = {
          ...task,
          dueDate: scheduleSnapshot.dueDate,
          dueTime: scheduleSnapshot.dueTime ?? task.dueTime,
          duration: scheduleSnapshot.duration ?? task.duration,
        }
      }
      task = {
        ...task,
        repeat: scheduleSnapshot.repeat ?? task.repeat,
        repeatDays: scheduleSnapshot.repeatDays ?? task.repeatDays,
        repeatCustom: scheduleSnapshot.repeatCustom ?? task.repeatCustom,
      }
      upsertTaskInState(task)

      if (willComplete) {
        void useSoundsStore().playFeedbackSound('completion')
        if (isRecurringTask(existing)) {
          await upsertNextRecurringOccurrence(existing, updated.next_task)
        }
      }

      await refreshTaskLists(refresh)
      if (willComplete && isRecurringTask(existing) && calendarCacheKey.value) {
        await refreshCalendarIfCached()
      }
      // Re-pin after refresh — same pattern as addTask (grouped may drop due_at / lag flags).
      upsertTaskInState(preferClientSchedule(task, scheduleSnapshot))
      return task
    }
    finally {
      completeInFlight.delete(id)
    }
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
    calendarPremiumBlocked.value = false
    matrixPremiumBlocked.value = false
    initialized.value = false
    error.value = ''
  }

  return {
    tasks,
    groupedFromApi,
    matrixTasksByBlock,
    calendarTasks,
    calendarCacheKey,
    calendarPremiumBlocked,
    matrixPremiumBlocked,
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
    deleteOccurrence,
    deleteSeries,
    completeTask,
    isRecurringTask,
    moveToMatrix,
    fetchTask,
    searchTasks,
    uploadAttachment,
    deleteAttachment,
    upsertTaskInState,
    reset,
  }
})
