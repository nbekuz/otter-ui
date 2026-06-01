import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import {
  defaultAppSettings,
  matrixBlockDefaults,
  type AppSettings,
} from '~/data/mockData'
import type {
  ApiAppSettings,
  ApiHelpItem,
  ApiLegalDocument,
  ApiMatrixSetting,
  ApiPremiumFeature,
} from '~/types/mobile-api'
import { apiGet, apiPatch, apiPost, getApiErrorMessage } from '~/utils/api'

export interface HelpFaqItem {
  id: string
  question: string
  answer: string
  open: boolean
}

function apiToAppSettings(data: ApiAppSettings): AppSettings {
  const visibleGroups: string[] = []
  if (data.show_overdue) visibleGroups.push('overdue')
  if (data.show_today) visibleGroups.push('today')
  if (data.show_tomorrow) visibleGroups.push('tomorrow')
  if (data.show_later) visibleGroups.push('later')
  if (data.show_no_deadline) visibleGroups.push('nodate')
  if (data.show_completed) visibleGroups.push('completed')

  return {
    language: data.language,
    theme: defaultAppSettings.theme,
    visibleGroups,
    notifications: true,
    vibration: data.vibration_enabled,
    notificationSound: data.notification_sound,
    completionSound: data.completion_sound,
    bottomNavItems: data.bottom_tabs?.length
      ? [...data.bottom_tabs]
      : [...defaultAppSettings.bottomNavItems],
  }
}

function appSettingsToApiPatch(updates: Partial<AppSettings>): Partial<ApiAppSettings> {
  const patch: Partial<ApiAppSettings> = {}

  if (updates.language !== undefined) patch.language = updates.language
  if (updates.vibration !== undefined) patch.vibration_enabled = updates.vibration
  if (updates.notificationSound !== undefined) patch.notification_sound = updates.notificationSound
  if (updates.completionSound !== undefined) patch.completion_sound = updates.completionSound
  if (updates.bottomNavItems !== undefined) patch.bottom_tabs = [...updates.bottomNavItems]

  if (updates.visibleGroups !== undefined) {
    patch.show_overdue = updates.visibleGroups.includes('overdue')
    patch.show_today = updates.visibleGroups.includes('today')
    patch.show_tomorrow = updates.visibleGroups.includes('tomorrow')
    patch.show_later = updates.visibleGroups.includes('later')
    patch.show_no_deadline = updates.visibleGroups.includes('nodate')
    patch.show_completed = updates.visibleGroups.includes('completed')
  }

  return patch
}

function apiMatrixToBlocks(settings: ApiMatrixSetting[]) {
  const blocks = { ...matrixBlockDefaults }
  for (const item of settings) {
    const uiId = item.block
      .replace('urgent_important', 'urgent-important')
      .replace('not_urgent_important', 'not-urgent-important')
      .replace('urgent_not_important', 'urgent-not-important')
      .replace('not_urgent_not_important', 'not-urgent-not-important') as keyof typeof blocks

    if (!blocks[uiId]) continue
    blocks[uiId] = {
      ...blocks[uiId],
      title: item.title || blocks[uiId].title,
      dateFilter: item.date_filter ? item.date_filter.split(',').filter(Boolean) : blocks[uiId].dateFilter,
      priorityFilter: item.allowed_priorities?.length
        ? item.allowed_priorities.map(p => (p === 'critical' ? 'high' : p))
        : blocks[uiId].priorityFilter,
    }
  }
  return blocks
}

