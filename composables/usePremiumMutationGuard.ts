/**
 * Opens Premium paywall when a non-premium user tries to mutate premium-gated features.
 */
export function usePremiumMutationGuard() {
  const premiumStore = usePremiumStore()
  const { openPremiumModal } = usePremiumModal()

  function requirePremium(): boolean {
    if (premiumStore.isPremium) return true
    openPremiumModal()
    return false
  }

  return { requirePremium }
}
