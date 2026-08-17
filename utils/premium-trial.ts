import type { ApiSubscription, ApiTariff } from '~/types/mobile-api'
import { PREMIUM_SUBSCRIPTION } from '~/utils/site-info'

export const PREMIUM_TRIAL_DAYS = PREMIUM_SUBSCRIPTION.trialDays

/** Free trial is available only once — while subscription status is still `none`. */
export function canStartPremiumTrial(
  subscription: ApiSubscription | null | undefined,
): boolean {
  if (!subscription) return true
  if (subscription.is_premium) return false
  return subscription.status === 'none'
}

export function effectivePromoDays(
  tariff: ApiTariff | null | undefined,
  subscription?: ApiSubscription | null,
): number {
  if (!canStartPremiumTrial(subscription)) return 0
  const fromApi = tariff?.promo_days ?? 0
  return fromApi > 0 ? fromApi : PREMIUM_TRIAL_DAYS
}
