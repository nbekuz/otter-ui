<template>
  <div class="min-h-dvh bg-white lg:flex lg:items-center lg:justify-center lg:bg-sber-gray-light lg:px-6 lg:py-10">
    <div class="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-sm lg:p-8">
      <div class="mb-6 flex justify-center">
        <div class="relative">
          <div class="h-32 w-32 overflow-hidden rounded-full bg-sber-gray-light ring-2 ring-white shadow-md">
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-4xl font-bold text-sber-gray">
              {{ initials }}
            </div>
          </div>
          <button
            type="button"
            class="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition hover:brightness-95"
            @click="pickAvatar"
          >
            <Camera class="h-5 w-5" />
          </button>
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarChange"
          />
        </div>
      </div>

      <h1 class="text-2xl font-bold text-sber-black">Заполните профиль</h1>
      <p class="mt-2 text-sm text-sber-gray">Имя и фамилия обязательны. Аватар можно добавить по желанию.</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-2 block text-sm font-medium text-sber-gray">Имя</label>
          <input
            v-model="form.first_name"
            type="text"
            class="input-field"
            :class="{ 'border-red-400 bg-red-50': errors.first_name }"
            placeholder="Введите имя"
            @input="errors.first_name = ''"
          />
          <p v-if="errors.first_name" class="mt-1 ml-1 text-xs text-red-500">{{ errors.first_name }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-sber-gray">Фамилия</label>
          <input
            v-model="form.last_name"
            type="text"
            class="input-field"
            :class="{ 'border-red-400 bg-red-50': errors.last_name }"
            placeholder="Введите фамилию"
            @input="errors.last_name = ''"
          />
          <p v-if="errors.last_name" class="mt-1 ml-1 text-xs text-red-500">{{ errors.last_name }}</p>
        </div>

        <p v-if="errors.avatar" class="mt-1 ml-1 text-xs text-red-500">{{ errors.avatar }}</p>

        <Transition name="fade-notification">
          <div v-if="toast.visible" class="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3" :class="toast.type === 'success' ? 'border border-sber-green bg-sber-green-light' : 'border border-red-300 bg-red-50'">
            <p class="text-sm font-medium" :class="toast.type === 'success' ? 'text-sber-green' : 'text-red-600'">
              {{ toast.message }}
            </p>
          </div>
        </Transition>

        <button
          class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Сохранение...' : 'Сохранить профиль' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera } from 'lucide-vue-next'

const authStore = useAuthStore()

const form = reactive({
  first_name: authStore.profileFirstName || '',
  last_name: authStore.profileLastName || '',
})
const errors = reactive({
  first_name: '',
  last_name: '',
  avatar: '',
})
const isSubmitting = ref(false)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref(authStore.user?.avatar || '')
const previewBlobUrl = ref<string | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const toast = reactive({
  visible: false,
  type: 'success' as 'success' | 'error',
  message: '',
})
const initials = computed(() => {
  const first = form.first_name.trim().charAt(0)
  const last = form.last_name.trim().charAt(0)
  return `${first}${last}`.trim().toUpperCase() || 'U'
})

if (!authStore.isLoggedIn) {
  navigateTo('/')
}

function revokePreviewBlob() {
  if (previewBlobUrl.value) {
    URL.revokeObjectURL(previewBlobUrl.value)
    previewBlobUrl.value = null
  }
}

onUnmounted(() => {
  revokePreviewBlob()
})

function showToast(type: 'success' | 'error', message: string) {
  toast.visible = true
  toast.type = type
  toast.message = message
}

function validate() {
  errors.first_name = ''
  errors.last_name = ''

  let valid = true
  if (!form.first_name.trim()) {
    errors.first_name = 'Имя обязательно'
    valid = false
  }
  if (!form.last_name.trim()) {
    errors.last_name = 'Фамилия обязательна'
    valid = false
  }
  return valid
}

function pickAvatar() {
  avatarInputRef.value?.click()
}

function handleAvatarChange(event: Event) {
  errors.avatar = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    avatarFile.value = null
    revokePreviewBlob()
    avatarPreview.value = authStore.user?.avatar || ''
    return
  }

  try {
    revokePreviewBlob()
    const url = URL.createObjectURL(file)
    previewBlobUrl.value = url
    avatarPreview.value = url
    avatarFile.value = file
  }
  catch {
    errors.avatar = 'Не удалось обработать файл'
  }
}

async function handleSubmit() {
  if (!validate()) return
  if (isSubmitting.value) return

  toast.visible = false
  isSubmitting.value = true

  try {
    await authStore.updateProfile(
      form.first_name.trim(),
      form.last_name.trim(),
      avatarFile.value ?? undefined,
    )
    showToast('success', 'Профиль заполнен успешно')
    setTimeout(() => {
      navigateTo('/app')
    }, 700)
  }
  catch (err: any) {
    const payload = err?.response?.data
    const firstNameErrors = Array.isArray(payload?.first_name) ? payload.first_name : []
    const lastNameErrors = Array.isArray(payload?.last_name) ? payload.last_name : []
    const avatarErrors = Array.isArray(payload?.avatar) ? payload.avatar : []
    const detailError = typeof payload?.detail === 'string' ? payload.detail : ''

    if (firstNameErrors.length) errors.first_name = firstNameErrors.join(' ')
    if (lastNameErrors.length) errors.last_name = lastNameErrors.join(' ')
    if (avatarErrors.length) errors.avatar = avatarErrors.join(' ')

    const apiMessage = [...firstNameErrors, ...lastNameErrors, ...avatarErrors, detailError].filter(Boolean).join(' ')
    showToast('error', apiMessage || 'Профильни сақлаб бўлмади')
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
