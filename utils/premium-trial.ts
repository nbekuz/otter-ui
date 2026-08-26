import type { ApiSubscription, ApiTariff } from '~/types/mobile-api'
import { PREMIUM_SUBSCRIPTION } from '~/utils/site-info'

export const PREMIUM_TRIAL_DAYS = PREMIUM_SUBSCRIPTION.trialDays

/**
 * Free trial is available only once. Prefer backend `trial_available`;
 * fall back to status/`promo_used` for older payloads.
 */
export function canStartPremiumTrial(
  subscription: ApiSubscription | null | undefined,
): boolean {
  if (!subscription) return true
  if (subscription.is_premium) return false
  if (typeof subscription.trial_available === 'boolean') {
    return subscription.trial_available
  }
  if (subscription.promo_used) return false
  return subscription.status === 'none'
}

export function effectivePromoDays(
  tariff: ApiTariff | null | undefined,
  subscription?: ApiSubscription | null,
): number {
  if (!canStartPremiumTrial(subscription)) return 0
  if (PREMIUM_TRIAL_DAYS <= 0) return 0
  const fromApi = tariff?.promo_days ?? 0
  return fromApi > 0 ? fromApi : PREMIUM_TRIAL_DAYS
}
