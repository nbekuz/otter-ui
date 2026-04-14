import { defineStore } from 'pinia'
import { defaultPomodoroSettings, type PomodoroSettings } from '~/data/mockData'

type TimerState = 'idle' | 'running' | 'paused' | 'break'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const settings = ref<PomodoroSettings>({ ...defaultPomodoroSettings })
  const state = ref<TimerState>('idle')
  const secondsLeft = ref(settings.value.duration * 60)
  const selectedTaskId = ref<string | null>(null)
  const sessionCount = ref(0)
  const isBreak = ref(false)

  let intervalId: ReturnType<typeof setInterval> | null = null

  const totalSeconds = computed(() =>
    isBreak.value
      ? (sessionCount.value % settings.value.sessionsUntilLong === 0
          ? settings.value.longBreak
          : settings.value.shortBreak) * 60
      : settings.value.duration * 60
  )

  const progress = computed(() =>
    1 - secondsLeft.value / totalSeconds.value
  )

  const displayTime = computed(() => {
    const m = Math.floor(secondsLeft.value / 60).toString().padStart(2, '0')
    const s = (secondsLeft.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  function start() {
    if (state.value === 'idle' || state.value === 'paused') {
      state.value = 'running'
      intervalId = setInterval(() => {
        if (secondsLeft.value > 0) {
          secondsLeft.value--
        } else {
          // Timer finished
          pause()
          sessionCount.value++
          state.value = 'idle'
          secondsLeft.value = totalSeconds.value
        }
      }, 1000)
    }
  }

  function pause() {
    if (state.value === 'running') {
      state.value = 'paused'
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }

  function stop() {
    state.value = 'idle'
    isBreak.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    secondsLeft.value = settings.value.duration * 60
  }

  function updateSettings(newSettings: Partial<PomodoroSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    if (state.value === 'idle') {
      secondsLeft.value = settings.value.duration * 60
    }
  }

  function selectTask(taskId: string | null) {
    selectedTaskId.value = taskId
  }

  return {
    settings,
    state,
    secondsLeft,
    totalSeconds,
    progress,
    displayTime,
    selectedTaskId,
    sessionCount,
    isBreak,
    start,
    pause,
    stop,
    updateSettings,
    selectTask,
  }
})
