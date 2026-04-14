<template>
  <div class="min-h-dvh" :class="isDark ? 'dark bg-[#0f1115]' : 'bg-sber-gray-light'">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import 'dayjs/locale/ru'
import dayjs from 'dayjs'
dayjs.locale('ru')

const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.appSettings.theme === 'dark')
</script>