function syncPremiumToAuth(settings: ApiAppSettings) {
  const authStore = useAuthStore()
  if (authStore.user) {
    authStore.user.isPremium = settings.is_premium
    authStore.user.premiumExpiresAt = settings.premium_activated_at || undefined
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const appSettings = useLocalStorage<AppSettings>('otter.app.settings', { ...defaultAppSettings })
  const matrixBlocks = useLocalStorage('otter.matrix.blocks', { ...matrixBlockDefaults })
  const isPremium = ref(false)
  const premiumActivatedAt = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')

  const helpFaq = ref<HelpFaqItem[]>([])
  const helpFaqLoading = ref(false)
  const helpFaqError = ref('')

  const premiumFeatures = ref<ApiPremiumFeature[]>([])
  const premiumFeaturesLoading = ref(false)

  const legalDocuments = ref<ApiLegalDocument[]>([])
  const legalDocumentsLoading = ref(false)
  const legalDocumentsError = ref('')

  async function fetchHelpFaq() {
    helpFaqLoading.value = true
    helpFaqError.value = ''
    try {
      const items = await apiGet<ApiHelpItem[]>('help/')
      helpFaq.value = items.map((item, index) => ({
        id: `faq-${index}`,
        question: item.question,
        answer: item.answer,
        open: false,
      }))
    }
    catch (err) {
      helpFaqError.value = getApiErrorMessage(err, 'Не удалось загрузить FAQ')
      throw err
    }
    finally {
      helpFaqLoading.value = false
    }
  }

  async function sendHelpMessage(message: string, screenshot?: File) {
    if (screenshot) {
      const formData = new FormData()
      formData.append('message', message)
      formData.append('screenshot', screenshot)
      return apiPost('help/', formData)
    }
    return apiPost('help/', { message })
  }

  async function callStubAction() {
    const response = await apiPost<{ detail: string }>('settings/stub-action/')
    return response.detail || 'Уже разрабатываем, скоро будет готово :)'
  }

  async function fetchPremiumFeatures() {
    premiumFeaturesLoading.value = true
    try {
      premiumFeatures.value = await apiGet<ApiPremiumFeature[]>('premium/features/')
    }
    finally {
      premiumFeaturesLoading.value = false
    }
  }

  async function fetchLegalDocuments() {
    legalDocumentsLoading.value = true
    legalDocumentsError.value = ''
    try {
      legalDocuments.value = await apiGet<ApiLegalDocument[]>('legal/documents/')
    }
    catch (err) {
      legalDocumentsError.value = getApiErrorMessage(err, 'Не удалось загрузить документы')
      throw err
    }
    finally {
      legalDocumentsLoading.value = false
    }
  }

  async function fetchFromApi() {
    loading.value = true
    error.value = ''
    try {
      const [settings, matrixSettings] = await Promise.all([
        apiGet<ApiAppSettings>('settings/'),
        apiGet<ApiMatrixSetting[]>('matrix/settings/'),
      ])
      appSettings.value = {
        ...appSettings.value,
        ...apiToAppSettings(settings),
      }
      matrixBlocks.value = apiMatrixToBlocks(matrixSettings)
      isPremium.value = settings.is_premium
      premiumActivatedAt.value = settings.premium_activated_at
      syncPremiumToAuth(settings)
    }
    catch (err) {
      error.value = getApiErrorMessage(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateSettings(updates: Partial<AppSettings>) {
    const next = { ...appSettings.value, ...updates }
    appSettings.value = next

    const patch = appSettingsToApiPatch(updates)
    if (Object.keys(patch).length === 0) return

    const updated = await apiPatch<ApiAppSettings>('settings/', patch)
    appSettings.value = {
      ...next,
      ...apiToAppSettings(updated),
    }
    isPremium.value = updated.is_premium
    premiumActivatedAt.value = updated.premium_activated_at
    syncPremiumToAuth(updated)
  }

  async function toggleGroup(groupId: string) {
    const groups = [...appSettings.value.visibleGroups]
    const idx = groups.indexOf(groupId)
    if (idx === -1) groups.push(groupId)
    else groups.splice(idx, 1)
    await updateSettings({ visibleGroups: groups })
  }

  function isGroupVisible(groupId: string) {
    return appSettings.value.visibleGroups.includes(groupId)
  }

  async function updateMatrixBlock(
    blockId: string,
    updates: Partial<typeof matrixBlockDefaults['urgent-important']>,
  ) {
    const block = matrixBlocks.value[blockId as keyof typeof matrixBlocks.value]
    if (!block) return
    Object.assign(block, updates)

    const apiBlock = blockId.replace(/-/g, '_')
    await apiPatch<ApiMatrixSetting>('matrix/settings/', {
      block: apiBlock,
      title: updates.title ?? block.title,
      allowed_priorities: updates.priorityFilter || block.priorityFilter,
      date_filter: Array.isArray(updates.dateFilter)
        ? updates.dateFilter.join(',')
        : (updates.dateFilter as string | undefined) ?? block.dateFilter?.join(','),
    })
  }

  async function reorderNavItems(items: string[]) {
    await updateSettings({ bottomNavItems: items })
  }

  async function premiumCheckout(tariff = 'monthly') {
    return apiPost<{ checkout_url: string; provider: string }>('premium/checkout/', { tariff })
  }

  async function premiumActivate() {
    const updated = await apiPost<ApiAppSettings>('premium/activate/')
    appSettings.value = { ...appSettings.value, ...apiToAppSettings(updated) }
    isPremium.value = updated.is_premium
    premiumActivatedAt.value = updated.premium_activated_at
    syncPremiumToAuth(updated)
    return updated
  }

  return {
    appSettings,
    matrixBlocks,
    isPremium,
    premiumActivatedAt,
    loading,
    error,
    helpFaq,
    helpFaqLoading,
    helpFaqError,
    premiumFeatures,
    premiumFeaturesLoading,
    legalDocuments,
    legalDocumentsLoading,
    legalDocumentsError,
    fetchHelpFaq,
    sendHelpMessage,
    callStubAction,
    fetchPremiumFeatures,
    fetchLegalDocuments,
    fetchFromApi,
    updateSettings,
    toggleGroup,
    isGroupVisible,
    updateMatrixBlock,
    reorderNavItems,
    premiumCheckout,
    premiumActivate,
  }
})
