import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'
import SmoothScroll from '@/components/SmoothScroll'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contactPage' })
  return {
    title: `LONA — ${t('heading')}`,
  }
}

export default async function ContactPage() {
  const t = await getTranslations('contactPage')

  return (
    <SmoothScroll>
      <Nav />
      <main
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Grid principal ──────────────────────────────────────────── */}
        <section
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4rem',
            padding: 'clamp(7rem, 14vw, 10rem) 2.5rem clamp(4rem, 8vw, 6rem)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
          }}
          className="md:grid-cols-[1fr_1fr] lg:grid-cols-[5fr_6fr]"
        >

          {/* ── Lado esquerdo: info ──────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              paddingTop: '0.25rem',
            }}
          >
            {/* Label de secção */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--color-dim)',
                opacity: 0.55,
              }}
            >
              {t('sectionLabel')}
            </span>

            {/* Headline */}
            <h1
              className="font-display font-light"
              style={{
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                lineHeight: 1.0,
                color: 'var(--color-text)',
                letterSpacing: '-0.01em',
              }}
            >
              {t('heading')}
            </h1>

            {/* Sub */}
            <p
              className="font-body font-light"
              style={{
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'var(--color-dim)',
                maxWidth: '380px',
              }}
            >
              {t('sub')}
            </p>

            {/* Email directo */}
            <a
              href={`mailto:${t('email')}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                textTransform: 'lowercase',
                letterSpacing: '0.05em',
                color: 'var(--color-dim)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                marginTop: '0.5rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
            >
              {t('email')}
            </a>
          </div>

          {/* ── Lado direito: formulário ────────────────────────────── */}
          <div
            style={{
              paddingTop: '0.25rem',
            }}
          >
            <ContactForm />
          </div>

        </section>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
