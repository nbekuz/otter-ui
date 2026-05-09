<template>
  <div class="page-container bg-sber-gray-light">
    <div class="bg-white px-4 pt-14 pb-4 shadow-sm lg:px-6">
      <div class="flex items-center gap-3">
        <button class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light" type="button" @click="$router.back()">
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <div>
          <p class="text-xs text-sber-gray">Аккаунт</p>
          <h1 class="text-xl font-bold text-sber-black">Профиль</h1>
        </div>
      </div>
    </div>

    <div class="mx-auto w-full max-w-5xl px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:gap-4 lg:px-6">
      <div class="space-y-4">
        <div class="rounded-[28px] bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
            <button class="relative self-start" type="button" @click="avatarModal = true">
              <div class="h-24 w-24 overflow-hidden rounded-[28px]" :class="authStore.user?.isPremium ? 'ring-2 ring-yellow-400 ring-offset-2' : ''">
                <div v-if="!authStore.user?.avatar" class="flex h-full w-full items-center justify-center bg-sber-green">
                  <span class="text-3xl font-bold text-white">{{ initials }}</span>
                </div>
                <img v-else :src="authStore.user.avatar" class="h-full w-full object-cover" />
              </div>
              <div class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sber-green shadow-sm">
                <Camera class="h-4 w-4 text-white" />
              </div>
            </button>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="truncate text-2xl font-bold text-sber-black">{{ authStore.user?.name || 'Пользователь' }}</h2>
                <span v-if="authStore.user?.isPremium" class="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-700">
                  ⭐ ПРЕМИУМ
                </span>
              </div>
              <p class="mt-1 truncate text-sm text-sber-gray">{{ authStore.user?.email }}</p>
              <div v-if="authStore.user?.isPremium && premiumExpiresLabel" class="mt-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-700">
                  ⭐ ПРЕМИУМ
                </span>
                <span class="text-xs font-medium text-yellow-700">
                  Срок до {{ premiumExpiresLabel }}
                </span>
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <button class="rounded-2xl bg-sber-green px-4 py-2.5 text-sm font-semibold text-white" type="button" @click="openNameModal">
                  Изменить имя
                </button>
                <button class="rounded-2xl bg-sber-gray-light px-4 py-2.5 text-sm font-semibold text-sber-black" type="button" @click="passwordModal = true">
                  Сменить пароль
                </button>
              </div>
            </div>
          </div>
        </div>

      

      </div>

      <div class="mt-4 space-y-4 lg:mt-0">
        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Аккаунт</p>
          <div class="mt-3 space-y-3">
            <button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button" @click="navigateTo('/app/settings')">
              <Settings class="h-5 w-5 text-sber-gray" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-sber-black">Настройки приложения</p>
                <p class="text-xs text-sber-gray">Уведомления, звуки и видимые разделы</p>
              </div>
              <ChevronRight class="h-4 w-4 text-sber-gray" />
            </button>

            <button class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left" type="button" @click="premiumModal = true">
              <Crown class="h-5 w-5 text-yellow-500" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-sber-black">Otter Premium</p>
                <p class="text-xs text-sber-gray">Расширенные возможности и синхронизация</p>
              </div>
              <ChevronRight class="h-4 w-4 text-sber-gray" />
            </button>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Безопасность</p>
          <div class="mt-3 rounded-2xl border border-sber-gray-light p-4">
            <p class="text-sm font-semibold text-sber-black">Сессия на этом устройстве</p>
            <p class="mt-1 text-xs leading-5 text-sber-gray">
              При выходе токены и локальные данные входа на этом устройстве будут удалены.
            </p>
          </div>
          <button class="mt-4 w-full rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white" type="button" @click="showLogout = true">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="nameModal" class="overlay" @click="closeNameModal" />
      </Transition>
      <Transition name="modal">
        <div v-if="nameModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-1 text-lg font-bold text-sber-black">Имя и фамилия</h3>
          <p class="mb-4 text-xs text-sber-gray">Сохранение через API (multipart, как в документации).</p>
          <label class="mb-2 block text-sm font-medium text-sber-gray">Имя</label>
          <input
            v-model="editFirstName"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': nameErrors.first }"
            placeholder="Имя"
            autocomplete="given-name"
            @input="nameErrors.first = ''"
          />
          <p v-if="nameErrors.first" class="mb-3 ml-1 text-xs text-red-500">{{ nameErrors.first }}</p>
          <label class="mb-2 block text-sm font-medium text-sber-gray">Фамилия</label>
          <input
            v-model="editLastName"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': nameErrors.last }"
            placeholder="Фамилия"
            autocomplete="family-name"
            @input="nameErrors.last = ''"
          />
          <p v-if="nameErrors.last" class="mb-3 ml-1 text-xs text-red-500">{{ nameErrors.last }}</p>
          <button class="btn-primary mb-3 w-full" type="button" :disabled="nameSaving" @click="saveProfileNames">
            {{ nameSaving ? 'Сохранение…' : 'Сохранить' }}
          </button>
          <button class="btn-secondary w-full" type="button" :disabled="nameSaving" @click="closeNameModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="passwordModal" class="overlay" @click="closePasswordModal" />
      </Transition>
      <Transition name="modal">
        <div v-if="passwordModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-2 text-lg font-bold text-sber-black">Сменить пароль</h3>
          <p class="mb-4 text-xs text-sber-gray">Новый: 8–20 символов, Aa + цифра + спецсимвол (!, @ …).</p>
          <input
            v-model="passwordForm.next"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': passwordErrors.next }"
            type="password"
            placeholder="Новый пароль"
            required
            @input="passwordErrors.next = ''"
          />
          <p v-if="passwordErrors.next" class="mb-3 ml-1 text-xs text-red-500">{{ passwordErrors.next }}</p>
          <input
            v-model="passwordForm.confirm"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': passwordErrors.confirm }"
            type="password"
            placeholder="Повторите новый пароль"
            required
            @input="passwordErrors.confirm = ''"
          />
          <p v-if="passwordErrors.confirm" class="mb-3 ml-1 text-xs text-red-500">{{ passwordErrors.confirm }}</p>
          <button class="btn-primary mb-3 w-full" type="button" :disabled="passwordSaving" @click="savePassword">
            {{ passwordSaving ? 'Сохранение…' : 'Сохранить' }}
          </button>
          <button class="btn-secondary w-full" type="button" :disabled="passwordSaving" @click="closePasswordModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="avatarModal" class="overlay" @click="closeAvatarModal" />
      </Transition>
      <Transition name="modal">
        <div v-if="avatarModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-1 text-lg font-bold text-sber-black">Выберите аватар</h3>
          <p class="mb-4 text-xs text-sber-gray">Фото с устройства или готовый шаблон ниже.</p>

          <input
            ref="avatarFileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleDeviceAvatarChange"
          />
          <button
            class="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-sber-gray-mid bg-sber-gray-light py-3.5 text-sm font-semibold text-sber-black transition-colors active:bg-sber-gray-mid/30 disabled:opacity-50"
            type="button"
            :disabled="avatarUploading"
            @click="pickDeviceAvatar"
          >
            <Image class="h-5 w-5 text-sber-gray" />
            {{ avatarUploading ? 'Загрузка…' : 'Выбрать фото с устройства' }}
          </button>
          <p v-if="avatarUploadError" class="mb-3 text-xs text-red-500">{{ avatarUploadError }}</p>

          <button class="btn-secondary mt-1 w-full" type="button" @click="closeAvatarModal">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="premiumModal" class="overlay" @click="premiumModal = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="premiumModal" class="app-modal px-5 py-6" @click.stop>
          <div class="text-center">
            <div class="mb-3 text-4xl">⭐</div>
            <h3 class="text-xl font-bold text-sber-black">Otter Premium</h3>
            <p class="mt-2 text-sm text-sber-gray">Синхронизация между устройствами, расширенная статистика и больше гибкости в планировании.</p>
          </div>
          <button class="mt-6 w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 font-bold text-white" type="button" @click="activatePremium">
            Подключить Premium
          </button>
          <button class="btn-secondary mt-3" type="button" @click="premiumModal = false">Позже</button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showLogout" class="overlay" @click="showLogout = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="showLogout" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold text-sber-black">Выйти из аккаунта?</h3>
          <p class="mt-2 text-sm text-sber-gray">Вы сможете войти снова в любой момент.</p>
          <button class="mt-5 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white" type="button" @click="authStore.logout()">
            Выйти
          </button>
          <button class="btn-secondary mt-3" type="button" @click="showLogout = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Camera, Image, Settings, Crown, ChevronRight } from 'lucide-vue-next'
