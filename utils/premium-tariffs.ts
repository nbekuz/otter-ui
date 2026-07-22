import type { ApiTariff } from '~/types/mobile-api'

/** Display overrides while backend tariffs catch up to product pricing. */
export const PREMIUM_TARIFF_DISPLAY: Record<string, { price: number; promoDays: number }> = {
  monthly: { price: 150, promoDays: 30 },
  yearly: { price: 1500, promoDays: 30 },
}

const PROMO_SIDE_NOTE = /промо-период\s+настраивается\s+на\s+стороне\s+otter\.?/gi

export function isPurchaseableTariff(tariff: ApiTariff): boolean {
  const code = (tariff.code || '').toLowerCase()
  if (code === 'lifetime' || code === 'forever' || code === 'навсегда') return false
  if (tariff.duration_days === 0) return false
  return true
}

export function sanitizeTariffDescription(description: string): string {
  return description.replace(PROMO_SIDE_NOTE, '').replace(/\s{2,}/g, ' ').trim()
}

export function normalizeTariffForDisplay(tariff: ApiTariff): ApiTariff {
  const override = PREMIUM_TARIFF_DISPLAY[tariff.code]
  return {
    ...tariff,
    price: override ? String(override.price) : tariff.price,
    promo_days: override ? override.promoDays : tariff.promo_days,
    description: sanitizeTariffDescription(tariff.description || ''),
  }
}

export function normalizeTariffsForDisplay(tariffs: ApiTariff[]): ApiTariff[] {
  return tariffs
    .filter(isPurchaseableTariff)
    .map(normalizeTariffForDisplay)
    .sort((a, b) => a.sort_order - b.sort_order)
}
