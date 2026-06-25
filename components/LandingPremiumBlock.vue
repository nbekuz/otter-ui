<template>
  <div
    class="w-full rounded-[20px] border border-yellow-200/80 bg-gradient-to-br from-yellow-50 via-white to-white px-4 py-4 shadow-sm lg:rounded-[18px] lg:px-4 lg:py-3.5"
  >
    <div class="flex items-start gap-3">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700 lg:h-9 lg:w-9">
        <Crown class="h-5 w-5 lg:h-4 lg:w-4" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-yellow-700 lg:text-[10px]">
          {{ PREMIUM_LANDING.title }}
        </p>
        <p class="mt-0.5 text-xl font-bold text-sber-black lg:text-2xl">
          {{ PREMIUM_LANDING.price }} ₽
          <span class="text-sm font-medium text-sber-gray">/ {{ PREMIUM_LANDING.period }}</span>
        </p>
        <p class="mt-1 text-xs text-sber-gray lg:text-[13px]">
          Расширенный доступ к разделам:
        </p>
        <ul class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
          <li
            v-for="feature in PREMIUM_LANDING.features"
            :key="feature"
            class="flex items-center gap-1.5 text-sm font-medium text-sber-black lg:text-[13px]"
          >
            <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-yellow-100 text-yellow-700">
              <Check class="h-2.5 w-2.5" stroke-width="3" />
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
