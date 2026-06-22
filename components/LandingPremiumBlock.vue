<template>
  <div
    class="w-full rounded-[24px] border border-yellow-200/80 bg-gradient-to-br from-yellow-50 via-white to-white px-5 py-5 shadow-sm md:px-6 md:py-6"
  >
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
        <Crown class="h-6 w-6" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold uppercase tracking-wide text-yellow-700">
          {{ PREMIUM_LANDING.title }}
        </p>
        <p class="mt-1 text-2xl font-bold text-sber-black md:text-3xl">
          {{ PREMIUM_LANDING.price }} ₽
          <span class="text-sm font-medium text-sber-gray">/ {{ PREMIUM_LANDING.period }}</span>
        </p>
        <p class="mt-2 text-sm text-sber-gray">
          Расширенный доступ к разделам:
        </p>
        <ul class="mt-3 space-y-2">
          <li
            v-for="feature in PREMIUM_LANDING.features"
            :key="feature"
            class="flex items-center gap-2 text-sm font-medium text-sber-black"
          >
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-yellow-100 text-yellow-700">
              <Check class="h-3 w-3" stroke-width="3" />
            </span>
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Crown } from 'lucide-vue-next'
import { PREMIUM_LANDING } from '~/utils/site-info'
</script>
