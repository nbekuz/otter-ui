<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <div
      class="page-header-top px-4 pb-4"
      :class="isDarkTheme ? 'bg-[#171a21] border-b border-[#2a303a] shadow-none' : 'bg-white shadow-sm'"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light"
          @click="goBack"
        >
          <ChevronLeft class="h-5 w-5 text-sber-black" />
        </button>
        <h1 class="text-xl font-bold text-sber-black">
          {{ headerTitle }}
        </h1>
      </div>
    </div>

    <div class="mx-auto w-full max-w-6xl px-4 py-4 lg:px-8">
      <template v-if="selectedStatic">
        <button
          class="mb-4 text-sm font-semibold text-sber-green"
          type="button"
          @click="selectedStatic = null"
        >
          ← Назад к списку
        </button>
        <div
          class="rounded-2xl p-4 sm:p-6"
          :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
        >
          <p v-if="staticUpdatedLabel" class="mb-3 text-xs text-sber-gray">
            Обновлено: {{ staticUpdatedLabel }}
          </p>
          <LegalDocumentBody :content="selectedStatic.content" />
        </div>
        <a
          :href="selectedStatic.docxPath"
          class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sber-green"
          download
        >
          Скачать оригинал (.docx)
        </a>
      </template>

      <template v-else>
        <div class="space-y-2">
          <button
            v-for="doc in STATIC_LEGAL_DOCUMENTS"
            :key="doc.slug"
            class="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors active:bg-sber-gray-light"
            :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
            type="button"
            @click="selectedStatic = doc"
          >
            <FileText class="h-5 w-5 flex-shrink-0 text-sber-gray" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-sber-black">{{ doc.title }}</p>
              <p v-if="formatLegalUpdatedAt(doc.updatedAt)" class="mt-0.5 text-xs text-sber-gray">
                {{ formatLegalUpdatedAt(doc.updatedAt) }}
              </p>
            </div>
            <ChevronRight class="h-4 w-4 flex-shrink-0 text-sber-gray" />
          </button>
        </div>
      </template>
    </div>

    <div class="h-8" />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, FileText } from 'lucide-vue-next'
import {
  STATIC_LEGAL_DOCUMENTS,
  formatLegalUpdatedAt,
  type StaticLegalDocument,
} from '~/utils/legal-static'

definePageMeta({ layout: 'app' })

const settingsStore = useSettingsStore()
const selectedStatic = ref<StaticLegalDocument | null>(null)

const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const headerTitle = computed(() =>
  selectedStatic.value ? selectedStatic.value.title : 'Юридические документы',
)

const staticUpdatedLabel = computed(() =>
  selectedStatic.value
    ? formatLegalUpdatedAt(selectedStatic.value.updatedAt)
    : '',
)

function goBack() {
  if (selectedStatic.value) {
    selectedStatic.value = null
    return
  }
  useRouter().back()
}
</script>
