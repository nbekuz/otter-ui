<template>
  <div class="min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10">
    <div class="w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl">
      <div class="hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-sber-green lg:to-sber-blue lg:p-10 lg:text-white">
        <div>
          <NuxtLink to="/" class="inline-flex">
            <img :src="logoUrl" alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0 invert opacity-95" />
          </NuxtLink>
          <h1 class="mt-6 text-4xl font-bold leading-tight">Пару кликов, и задача готова. Ничего лишнего.</h1>
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

      <div class="min-h-dvh bg-white lg:min-h-0">
        <div class="flex items-center px-4 pt-14 pb-4 lg:px-8 lg:pt-8">
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" @click="$router.back()">
            <ChevronLeft class="h-5 w-5 text-sber-black" />
          </button>
          <h1 class="ml-3 text-xl font-bold text-sber-black">Войти</h1>
        </div>

        <div class="flex-1 px-6 pt-6 pb-10 lg:px-8">
          <p class="mb-8 text-sm leading-relaxed text-sber-gray">
            Введите данные вашей учётной записи для входа в Otter
          </p>

          <form class="space-y-4" @submit.prevent="handleLogin">
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
                  @input="clearError('email')"
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
                  placeholder="Введите пароль"
                  autocomplete="current-password"
                  required
                  class="input-field pl-12 pr-12"
                  :class="{ 'border-red-400 bg-red-50': errors.password }"
                  @input="clearError('password')"
                />
                <button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" @click="showPassword = !showPassword">
                  <Eye v-if="!showPassword" class="h-5 w-5 text-sber-gray" />
                  <EyeOff v-else class="h-5 w-5 text-sber-gray" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 ml-1 text-xs text-red-500">{{ errors.password }}</p>
            </div>

            <div class="flex justify-end">
              <button class="text-sm font-medium text-sber-green" type="button" @click="showForgot = true">
                Забыли пароль?
              </button>
            </div>

            <button class="btn-primary mx-auto block w-full max-w-[320px]" type="submit">
              Войти
            </button>
          </form>

          <div class="mt-4 flex items-start gap-2 rounded-2xl bg-sber-blue-light px-4 py-3">
            <Info class="mt-0.5 h-4 w-4 flex-shrink-0 text-sber-blue" />
            <p class="text-xs text-sber-blue">
              Тестовый вход: введите любой email и пароль
            </p>
          </div>

          <div class="my-6 text-center">
            <span class="text-sm text-sber-gray">Нет аккаунта? </span>
            <NuxtLink to="/register" class="text-sm font-semibold text-sber-green">Создать</NuxtLink>
          </div>

          <div class="mb-6 flex items-center gap-4">
            <div class="h-px flex-1 bg-sber-gray-mid" />
            <span class="text-sm text-sber-gray">или</span>
            <div class="h-px flex-1 bg-sber-gray-mid" />
          </div>

          <button
            class="mx-auto flex w-full max-w-[320px] items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light"
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

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showForgot" class="overlay" @click="closeForgotModal" />
      </Transition>
      <Transition name="modal">
        <form v-if="showForgot" class="app-modal px-6 py-6" @click.stop @submit.prevent="sendReset">
          <h3 class="mb-2 text-lg font-bold text-sber-black">Восстановление пароля</h3>
          <p class="mb-4 text-sm text-sber-gray">
            Введите ваш email, и мы отправим ссылку для сброса пароля
          </p>
          <div class="relative mb-2">
            <Mail class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
            <input
              v-model="forgotEmail"
              type="email"
              placeholder="Email"
              autocomplete="email"
              class="input-field pl-12"
              :class="{ 'border-red-400 bg-red-50': forgotError }"
              @input="forgotError = ''"
            />
          </div>
          <p v-if="forgotError" class="mb-3 ml-1 text-xs text-red-500">{{ forgotError }}</p>
          <button class="btn-primary" type="submit">Отправить</button>
          <button class="btn-secondary mt-3" type="button" @click="closeForgotModal">Отмена</button>
          <div v-if="resetSent" class="mt-3 text-center text-sm font-medium text-sber-green">
            ✓ Письмо отправлено на {{ forgotEmail }}
          </div>
        </form>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Info } from 'lucide-vue-next'
import logoUrl from '~/assets/img/logo.svg'

const authStore = useAuthStore()
const metrics = ['планируйте', 'контролируйте', 'фокусируйтесь', 'управляйте']
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const showForgot = ref(false)
const forgotEmail = ref('')
const forgotError = ref('')
const resetSent = ref(false)

function clearError(field: 'email' | 'password') {
  errors[field] = ''
}

function validate() {
  errors.email = ''
  errors.password = ''

  if (!form.email.trim() || !form.email.includes('@')) {
    errors.email = 'Введите корректный email'
  }

  if (!form.password.trim()) {
    errors.password = 'Введите пароль'
  }

  return !errors.email && !errors.password
}

function handleLogin() {
  if (!validate()) return
  authStore.login(form.email.trim(), form.password)
}

function loginWithGoogle() {
  authStore.loginWithGoogle()
}

function sendReset() {
  forgotError.value = ''

  if (!forgotEmail.value.trim() || !forgotEmail.value.includes('@')) {
    forgotError.value = 'Введите корректный email'
    return
  }

  resetSent.value = true
  setTimeout(() => {
    closeForgotModal()
  }, 2000)
}

function closeForgotModal() {
  showForgot.value = false
  resetSent.value = false
  forgotError.value = ''
}
</script>
