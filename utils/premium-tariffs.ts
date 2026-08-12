import type { ApiTariff } from '~/types/mobile-api'

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

/** Keep API price/promo as-is; only clean description for UI. */
export function normalizeTariffForDisplay(tariff: ApiTariff): ApiTariff {
  return {
    ...tariff,
    description: sanitizeTariffDescription(tariff.description || ''),
  }
}

export function normalizeTariffsForDisplay(tariffs: ApiTariff[]): ApiTariff[] {
  return tariffs
    .filter(isPurchaseableTariff)
    .map(normalizeTariffForDisplay)
    .sort((a, b) => a.sort_order - b.sort_order)
}
