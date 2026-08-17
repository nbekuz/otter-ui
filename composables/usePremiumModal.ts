export function usePremiumModal() {
  const isOpen = useState('premium-modal-open', () => false)

  function openPremiumModal() {
    isOpen.value = true
    void usePremiumStore().loadAll()
  }

  function closePremiumModal() {
    isOpen.value = false
  }

  return { isOpen, openPremiumModal, closePremiumModal }
}
