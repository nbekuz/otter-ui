<template>
  <div class="min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10">
    <div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl">
      <div class="min-h-dvh bg-white lg:order-2 lg:min-h-0">
        <div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8">
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" @click="$router.back()">
            <ChevronLeft class="h-5 w-5 text-sber-black" />
          </button>
          <h1 class="ml-3 text-xl font-bold text-sber-black">Создать аккаунт</h1>
        </div>

        <div class="px-6 pt-6 pb-10 lg:px-8">
          <form class="space-y-4" novalidate @submit.prevent="handleRegister">
            <div>
              <label class="mb-2 block text-sm font-medium text-sber-gray">Email</label>
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="example@mail.ru"
                  autocomplete="email"
                  required
                  class="input-field pl-12"
                  :class="{ 'border-red-400 bg-red-50': errors.email }"
                  @input="errors.email = ''"
                />
              </div>
              <p v-if="errors.email" class="mt-1 ml-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-sber-gray">Пароль</label>
              <div class="relative">
                <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Минимум 6 символов"
                  autocomplete="new-password"
                  required
                  class="input-field pl-12 pr-12"
                  :class="{ 'border-red-400 bg-red-50': errors.password }"
                  @input="errors.password = ''"
                />
                <button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" @click="showPassword = !showPassword">
                  <Eye v-if="!showPassword" class="h-5 w-5 text-sber-gray" />
                  <EyeOff v-else class="h-5 w-5 text-sber-gray" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 ml-1 text-xs text-red-500">{{ errors.password }}</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-sber-gray">Повторите пароль</label>
              <div class="relative">
                <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  placeholder="Повторите пароль"
                  autocomplete="new-password"
                  required
                  class="input-field pl-12 pr-12"
                  :class="{ 'border-red-400 bg-red-50': errors.confirmPassword || (form.confirmPassword && form.confirmPassword !== form.password) }"
                  @input="errors.confirmPassword = ''"
                />
                <button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" @click="showConfirm = !showConfirm">
                  <Eye v-if="!showConfirm" class="h-5 w-5 text-sber-gray" />
                  <EyeOff v-else class="h-5 w-5 text-sber-gray" />
                </button>
              </div>
              <p v-if="errors.confirmPassword || (form.confirmPassword && form.confirmPassword !== form.password)" class="mt-1 ml-1 text-xs text-red-500">
                {{ errors.confirmPassword || 'Пароли не совпадают' }}
              </p>
            </div>

            <div>
              <div class="flex items-start gap-3">
                <button
                  class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2"
                  :class="agreeTerms ? 'border-sber-green bg-sber-green' : 'border-sber-gray-mid'"
                  type="button"
                  @click="toggleTerms"
                >
                  <Check v-if="agreeTerms" class="h-4 w-4 text-white" />
                </button>
                <p class="text-sm leading-relaxed text-sber-gray">
                  Я соглашаюсь с
                  <span class="font-medium text-sber-green">Пользовательским соглашением</span>
                  и
                  <span class="font-medium text-sber-green">Политикой конфиденциальности</span>
                </p>
              </div>
              <p v-if="errors.terms" class="mt-2 ml-1 text-xs text-red-500">{{ errors.terms }}</p>
            </div>
            <div class="w-full flex lg:justify-center items-center">

              <button class="btn-primary  lg:max-w-[360px] " type="submit">
                Создать аккаунт
              </button>
            </div>

          </form>

          <Transition name="fade-notification">
            <div v-if="showSuccess" class="mt-4 flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3">
              <CheckCircle class="h-5 w-5 flex-shrink-0 text-sber-green" />
              <p class="text-sm font-medium text-sber-green">
                Аккаунт создан! Проверьте почту для подтверждения.
              </p>
            </div>
          </Transition>

          <div class="mt-6 text-center lg:mx-auto lg:max-w-[360px]">
            <span class="text-sm text-sber-gray">Уже есть аккаунт? </span>
            <NuxtLink to="/login" class="text-sm font-semibold text-sber-green">Войти</NuxtLink>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-sber-green lg:to-sber-blue lg:p-10 lg:text-white">
        <div>
          <NuxtLink to="/" class="inline-flex">
            <img :src="logoUrl" alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0 invert opacity-95" />
          </NuxtLink>
          <h2 class="mt-6 text-4xl font-bold leading-tight">Пару кликов, и задача готова. Ничего лишнего.</h2>
          <p class="mt-4 max-w-md text-sm leading-7 text-white/85">
            Теперь еще удобнее для обзора задач, календаря и планов на день.
          </p>
        </div>

        <div class="rounded-[28px] bg-white/10 p-5 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/70">Что внутри</p>
          <div class="relative mt-4 grid grid-cols-2 items-start gap-3">
            <div class="pointer-events-none absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-3 -translate-x-1/2 rounded-full bg-sber-gray-light/95" />
            <div class="pointer-events-none absolute left-3 top-1/2 h-3 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/95" />
            <div
              v-for="(metric, index) in metrics"
              :key="metric"
              class="flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"
              :class="{ 'mt-7': index % 2 === 1 }"
            >
              <p class="text-sm font-bold uppercase tracking-wide">{{ metric }}</p>
            </div>
            <div class="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <img :src="logoUrl" alt="Otter logo" class="h-8 w-8 brightness-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Check, CheckCircle } from 'lucide-vue-next'
import logoUrl from '~/assets/img/logo.svg'

const authStore = useAuthStore()
const metrics = ['планируйте', 'контролируйте', 'фокусируйтесь', 'управляйте']

const form = reactive({ email: '', password: '', confirmPassword: '' })
const errors = reactive({ email: '', password: '', confirmPassword: '', terms: '' })
const showPassword = ref(false)
const showConfirm = ref(false)
const agreeTerms = ref(false)
const showSuccess = ref(false)

function validate() {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.terms = ''

  let valid = true
  if (!form.email.trim() || !form.email.includes('@')) {
    errors.email = 'Введите корректный email'
    valid = false
  }
  if (form.password.length < 6) {
    errors.password = 'Пароль должен состоять минимум из 6 символов'
    valid = false
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    valid = false
  }
  if (!agreeTerms.value) {
    errors.terms = 'Подтвердите согласие с условиями'
    valid = false
  }
  return valid
}

function handleRegister() {
  if (!validate()) return
  showSuccess.value = true
  setTimeout(() => {
    authStore.register(form.email.trim(), form.password)
  }, 1500)
}

function toggleTerms() {
  agreeTerms.value = !agreeTerms.value
  if (agreeTerms.value) {
    errors.terms = ''
  }
}
</script>

<style scoped>
.fade-notification-enter-active, .fade-notification-leave-active {
  transition: all 0.3s ease;
}
.fade-notification-enter-from, .fade-notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
