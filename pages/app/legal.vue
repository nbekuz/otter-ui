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

    <div class="px-4 py-4">
      <template v-if="selectedStatic">
        <button
          class="mb-4 text-sm font-semibold text-sber-green"
          type="button"
          @click="selectedStatic = null"
        >
          ← Назад к списку
        </button>
        <div
          class="rounded-2xl p-4"
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

      <template v-else-if="selectedApi">
        <button
          class="mb-4 text-sm font-semibold text-sber-green"
          type="button"
          @click="selectedApi = null"
        >
          ← Назад к списку
        </button>
        <div
          class="rounded-2xl p-4"
          :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
        >
          <p v-if="formatUpdatedAt(selectedApi.updated_at)" class="mb-3 text-xs text-sber-gray">
            Обновлено: {{ formatUpdatedAt(selectedApi.updated_at) }}
          </p>
          <p class="whitespace-pre-wrap text-sm leading-relaxed text-sber-gray">
            {{ selectedApi.content }}
          </p>
        </div>
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
              <p class="mt-0.5 text-xs text-sber-gray">17.06.2026</p>
            </div>
            <ChevronRight class="h-4 w-4 flex-shrink-0 text-sber-gray" />
          </button>
        </div>

        <p v-if="settingsStore.legalDocumentsLoading" class="py-6 text-center text-sm text-sber-gray">
          Загрузка дополнительных документов…
        </p>
        <p v-else-if="settingsStore.legalDocumentsError" class="py-4 text-center text-sm text-red-500">
          {{ settingsStore.legalDocumentsError }}
        </p>

        <div v-if="settingsStore.legalDocuments.length" class="mt-4 space-y-2">
          <p class="px-1 text-xs font-semibold uppercase tracking-wide text-sber-gray">
            С сервера
          </p>
          <button
            v-for="(doc, index) in settingsStore.legalDocuments"
            :key="`${doc.doc_type}-${index}`"
            class="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors active:bg-sber-gray-light"
            :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a]' : 'bg-white shadow-sm'"
            type="button"
            @click="selectedApi = doc"
          >
            <FileText class="h-5 w-5 flex-shrink-0 text-sber-gray" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-sber-black">{{ doc.title }}</p>
              <p v-if="docTypeLabel(doc.doc_type)" class="mt-0.5 text-xs text-sber-gray">
                {{ docTypeLabel(doc.doc_type) }}
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
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-vue-next'
import type { ApiLegalDocument } from '~/types/mobile-api'
import {
  STATIC_LEGAL_DOCUMENTS,
  formatLegalUpdatedAt,
  type StaticLegalDocument,
} from '~/utils/legal-static'

definePageMeta({ layout: 'app' })

const settingsStore = useSettingsStore()
const selectedStatic = ref<StaticLegalDocument | null>(null)
const selectedApi = ref<ApiLegalDocument | null>(null)

const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const headerTitle = computed(() => {
  if (selectedStatic.value) return selectedStatic.value.title
  if (selectedApi.value) return selectedApi.value.title
  return 'Юридические документы'
})

const staticUpdatedLabel = computed(() =>
  selectedStatic.value
    ? formatLegalUpdatedAt(selectedStatic.value.updatedAt)
    : '',
)

const docTypeLabels: Record<string, string> = {
  offer: 'Публичная оферта',
  privacy: 'Политика конфиденциальности',
  terms: 'Пользовательское соглашение',
  license: 'Лицензия',
}

function docTypeLabel(type: string) {
  return docTypeLabels[type] || type
}

function formatUpdatedAt(value: string) {
  const d = dayjs(value)
  if (!d.isValid()) return ''
  return d.format('D MMMM YYYY, HH:mm')
}

function goBack() {
  if (selectedStatic.value || selectedApi.value) {
    selectedStatic.value = null
    selectedApi.value = null
    return
  }
  useRouter().back()
}

onMounted(() => {
  if (!settingsStore.legalDocuments.length && !settingsStore.legalDocumentsLoading) {
    void settingsStore.fetchLegalDocuments().catch(() => {})
  }
})
</script>
