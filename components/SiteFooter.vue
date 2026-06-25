<template>
  <footer class="border-t border-sber-gray-light bg-sber-gray-light/60 px-4 py-8 md:px-8 lg:px-10">
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
        </div>
      </div>

      <p class="mt-8 text-center text-xs text-sber-gray">
        © {{ currentYear }} {{ BRAND_NAME }}. {{ SITE_LEGAL_INFO.businessName }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BRAND_NAME, SITE_LEGAL_INFO } from '~/utils/site-info'
import { STATIC_LEGAL_DOCUMENTS } from '~/utils/legal-static'

const currentYear = 2026
const legalDocuments = STATIC_LEGAL_DOCUMENTS
</script>
