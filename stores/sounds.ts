import { defineStore } from 'pinia'
import type { ApiSound } from '~/types/mobile-api'
import { apiGet } from '~/utils/api'

export const useSoundsStore = defineStore('sounds', () => {
  const workBackground = ref<ApiSound[]>([])
  const timerEnd = ref<ApiSound[]>([])
  const loading = ref(false)

  async function fetchCategory(category: 'work_background' | 'timer_end') {
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

  function findWorkSound(key: string) {
    return workBackground.value.find(s => s.key === key)
  }

  function findTimerEndSound(key: string) {
    return timerEnd.value.find(s => s.key === key)
  }

  return {
    workBackground,
    timerEnd,
    loading,
    fetchAll,
    fetchCategory,
    findWorkSound,
    findTimerEndSound,
  }
})
