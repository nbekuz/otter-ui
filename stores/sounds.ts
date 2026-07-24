import { defineStore } from 'pinia'
import type { ApiSound } from '~/types/mobile-api'
import { soundOptions } from '~/data/mockData'
import { apiGet } from '~/utils/api'
import { playSoundOnce } from '~/utils/pomodoro-audio'

function fallbackSounds(category: 'notification' | 'completion'): ApiSound[] {
  return soundOptions.map((s, index) => ({
    key: s.id,
    category,
    title: s.name,
    emoji: s.icon,
    audio_url: null,
    sort_order: index,
  }))
}

export const useSoundsStore = defineStore('sounds', () => {
  const workBackground = ref<ApiSound[]>([])
  const timerEnd = ref<ApiSound[]>([])
  const notification = ref<ApiSound[]>([])
  const completion = ref<ApiSound[]>([])
  const loading = ref(false)
  const feedbackLoaded = ref(false)

  async function fetchCategory(
    category: 'work_background' | 'timer_end' | 'notification' | 'completion',
  ) {
    return apiGet<ApiSound[]>('sounds/', { params: { category } })
  }

  async function fetchAll() {
    loading.value = true
    try {
      const [work, end] = await Promise.all([
        fetchCategory('work_background'),
        fetchCategory('timer_end'),
      ])
      workBackground.value = work.sort((a, b) => a.sort_order - b.sort_order)
      timerEnd.value = end.sort((a, b) => a.sort_order - b.sort_order)
    }
    finally {
      loading.value = false
    }
  }

  async function ensureFeedbackLoaded() {
    if (feedbackLoaded.value
      && (notification.value.length > 0 || completion.value.length > 0)) {
      return
    }
    try {
      const [notify, complete] = await Promise.all([
        fetchCategory('notification'),
        fetchCategory('completion'),
      ])
      notification.value = notify.length
        ? notify.sort((a, b) => a.sort_order - b.sort_order)
        : fallbackSounds('notification')
      completion.value = complete.length
        ? complete.sort((a, b) => a.sort_order - b.sort_order)
        : fallbackSounds('completion')
    }
    catch {
      if (!notification.value.length) notification.value = fallbackSounds('notification')
      if (!completion.value.length) completion.value = fallbackSounds('completion')
    }
    finally {
      feedbackLoaded.value = true
    }
  }

  function findWorkSound(key: string) {
    return workBackground.value.find(s => s.key === key)
  }

  function findTimerEndSound(key: string) {
    return timerEnd.value.find(s => s.key === key)
  }

  function findNotificationSound(key: string) {
    return notification.value.find(s => s.key === key)
      || fallbackSounds('notification').find(s => s.key === key)
  }

  function findCompletionSound(key: string) {
    return completion.value.find(s => s.key === key)
      || fallbackSounds('completion').find(s => s.key === key)
  }

  function soundLabel(key: string, kind: 'notification' | 'completion' = 'notification') {
    const sound = kind === 'completion'
      ? findCompletionSound(key)
      : findNotificationSound(key)
    if (!sound) return soundOptions.find(s => s.id === key)?.name || key
    return `${sound.emoji} ${sound.title}`.trim()
  }

  async function playFeedbackSound(kind: 'notification' | 'completion', key?: string) {
    const settingsStore = useSettingsStore()
    const selected = key
      || (kind === 'notification'
        ? settingsStore.appSettings.notificationSound
        : settingsStore.appSettings.completionSound)
    if (!selected || selected === 'none') return

    await ensureFeedbackLoaded()
    const sound = kind === 'notification'
      ? findNotificationSound(selected)
      : findCompletionSound(selected)
    playSoundOnce(sound?.audio_url)
  }

  function previewSound(sound: ApiSound | null | undefined) {
    if (!sound || sound.key === 'none') return
    playSoundOnce(sound.audio_url)
  }

  return {
    workBackground,
    timerEnd,
    notification,
    completion,
    loading,
    feedbackLoaded,
    fetchAll,
    fetchCategory,
    ensureFeedbackLoaded,
    findWorkSound,
    findTimerEndSound,
    findNotificationSound,
    findCompletionSound,
    soundLabel,
    playFeedbackSound,
    previewSound,
  }
})
