<template>
  <div class="min-h-dvh bg-sber-gray-light px-4 py-10">
    <div class="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-card text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
        !
      </div>
      <h1 class="text-2xl font-bold text-sber-black">Оплата не завершена</h1>
      <p class="mt-3 text-sm leading-relaxed text-sber-gray">
        Платёж отменён или не прошёл. Вы можете попробовать снова или выбрать другой тариф.
      </p>

      <div class="mt-8 space-y-3">
        <NuxtLink to="/app/settings?openPremium=1" class="btn-primary block w-full text-center">
          Попробовать снова
        </NuxtLink>
        <NuxtLink to="/app" class="btn-secondary block w-full text-center">
          На главную
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>