import { validateNewPassword } from '~/utils/password-policy'

definePageMeta({ layout: 'app' })

const authStore = useAuthStore()

const nameModal = ref(false)
const passwordModal = ref(false)
const avatarModal = ref(false)
const premiumModal = ref(false)
const showLogout = ref(false)

const avatarFileInputRef = ref<HTMLInputElement | null>(null)
const avatarUploading = ref(false)
const avatarUploadError = ref('')

const editFirstName = ref('')
const editLastName = ref('')
const nameErrors = reactive({ first: '', last: '' })
const nameSaving = ref(false)
const passwordSaving = ref(false)

const passwordForm = reactive({
  next: '',
  confirm: '',
})

const passwordErrors = reactive({
  next: '',
  confirm: '',
})

const initials = computed(() => {
  const a = authStore.profileFirstName.trim().charAt(0)
  const b = authStore.profileLastName.trim().charAt(0)
  if (a || b)
    return `${a}${b}`.toUpperCase()
  const n = authStore.user?.name?.trim() || ''
  return n.charAt(0).toUpperCase() || 'U'
})

const premiumExpiresLabel = computed(() => {
  const expiresAt = authStore.user?.premiumExpiresAt
  if (!expiresAt) return ''

  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

function openNameModal() {
  nameErrors.first = ''
  nameErrors.last = ''
  editFirstName.value = authStore.profileFirstName.trim()
  editLastName.value = authStore.profileLastName.trim()
  if ((!editFirstName.value || !editLastName.value) && authStore.user?.name?.trim()) {
    const parts = authStore.user.name.trim().split(/\s+/).filter(Boolean)
    if (!editFirstName.value) editFirstName.value = parts[0] || ''
    if (!editLastName.value) editLastName.value = parts.slice(1).join(' ')
  }
  nameModal.value = true
}

function closeNameModal() {
  nameErrors.first = ''
  nameErrors.last = ''
  nameModal.value = false
}

async function saveProfileNames() {
  nameErrors.first = ''
  nameErrors.last = ''
  const first = editFirstName.value.trim()
  const last = editLastName.value.trim()
  let valid = true
  if (!first) {
    nameErrors.first = 'Введите имя'
    valid = false
  }
  if (!last) {
    nameErrors.last = 'Введите фамилию'
    valid = false
  }
  if (!valid || nameSaving.value) return

  nameSaving.value = true
  try {
    await authStore.updateProfile(first, last)
    closeNameModal()
  }
  catch (err: any) {
    const payload = err?.response?.data
    const f = Array.isArray(payload?.first_name) ? payload.first_name.join(' ') : ''
    const l = Array.isArray(payload?.last_name) ? payload.last_name.join(' ') : ''
    const detail = typeof payload?.detail === 'string' ? payload.detail : ''
    if (f) nameErrors.first = f
    if (l) nameErrors.last = l
    if (!f && !l && detail)
      nameErrors.first = detail
    if (!f && !l && !detail)
      nameErrors.first = 'Не удалось сохранить'
  }
  finally {
    nameSaving.value = false
  }
}

function closePasswordModal() {
  passwordForm.next = ''
  passwordForm.confirm = ''
  passwordErrors.next = ''
  passwordErrors.confirm = ''
  passwordModal.value = false
}

async function savePassword() {
  passwordErrors.next = ''
  passwordErrors.confirm = ''

  const nextRule = validateNewPassword(passwordForm.next)
  if (nextRule) {
    passwordErrors.next = nextRule
  }
  if (passwordForm.next !== passwordForm.confirm) {
    passwordErrors.confirm = 'Пароли не совпадают'
  }

  if (passwordErrors.next || passwordErrors.confirm) return

  passwordSaving.value = true
  try {
    const result = await authStore.changePassword(passwordForm.next.trim())
    closePasswordModal()
    const { showToast } = useAppToast()
    const msg = typeof result?.detail === 'string' ? result.detail : 'Пароль обновлён'
    showToast(msg, 'success')
  }
  catch (err: any) {
    const payload = err?.response?.data
    const detail = typeof payload?.detail === 'string' ? payload.detail : ''
    const np = Array.isArray(payload?.new_password) ? payload.new_password.join(' ') : ''
    if (np) {
      passwordErrors.next = np
    }
    else if (detail) {
      passwordErrors.next = detail
    }
    else if (payload && typeof payload === 'object') {
      passwordErrors.next = JSON.stringify(payload)
    }
    else {
      passwordErrors.next = 'Не удалось сменить пароль. Проверьте API (profile/change-password/).'
    }
  }
  finally {
    passwordSaving.value = false
  }
}

function closeAvatarModal() {
  avatarUploadError.value = ''
  avatarUploading.value = false
  if (avatarFileInputRef.value) {
    avatarFileInputRef.value.value = ''
  }
  avatarModal.value = false
}

function pickDeviceAvatar() {
  avatarUploadError.value = ''
  avatarFileInputRef.value?.click()
}

async function handleDeviceAvatarChange(event: Event) {
  avatarUploadError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (avatarFileInputRef.value) {
    avatarFileInputRef.value.value = ''
  }
  if (!file || avatarUploading.value) return

  if (!file.type.startsWith('image/')) {
    avatarUploadError.value = 'Выберите файл изображения'
    return
  }

  let first = authStore.profileFirstName.trim()
  let last = authStore.profileLastName.trim()
  if ((!first || !last) && authStore.user?.name?.trim()) {
    const parts = authStore.user.name.trim().split(/\s+/).filter(Boolean)
    if (!first) first = parts[0] || ''
    if (!last) last = parts.slice(1).join(' ')
  }
  if (!first.trim()) {
    avatarUploadError.value = 'Заполните имя и фамилию (кнопка «Изменить имя»), затем загрузите фото'
    return
  }
  if (!last.trim())
    last = first

  avatarUploading.value = true
  try {
    await authStore.updateProfile(first.trim(), last.trim(), file)
    closeAvatarModal()
  }
  catch (err: any) {
    const payload = err?.response?.data
    const avatarErrors = Array.isArray(payload?.avatar) ? payload.avatar : []
    const detail = typeof payload?.detail === 'string' ? payload.detail : ''
    avatarUploadError.value = avatarErrors.join(' ') || detail || 'Не удалось загрузить фото'
  }
  finally {
    avatarUploading.value = false
  }
}

function activatePremium() {
  authStore.activatePremium()
  premiumModal.value = false
}
</script>
