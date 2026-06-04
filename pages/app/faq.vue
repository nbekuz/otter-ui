<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <div
      class="px-4 pt-14 pb-4"
      :class="isDarkTheme ? 'bg-[#171a21] border-b border-[#2a303a] shadow-none' : 'bg-white shadow-sm'"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light"
          @click="$router.back()"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <h1 class="text-xl font-bold text-sber-black">Частые вопросы</h1>
      </div>
    </div>

    <div class="px-4 py-4">
      <div class="relative mb-4">
        <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sber-gray" />
        <input
          v-model="faqSearch"
          placeholder="Поиск по вопросам..."
          class="input-field py-3 pl-11 text-sm"
        />
      </div>

      <div
        class="rounded-2xl overflow-hidden"
        :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
      >
        <p v-if="settingsStore.helpFaqLoading" class="py-10 text-center text-sm text-sber-gray">
          Загрузка…
        </p>
        <p v-else-if="settingsStore.helpFaqError" class="px-4 py-6 text-center text-sm text-red-500">
          {{ settingsStore.helpFaqError }}
        </p>
        <div v-if="settingsStore.helpFaqError" class="px-4 pb-4">
          <button class="btn-secondary w-full" type="button" @click="loadHelpFaq">
            Повторить
          </button>
        </div>
        <p
          v-else-if="filteredFaq.length === 0"
          class="py-10 text-center text-sm text-sber-gray"
        >
          Вопросы не найдены
        </p>
        <div v-else>
          <div
            v-for="faq in filteredFaq"
            :key="faq.id"
            class="border-b border-sber-gray-light last:border-0"
          >
            <button class="w-full px-4 text-left" type="button" @click="faq.open = !faq.open">
              <div class="flex items-start justify-between gap-2 py-4">
                <span class="text-sm font-semibold text-sber-black">{{ faq.question }}</span>
                <ChevronDown
                  class="mt-0.5 h-4 w-4 flex-shrink-0 text-sber-gray transition-transform"
                  :class="faq.open ? 'rotate-180' : ''"
                />
              </div>
            </button>
            <Transition name="slide-down">
              <p
                v-if="faq.open"
                class="px-4 pb-4 text-sm leading-relaxed text-sber-gray"
              >
                {{ faq.answer }}
              </p>
            </Transition>
          </div>
        </div>
      </div>

      <button
        class="btn-primary mt-6"
        type="button"
        @click="goContact"
      >
        Связаться с нами
      </button>
    </div>

    <div class="h-8" />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronLeft, Search } from 'lucide-vue-next'

definePageMeta({ layout: 'app' })

const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const faqSearch = ref('')

function goContact() {
  if (authStore.isLoggedIn) {
    navigateTo({ path: '/app/settings', query: { openContact: '1' } })
  }
  else {
    navigateTo('/login')
  }
}

const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const filteredFaq = computed(() => {
  const items = settingsStore.helpFaq
  if (!faqSearch.value.trim()) return items
  const q = faqSearch.value.trim().toLowerCase()
  return items.filter(f =>
    f.question.toLowerCase().includes(q)
    || f.answer.toLowerCase().includes(q),
  )
})

async function loadHelpFaq() {
  await settingsStore.fetchHelpFaq()
}

onMounted(() => {
  if (!settingsStore.helpFaq.length && !settingsStore.helpFaqLoading) {
    void loadHelpFaq()
  }
})
</script>
