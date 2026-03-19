'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { sendContactEmail } from '@/app/actions/contact'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  name:    z.string().min(1),
  email:   z.string().min(1).refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
  company: z.string().optional(),
  type:    z.enum(['marca', 'artista', 'outro']),
  message: z.string().min(10),
})

type FormValues = z.infer<typeof schema>

// ── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--color-dim)',
  opacity: 0.7,
  display: 'block',
  marginBottom: '0.5rem',
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  outline: 'none',
  padding: '0.625rem 0',
  fontSize: '0.9375rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 300,
  color: 'var(--color-text)',
  lineHeight: 1.6,
  transition: 'border-color 0.2s ease',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.625rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#b85c50',
  marginTop: '0.375rem',
  display: 'block',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactForm() {
  const t = useTranslations('contactPage.form')
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const selectedType = watch('type')

  const onSubmit = (data: FormValues) => {
    setServerError(false)
    startTransition(async () => {
      const result = await sendContactEmail(data)
      if (result.success) {
        setSubmitted(true)
      } else {
        setServerError(true)
      }
    })
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        style={{
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h3
          className="font-display font-light"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)', lineHeight: 1.05 }}
        >
          {t('successHeading')}
        </h3>
        <p
          className="font-body font-light"
          style={{ fontSize: '1rem', color: 'var(--color-dim)', lineHeight: 1.75, maxWidth: '400px' }}
        >
          {t('successSub')}
        </p>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>

      {/* Nome */}
      <div>
        <label style={labelStyle}>{t('name')}</label>
        <input
          {...register('name')}
          placeholder={t('namePlaceholder')}
          style={{
            ...inputBase,
            borderBottomColor: errors.name ? '#b85c50' : 'var(--color-border)',
          }}
          onFocus={e => (e.target.style.borderBottomColor = 'var(--color-text)')}
          onBlur={e => (e.target.style.borderBottomColor = errors.name ? '#b85c50' : 'var(--color-border)')}
        />
        {errors.name && <span style={errorStyle}>{t('errors.nameRequired')}</span>}
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>{t('email')}</label>
        <input
          {...register('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          style={{
            ...inputBase,
            borderBottomColor: errors.email ? '#b85c50' : 'var(--color-border)',
          }}
          onFocus={e => (e.target.style.borderBottomColor = 'var(--color-text)')}
          onBlur={e => (e.target.style.borderBottomColor = errors.email ? '#b85c50' : 'var(--color-border)')}
        />
        {errors.email && (
          <span style={errorStyle}>
            {errors.email.message === 'Invalid input'
              ? t('errors.emailInvalid')
              : t('errors.emailRequired')}
          </span>
        )}
      </div>

      {/* Empresa */}
      <div>
        <label style={labelStyle}>{t('company')}</label>
        <input
          {...register('company')}
          placeholder={t('companyPlaceholder')}
          style={inputBase}
          onFocus={e => (e.target.style.borderBottomColor = 'var(--color-text)')}
          onBlur={e => (e.target.style.borderBottomColor = 'var(--color-border)')}
        />
      </div>

      {/* Tipo — radio estilizados */}
      <div>
        <span style={labelStyle}>{t('typeLabel')}</span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          {(['marca', 'artista', 'outro'] as const).map((val) => {
            const labelKey = ({ marca: 'typeBrand', artista: 'typeArtist', outro: 'typeOther' } as const)[val]
            const isSelected = selectedType === val
            return (
              <button
                key={val}
                type="button"
                onClick={() => setValue('type', val, { shouldValidate: true })}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  padding: '0.4375rem 0.875rem',
                  border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isSelected ? 'transparent' : 'transparent',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-dim)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
              >
                {t(labelKey)}
              </button>
            )
          })}
        </div>
        {errors.type && <span style={errorStyle}>{t('errors.typeRequired')}</span>}
        {/* hidden input to register value */}
        <input type="hidden" {...register('type')} />
      </div>

      {/* Mensagem */}
      <div>
        <label style={labelStyle}>{t('message')}</label>
        <textarea
          {...register('message')}
          placeholder={t('messagePlaceholder')}
          rows={5}
          style={{
            ...inputBase,
            resize: 'none',
            borderBottom: `1px solid ${errors.message ? '#b85c50' : 'var(--color-border)'}`,
            display: 'block',
          }}
          onFocus={e => (e.target.style.borderBottomColor = 'var(--color-text)')}
          onBlur={e => (e.target.style.borderBottomColor = errors.message ? '#b85c50' : 'var(--color-border)')}
        />
        {errors.message && (
          <span style={errorStyle}>
            {errors.message.type === 'too_small'
              ? t('errors.messageMin')
              : t('errors.messageRequired')}
          </span>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <p style={{ ...errorStyle, fontSize: '0.6875rem' }}>{t('error')}</p>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: isPending ? 'var(--color-dim)' : 'var(--color-accent)',
            background: 'none',
            border: 'none',
            cursor: isPending ? 'not-allowed' : 'pointer',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'opacity 0.25s ease',
          }}
          onMouseEnter={e => !isPending && ((e.currentTarget as HTMLButtonElement).style.opacity = '0.7')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          <span>{isPending ? t('sending') : t('submit')}</span>
          {!isPending && <span aria-hidden>→</span>}
        </button>
      </div>

    </form>
  )
}
