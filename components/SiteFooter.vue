<template>
  <footer
    class="border-t px-4 py-8 md:px-8 lg:px-10"
    :class="surface === 'white'
      ? 'border-sber-gray-mid/40 bg-white'
      : 'border-sber-gray-light bg-sber-gray-light/60'"
  >
    <div class="mx-auto max-w-6xl">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p class="text-sm font-bold text-sber-black">{{ SITE_LEGAL_INFO.businessName }}</p>
          <ul class="mt-3 space-y-2 text-sm text-sber-gray">
            <li>
              <span class="text-sber-black/70">Email:</span>
              <a :href="`mailto:${SITE_LEGAL_INFO.email}`" class="ml-1 text-sber-green hover:underline">
                {{ SITE_LEGAL_INFO.email }}
              </a>
            </li>
            <li>
              <span class="text-sber-black/70">Телефон:</span>
              <a :href="SITE_LEGAL_INFO.phoneHref" class="ml-1 text-sber-green hover:underline">
                {{ SITE_LEGAL_INFO.phone }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-bold text-sber-black">Реквизиты</p>
          <ul class="mt-3 space-y-2 text-sm text-sber-gray">
            <li><span class="text-sber-black/70">ИНН:</span> {{ SITE_LEGAL_INFO.inn }}</li>
            <li><span class="text-sber-black/70">ОГРНИП:</span> {{ SITE_LEGAL_INFO.ogrnip }}</li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-bold text-sber-black">Документы</p>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="doc in legalDocuments" :key="doc.slug">
              <NuxtLink :to="`/legal/${doc.slug}`" class="text-sber-green hover:underline">
                {{ doc.title }}
              </NuxtLink>
            </li>
          </ul>
          <button
            class="mt-4 hidden items-center gap-2 text-sm font-semibold text-sber-green hover:underline sm:inline-flex"
            type="button"
            :disabled="loadingWindows"
            @click="onDesktopDownloadClick"
          >
            {{ loadingWindows ? 'Загрузка…' : DESKTOP_APP.label }}
          </button>
          <button
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sber-green hover:underline max-sm:inline-flex sm:hidden"
            type="button"
            :disabled="loadingMobile"
            @click="onRustoreDownloadClick"
          >
            {{ loadingMobile ? 'Загрузка…' : DESKTOP_APP.rustoreLabel }}
          </button>
        </div>
      </div>

      <p class="mt-8 text-center text-xs text-sber-gray">
        © {{ currentYear }} {{ BRAND_NAME }}. {{ SITE_LEGAL_INFO.businessName }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BRAND_NAME, DESKTOP_APP, SITE_LEGAL_INFO } from '~/utils/site-info'
import { STATIC_LEGAL_DOCUMENTS } from '~/utils/legal-static'

withDefaults(defineProps<{
  /** Legal pages need a full white canvas (no gray side gutters). */
  surface?: 'default' | 'white'
}>(), {
  surface: 'default',
})

const currentYear = 2026
const legalDocuments = STATIC_LEGAL_DOCUMENTS
const {
  loadingWindows,
  loadingMobile,
  loadWindows,
  loadMobile,
  downloadWindowsApp,
  openRustoreDownload,
} = useAppDownloads()

onMounted(() => {
  void loadWindows()
  void loadMobile()
})

async function onDesktopDownloadClick() {
  await downloadWindowsApp()
}

async function onRustoreDownloadClick() {
  await openRustoreDownload()
}
</script>
