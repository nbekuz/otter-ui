<template>
  <div>
    <p v-if="featuresLoading || tariffsLoading" class="mb-4 text-center text-sm text-sber-gray">
      Загрузка…
    </p>

    <div v-else class="mb-4 max-h-40 space-y-3 overflow-y-auto">
      <div
        v-for="feat in features"
        :key="feat.key"
        class="flex items-center gap-3"
      >
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
          <Check class="h-3.5 w-3.5 text-yellow-600" />
        </div>
        <span class="text-sm text-sber-black">{{ feat.title }}</span>
      </div>
    </div>

    <template v-if="isPremium">
      <p class="text-center text-sm font-semibold text-sber-green">
        {{ statusLabel }}
      </p>
      <p v-if="expiresLabel" class="mt-1 text-center text-xs text-sber-gray">
        Срок до {{ expiresLabel }}
      </p>
      <p v-if="subscription?.tariff" class="mt-3 text-center text-xs text-sber-gray">
        Тариф: {{ subscription.tariff.title }}
        · {{ formatPrice(subscription.tariff) }}
      </p>
      <p
        v-if="subscription?.recurring_enabled"
        class="mt-4 rounded-2xl bg-sber-gray-light px-4 py-3 text-xs leading-relaxed text-sber-gray"
      >
        Автопродление включено.
        {{ subscription.cancelled_at ? 'Отмена запрошена — доступ сохранится до конца периода.' : '' }}
      </p>
      <button
        v-if="canCancel"
        class="mt-4 w-full rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 disabled:opacity-60"
        type="button"
        :disabled="actionLoading"
        @click="cancelModal = true"
      >
        {{ actionLoading ? 'Отмена…' : 'Отменить автопродление' }}
      </button>
      <button
        class="btn-secondary mt-2 w-full"
        type="button"
        :disabled="refreshLoading"
        @click="$emit('refresh')"
      >
        {{ refreshLoading ? 'Обновление…' : 'Обновить статус' }}
      </button>
    </template>

    <template v-else>
      <div v-if="tariffs.length" class="mb-4 space-y-2">
        <button
          v-for="tariff in tariffs"
          :key="tariff.code"
          type="button"
          class="w-full rounded-2xl border px-4 py-3 text-left transition-colors"
          :class="selectedTariffCode === tariff.code
            ? 'border-yellow-500 bg-yellow-50'
            : 'border-sber-gray-light bg-white'"
          @click="$emit('select-tariff', tariff.code)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-sber-black">{{ tariff.title }}</p>
              <p class="mt-0.5 text-xs text-sber-gray">{{ tariff.description }}</p>
              <p v-if="tariff.promo_days > 0" class="mt-1 text-xs font-medium text-sber-green">
                {{ tariff.promo_days }} дней бесплатно
              </p>
            </div>
            <p class="shrink-0 text-sm font-bold text-sber-black">
              {{ formatPrice(tariff) }}
            </p>
          </div>
        </button>
      </div>

      <div
        v-else
        class="mb-4 rounded-2xl border border-yellow-200/80 bg-yellow-50/60 px-4 py-3"
      >
        <p class="text-sm font-semibold text-sber-black">
          {{ PREMIUM_SUBSCRIPTION.price }} ₽ / {{ PREMIUM_SUBSCRIPTION.period }}
        </p>
        <p class="mt-1 text-xs leading-relaxed text-sber-gray">
          Оплата через Robokassa.
        </p>
      </div>

      <OtterCheckbox v-if="needsRecurringConsent" v-model="recurringConsent" class="mb-4">
        <p class="text-sm leading-relaxed text-sber-gray">
          {{ PREMIUM_SUBSCRIPTION.consentText }}
          <NuxtLink
            :to="`/legal/${PREMIUM_SUBSCRIPTION.offerSlug}`"
            class="font-medium text-sber-green underline"
            @click.stop
          >
            оферты
          </NuxtLink>
        </p>
      </OtterCheckbox>
      <p v-if="consentError" class="mb-3 ml-1 text-xs text-red-500">{{ consentError }}</p>

      <button
        v-if="selectedTariff?.promo_days"
        class="mb-2 w-full rounded-2xl border border-sber-green bg-sber-green-light py-3.5 text-sm font-semibold text-sber-green disabled:opacity-60"
        type="button"
        :disabled="actionLoading"
        @click="handleTrial"
      >
        {{ actionLoading ? 'Активация…' : `Попробовать бесплатно (${selectedTariff.promo_days} дн.)` }}
      </button>

      <button
        class="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white disabled:opacity-60"
        type="button"
        :disabled="actionLoading"
        @click="handleCheckout"
      >
        {{ actionLoading ? 'Открываем оплату…' : payButtonLabel }}
      </button>
      <button
        class="btn-secondary mt-2 w-full"
        type="button"
        :disabled="refreshLoading"
        @click="$emit('refresh')"
      >
        {{ refreshLoading ? 'Проверяем…' : 'Я оплатил — обновить статус' }}
      </button>
      <p class="mt-3 text-center text-xs text-sber-gray">
        После оплаты на Robokassa Premium включается автоматически.
        Если статус не обновился — нажмите «обновить статус».
      </p>
    </template>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="cancelModal" class="overlay" @click="cancelModal = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="cancelModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold text-sber-black">Отменить автопродление?</h3>
          <p class="mt-2 text-sm leading-relaxed text-sber-gray">
            Автоматические списания прекратятся. Доступ к Premium сохранится до конца оплаченного периода.
          </p>
          <button
            class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white disabled:opacity-60"
            type="button"
            :disabled="actionLoading"
            @click="handleCancel"
          >
            {{ actionLoading ? 'Отмена…' : 'Да, отменить' }}
          </button>
          <button class="btn-secondary mt-3 w-full" type="button" @click="cancelModal = false">
            Не отменять
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { ApiPremiumFeature, ApiSubscription, ApiTariff } from '~/types/mobile-api'
import { PREMIUM_SUBSCRIPTION } from '~/utils/site-info'

