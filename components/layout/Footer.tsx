'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'

export default function Footer() {
  const t      = useTranslations('footer')
  const nav    = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const toggleLocale = () => {
    // @ts-expect-error — next-intl typing não suporta params aqui
    router.replace(pathname, { locale: locale === 'pt' ? 'en' : 'pt', params })
  }

  const monoBase: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.14em',
    textDecoration: 'none',
    transition: 'color 0.25s ease',
  }

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '2.5rem 2.5rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '2rem',
        }}
      >

        {/* ── Esquerda: LONA + localização ─────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/"
            className="font-display font-bold transition-opacity duration-300 hover:opacity-70"
            style={{
              fontSize: '1.125rem',
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              textDecoration: 'none',
            }}
          >
            LONA
          </Link>
          <span style={{ ...monoBase, color: 'var(--color-dim)', opacity: 0.55 }}>
            {t('location')}
          </span>
        </div>

        {/* ── Centro: links de navegação ───────────────────────────── */}
        <nav
          aria-label="Footer navigation"
          style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
        >
          {(
            [
              { key: 'sobre',     href: '/about'   },
              { key: 'trabalho',  href: '/work'    },
              { key: 'artistas',  href: '/artists' },
              { key: 'contacto',  href: '/contact' },
            ] as const
          ).map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              style={{ ...monoBase, color: 'var(--color-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
            >
              {t(`links.${key}`)}
            </Link>
          ))}
        </nav>

        {/* ── Direita: copyright + lang toggle ────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1.5rem',
          }}
        >
          <span style={{ ...monoBase, color: 'var(--color-dim)', opacity: 0.4 }}>
            {t('copyright')}
          </span>

          {/* Separador */}
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '1px',
              height: '0.9em',
              backgroundColor: 'var(--color-border)',
            }}
          />

          {/* Lang toggle */}
          <button
            onClick={toggleLocale}
            style={{
              ...monoBase,
              color: 'var(--color-dim)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-dim)')}
          >
            {nav('lang')}
          </button>
        </div>

      </div>
    </footer>
  )
}
