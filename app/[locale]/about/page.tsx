import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import AboutHero from '@/components/about/AboutHero'
import AboutManifesto from '@/components/about/AboutManifesto'
import AboutValues from '@/components/about/AboutValues'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'aboutPage.hero' })
  return { title: `LONA — ${t('label').replace('— ', '')}` }
}

export default async function AboutPage() {
  const t = await getTranslations('aboutPage.cta')

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <AboutHero />
        <AboutManifesto />
        <AboutValues />

        {/* CTA final — segue o mesmo padrão visual da homepage */}
        <section
          style={{
            padding: 'clamp(4rem, 8vw, 7rem) 2.5rem clamp(5rem, 10vw, 9rem)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
              lineHeight: 1.05,
              color: 'var(--color-text)',
              marginBottom: '2.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            {t('heading')}
          </h2>

          <Link
            href={t('href')}
            className="group link-hover-text inline-flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-accent)',
              textDecoration: 'none',
            }}
          >
            <span>{t('link')}</span>
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden
            >
              →
            </span>
          </Link>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
