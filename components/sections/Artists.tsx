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

  const pinnedRef = useRef<HTMLDivElement>(null)
  const trackRef  = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const track  = trackRef.current
      const pinned = pinnedRef.current
      if (!track || !pinned) return
      if (prefersReducedMotion) return

      // Distância total a percorrer = largura do track - largura visível
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

  return (
    <article>
      {/* ── Secção pinned — scroll horizontal ────────────────────────── */}
      <div
        ref={pinnedRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Label 004 — fica fixo durante o scroll horizontal */}
        <div
          className="absolute flex items-center gap-3 z-10"
          style={{ top: '2.5rem', left: '2.5rem' }}
        >
          <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>
            004
          </span>
          <span
            className="inline-block h-px w-8"
            style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }}
          />
          <span className="text-label">{t('label')}</span>
        </div>

        {/* Track — este div translada em X com GSAP */}
        <div
          ref={trackRef}
          className="flex h-full items-start"
          style={{
            paddingTop: '7.5rem',
            paddingLeft: '2.5rem',
            paddingRight: '12vw',
            gap: '5rem',
            willChange: 'transform',
          }}
        >
          {artists.map((artist, i) => (
            <div
              key={i}
              className="artist-card flex-shrink-0 flex flex-col"
              style={{
                width: 'clamp(260px, 26vw, 400px)',
                gap: '1.5rem',
              }}
            >
              {/* Imagem quadrada */}
              <div
                style={{
                  aspectRatio: '1 / 1',
                  width: '100%',
                  backgroundColor: '#161613',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Imagem principal — grayscale por defeito */}
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
                {/* Segunda imagem — fade in no hover */}
                {artistsData[i]?.images?.[1] && (
                  <div
                    className="artist-img-secondary"
                    style={{
                      backgroundImage: `url(${artistsData[i].images[1]})`,
                    }}
                  />
                )}
              </div>

              {/* Nome */}
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

              {/* Cidade · Médium */}
              <p
                className="text-label"
                style={{ color: 'var(--color-dim)', opacity: 0.7 }}
              >
                {artist.city} · {artist.medium}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA — abaixo do scroll pinned ────────────────────────────── */}
      <div
        className="flex items-center"
        style={{ padding: '4rem 2.5rem 5rem' }}
      >
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
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          >
            →
          </span>
        </Link>
      </div>

      <style>{`
        .artist-card { cursor: default; }
        .artist-img-primary {
          filter: grayscale(1);
          transform: scale(1);
          transition: filter 0.6s ease, transform 0.6s ease;
        }
        .artist-card:hover .artist-img-primary {
          filter: grayscale(0);
          transform: scale(1.03);
        }
        .artist-img-secondary {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .artist-card:hover .artist-img-secondary { opacity: 1; }
        .artist-name { transition: color 0.3s ease; }
        .artist-card:hover .artist-name { color: var(--color-accent) !important; }
      `}</style>
    </article>
  )
}
