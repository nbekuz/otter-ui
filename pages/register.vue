<template>
  <div class="flex min-h-dvh flex-col bg-white md:px-2 lg:bg-sber-gray-light lg:px-6 lg:py-10">
    <div class="flex flex-1 items-center justify-center">
    <div class="w-full max-w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl">
      <div class="min-h-dvh bg-white lg:order-2 lg:min-h-0">
        <div class="page-header-top flex items-center px-4 pb-4 sm:px-6 lg:px-8 lg:pt-8">
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" @click="$router.back()">
            <ChevronLeft class="h-5 w-5 text-sber-black" />
          </button>
          <h1 class="ml-3 text-xl font-bold text-sber-black">Создать аккаунт</h1>
        </div>

        <div class="px-4 pt-6 pb-10 sm:px-6 lg:px-8">
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
                  placeholder="Введите пароль"
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

            <OtterCheckbox v-model="rememberMe" @update:model-value="onRememberToggle">
              <span class="text-sm leading-relaxed text-sber-gray">Запомнить email и пароль на этом устройстве</span>
            </OtterCheckbox>

            <div>
              <OtterCheckbox v-model="agreeTerms" @update:model-value="onTermsToggle">
                <p class="text-sm leading-relaxed text-sber-gray">
                  Я соглашаюсь с
                  <NuxtLink to="/legal/terms-of-use" class="font-medium text-sber-green underline" @click.stop>
                    Пользовательским соглашением
                  </NuxtLink>
                  и
                  <NuxtLink to="/legal/privacy-policy" class="font-medium text-sber-green underline" @click.stop>
                    Политикой конфиденциальности
                  </NuxtLink>
                </p>
              </OtterCheckbox>
              <p v-if="errors.terms" class="mt-2 ml-1 text-xs text-red-500">{{ errors.terms }}</p>
            </div>
            <div class="flex w-full items-center lg:justify-center">

              <button class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 lg:max-w-[360px]" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Отправка...' : 'Создать аккаунт' }}
              </button>
            </div>

          </form>

          <Transition name="fade-notification">
            <div v-if="toast.visible" class="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3" :class="toast.type === 'success' ? 'border border-sber-green bg-sber-green-light' : 'border border-red-300 bg-red-50'">
              <CheckCircle class="h-5 w-5 flex-shrink-0" :class="toast.type === 'success' ? 'text-sber-green' : 'text-red-500'" />
              <p class="text-sm font-medium" :class="toast.type === 'success' ? 'text-sber-green' : 'text-red-600'">
                {{ toast.message }}
              </p>
            </div>
          </Transition>

          <div class="mt-6 text-center lg:mx-auto lg:max-w-[360px]">
            <span class="text-sm text-sber-gray">Уже есть аккаунт? </span>
            <NuxtLink to="/login" class="text-sm font-semibold text-sber-green">Войти</NuxtLink>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black">
        <div>
          <NuxtLink to="/" class="inline-flex">
            <img :src="logoUrl" alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0" />
          </NuxtLink>
          <h2 class="mt-6 text-4xl font-bold leading-tight text-sber-black">Пару кликов, и задача готова. Ничего лишнего.</h2>
          <p class="mt-4 max-w-md text-sm leading-7 text-sber-gray">
            Теперь еще удобнее для обзора задач, календаря и планов на день.
          </p>
        </div>

        <div class="rounded-[28px] bg-sber-gray-light p-5">
          <p class="text-xs uppercase tracking-[0.2em] text-sber-gray">Что внутри</p>
          <div class="relative mt-4 grid grid-cols-2 items-start gap-3">
            <div class="pointer-events-none absolute left-1/2 top-3 z-0 h-[calc(100%-1.5rem)] w-2.5 -translate-x-1/2 rounded-full bg-sber-gray-light/80" />
            <div class="pointer-events-none absolute left-3 top-1/2 z-0 h-2.5 w-[calc(100%-1.5rem)] -translate-y-1/2 rounded-full bg-sber-gray-light/80" />
            <div
              v-for="(metric, index) in metrics"
              :key="metric"
              class="relative z-10 flex min-h-[108px] items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-sber-black shadow-sm"
              :class="{ 'mt-7': index % 2 === 1 }"
            >
              <p class="text-sm font-bold uppercase tracking-wide">{{ metric }}</p>
            </div>
            <div class="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sber-gray-light/95">
              <div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-sm">
                <img :src="logoUrl" alt="Otter logo" class="h-8 w-8 brightness-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-vue-next'
import logoUrl from '~/assets/img/logo.svg'
import { validateNewPassword } from '~/utils/password-policy'
import { clearRememberedLogin, readRememberedLogin, writeRememberedLogin } from '~/utils/auth-session'

const authStore = useAuthStore()
const metrics = ['планируйте', 'контролируйте', 'фокусируйтесь', 'управляйте']

const form = reactive({ email: '', password: '', confirmPassword: '' })
const errors = reactive({ email: '', password: '', confirmPassword: '', terms: '' })
const showPassword = ref(false)
const showConfirm = ref(false)
const agreeTerms = ref(false)
const rememberMe = ref(false)
const isSubmitting = ref(false)
const toast = reactive({
  visible: false,
  type: 'success' as 'success' | 'error',
  message: '',
})

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
  const pwRule = validateNewPassword(form.password)
  if (pwRule) {
    errors.password = pwRule
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

function showToast(type: 'success' | 'error', message: string) {
  toast.visible = true
  toast.type = type
  toast.message = message
}

function onRememberToggle() {
  if (!rememberMe.value)
    clearRememberedLogin()
}

function onTermsToggle(accepted: boolean) {
  if (accepted)
    errors.terms = ''
}

onMounted(() => {
  const saved = readRememberedLogin()
  if (saved) {
    form.email = saved.email
    form.password = saved.password
    form.confirmPassword = saved.password
    rememberMe.value = true
  }
})

async function handleRegister() {
  if (!validate()) return
  if (isSubmitting.value) return

  toast.visible = false
  isSubmitting.value = true

  try {
    await authStore.register(form.email.trim(), form.password, '', '', { navigateOnSuccess: false })
    if (rememberMe.value)
      writeRememberedLogin(form.email.trim(), form.password)
    else
      clearRememberedLogin()
    showToast('success', 'Аккаунт создан! Проверьте почту для подтверждения.')
    setTimeout(() => {
      navigateTo('/profile-fill')
    }, 1200)
  }
  catch (err: any) {
    const payload = err?.response?.data
    const passwordErrors = Array.isArray(payload?.password) ? payload.password : []
    const emailErrors = Array.isArray(payload?.email) ? payload.email : []
    const detailError = typeof payload?.detail === 'string' ? payload.detail : ''

    if (passwordErrors.length > 0) {
      errors.password = passwordErrors.join(' ')
    }
    if (emailErrors.length > 0) {
      errors.email = emailErrors.join(' ')
    }

    const apiMessage = [
      ...passwordErrors,
      ...emailErrors,
      detailError,
    ].filter(Boolean).join(' ')

    showToast('error', apiMessage || err?.message || 'Не удалось зарегистрироваться. Попробуйте снова.')
  }
  finally {
    isSubmitting.value = false
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
