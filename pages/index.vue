<template>
  <div class="min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-white lg:px-0 lg:py-0">
    <div class="w-full lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-16 lg:px-12 xl:px-20">
      <div class="flex flex-1  flex-col items-center justify-start px-6 pt-6 pb-8 lg:items-start lg:px-0 lg:pt-2 lg:pb-6">
        <!-- App Logo & Illustration -->
        <div class="relative mb-8 w-fit lg:origin-left lg:scale-110">
          <BrandLogo size="lg" show-name-from="always" text-class="text-sber-black" />
          <div class="pointer-events-none absolute -top-2 left-[calc(4rem-0.5rem)] h-6 w-6 rounded-full bg-sber-green/20" />
          <div class="pointer-events-none absolute -bottom-1 -left-3 h-4 w-4 rounded-full bg-sber-blue/20" />
        </div>
        <p class="mb-2 max-w-2xl px-4 text-center text-lg leading-relaxed text-sber-gray lg:px-0 lg:text-left lg:text-2xl lg:leading-snug">
          Планировщик задач для тех, кто ценит время
        </p>

        <div class="mt-10 mb-4 grid w-full max-w-3xl grid-cols-1 gap-4 lg:mr-auto lg:max-w-[700px] lg:grid-cols-2 lg:gap-5">
          <div
            v-for="feature in features"
            :key="feature.text"
            class="flex items-start gap-3 rounded-[24px] bg-sber-gray-light px-5 py-5 text-left shadow-sm transition-transform lg:min-h-[136px] lg:hover:-translate-y-0.5"
          >
            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl" :class="feature.bg">
              {{ feature.icon }}
            </div>
            <div class="min-w-0">
              <p class="text-base font-semibold text-sber-black lg:text-lg">{{ feature.title }}</p>
              <p class="mt-1 text-sm leading-6 text-sber-gray lg:text-base">{{ feature.text }}</p>
            </div>
          </div>
        </div>

        <div class="mt-2 w-full max-w-3xl rounded-[24px] border border-sber-gray-mid/25 bg-white px-5 py-4 shadow-sm lg:mr-auto lg:max-w-[700px]">
          <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">
            В одном приложении
          </p>
          <ul class="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <li
              v-for="item in checklistItems"
              :key="item"
              class="flex items-center gap-3 text-sm font-medium text-sber-black lg:text-base"
            >
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-sber-green bg-sber-green/10">
                <Check class="h-3.5 w-3.5 text-sber-green" stroke-width="3" />
              </span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <div class="px-6 pb-10 lg:p-0">
        <div class="rounded-[32px] bg-sber-gray-light p-6 lg:p-8">
          <p class="text-sm font-semibold text-sber-green">Планирование, фокус и порядок</p>
          <h2 class="mt-3 max-w-md text-2xl font-bold text-sber-black">Все основные инструменты для работы с задачами в одном месте.</h2>
          <p class="mt-3 max-w-lg text-sm leading-7 text-sber-gray">
            Ведите списки задач, планируйте время в календаре, расставляйте приоритеты и сохраняйте фокус в течение дня.
          </p>

          <div class="relative mt-6 grid max-w-[430px] grid-cols-2 items-start gap-2 sm:gap-3">
            <div
              v-for="(metric, index) in metrics"
              :key="metric"
              class="flex min-h-[112px] min-w-0 items-center justify-center rounded-2xl bg-white px-2 py-4 text-center shadow-sm sm:px-4"
              :class="{ 'sm:mt-8': index % 2 === 1 }"
            >
              <p
                class="w-full min-w-0 max-w-full text-balance break-anywhere text-center text-[11px] font-bold uppercase leading-tight tracking-tight text-sber-black sm:text-sm sm:leading-snug sm:tracking-wide md:text-base"
              >
                {{ metric }}
              </p>
            </div>
            <div class="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <img :src="logoUrl" alt="Otter logo" class="h-8 w-8 brightness-0" />
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col  items-center gap-3 lg:flex-row lg:flex-wrap lg:justify-center">
            <button class="btn-primary  w-full max-w-[260px] lg:w-auto lg:min-w-[190px] lg:px-7" type="button" @click="$router.push('/register')">
              Создать аккаунт
            </button>
            <button class="btn-outline w-full max-w-[260px] lg:w-auto lg:min-w-[160px] lg:px-7" type="button" @click="$router.push('/login')">
              Войти
            </button>
            <button
              class="flex w-full max-w-[260px] items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light lg:w-auto lg:min-w-[220px] lg:px-7"
              type="button"
              @click="loginWithGoogle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Войти через Google
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import logoUrl from '~/assets/img/logo.svg'

const authStore = useAuthStore()

// Redirect if already logged in
if (authStore.isLoggedIn) {
  navigateTo('/app')
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

const checklistItems = [
  'Списки задач',
  'Календарь',
  'Матрица Эйзенхауэра',
  'Таймер Помодоро',
]

function loginWithGoogle() {
  authStore.loginWithGoogle()
}
</script>
