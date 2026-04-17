import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { mockTasks, type Task, type Priority, type RepeatType } from '~/data/mockData'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = useLocalStorage<Task[]>(
    'otter.tasks',
    mockTasks.map(task => ({
      ...task,
      duration: task.duration ? { ...task.duration } : undefined,
    }))
  )

  const today = computed(() => dayjs().format('YYYY-MM-DD'))
  const tomorrow = computed(() => dayjs().add(1, 'day').format('YYYY-MM-DD'))

  // ─── Grouped tasks ───────────────────────────────────────────────────────
  const overdueTasks = computed(() =>
    tasks.value.filter(t =>
      !t.completed && t.dueDate && dayjs(t.dueDate).isBefore(today.value, 'day')
    )
  )

  const todayTasks = computed(() =>
    tasks.value.filter(t =>
      !t.completed && t.dueDate === today.value
    )
  )

  const tomorrowTasks = computed(() =>
    tasks.value.filter(t =>
      !t.completed && t.dueDate === tomorrow.value
    )
  )

  const laterTasks = computed(() =>
    tasks.value.filter(t =>
      !t.completed && t.dueDate && dayjs(t.dueDate).isAfter(tomorrow.value, 'day')
    )
  )

  const noDateTasks = computed(() =>
    tasks.value.filter(t => !t.completed && !t.dueDate)
  )

  const completedTasks = computed(() =>
    tasks.value.filter(t => t.completed)
  )

  // Tasks for specific date (calendar)
  function getTasksForDate(date: string) {
    return tasks.value.filter(t => t.dueDate === date)
  }

  // Tasks for date range (week)
  function getTasksForWeek(startDate: string, endDate: string) {
    return tasks.value.filter(t =>
      t.dueDate &&
      !dayjs(t.dueDate).isBefore(startDate, 'day') &&
      !dayjs(t.dueDate).isAfter(endDate, 'day')
    )
  }

  // Tasks for matrix block
  function getTasksForMatrix(blockId: string) {
    return tasks.value.filter(t => !t.completed && t.matrixBlock === blockId)
  }

  // ─── CRUD Operations ─────────────────────────────────────────────────────
  function addTask(taskData: Partial<Task>) {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: taskData.title || '',
      description: taskData.description,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      duration: taskData.duration,
      priority: taskData.priority || 'none',
      completed: false,
      repeat: taskData.repeat || 'none',
      repeatDays: taskData.repeatDays,
      repeatCustom: taskData.repeatCustom,
      attachment: taskData.attachment,
      notification: taskData.notification,
      imageUrl: taskData.imageUrl,
      listId: taskData.listId,
      matrixBlock: taskData.matrixBlock || 'not-urgent-not-important',
      createdAt: new Date().toISOString(),
    }
    tasks.value.unshift(newTask)
    return newTask
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], ...updates }
    }
  }

  function deleteTask(id: string) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tasks.value.splice(idx, 1)
    }
  }

  function completeTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.completedAt = task.completed ? dayjs().format('YYYY-MM-DD') : undefined
    }
  }

  function moveToMatrix(taskId: string, blockId: string) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.matrixBlock = blockId as Task['matrixBlock']
    }
  }

  // Search tasks
  function searchTasks(query: string) {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return tasks.value.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    )
  }

  return {
    tasks,
    overdueTasks,
    todayTasks,
    tomorrowTasks,
    laterTasks,
    noDateTasks,
    completedTasks,
    getTasksForDate,
    getTasksForWeek,
    getTasksForMatrix,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveToMatrix,
    searchTasks,
  }
})
