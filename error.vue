<template>
  <div class="min-h-dvh bg-sber-gray-light px-6 py-10 lg:flex lg:items-center lg:justify-center">
    <div class="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:p-10">
      <div class="mb-8 lg:mb-0">
        <p class="text-sm font-semibold text-sber-green">{{ statusLabel }}</p>
        <h1 class="mt-3 text-4xl font-bold tracking-tight text-sber-black lg:text-5xl">{{ statusCode }}</h1>
        <h2 class="mt-4 text-2xl font-bold text-sber-black">{{ title }}</h2>
        <p class="mt-4 max-w-md text-sm leading-7 text-sber-gray">
          {{ description }}
        </p>
      </div>

      <div class="rounded-[28px] bg-sber-gray-light p-6">
        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Что можно сделать</p>
          <ul class="mt-4 space-y-3 text-sm text-sber-black">
            <li>Проверьте адрес страницы и попробуйте открыть её снова.</li>
            <li v-if="statusCode === 404">Вернитесь на главную или откройте рабочее пространство.</li>
            <li v-else>Обновите страницу. Если ошибка повторится, попробуйте снова чуть позже.</li>
          </ul>
        </div>

        <div class="mt-5 flex flex-col gap-3">
          <button class="btn-primary" @click="goHome">
            На главную
          </button>
          <button class="btn-secondary" @click="goApp">
            Открыть приложение
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const statusCode = computed(() => props.error?.statusCode || 500)
const statusLabel = computed(() => statusCode.value === 404 ? 'Страница не найдена' : 'Ошибка приложения')
const title = computed(() => statusCode.value === 404 ? 'Такой страницы нет.' : 'Что-то пошло не так.')
const description = computed(() =>
  statusCode.value === 404
    ? 'Возможно, адрес изменился или страница была перенесена в другой раздел приложения.'
    : 'Во время открытия страницы произошла ошибка. Мы уже подготовили безопасный выход на главную страницу.'
)

function goHome() {
  clearError({ redirect: '/' })
}

function goApp() {
  clearError({ redirect: '/app' })
}
</script>
