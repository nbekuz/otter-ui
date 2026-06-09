<template>
  <div class="min-h-dvh bg-white md:px-2 lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10">
    <div class="w-full max-w-full overflow-hidden lg:grid lg:max-w-5xl lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px] lg:bg-white lg:shadow-xl">
      <div class="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-sber-gray-light lg:bg-white lg:p-10 lg:text-sber-black">
        <div>
          <NuxtLink to="/" class="inline-flex">
            <img :src="logoUrl" alt="Otter logo" class="h-11 w-11 rounded-2xl brightness-0" />
          </NuxtLink>
          <h1 class="mt-6 text-4xl font-bold leading-tight text-sber-black">Пару кликов, и задача готова. Ничего лишнего.</h1>
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

      <div class="min-h-dvh bg-white lg:min-h-0">
        <div class="page-header-top flex items-center px-4 pb-4 sm:px-6 lg:px-8 lg:pt-8">
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" @click="$router.back()">
            <ChevronLeft class="h-5 w-5 text-sber-black" />
          </button>
          <h1 class="ml-3 text-xl font-bold text-sber-black">Войти</h1>
        </div>

        <div class="flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8">
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

            <div class="flex flex-wrap items-center justify-between gap-3">
              <OtterCheckbox
                v-model="rememberMe"
                align="center"
                class="min-w-0 flex-1"
                @update:model-value="onRememberToggle"
              >
                <span class="cursor-default select-none text-sm text-sber-black">Запомнить</span>
              </OtterCheckbox>
              <button class="shrink-0 text-sm font-medium text-sber-green" type="button" @click="openForgotModal">
                Забыли пароль?
              </button>
            </div>

            <button class="btn-primary mx-auto block w-full sm:max-w-[320px]" type="submit">
              Войти
            </button>
          </form>

          <div class="my-6 text-center">
            <span class="text-sm text-sber-gray">Нет аккаунта? </span>
            <NuxtLink to="/register" class="text-sm font-semibold text-sber-green">Создать</NuxtLink>
          </div>

          <div class="mb-6 flex items-center gap-4">
            <div class="h-px flex-1 bg-sber-gray-mid" />
            <span class="text-sm text-sber-gray">или</span>
            <div class="h-px flex-1 bg-sber-gray-mid" />
          </div>

          <p v-if="googleError" class="mx-auto mb-2 max-w-full text-center text-xs text-red-500 sm:max-w-[320px]">{{ googleError }}</p>
          <button
            class="mx-auto flex w-full max-w-full items-center justify-center gap-3 rounded-2xl border border-sber-gray-mid bg-white py-4 font-semibold text-sber-black transition-colors active:bg-sber-gray-light disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-[320px]"
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
    </div>

    <Teleport to="body">
      <Transition name="fade-notification">
        <div
          v-if="pageToast.visible"
          class="fixed bottom-6 left-1/2 z-[200] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-0"
          role="status"
        >
          <div class="flex items-center gap-3 rounded-2xl border border-sber-green bg-sber-green-light px-4 py-3 shadow-lg">
            <CheckCircle class="h-5 w-5 flex-shrink-0 text-sber-green" />
            <p class="text-sm font-medium text-sber-green">
              {{ pageToast.message }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showForgot" class="overlay" @click="closeForgotModal" />
      </Transition>
      <Transition name="modal">
        <form v-if="showForgot" class="app-modal px-6 py-6" @click.stop @submit.prevent="onForgotSubmit">
          <h3 class="mb-2 text-lg font-bold text-sber-black">Восстановление пароля</h3>

          <template v-if="forgotStep === 'email'">
            <p class="mb-4 text-sm text-sber-gray">
              Введите email — мы отправим письмо с кодом (например: «ВАШ КОД 310696»).
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
          </template>

          <template v-else-if="forgotStep === 'code'">
            <p class="mb-2 text-sm text-sber-gray">
              Код отправлен на <span class="font-medium text-sber-black">{{ forgotEmail }}</span>
            </p>
            <p class="mb-3 text-xs text-sber-gray">Введите 6 цифр из письма (только код).</p>
            <div class="relative mb-2">
              <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
              <input
                v-model="forgotCode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="000000"
                autocomplete="one-time-code"
                class="input-field pl-12 tracking-widest"
                :class="{ 'border-red-400 bg-red-50': forgotError }"
                @input="onForgotCodeInput"
              />
            </div>
            <button class="btn-secondary mb-3 w-full" type="button" @click="goBackForgotEmail">
              Изменить email
            </button>
          </template>

          <template v-else>
            <p class="mb-2 text-sm text-sber-gray">
              Новый пароль для <span class="font-medium text-sber-black">{{ forgotEmail }}</span>
            </p>
            <p class="mb-3 text-xs text-sber-gray">8–20 символов: заглавная и строчная латинские буквы, цифра и один специальный символ.</p>
            <div class="relative mb-2">
              <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
              <input
                v-model="forgotNewPassword"
                :type="showForgotNewPw ? 'text' : 'password'"
                placeholder="Новый пароль"
                autocomplete="new-password"
                class="input-field pl-12 pr-12"
                :class="{ 'border-red-400 bg-red-50': forgotPwError }"
                @input="forgotPwError = ''"
              />
              <button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" @click="showForgotNewPw = !showForgotNewPw">
                <Eye v-if="!showForgotNewPw" class="h-5 w-5 text-sber-gray" />
                <EyeOff v-else class="h-5 w-5 text-sber-gray" />
              </button>
            </div>
            <div class="relative mb-2">
              <Lock class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sber-gray" />
              <input
                v-model="forgotConfirmPassword"
                :type="showForgotConfirmPw ? 'text' : 'password'"
                placeholder="Повторите пароль"
                autocomplete="new-password"
                class="input-field pl-12 pr-12"
                :class="{ 'border-red-400 bg-red-50': forgotPwError }"
                @input="forgotPwError = ''"
              />
              <button class="absolute right-4 top-1/2 -translate-y-1/2" type="button" @click="showForgotConfirmPw = !showForgotConfirmPw">
                <Eye v-if="!showForgotConfirmPw" class="h-5 w-5 text-sber-gray" />
                <EyeOff v-else class="h-5 w-5 text-sber-gray" />
              </button>
            </div>
            <p v-if="forgotPwError" class="mb-2 ml-1 text-xs text-red-500">{{ forgotPwError }}</p>
          </template>

          <p v-if="forgotError" class="mb-3 ml-1 text-xs text-red-500">{{ forgotError }}</p>

          <button class="btn-primary w-full" type="submit" :disabled="forgotLoading">
            {{ forgotSubmitLabel }}
          </button>
          <button class="btn-secondary mt-3 w-full" type="button" :disabled="forgotLoading" @click="closeForgotModal">
            Отмена
          </button>
        </form>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-vue-next'
import logoUrl from '~/assets/img/logo.svg'
import { validateNewPassword } from '~/utils/password-policy'
import { clearRememberedLogin, readRememberedLogin, writeRememberedLogin } from '~/utils/auth-session'

const authStore = useAuthStore()
const metrics = ['планируйте', 'контролируйте', 'фокусируйтесь', 'управляйте']
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const rememberMe = ref(false)
const googleLoading = ref(false)
const googleError = ref('')

/** Parol tiklangach toast — `navigateTo` sahifani qayta ochsa ham saqlanadi */
const pendingPasswordResetToast = useState<string | null>('loginPasswordResetToast', () => null)

const pageToast = reactive({
  visible: false,
  message: '',
})
let pageToastTimer: ReturnType<typeof setTimeout> | null = null

function showPageToast(message: string) {
  if (pageToastTimer) {
    clearTimeout(pageToastTimer)
    pageToastTimer = null
  }
  pageToast.message = message
  pageToast.visible = true
  pageToastTimer = setTimeout(() => {
    pageToast.visible = false
    pageToastTimer = null
  }, 5000)
}

function flushPendingPasswordToast() {
  const msg = pendingPasswordResetToast.value
  if (!msg) return
  pendingPasswordResetToast.value = null
  showPageToast(msg)
}

function onRememberToggle() {
  if (!rememberMe.value)
    clearRememberedLogin()
}

onMounted(() => {
  flushPendingPasswordToast()

  const saved = readRememberedLogin()
  if (saved) {
    form.email = saved.email
    form.password = saved.password
    rememberMe.value = true
  }

  const pending = useState<string | null>('googleBackendError', () => null)
  if (pending.value) {
    googleError.value = pending.value
    pending.value = null
  }
})

onUnmounted(() => {
  if (pageToastTimer) clearTimeout(pageToastTimer)
})

const showForgot = ref(false)
const forgotStep = ref<'email' | 'code' | 'new-password'>('email')
const forgotEmail = ref('')
const forgotCode = ref('')
const forgotResetToken = ref('')
const forgotNewPassword = ref('')
const forgotConfirmPassword = ref('')
const forgotError = ref('')
const forgotPwError = ref('')
const forgotLoading = ref(false)
const showForgotNewPw = ref(false)
const showForgotConfirmPw = ref(false)

const forgotSubmitLabel = computed(() => {
  if (forgotLoading.value) return 'Подождите...'
  if (forgotStep.value === 'email') return 'Отправить код'
  if (forgotStep.value === 'code') return 'Подтвердить код'
  return 'Сохранить пароль'
})

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

async function handleLogin() {
  if (!validate()) return
  try {
    await authStore.login(form.email.trim(), form.password)
    if (rememberMe.value)
      writeRememberedLogin(form.email.trim(), form.password)
    else
      clearRememberedLogin()
  }
  catch (err: any) {
    errors.password = normalizeErrorDetail(err?.response?.data?.detail, "Login xatoligi. Qayta urinib ko'ring.")
  }
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

function onForgotCodeInput() {
  forgotError.value = ''
  forgotCode.value = forgotCode.value.replace(/\D/g, '').slice(0, 6)
}

function goBackForgotEmail() {
  forgotStep.value = 'email'
  forgotCode.value = ''
  forgotResetToken.value = ''
  forgotError.value = ''
}

async function onForgotSubmit() {
  forgotError.value = ''
  forgotPwError.value = ''

  if (forgotStep.value === 'email') {
    if (!forgotEmail.value.trim() || !forgotEmail.value.includes('@')) {
      forgotError.value = 'Введите корректный email'
      return
    }
    forgotLoading.value = true
    try {
      await authStore.forgotPassword(forgotEmail.value.trim())
      forgotStep.value = 'code'
    }
    catch (err: any) {
      forgotError.value = normalizeErrorDetail(err?.response?.data?.detail, 'Не удалось отправить код')
    }
    finally {
      forgotLoading.value = false
    }
    return
  }

  if (forgotStep.value === 'code') {
    const code = forgotCode.value.trim()
    if (code.length !== 6) {
      forgotError.value = 'Введите 6 цифр кода из письма'
      return
    }
    forgotLoading.value = true
    try {
      const { reset_token } = await authStore.forgotPasswordVerify(forgotEmail.value.trim(), code)
      forgotResetToken.value = reset_token
      forgotStep.value = 'new-password'
    }
    catch (err: any) {
      forgotError.value = normalizeErrorDetail(err?.response?.data?.detail, 'Неверный код или срок истёк')
    }
    finally {
      forgotLoading.value = false
    }
    return
  }

  const pwMsg = validateNewPassword(forgotNewPassword.value)
  if (pwMsg) {
    forgotPwError.value = pwMsg
    return
  }
  if (forgotNewPassword.value !== forgotConfirmPassword.value) {
    forgotPwError.value = 'Пароли не совпадают'
    return
  }
  if (!forgotResetToken.value) {
    forgotError.value = 'Сессия сброса устарела. Начните заново.'
    return
  }

  forgotLoading.value = true
  try {
    const res = await authStore.forgotPasswordConfirm(forgotResetToken.value, forgotNewPassword.value)
    const detail = res?.detail
    const message = typeof detail === 'string'
      ? detail
      : Array.isArray(detail)
        ? detail.map(String).join(' ')
        : 'Пароль обновлён'
    pendingPasswordResetToast.value = message
    closeForgotModal()
    await navigateTo({ path: '/login', replace: true })
    await nextTick()
    flushPendingPasswordToast()
  }
  catch (err: any) {
    const payload = err?.response?.data
    const pwErrors = Array.isArray(payload?.new_password) ? payload.new_password : []
    forgotPwError.value = pwErrors.join(' ') || payload?.detail || 'Не удалось сохранить пароль'
  }
  finally {
    forgotLoading.value = false
  }
}

function resetForgotForm() {
  forgotStep.value = 'email'
  forgotEmail.value = ''
  forgotCode.value = ''
  forgotResetToken.value = ''
  forgotNewPassword.value = ''
  forgotConfirmPassword.value = ''
  forgotError.value = ''
  forgotPwError.value = ''
  forgotLoading.value = false
  showForgotNewPw.value = false
  showForgotConfirmPw.value = false
}

function openForgotModal() {
  resetForgotForm()
  showForgot.value = true
}

function closeForgotModal() {
  resetForgotForm()
  showForgot.value = false
}
</script>

<style scoped>
.fade-notification-enter-active,
.fade-notification-leave-active {
  transition: all 0.3s ease;
}
.fade-notification-enter-from,
.fade-notification-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
