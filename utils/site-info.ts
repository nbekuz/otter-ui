export const BRAND_NAME = 'Оттер'

export const SITE_LEGAL_INFO = {
  businessName: 'ИП Наринян А.Б.',
  email: 'nab1985nab@gmail.com',
  phone: '89283285202',
  phoneHref: 'tel:+79283285202',
  inn: '262514605435',
  ogrnip: '326265100087984',
} as const

/** Windows desktop build — override with NUXT_PUBLIC_DESKTOP_DOWNLOAD_URL in production. */
export const DESKTOP_APP = {
  label: 'Скачать для Windows',
  downloadPath: '/downloads/otter-windows-x64.zip',
  unavailableMessage: 'Десктопная версия пока не загружена. Скачивание будет доступно позже.',
} as const

export const PREMIUM_LANDING = {
  title: `${BRAND_NAME} Premium`,
  price: 150,
  period: 'месяц',
  yearlyPrice: 1500,
  trialDays: 30,
  features: ['Календарь', 'Помодоро', 'Матрица Эйзенхауэра'],
} as const

/** Условия рекуррентной подписки Premium (Robokassa) */
export const PREMIUM_SUBSCRIPTION = {
  price: PREMIUM_LANDING.price,
  yearlyPrice: PREMIUM_LANDING.yearlyPrice,
  period: PREMIUM_LANDING.period,
  periodDays: 30,
  trialDays: PREMIUM_LANDING.trialDays,
  chargeSchedule:
    'первое списание — при оформлении, далее каждые 30 календарных дней в 10:00 по московскому времени (UTC+3)',
  offerVersion: '2026-07-08',
  offerSlug: 'public-offer',
  /** Link label «оферты» is rendered separately — do not end with «оферты». */
  consentText: 'Я согласен на автоматические списания согласно условиям',
} as const
