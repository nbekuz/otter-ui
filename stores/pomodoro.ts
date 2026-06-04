import { defineStore } from 'pinia'
import { defaultPomodoroSettings, type PomodoroSettings } from '~/data/mockData'
import type { ApiPomodoroSession, ApiPomodoroSettings, ApiSound } from '~/types/mobile-api'
import { apiGet, apiPatch, apiPost } from '~/utils/api'
import {
  playBackgroundLoop,
  playSoundOnce,
  stopBackgroundAudio,
} from '~/utils/pomodoro-audio'

type TimerState = 'idle' | 'running' | 'paused' | 'break'

function apiToPomodoroSettings(data: ApiPomodoroSettings): PomodoroSettings {
  return {
    duration: data.duration_minutes,
    shortBreak: data.short_break_minutes ?? defaultPomodoroSettings.shortBreak,
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
  if (updates.shortBreak !== undefined) patch.short_break_minutes = updates.shortBreak
  if (updates.sound !== undefined) patch.timer_end_sound = updates.sound
  if (updates.workingSound !== undefined) patch.work_sound = updates.workingSound
  if (updates.showOnLockScreen !== undefined) patch.show_on_lock_screen = updates.showOnLockScreen
  return patch
}

export const usePomodoroStore = defineStore('pomodoro', () => {
  const settings = ref<PomodoroSettings>({ ...defaultPomodoroSettings })
  const timerEndSoundDetail = ref<ApiSound | null>(null)
  const workSoundDetail = ref<ApiSound | null>(null)
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
      : settings.value.duration * 60,
  )

  const progress = computed(() =>
    1 - secondsLeft.value / totalSeconds.value,
  )

  const displayTime = computed(() => {
    const m = Math.floor(secondsLeft.value / 60).toString().padStart(2, '0')
    const s = (secondsLeft.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  function applySettingsResponse(data: ApiPomodoroSettings) {
    settings.value = apiToPomodoroSettings(data)
    timerEndSoundDetail.value = data.timer_end_sound_detail ?? null
    workSoundDetail.value = data.work_sound_detail ?? null
  }

  function syncBackgroundAudio() {
    if (state.value !== 'running' || isBreak.value) {
      stopBackgroundAudio()
      return
    }
    const key = settings.value.workingSound
    if (key === 'none') {
      stopBackgroundAudio()
      return
    }
    const url = workSoundDetail.value?.audio_url
    if (url) playBackgroundLoop(url)
    else stopBackgroundAudio()
  }

  function playCompletionSound() {
    stopBackgroundAudio()
    const key = settings.value.sound
    if (key === 'none') return
    playSoundOnce(timerEndSoundDetail.value?.audio_url)
  }

  function previewSound(sound: ApiSound | null | undefined) {
    if (!sound || sound.key === 'none') return
    playSoundOnce(sound.audio_url)
  }

  async function fetchSettings() {
    const data = await apiGet<ApiPomodoroSettings>('pomodoro/settings/')
    applySettingsResponse(data)
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
      syncBackgroundAudio()
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
          playCompletionSound()
          state.value = 'idle'
          secondsLeft.value = settings.value.duration * 60
          void syncSessionState('completed')
          activeSessionId.value = null
        }
      }, 1000)
    }
  }

  function pause() {
    if (state.value === 'running') {
      state.value = 'paused'
      stopBackgroundAudio()
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
    stopBackgroundAudio()
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
      applySettingsResponse(updated)
      if (state.value === 'running') syncBackgroundAudio()
    }
  }

  async function setWorkSound(key: string, sound?: ApiSound) {
    if (sound) workSoundDetail.value = sound
    await updateSettings({ workingSound: key })
  }

  async function setTimerEndSound(key: string, sound?: ApiSound) {
    if (sound) timerEndSoundDetail.value = sound
    await updateSettings({ sound: key })
  }

  async function startSession(taskId?: string | null) {
    const payload: Record<string, unknown> = {
      duration_minutes: settings.value.duration,
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
    timerEndSoundDetail,
    workSoundDetail,
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
    setWorkSound,
    setTimerEndSound,
    previewSound,
    startSession,
    selectTask,
    stopBackgroundAudio,
  }
})
