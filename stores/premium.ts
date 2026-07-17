import { defineStore } from 'pinia'
import type {
  ApiPremiumCheckoutResponse,
  ApiPremiumFeature,
  ApiSubscription,
  ApiTariff,
} from '~/types/mobile-api'
import { apiGet, apiPost, getApiErrorMessage } from '~/utils/api'
import { PREMIUM_SUBSCRIPTION } from '~/utils/site-info'

function syncPremiumFlags(subscription: ApiSubscription) {
  const settingsStore = useSettingsStore()
  const authStore = useAuthStore()
  settingsStore.isPremium = subscription.is_premium
  settingsStore.premiumActivatedAt = subscription.premium_until
    || subscription.promo_until
    || null
  if (authStore.user) {
    authStore.user.isPremium = subscription.is_premium
    authStore.user.premiumExpiresAt = subscription.premium_until
      || subscription.promo_until
      || undefined
  }
}

export const usePremiumStore = defineStore('premium', () => {
  const tariffs = ref<ApiTariff[]>([])
  const tariffsLoading = ref(false)
  const tariffsError = ref('')

  const subscription = ref<ApiSubscription | null>(null)
  const subscriptionLoading = ref(false)
  const subscriptionError = ref('')

  const features = ref<ApiPremiumFeature[]>([])
  const featuresLoading = ref(false)

  const selectedTariffCode = ref('monthly')
  const actionLoading = ref(false)

  const selectedTariff = computed(() =>
    tariffs.value.find(t => t.code === selectedTariffCode.value)
    || tariffs.value[0]
    || null,
  )

  const isPremium = computed(() => {
    if (subscription.value) return !!subscription.value.is_premium
    const settingsStore = useSettingsStore()
    const authStore = useAuthStore()
    return !!(settingsStore.isPremium || authStore.user?.isPremium)
  })

  const status = computed(() => subscription.value?.status ?? 'none')

  const expiresAt = computed(() =>
    subscription.value?.premium_until
    || subscription.value?.promo_until
    || useSettingsStore().premiumActivatedAt
    || useAuthStore().user?.premiumExpiresAt
    || null,
  )

  async function fetchTariffs() {
    tariffsLoading.value = true
    tariffsError.value = ''
    try {
      const list = await apiGet<ApiTariff[]>('premium/tariffs/')
      tariffs.value = [...list].sort((a, b) => a.sort_order - b.sort_order)
      if (!tariffs.value.some(t => t.code === selectedTariffCode.value)) {
        selectedTariffCode.value = tariffs.value[0]?.code || 'monthly'
      }
    }
    catch (err) {
      tariffsError.value = getApiErrorMessage(err, 'Не удалось загрузить тарифы')
      throw err
    }
    finally {
      tariffsLoading.value = false
    }
  }

  async function fetchSubscription() {
    subscriptionLoading.value = true
    subscriptionError.value = ''
    try {
      const data = await apiGet<ApiSubscription>('premium/subscription/')
      subscription.value = data
      syncPremiumFlags(data)
      return data
    }
    catch (err) {
      subscriptionError.value = getApiErrorMessage(err, 'Не удалось загрузить подписку')
      throw err
    }
    finally {
      subscriptionLoading.value = false
    }
  }

  async function fetchFeatures() {
    featuresLoading.value = true
    try {
      features.value = await apiGet<ApiPremiumFeature[]>('premium/features/')
    }
    finally {
      featuresLoading.value = false
    }
  }

  async function loadAll() {
    await Promise.allSettled([
      fetchTariffs(),
      fetchSubscription(),
      fetchFeatures(),
    ])
  }

  async function startTrial(tariffCode?: string, recurringConsent = false) {
    const code = tariffCode || selectedTariffCode.value
    actionLoading.value = true
    try {
      const data = await apiPost<ApiSubscription>('premium/trial/', {
        tariff: code,
        recurring_consent: recurringConsent,
        offer_version: PREMIUM_SUBSCRIPTION.offerVersion,
      })
      subscription.value = data
      syncPremiumFlags(data)
      return data
    }
    finally {
      actionLoading.value = false
    }
  }

  async function checkout(
    tariffCode?: string,
    options: { recurringConsent?: boolean } = {},
  ) {
    const code = tariffCode || selectedTariffCode.value
    actionLoading.value = true
    try {
      const response = await apiPost<ApiPremiumCheckoutResponse>('premium/checkout/', {
        tariff: code,
        recurring_consent: options.recurringConsent ?? false,
        offer_version: PREMIUM_SUBSCRIPTION.offerVersion,
      })
      return response
    }
    finally {
      actionLoading.value = false
    }
  }

  async function cancel() {
    actionLoading.value = true
    try {
      const data = await apiPost<ApiSubscription>('premium/cancel/', {})
      subscription.value = data
      syncPremiumFlags(data)
      return data
    }
    finally {
      actionLoading.value = false
    }
  }

  function selectTariff(code: string) {
    selectedTariffCode.value = code
  }

  function reset() {
    tariffs.value = []
    subscription.value = null
    features.value = []
    selectedTariffCode.value = 'monthly'
    tariffsError.value = ''
    subscriptionError.value = ''
  }

  return {
    tariffs,
    tariffsLoading,
    tariffsError,
    subscription,
    subscriptionLoading,
    subscriptionError,
    features,
    featuresLoading,
    selectedTariffCode,
    selectedTariff,
    actionLoading,
    isPremium,
    status,
    expiresAt,
    fetchTariffs,
    fetchSubscription,
    fetchFeatures,
    loadAll,
    startTrial,
    checkout,
    cancel,
    selectTariff,
    reset,
  }
})
