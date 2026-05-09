<template>
  <div class="flex flex-col gap-2">
    <button
      type="button"
      class="inline-flex items-center justify-center gap-2 rounded-2xl border border-sber-gray-mid bg-white px-4 py-3 text-sm font-semibold text-sber-black shadow-sm transition-colors hover:bg-sber-gray-light disabled:opacity-50"
      :disabled="loading"
      @click="onLoginClick"
    >
      {{ loading ? 'Вход…' : 'Login with Google' }}
    </button>
    <p v-if="lastError" class="text-xs text-red-600">{{ lastError }}</p>
    <p v-if="hint" class="text-xs text-sber-gray">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import type { FirebaseOptions } from 'firebase/app'
import { loginWithGoogle, subscribeAuthState, type AuthenticatedUserData } from '~/lib/auth'

const runtime = useRuntimeConfig()

const firebaseConfig = computed(
  () => runtime.public.firebase as FirebaseOptions,
)

const loading = ref(false)
const lastError = ref('')
const hint = 'localhost: Firebase Console → Authentication → Settings → Authorized domains.'

let unsubscribe: (() => void) | null = null

function logUserInfo(label: string, data: AuthenticatedUserData | null) {
  if (data) {
    console.log(`[GoogleLoginButton] ${label}`, data)
  }
  else {
    console.log(`[GoogleLoginButton] ${label}`, null)
  }
}

onMounted(() => {
  unsubscribe = subscribeAuthState(firebaseConfig.value, (user) => {
    logUserInfo('onAuthStateChanged', user)
  })
})

onUnmounted(() => {
  unsubscribe?.()
  unsubscribe = null
})

async function onLoginClick() {
  lastError.value = ''
  loading.value = true
  try {
    const data = await loginWithGoogle(firebaseConfig.value)
    console.log('[GoogleLoginButton] loginWithGoogle success', data)
  }
  catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Login failed'
    lastError.value = msg
  }
  finally {
    loading.value = false
  }
}
</script>
