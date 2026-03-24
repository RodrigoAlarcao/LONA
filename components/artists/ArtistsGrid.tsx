'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface Artist {
  slug: string
  name: string
  medium: string
  mediumEn: string
  location: string
  portrait: string
  action: string
}

interface Props {
  artists: Artist[]
  locale: string
  label: string
  heading: string
  editorial: string
  viewArtist: string
  forArtists: string
  forArtistsBody: string
  getInTouch: string
}

export default function ArtistsGrid({
  artists,
  locale,
  label,
  heading,
  editorial,
  viewArtist,
  forArtists,
  forArtistsBody,
  getInTouch,
}: Props) {
  const sectionRef   = useRef<HTMLElement>(null)
  const heroRef      = useRef<HTMLDivElement>(null)
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([])
  const editorialRef = useRef<HTMLDivElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)

  const contactHref = locale === 'en' ? '/en/contact' : '/contacto'
  const artistsBase = locale === 'en' ? '/en/artists' : '/artistas'

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([heroRef.current, ...cardRefs.current, editorialRef.current, ctaRef.current], { opacity: 1 })
        return
      }

      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )

      cardRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })

      gsap.fromTo(
        editorialRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: editorialRef.current, start: 'top 88%', once: true },
        }
      )

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 88%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(7rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(5rem, 10vw, 8rem)',
      }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ marginBottom: 'clamp(3.5rem, 7vw, 6rem)', opacity: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--color-dim)',
            opacity: 0.45,
            marginBottom: '1.5rem',
          }}
        >
          {label}
        </p>
        <h1
          className="font-display font-light"
          style={{
            fontSize: 'clamp(2.75rem, 7vw, 6rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            whiteSpace: 'pre-line',
            margin: 0,
          }}
        >
          {heading}
        </h1>
      </div>

      {/* ── GRID ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(2rem, 4vw, 3.5rem) clamp(1.25rem, 3vw, 2rem)',
        }}
        className="artists-grid"
      >
        {artists.map((artist, i) => {
          const medium = locale === 'en' ? artist.mediumEn : artist.medium
          const isLast = i === artists.length - 1 && artists.length % 3 !== 0

          return (
            <Link
              key={artist.slug}
              href={`${artistsBase}/${artist.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                ref={el => { cardRefs.current[i] = el }}
                className={`artist-card${isLast ? ' artist-card-last' : ''}`}
                style={{ opacity: 0 }}
              >
                {/* Imagem — proporção 3:4 */}
                <div
                  style={{
                    aspectRatio: '3 / 4',
                    width: '100%',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                    backgroundColor: '#161613',
                    position: 'relative',
                  }}
                >
                  {/* Imagem portrait — grayscale por defeito */}
                  <div
                    className="artist-img-primary"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${artist.portrait})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                    }}
                  />
                  {/* Imagem action — fade in no hover */}
                  {artist.action && (
                    <div
                      className="artist-img-secondary"
                      style={{
                        backgroundImage: `url(${artist.action})`,
                      }}
                    />
                  )}

                  {/* CTA overlay */}
                  <div className="artist-cta-overlay">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: '#fff',
                      }}
                    >
                      {viewArtist} →
                    </span>
                  </div>
                </div>

                {/* Info */}
                <h2
                  className="artist-name font-display font-light"
                  style={{
                    fontSize: 'clamp(1.375rem, 2.2vw, 1.875rem)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {artist.name}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-dim)',
                    opacity: 0.5,
                  }}
                >
                  {artist.location} · {medium}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── NOTA EDITORIAL ────────────────────────────────────────────── */}
      <div
        ref={editorialRef}
        style={{
          marginTop: 'clamp(4rem, 8vw, 6rem)',
          paddingTop: 'clamp(2rem, 4vw, 3rem)',
          borderTop: '1px solid var(--color-border)',
          opacity: 0,
        }}
      >
        <p
          className="font-body font-light"
          style={{
            maxWidth: '480px',
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'var(--color-dim)',
            opacity: 0.7,
          }}
        >
          {editorial}
        </p>
      </div>

      {/* ── CTA ARTISTAS ──────────────────────────────────────────────── */}
      <div
        ref={ctaRef}
        style={{
          marginTop: 'clamp(3rem, 6vw, 5rem)',
          paddingTop: 'clamp(2rem, 4vw, 3rem)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
          opacity: 0,
        }}
      >
        <div style={{ maxWidth: '420px' }}>
          <p
            className="font-display font-light"
            style={{
              fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
              lineHeight: 1.2,
              color: 'var(--color-text)',
              marginBottom: '0.75rem',
            }}
          >
            {forArtists}
          </p>
          <p
            className="font-body font-light"
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.75,
              color: 'var(--color-dim)',
              opacity: 0.7,
            }}
          >
            {forArtistsBody}
          </p>
        </div>
        <Link
          href={contactHref}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            padding: '0.875rem 1.5rem',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            alignSelf: 'center',
          }}
          className="cta-artists-btn"
        >
          {getInTouch}
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .artists-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .artist-card-last { grid-column: auto !important; }
        }
        @media (max-width: 540px) {
          .artists-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) {
          .artist-card-last { grid-column: 2; }
        }
        .artist-card { cursor: pointer; }
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
        .artist-card:hover .artist-img-secondary { opacity: 0.85; }
        .artist-cta-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem 1.25rem 1.25rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .artist-card:hover .artist-cta-overlay { opacity: 1; }
        .artist-name { transition: color 0.3s ease; }
        .artist-card:hover .artist-name { color: var(--color-accent) !important; }
        .cta-artists-btn:hover { background: var(--color-text); color: var(--color-bg) !important; }
      `}</style>
    </section>
  )
}
