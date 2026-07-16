<template>
  <div class="min-h-dvh bg-sber-gray-light px-4 py-10">
    <div class="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-card text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sber-green-light text-3xl">
        ✓
      </div>
      <h1 class="text-2xl font-bold text-sber-black">Оплата прошла</h1>
      <p class="mt-3 text-sm leading-relaxed text-sber-gray">
        Robokassa подтвердила платёж. Мы обновляем статус Premium…
      </p>

      <p v-if="loading" class="mt-6 text-sm text-sber-gray">Проверяем подписку…</p>
      <p v-else-if="premiumStore.isPremium" class="mt-6 text-sm font-semibold text-sber-green">
        Premium активен
        <span v-if="expiresLabel"> до {{ expiresLabel }}</span>
      </p>
      <p v-else-if="error" class="mt-6 text-sm text-red-500">{{ error }}</p>
      <p v-else class="mt-6 text-sm text-sber-gray">
        Статус ещё обновляется. Нажмите «Обновить» через несколько секунд.
      </p>

      <div class="mt-8 space-y-3">
        <button
          class="btn-primary w-full"
          type="button"
          :disabled="loading"
          @click="refresh"
        >
          {{ loading ? 'Обновление…' : 'Обновить статус' }}
        </button>
        <NuxtLink to="/app/settings?openPremium=1" class="btn-secondary block w-full text-center">
          К настройкам Premium
        </NuxtLink>
        <NuxtLink to="/app" class="block text-sm font-medium text-sber-green">
          На главную
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getApiErrorMessage } from '~/utils/api'

definePageMeta({ layout: false })

const authStore = useAuthStore()
const premiumStore = usePremiumStore()
const loading = ref(false)
const error = ref('')

const expiresLabel = computed(() => {
  const value = premiumStore.expiresAt
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

async function refresh() {
  if (!authStore.isLoggedIn) {
    error.value = 'Войдите в аккаунт, чтобы проверить Premium'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await premiumStore.fetchSubscription()
  }
  catch (err) {
    error.value = getApiErrorMessage(err, 'Не удалось обновить статус')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void refresh()
})
</script>
