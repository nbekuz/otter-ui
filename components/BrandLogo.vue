<template>
  <div class="inline-flex items-center gap-2" :class="centered ? 'justify-center' : ''">
    <img :src="logoUrl" alt="Otter logo" :class="[logoClass, logoToneClass]" />
    <span :class="[nameClassMap[showNameFrom], textClass, textSizeClass, 'font-bold tracking-tight']">
      {{ name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/img/logo.svg'

const props = withDefaults(defineProps<{
  name?: string
  textClass?: string
  showNameFrom?: 'sm' | 'md' | 'lg' | 'always'
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
}>(), {
  name: 'Otter',
  textClass: 'text-sber-black',
  showNameFrom: 'md',
  size: 'md',
  centered: false,
})

const logoClassMap = {
  sm: 'h-9 w-9 rounded-2xl',
  md: 'h-11 w-11 rounded-2xl',
  lg: 'h-16 w-16 rounded-[22px]',
}

const textSizeClassMap = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl',
}

const nameClassMap = {
  sm: 'hidden sm:inline',
  md: 'hidden md:inline',
  lg: 'hidden lg:inline',
  always: 'inline',
}

const settingsStore = useSettingsStore()
const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')
const logoClass = computed(() => logoClassMap[props.size || 'md'])
const textSizeClass = computed(() => textSizeClassMap[props.size || 'md'])
const logoToneClass = computed(() => {
  const needsLightLogo = props.textClass.includes('text-white') || isDarkTheme.value
  return needsLightLogo ? 'brightness-0 invert opacity-95' : 'brightness-0'
})
</script>
