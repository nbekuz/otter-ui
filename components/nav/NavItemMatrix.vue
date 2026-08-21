<script setup lang="ts">
import { LayoutGrid } from 'lucide-vue-next'

withDefaults(defineProps<{
  mode: 'bottom' | 'sidebar' | 'settings'
  active?: boolean
  isDarkTheme?: boolean
}>(), {
  active: false,
  isDarkTheme: false,
})

const to = '/app/matrix'
const label = 'Матрица'
const { guardPremiumNav } = usePremiumNavGuard()
</script>

<template>
  <span
    v-if="mode === 'settings'"
    class="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden"
    aria-hidden="true"
  >
    <LayoutGrid class="h-full w-full" :stroke-width="2" />
  </span>

  <NuxtLink
    v-else-if="mode === 'bottom'"
    v-slot="{ href, navigate }"
    :to="to"
    custom
  >
    <a
      :href="href"
      class="relative flex min-w-[52px] flex-col items-center gap-1 rounded-xl px-2 py-1 transition-colors active:bg-sber-gray-light"
      :class="active ? 'text-sber-green' : 'text-sber-gray'"
      @click="(e) => { void guardPremiumNav(e, navigate, to) }"
    >
      <span class="inline-flex h-6 w-6 items-center justify-center overflow-hidden">
        <LayoutGrid class="h-full w-full" :stroke-width="active ? 2.25 : 2" />
      </span>
      <span class="text-[10px] font-medium leading-none">{{ label }}</span>
    </a>
  </NuxtLink>

  <NuxtLink
    v-else
    v-slot="{ href, navigate }"
    :to="to"
    custom
  >
    <a
      :href="href"
      class="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors"
      :class="active
        ? 'bg-sber-green text-white shadow-sm'
        : isDarkTheme
          ? 'text-slate-300 hover:bg-[#20242d] hover:text-white'
          : 'text-sber-gray hover:bg-sber-gray-light hover:text-sber-black'"
      @click="(e) => { void guardPremiumNav(e, navigate, to) }"
    >
      <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
        <LayoutGrid class="h-full w-full" :stroke-width="active ? 2.25 : 2" />
      </span>
      <span class="truncate">{{ label }}</span>
    </a>
  </NuxtLink>
</template>
