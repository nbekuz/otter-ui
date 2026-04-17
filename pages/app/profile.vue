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
              <p v-if="authStore.user?.isPremium && premiumExpiresLabel" class="mt-1 text-xs font-medium text-yellow-700">
                Подписка активна до {{ premiumExpiresLabel }}
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <button class="rounded-2xl bg-sber-green px-4 py-2.5 text-sm font-semibold text-white" type="button" @click="nameModal = true">
                  Изменить имя
                </button>
                <button class="rounded-2xl bg-sber-gray-light px-4 py-2.5 text-sm font-semibold text-sber-black" type="button" @click="passwordModal = true">
                  Сменить пароль
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div v-for="stat in stats" :key="stat.label" class="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-bold text-sber-black">{{ stat.value }}</p>
            <p class="mt-1 text-xs leading-5 text-sber-gray">{{ stat.caption }}</p>
          </div>
        </div>

        <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
          <p class="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-sber-gray">Личные данные</p>
          <SettingsSettingsRow label="Имя" :value="authStore.user?.name" @click="nameModal = true">
            <template #icon><User class="mr-3 h-5 w-5 text-sber-gray" /></template>
          </SettingsSettingsRow>
          <SettingsSettingsRow label="Email" :value="authStore.user?.email">
            <template #icon><Mail class="mr-3 h-5 w-5 text-sber-gray" /></template>
          </SettingsSettingsRow>
          <SettingsSettingsRow label="Пароль" value="Изменить" @click="passwordModal = true">
            <template #icon><Lock class="mr-3 h-5 w-5 text-sber-gray" /></template>
          </SettingsSettingsRow>
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
            <p class="text-sm font-semibold text-sber-black">Демо-сессия активна</p>
            <p class="mt-1 text-xs leading-5 text-sber-gray">
              Аккаунт хранится локально. При выходе данные сессии будут очищены только на этом устройстве.
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
          <h3 class="mb-4 text-lg font-bold text-sber-black">Изменить имя</h3>
          <input
            v-model="newName"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': nameError }"
            placeholder="Введите имя"
            required
            @input="nameError = ''"
          />
          <p v-if="nameError" class="mb-3 ml-1 text-xs text-red-500">{{ nameError }}</p>
          <button class="btn-primary mb-3" type="button" @click="saveName">Сохранить</button>
          <button class="btn-secondary" type="button" @click="closeNameModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="passwordModal" class="overlay" @click="closePasswordModal" />
      </Transition>
      <Transition name="modal">
        <div v-if="passwordModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-4 text-lg font-bold text-sber-black">Сменить пароль</h3>
          <input
            v-model="passwordForm.current"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': passwordErrors.current }"
            type="password"
            placeholder="Текущий пароль"
            required
            @input="passwordErrors.current = ''"
          />
          <p v-if="passwordErrors.current" class="mb-3 ml-1 text-xs text-red-500">{{ passwordErrors.current }}</p>
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
          <button class="btn-primary mb-3" type="button" @click="savePassword">Сохранить</button>
          <button class="btn-secondary" type="button" @click="closePasswordModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="avatarModal" class="overlay" @click="avatarModal = false" />
      </Transition>
      <Transition name="modal">
        <div v-if="avatarModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="mb-4 text-lg font-bold text-sber-black">Выберите аватар</h3>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="avatar in avatarOptions"
              :key="avatar.id"
              class="overflow-hidden rounded-2xl border-2 bg-sber-gray-light p-1 transition-colors"
              :class="authStore.user?.avatar === avatar.url ? 'border-sber-green' : 'border-transparent'"
              type="button"
              @click="selectAvatar(avatar.url)"
            >
              <img :src="avatar.url" :alt="avatar.label" class="h-24 w-full rounded-xl object-cover" />
            </button>
          </div>
          <button class="btn-secondary mt-4" type="button" @click="avatarModal = false">Закрыть</button>
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
import { ChevronLeft, Camera, User, Mail, Lock, Settings, Crown, ChevronRight } from 'lucide-vue-next'

definePageMeta({ layout: 'app' })

const authStore = useAuthStore()
const tasksStore = useTasksStore()

const nameModal = ref(false)
const passwordModal = ref(false)
const avatarModal = ref(false)
const premiumModal = ref(false)
const showLogout = ref(false)

const newName = ref(authStore.user?.name || '')
const nameError = ref('')

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: '',
})

const passwordErrors = reactive({
  current: '',
  next: '',
  confirm: '',
})

const initials = computed(() => authStore.user?.name?.[0]?.toUpperCase() || 'A')

const stats = computed(() => [
  {
    label: 'Задачи',
    value: tasksStore.tasks.length,
    caption: 'Всего задач в вашем аккаунте',
  },
  {
    label: 'Выполнено',
    value: tasksStore.completedTasks.length,
    caption: 'Завершённых задач на данный момент',
  },
  {
    label: 'Статус',
    value: authStore.user?.isPremium ? 'PRO' : 'FREE',
    caption: authStore.user?.isPremium
      ? (premiumExpiresLabel.value ? `До ${premiumExpiresLabel.value}` : 'Премиум активен')
      : 'Базовый тариф',
  },
])

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

const avatarOptions = computed(() => {
  const letter = initials.value

  const makeAvatar = (id: string, from: string, to: string, label: string) => ({
    id,
    label,
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${from}" />
            <stop offset="100%" stop-color="${to}" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="32" fill="url(#g)"/>
        <circle cx="64" cy="46" r="18" fill="rgba(255,255,255,0.22)"/>
        <text x="64" y="78" text-anchor="middle" font-size="42" font-family="Arial, sans-serif" font-weight="700" fill="white">${letter}</text>
      </svg>`
    )}`,
  })

  return [
    makeAvatar('green', '#21A038', '#007AFF', 'Green'),
    makeAvatar('violet', '#7C3AED', '#EC4899', 'Violet'),
    makeAvatar('sunset', '#F59E0B', '#EF4444', 'Sunset'),
    makeAvatar('sky', '#0EA5E9', '#22C55E', 'Sky'),
    makeAvatar('midnight', '#334155', '#0F172A', 'Midnight'),
    makeAvatar('peach', '#FB7185', '#F59E0B', 'Peach'),
  ]
})

function closeNameModal() {
  nameError.value = ''
  newName.value = authStore.user?.name || ''
  nameModal.value = false
}

function saveName() {
  if (!newName.value.trim()) {
    nameError.value = 'Имя обязательно'
    return
  }

  authStore.updateName(newName.value.trim())
  closeNameModal()
}

function closePasswordModal() {
  passwordForm.current = ''
  passwordForm.next = ''
  passwordForm.confirm = ''
  passwordErrors.current = ''
  passwordErrors.next = ''
  passwordErrors.confirm = ''
  passwordModal.value = false
}

function savePassword() {
  passwordErrors.current = ''
  passwordErrors.next = ''
  passwordErrors.confirm = ''

  if (!passwordForm.current.trim()) {
    passwordErrors.current = 'Введите текущий пароль'
  }
  if (passwordForm.next.length < 6) {
    passwordErrors.next = 'Новый пароль должен быть не короче 6 символов'
  }
  if (passwordForm.next !== passwordForm.confirm) {
    passwordErrors.confirm = 'Пароли не совпадают'
  }

  if (passwordErrors.current || passwordErrors.next || passwordErrors.confirm) return

  closePasswordModal()
}

function selectAvatar(url: string) {
  authStore.updateAvatar(url)
  avatarModal.value = false
}

function activatePremium() {
  authStore.activatePremium()
  premiumModal.value = false
}
</script>
