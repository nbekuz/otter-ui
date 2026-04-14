<template>
  <button
    class="w-full flex items-center px-4 py-3.5 border-b border-sber-gray-light last:border-0 transition-colors"
    :class="isDarkTheme ? 'active:bg-[#20242d]' : 'active:bg-sber-gray-light'"
    @click="$emit('click')"
  >
    <slot name="icon">
      <div class="w-5 h-5 mr-3" />
    </slot>
    <span class="text-sm font-medium flex-1 text-left"
          :class="labelClass || 'text-sber-black'">
      {{ label }}
    </span>
    <span v-if="value" class="text-xs text-sber-gray mr-2">{{ value }}</span>
    <ChevronRight class="w-4 h-4 flex-shrink-0" :class="isDarkTheme ? 'text-slate-500' : 'text-sber-gray-mid'" />
  </button>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

defineProps<{ label: string; value?: string; labelClass?: string }>()
defineEmits<{ click: [] }>()
</script>
