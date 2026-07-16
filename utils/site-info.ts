export const BRAND_NAME = 'ОТТЕР'

export const SITE_LEGAL_INFO = {
  businessName: 'ИП Наринян А.Б.',
  email: 'nab1985nab@gmail.com',
  phone: '89283285202',
  phoneHref: 'tel:+79283285202',
  inn: '262514605435',
  ogrnip: '326265100087984',
} as const

export const PREMIUM_LANDING = {
  title: `${BRAND_NAME} Premium`,
  price: 150,
  period: 'месяц',
  features: ['Календарь', 'Помодоро', 'Матрица Эйзенхауэра'],
} as const

/** Условия рекуррентной подписки Premium (Robokassa) */
export const PREMIUM_SUBSCRIPTION = {
  price: PREMIUM_LANDING.price,
  period: PREMIUM_LANDING.period,
  periodDays: 30,
  chargeSchedule:
    'первое списание — при оформлении, далее каждые 30 календарных дней в 10:00 по московскому времени (UTC+3)',
  offerVersion: '2026-07-08',
  offerSlug: 'public-offer',
  consentText: 'Я согласен на автоматические списания согласно условиям оферты',
} as const
