import termsRaw from '~/content/legal/terms-of-use.md?raw'
import privacyRaw from '~/content/legal/privacy-policy.md?raw'
import offerRaw from '~/content/legal/public-offer.md?raw'

export type LegalSlug = 'terms-of-use' | 'privacy-policy' | 'public-offer'

export interface StaticLegalDocument {
  slug: LegalSlug
  title: string
  docType: 'terms' | 'privacy' | 'offer'
  updatedAt: string
  content: string
  docxPath: string
}

export const STATIC_LEGAL_DOCUMENTS: StaticLegalDocument[] = [
  {
    slug: 'terms-of-use',
    title: 'Условия использования',
    docType: 'terms',
    updatedAt: '2026-06-17',
    content: termsRaw,
    docxPath: '/legal/Условия%20использования%2017.06.26%20.docx',
  },
  {
    slug: 'privacy-policy',
    title: 'Политика конфиденциальности',
    docType: 'privacy',
    updatedAt: '2026-06-17',
    content: privacyRaw,
    docxPath: '/legal/Политика_конфиденциальности_17_06_26.docx',
  },
  {
    slug: 'public-offer',
    title: 'Публичная оферта',
    docType: 'offer',
    updatedAt: '2026-06-17',
    content: offerRaw,
    docxPath: '/legal/public-offer.docx',
  },
]

export function getStaticLegalDocument(slug: string) {
  return STATIC_LEGAL_DOCUMENTS.find(doc => doc.slug === slug) ?? null
}

export function formatLegalUpdatedAt(value: string) {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
