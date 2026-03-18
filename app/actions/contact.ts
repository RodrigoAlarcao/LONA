'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactPayload = {
  name: string
  email: string
  company?: string
  type: 'marca' | 'artista' | 'outro'
  message: string
}

export type ContactResult =
  | { success: true }
  | { success: false; error: string }

export async function sendContactEmail(data: ContactPayload): Promise<ContactResult> {
  const typeLabel = { marca: 'Marca', artista: 'Artista', outro: 'Outro' }[data.type]

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'LONA <noreply@lona.pt>',
      to: process.env.RESEND_TO ?? 'geral@lona.pt',
      replyTo: data.email,
      subject: `[LONA] Novo contacto — ${data.name} (${typeLabel})`,
      html: `
        <div style="font-family: monospace; max-width: 600px; padding: 40px 0; color: #1a1a18;">
          <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.5; margin-bottom: 32px;">
            LONA — Novo contacto
          </p>
          <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5; width: 100px;">Nome</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 14px;">${escHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 14px;">
                <a href="mailto:${escHtml(data.email)}" style="color: #6b6b5a;">${escHtml(data.email)}</a>
              </td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5;">Empresa</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 14px;">${escHtml(data.company)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5;">Tipo</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e3; font-size: 14px;">${typeLabel}</td>
            </tr>
          </table>
          <p style="margin-top: 32px; font-size: 14px; line-height: 1.75; white-space: pre-wrap;">${escHtml(data.message)}</p>
        </div>
      `,
    })

    if (error) {
      console.error('[contact action] Resend error:', error)
      return { success: false, error: 'send_failed' }
    }

    return { success: true }
  } catch (err) {
    console.error('[contact action] Unexpected error:', err)
    return { success: false, error: 'unexpected' }
  }
}

function escHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
