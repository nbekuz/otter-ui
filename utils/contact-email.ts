import { SITE_LEGAL_INFO } from '~/utils/site-info'

const BRAND_NAME_SAFE = 'Оттер'

/**
 * Deliver «Написать нам» to the support inbox.
 * Backend `POST help/` only persists the ticket; FormSubmit delivers mail.
 * Falls back to mailto: if the HTTP delivery path fails.
 */
export async function deliverSupportEmail(payload: {
  message: string
  fromEmail?: string
  fromName?: string
}): Promise<void> {
  const message = payload.message.trim()
  if (!message) throw new Error('Введите сообщение')

  const body: Record<string, string> = {
    message,
    _subject: `Обращение из ${BRAND_NAME_SAFE}`,
    _template: 'table',
    _captcha: 'false',
  }
  if (payload.fromEmail) body.email = payload.fromEmail
  if (payload.fromName) body.name = payload.fromName

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(SITE_LEGAL_INFO.email)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (response.ok) return

    let detail = 'Не удалось отправить сообщение'
    try {
      const data = await response.json() as { message?: string }
      if (data.message) detail = data.message
    }
    catch {
      // ignore parse errors
    }
    throw new Error(detail)
  }
  catch {
    openMailtoFallback(message)
  }
}

function openMailtoFallback(message: string) {
  if (!import.meta.client) {
    throw new Error('Не удалось отправить сообщение')
  }
  const href = `mailto:${SITE_LEGAL_INFO.email}?subject=${encodeURIComponent(`Обращение из ${BRAND_NAME_SAFE}`)}&body=${encodeURIComponent(message)}`
  window.location.href = href
}
