/**
 * Robokassa docs: POST to Index.aspx when Receipt is present.
 * GET query strings are truncated / mis-encoded and the widget hangs on a spinner.
 */
export function openRobokassaCheckout(options: {
  checkoutUrl?: string
  paymentUrl?: string
  params?: Record<string, string>
}) {
  const params = options.params
  const action = (options.paymentUrl || options.checkoutUrl || '').split('?')[0]

  if (params && Object.keys(params).length > 0 && action) {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = action
    form.target = '_blank'
    form.acceptCharset = 'UTF-8'
    form.style.display = 'none'
    for (const [name, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = String(value)
      form.appendChild(input)
    }
    document.body.appendChild(form)
    form.submit()
    queueMicrotask(() => form.remove())
    return
  }

  if (options.checkoutUrl) {
    window.open(options.checkoutUrl, '_blank', 'noopener,noreferrer')
  }
}
