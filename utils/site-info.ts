export const BRAND_NAME = 'Оттер'

/** Canonical public URL for share / recommend (not the current page path). */
export const APP_PUBLIC_URL = 'https://ottertime.ru'

export const APP_SHARE = {
  title: `${BRAND_NAME} — Планировщик задач`,
  text: 'Умный планировщик задач: списки, календарь, Помодоро и матрица Эйзенхауэра. Попробуй Оттер!',
  url: APP_PUBLIC_URL,
} as const

export const SITE_LEGAL_INFO = {
  businessName: 'ИП Наринян А.Б.',
  email: 'nab1985nab@gmail.com',
  phone: '89283285202',
  phoneHref: 'tel:+79283285202',
  inn: '262514605435',
  ogrnip: '326265100087984',
} as const

/**
 * Windows / mobile distribution labels.
 * Actual URLs come from public Admin APIs:
 * `GET /api/app/windows`, `GET /api/app/mobile` — do not hardcode download links.
 */
export const DESKTOP_APP = {
  label: 'Скачать для Windows',
  /** Visible only below 640px — opens RuStore URL from `GET /api/app/mobile`. */
  rustoreLabel: 'Скачать в RuStore',
  unavailableMessage: 'Десктопная версия пока не загружена. Скачивание будет доступно позже.',
  rustoreUnavailableMessage: 'Приложение пока недоступно в RuStore.',
} as const

export const PREMIUM_LANDING = {
  title: `${BRAND_NAME} Premium`,
  price: 150,
  period: 'месяц',
  yearlyPrice: 1500,
  // TODO: restore 30 after local Robokassa checkout testing
  trialDays: 0,
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
