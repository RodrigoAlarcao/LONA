'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import artistsData from '@/data/artists.json'

gsap.registerPlugin(ScrollTrigger)

interface Artist {
  name: string
  city: string
  medium: string
}

export default function Artists() {
  const t = useTranslations('artists')

  // Desktop
  const pinnedRef = useRef<HTMLDivElement>(null)
  const trackRef  = useRef<HTMLDivElement>(null)

  // Mobile
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    if (prefersReducedMotion) return

    if (isMobile) {
      // Mobile: fade-in simples por card, sem pin nem scrub
      const ctx = gsap.context(() => {
        mobileCardRefs.current.forEach((el, i) => {
          if (!el) return
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: (i % 2) * 0.1,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,
            },
          })
        })
      })
      return () => ctx.revert()
    }

    // Desktop: horizontal scroll pinado
    const ctx = gsap.context(() => {
      const track  = trackRef.current
      const pinned = pinnedRef.current
      if (!track || !pinned) return

      const totalWidth = track.scrollWidth - pinned.offsetWidth

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: pinned,
          start: 'top top',
          end: '+=' + totalWidth,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, pinnedRef)

    return () => ctx.revert()
  }, [])

  const artists = t.raw('list') as Artist[]

  // Header partilhado
  const Header = () => (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>004</span>
      <span className="inline-block h-px w-8" style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }} />
      <span className="text-label">{t('label')}</span>
    </div>
  )

  return (
    <article>
      {/* ─────────────────────────────────────────────────────────────────
          MOBILE: grid 2 colunas, sem GSAP pin
      ───────────────────────────────────────────────────────────────── */}
      <div className="md:hidden" style={{ padding: '4rem 1.5rem 3rem' }}>
        <Header />

        <h2
          className="font-display font-light leading-[1.05]"
          style={{
            fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
            color: 'var(--color-text)',
            whiteSpace: 'pre-line',
            marginBottom: '2rem',
          }}
        >
          {t('heading')}
        </h2>

        {/* Grid 2 colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1rem' }}>
          {artists.map((artist, i) => (
            <div
              key={i}
              ref={el => { mobileCardRefs.current[i] = el }}
              className="flex flex-col"
              style={{ gap: '0.75rem' }}
            >
              {/* Imagem quadrada */}
              <div style={{
                aspectRatio: '1 / 1',
                width: '100%',
                backgroundColor: '#161613',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#1e1e1a',
                  backgroundImage: artistsData[i]?.cover ? `url(${artistsData[i].cover})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  filter: 'grayscale(0.5)',
                }} />
              </div>

              {/* Nome */}
              <h3
                className="font-display font-light"
                style={{
                  fontSize: 'clamp(1rem, 4vw, 1.3rem)',
                  lineHeight: 1.1,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                {artist.name}
              </h3>

              {/* Cidade */}
              <p className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.6, margin: 0 }}>
                {artist.city}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '2.5rem' }}>
          <Link
            href={t('ctaLink') as any}
            className="group inline-flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-dim)',
              textDecoration: 'none',
            }}
          >
            <span>{t('cta')}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          DESKTOP: scroll horizontal pinado (comportamento original)
      ───────────────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        {/* Header estático acima do scroll */}
        <div style={{ padding: '5rem 2.5rem 2.5rem' }}>
          <Header />
          <h2
            className="font-display font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
              color: 'var(--color-text)',
              maxWidth: '420px',
              whiteSpace: 'pre-line',
            }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* Secção pinned */}
        <div ref={pinnedRef} className="relative overflow-hidden" style={{ height: '100vh' }}>
          <div
            ref={trackRef}
            className="flex h-full items-center"
            style={{
              paddingLeft: 'clamp(80px, 15vw, 200px)',
              paddingRight: 'clamp(80px, 15vw, 200px)',
              gap: '5rem',
              willChange: 'transform',
            }}
          >
            {artists.map((artist, i) => (
              <div
                key={i}
                className="artist-card flex-shrink-0 flex flex-col"
                style={{ width: 'clamp(260px, 26vw, 400px)', gap: '1.5rem' }}
              >
                <div style={{
                  aspectRatio: '1 / 1',
                  width: '100%',
                  backgroundColor: '#161613',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div
                    className="artist-img-primary"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: '#1e1e1a',
                      backgroundImage: artistsData[i]?.cover ? `url(${artistsData[i].cover})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                    }}
                  />
                  {artistsData[i]?.images?.[1] && (
                    <div
                      className="artist-img-secondary"
                      style={{ backgroundImage: `url(${artistsData[i].images[1]})` }}
                    />
                  )}
                </div>

                <h3
                  className="artist-name font-display font-light"
                  style={{
                    fontSize: 'clamp(1.75rem, 2.8vw, 2.6rem)',
                    lineHeight: 1.05,
                    color: 'var(--color-text)',
                    marginTop: '0.25rem',
                  }}
                >
                  {artist.name}
                </h3>

                <p className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.7 }}>
                  {artist.city} · {artist.medium}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA desktop */}
        <div style={{ padding: '2rem 2.5rem 5rem' }}>
          <Link
            href={t('ctaLink') as any}
            className="group inline-flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-dim)',
              textDecoration: 'none',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
          >
            <span>{t('cta')}</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <style>{`
        .artist-card { cursor: default; }
        .artist-img-primary {
          filter: grayscale(1);
          transform: scale(1);
          transition: filter 0.6s ease, transform 0.6s ease;
        }
        .artist-card:hover .artist-img-primary { filter: grayscale(0); transform: scale(1.03); }
        .artist-img-secondary {
          position: absolute; inset: 0;
          background-size: cover; background-position: center top;
          opacity: 0; transition: opacity 0.5s ease; pointer-events: none;
        }
        .artist-card:hover .artist-img-secondary { opacity: 1; }
        .artist-name { transition: color 0.3s ease; }
        .artist-card:hover .artist-name { color: var(--color-accent) !important; }
      `}</style>
    </article>
  )
}
