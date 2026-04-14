import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { defaultAppSettings, matrixBlockDefaults, type AppSettings } from '~/data/mockData'

export const useSettingsStore = defineStore('settings', () => {
  const appSettings = useLocalStorage<AppSettings>('otter.app.settings', { ...defaultAppSettings })
  const matrixBlocks = useLocalStorage('otter.matrix.blocks', { ...matrixBlockDefaults })

  function updateSettings(updates: Partial<AppSettings>) {
    appSettings.value = { ...appSettings.value, ...updates }
  }

  function toggleGroup(groupId: string) {
    const groups = appSettings.value.visibleGroups
    const idx = groups.indexOf(groupId)
    if (idx === -1) {
      groups.push(groupId)
    } else {
      groups.splice(idx, 1)
    }
  }

  function isGroupVisible(groupId: string) {
    return appSettings.value.visibleGroups.includes(groupId)
  }

  function updateMatrixBlock(blockId: string, updates: Partial<typeof matrixBlockDefaults['urgent-important']>) {
    const block = matrixBlocks.value[blockId as keyof typeof matrixBlocks.value]
    if (block) {
      Object.assign(block, updates)
    }
  }

  function reorderNavItems(items: string[]) {
    appSettings.value.bottomNavItems = items
  }

  return {
    appSettings,
    matrixBlocks,
    updateSettings,
    toggleGroup,
    isGroupVisible,
    updateMatrixBlock,
    reorderNavItems,
  }
})
