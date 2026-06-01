import { defineStore } from 'pinia'
import { defaultPomodoroSettings, type PomodoroSettings } from '~/data/mockData'
import type { ApiPomodoroSession, ApiPomodoroSettings } from '~/types/mobile-api'
import { apiGet, apiPatch, apiPost } from '~/utils/api'

type TimerState = 'idle' | 'running' | 'paused' | 'break'

function apiToPomodoroSettings(data: ApiPomodoroSettings): PomodoroSettings {
  return {
    duration: data.duration_minutes,
    shortBreak: defaultPomodoroSettings.shortBreak,
    longBreak: defaultPomodoroSettings.longBreak,
    sessionsUntilLong: defaultPomodoroSettings.sessionsUntilLong,
    sound: data.timer_end_sound,
    workingSound: data.work_sound,
    showOnLockScreen: data.show_on_lock_screen,
  }
}

function pomodoroToApiPatch(updates: Partial<PomodoroSettings>): Partial<ApiPomodoroSettings> {
  const patch: Partial<ApiPomodoroSettings> = {}
  if (updates.duration !== undefined) patch.duration_minutes = updates.duration
  if (updates.sound !== undefined) patch.timer_end_sound = updates.sound
  if (updates.workingSound !== undefined) patch.work_sound = updates.workingSound
  if (updates.showOnLockScreen !== undefined) patch.show_on_lock_screen = updates.showOnLockScreen
  return patch
}

export const usePomodoroStore = defineStore('pomodoro', () => {
  const settings = ref<PomodoroSettings>({ ...defaultPomodoroSettings })
  const state = ref<TimerState>('idle')
  const secondsLeft = ref(settings.value.duration * 60)
  const selectedTaskId = ref<string | null>(null)
  const sessionCount = ref(0)
  const isBreak = ref(false)
  const activeSessionId = ref<number | null>(null)
  const sessions = ref<ApiPomodoroSession[]>([])

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

  async function fetchSettings() {
    const data = await apiGet<ApiPomodoroSettings>('pomodoro/settings/')
    settings.value = apiToPomodoroSettings(data)
    if (state.value === 'idle') {
      secondsLeft.value = settings.value.duration * 60
    }
  }

  async function fetchSessions() {
    sessions.value = await apiGet<ApiPomodoroSession[]>('pomodoro/sessions/')
    return sessions.value
  }

  async function syncSessionState(nextState: 'running' | 'paused' | 'stopped' | 'completed') {
    if (!activeSessionId.value) return
    const updated = await apiPost<ApiPomodoroSession>(
      `pomodoro/sessions/${activeSessionId.value}/state/`,
      { state: nextState },
    )
    const idx = sessions.value.findIndex(s => s.id === updated.id)
    if (idx === -1) sessions.value.unshift(updated)
    else sessions.value[idx] = updated
  }

  async function ensureSession() {
    if (activeSessionId.value) return
    await startSession(selectedTaskId.value)
  }

  async function start() {
    if (state.value === 'idle' || state.value === 'paused') {
      try {
        await ensureSession()
      }
      catch {
        return
      }
      state.value = 'running'
      void syncSessionState('running')
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      intervalId = setInterval(() => {
        if (secondsLeft.value > 0) {
          secondsLeft.value--
        }
        else {
          pause()
          sessionCount.value++
          state.value = 'idle'
          secondsLeft.value = totalSeconds.value
          void syncSessionState('completed')
          activeSessionId.value = null
        }
      }, 1000)
    }
  }

  function pause() {
    if (state.value === 'running') {
      state.value = 'paused'
      void syncSessionState('paused')
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }

  function stop() {
    state.value = 'idle'
    isBreak.value = false
    void syncSessionState('stopped')
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    secondsLeft.value = settings.value.duration * 60
    activeSessionId.value = null
  }

  async function updateSettings(newSettings: Partial<PomodoroSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    if (state.value === 'idle') {
      secondsLeft.value = settings.value.duration * 60
    }
    const patch = pomodoroToApiPatch(newSettings)
    if (Object.keys(patch).length > 0) {
      const updated = await apiPatch<ApiPomodoroSettings>('pomodoro/settings/', patch)
      settings.value = apiToPomodoroSettings(updated)
    }
  }

  async function startSession(taskId?: string | null) {
    const payload: Record<string, unknown> = {
      duration_minutes: settings.value.duration,
      state: 'idle',
    }
    if (taskId) payload.task = Number(taskId)

    const session = await apiPost<ApiPomodoroSession>('pomodoro/sessions/', payload)
    activeSessionId.value = session.id
    selectedTaskId.value = taskId || null
    sessions.value.unshift(session)
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
    activeSessionId,
    sessions,
    fetchSettings,
    fetchSessions,
    start,
    pause,
    stop,
    updateSettings,
    startSession,
    selectTask,
  }
})