const props = defineProps<{
  features: ApiPremiumFeature[]
  featuresLoading?: boolean
  tariffs: ApiTariff[]
  tariffsLoading?: boolean
  selectedTariffCode: string
  subscription: ApiSubscription | null
  isPremium: boolean
  expiresLabel?: string
  actionLoading?: boolean
  refreshLoading?: boolean
}>()

const emit = defineEmits<{
  'select-tariff': [code: string]
  trial: [payload: { tariff: string; recurringConsent: boolean }]
  checkout: [payload: { tariff: string; recurringConsent: boolean }]
  refresh: []
  cancel: []
}>()

const recurringConsent = ref(false)
const consentError = ref('')
const cancelModal = ref(false)

const selectedTariff = computed(() =>
  props.tariffs.find(t => t.code === props.selectedTariffCode) || props.tariffs[0] || null,
)

const needsRecurringConsent = computed(() =>
  !!selectedTariff.value?.is_recurring,
)

const canCancel = computed(() =>
  props.isPremium
  && !!props.subscription?.recurring_enabled
  && !props.subscription?.cancelled_at,
)

const statusLabel = computed(() => {
  const status = props.subscription?.status
  if (status === 'trial') return 'Пробный период активен'
  if (status === 'cancelled') return 'Premium активен (автопродление отключено)'
  if (status === 'active') return 'Premium активен'
  return 'Premium активен'
})

const payButtonLabel = computed(() => {
  const tariff = selectedTariff.value
  if (!tariff) return `Оплатить ${PREMIUM_SUBSCRIPTION.price} ₽`
  return `Оплатить ${formatPrice(tariff)}`
})

function formatPrice(tariff: ApiTariff) {
  const amount = Number(tariff.price)
  const price = Number.isFinite(amount)
    ? amount.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
    : tariff.price
  if (tariff.duration_days === 0) return `${price} ₽`
  if (tariff.duration_days >= 365) return `${price} ₽/год`
  return `${price} ₽/мес`
}

watch(recurringConsent, (value) => {
  if (value) consentError.value = ''
})

function ensureConsent(): boolean {
  if (!needsRecurringConsent.value) return true
  if (!recurringConsent.value) {
    consentError.value = 'Подтвердите согласие на автоматические списания'
    return false
  }
  return true
}

function handleTrial() {
  if (!ensureConsent()) return
  const code = selectedTariff.value?.code || props.selectedTariffCode
  emit('trial', { tariff: code, recurringConsent: recurringConsent.value })
}

function handleCheckout() {
  if (!ensureConsent()) return
  const code = selectedTariff.value?.code || props.selectedTariffCode
  emit('checkout', { tariff: code, recurringConsent: recurringConsent.value })
}

function handleCancel() {
  emit('cancel')
}

watch(
  () => props.isPremium,
  (premium) => {
    if (!premium) recurringConsent.value = false
  },
)

watch(
  () => props.actionLoading,
  (loading, wasLoading) => {
    if (wasLoading && !loading) cancelModal.value = false
  },
)
</script>
