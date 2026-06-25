<template>
  <div class="flex min-h-dvh flex-col bg-white">
    <div class="page-header-top flex shrink-0 items-center gap-3 px-4 pb-4 sm:px-6">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-sber-gray-light"
        @click="goBack"
      >
        <ChevronLeft class="h-5 w-5 text-sber-black" />
      </button>
      <h1 class="text-xl font-bold text-sber-black">{{ document?.title || 'Документ' }}</h1>
    </div>

    <div v-if="!document" class="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-sber-gray">
      Документ не найден
    </div>

    <div v-else class="flex flex-1 flex-col px-4 pb-6 sm:px-6">
      <p v-if="updatedLabel" class="mb-4 text-xs text-sber-gray">
        Обновлено: {{ updatedLabel }}
      </p>

      <div class="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <LegalDocumentBody :content="document.content" />
      </div>

      <a
        :href="document.docxPath"
        class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sber-green"
        download
      >
        <Download class="h-4 w-4" />
        Скачать оригинал (.docx)
      </a>
    </div>

    <SiteFooter class="mt-auto shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Download } from 'lucide-vue-next'
import { formatLegalUpdatedAt, getStaticLegalDocument } from '~/utils/legal-static'
import { BRAND_NAME } from '~/utils/site-info'

const route = useRoute()
const router = useRouter()

const slug = computed(() => String(route.params.slug || ''))
const document = computed(() => getStaticLegalDocument(slug.value))
const updatedLabel = computed(() =>
  document.value ? formatLegalUpdatedAt(document.value.updatedAt) : '',
)

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }
  navigateTo('/login')
}

watchEffect(() => {
  if (document.value) {
    useHead({ title: `${document.value.title} — ${BRAND_NAME}` })
  }
})
</script>
