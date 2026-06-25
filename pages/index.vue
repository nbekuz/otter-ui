<template>
  <div class="flex min-h-dvh w-full flex-col overflow-x-hidden bg-white">
    <div class="flex flex-1 flex-col">
      <div
        class="mx-auto w-full max-w-[1380px] px-4 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8 lg:grid lg:grid-cols-[1.06fr_0.94fr] lg:items-start lg:gap-10 lg:px-8 lg:py-6 xl:gap-12 xl:px-12 xl:py-8"
      >
        <div class="flex w-full flex-col items-stretch justify-start">
          <div class="relative mb-4 w-fit self-center md:self-start lg:mb-3">
            <BrandLogo size="md" show-name-from="always" text-class="text-sber-black lg:text-2xl" />
          </div>
          <p class="mb-0 w-full text-center text-base leading-relaxed text-sber-gray md:text-left lg:max-w-2xl lg:text-lg lg:leading-snug">
            Планировщик задач для тех, кто ценит время
          </p>

          <div class="mt-5 grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:mt-4 lg:gap-4">
            <div
              v-for="feature in features"
              :key="feature.text"
              class="flex items-start gap-3 rounded-[20px] bg-sber-gray-light px-4 py-3.5 text-left shadow-sm lg:min-h-[108px] lg:rounded-[20px] lg:px-4 lg:py-4"
            >
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg lg:h-10 lg:w-10" :class="feature.bg">
                {{ feature.icon }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-sber-black lg:text-base">{{ feature.title }}</p>
                <p class="mt-0.5 text-xs leading-5 text-sber-gray lg:text-sm">{{ feature.text }}</p>
              </div>
            </div>
          </div>

          <LandingPremiumBlock class="mt-3 lg:mt-4" />
        </div>

        <div class="w-full max-w-none pt-4 pb-2 md:pt-6 lg:pt-0 lg:pb-0">
          <div class="w-full rounded-[28px] bg-sber-gray-light p-5 md:p-6 lg:min-h-full lg:p-6 xl:p-7">
            <p class="text-sm font-semibold text-sber-green">Планирование, фокус и порядок</p>
            <h2 class="mt-2 text-xl font-bold text-sber-black lg:text-2xl lg:leading-tight">
              Все основные инструменты для работы с задачами в одном месте.
            </h2>
            <p class="mt-2 text-sm leading-6 text-sber-gray lg:max-w-md lg:text-[15px]">
              Ведите списки задач, планируйте время в календаре, расставляйте приоритеты и сохраняйте фокус в течение дня.
            </p>

            <div class="relative mt-4 grid grid-cols-2 items-start gap-2 sm:gap-3 lg:mt-5">
              <div
                v-for="(metric, index) in metrics"
                :key="metric"
                class="flex min-h-[88px] min-w-0 items-center justify-center rounded-2xl bg-white px-2 py-3 text-center shadow-sm sm:px-3 lg:min-h-[92px] lg:px-4 lg:py-4"
                :class="{ 'sm:mt-6 lg:mt-6': index % 2 === 1 }"
              >
                <p class="w-full min-w-0 text-balance text-center text-[11px] font-bold uppercase leading-tight tracking-tight text-sber-black sm:text-sm lg:text-sm">
                  {{ metric }}
                </p>
              </div>
              <div class="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light lg:h-[72px] lg:w-[72px]">
                <div class="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm lg:h-12 lg:w-12">
                  <img :src="logoUrl" :alt="`${BRAND_NAME} logo`" class="h-7 w-7 brightness-0 lg:h-7 lg:w-7" />
                </div>
              </div>
            </div>

            <div class="mt-4 flex w-full flex-col items-center gap-2 lg:mt-4">
              <div class="flex w-full flex-wrap justify-center gap-2">
                <button
                  class="btn-primary !w-auto min-w-0 shrink px-4 sm:px-6"
                  type="button"
                  @click="$router.push('/register')"
                >
                  Создать аккаунт
                </button>
                <button
                  class="btn-outline !w-auto min-w-0 shrink px-4 sm:px-6"
                  type="button"
                  @click="$router.push('/login')"
                >
                  Войти
                </button>
              </div>
              <div class="flex w-full flex-col items-center gap-2">
                <p v-if="googleError" class="w-full text-center text-xs text-red-500">{{ googleError }}</p>
                <button
                  class="flex !w-auto max-w-full items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white px-4 py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-light disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                  type="button"
                  :disabled="googleLoading"
                  @click="handleGoogleLogin"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {{ googleLoading ? 'Вход…' : 'Войти через Google' }}
                </button>
              </div>
            </div>

            <div class="mt-4 lg:mt-3">
              <LegalAcceptanceText />
            </div>
          </div>
        </div>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/img/logo.svg'
import { BRAND_NAME } from '~/utils/site-info'

const authStore = useAuthStore()
const googleLoading = ref(false)
const googleError = ref('')

onMounted(() => {
  const pending = useState<string | null>('googleBackendError', () => null)
  if (pending.value) {
    googleError.value = pending.value
    pending.value = null
  }
})

if (import.meta.client && authStore.isLoggedIn) {
  try {
    await authStore.fetchMyProfile()
    if (authStore.requiresProfileFill) {
      navigateTo('/profile-fill')
    }
    else {
      navigateTo('/app')
    }
  }
  catch {
    authStore.logout()
  }
}

const features = [
  {
    icon: '✅',
    bg: 'bg-green-100',
    title: 'Списки задач',
    text: 'Собирайте задачи по срокам, спискам и приоритетам',
  },
  {
    icon: '📅',
    bg: 'bg-blue-100',
    title: 'Календарь',
    text: 'Смотрите планы на день, неделю, месяц и год',
  },
  {
    icon: '🎯',
    bg: 'bg-purple-100',
    title: 'Матрица Эйзенхауэра',
    text: 'Разделяйте задачи по важности и срочности',
  },
  {
    icon: '🍅',
    bg: 'bg-red-100',
    title: 'Таймер Помодоро',
    text: 'Чередуйте работу и перерывы без лишних настроек',
  },
]

const metrics = ['планируйте', 'контролируйте', 'фокусируйтесь', 'управляйте']

function normalizeErrorDetail(detail: unknown, fallback: string): string {
  if (typeof detail === 'string')
    return detail
  if (Array.isArray(detail)) {
    const parts = detail
      .map(item => (typeof item === 'string' ? item : ''))
      .filter(Boolean)
    if (parts.length)
      return parts.join(' ')
  }
  return fallback
}

async function handleGoogleLogin() {
  googleError.value = ''
  if (googleLoading.value) return
  googleLoading.value = true
  try {
    const { loginWithGooglePopup } = useFirebaseAuth()
    const firebase_token = await loginWithGooglePopup()
    await authStore.loginWithGoogle({ firebase_token })
  }
  catch (err: any) {
    googleError.value = normalizeErrorDetail(
      err?.response?.data?.detail,
      err?.message || 'Вход через Google не удался',
    )
  }
  finally {
    googleLoading.value = false
  }
}
</script>
