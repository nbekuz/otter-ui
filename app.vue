<template>
  <div class="min-h-dvh " :class="applyDark ? 'dark bg-[#0f1115]' : 'bg-white'">
    <AppGlobalToast />
    <TaskReminderToast />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import 'dayjs/locale/ru'
import dayjs from 'dayjs'
dayjs.locale('ru')

const route = useRoute()
const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.appSettings.theme === 'dark')

/**
 * Marketing/auth pages (/, /login, /register, /legal) are designed as light
 * surfaces. Applying global `.dark` there remaps `text-sber-black` to light
 * while responsive `lg:bg-white` stays white → invisible text.
 * Keep dark styles for the authenticated app (+ teleported modals) only.
 */
const applyDark = computed(
  () => isDark.value && route.path.startsWith('/app'),
)

useHead({
  htmlAttrs: {
    class: computed(() => (applyDark.value ? 'dark' : '')),
  },
  meta: [
    {
      name: 'theme-color',
      content: computed(() => (applyDark.value ? '#0f1115' : '#21A038')),
    },
  ],
})
</script>
