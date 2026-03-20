'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface Artist {
  slug: string
  name: string
  nameEn: string
  medium: string
  mediumEn: string
  location: string
  cover: string
  images: string[]
}

interface Props {
  artists: Artist[]
  locale: string
  label: string
  heading: string
  editorial: string
}

export default function ArtistsGrid({ artists, locale, label, heading, editorial }: Props) {
  const sectionRef  = useRef<HTMLElement>(null)
  const heroRef     = useRef<HTMLDivElement>(null)
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([])
  const editorialRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([heroRef.current, ...cardRefs.current, editorialRef.current], { opacity: 1 })
        return
      }

      // Hero entra primeiro
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )

      // Cards em stagger ao scroll
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

      // Nota editorial
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
          const name   = locale === 'en' ? artist.nameEn   : artist.name
          const medium = locale === 'en' ? artist.mediumEn : artist.medium

          return (
            <div
              key={artist.slug}
              ref={el => { cardRefs.current[i] = el }}
              className="artist-card"
              style={{ opacity: 0 }}
            >
              {/* Imagem — quadrada */}
              <div
                style={{
                  aspectRatio: '1 / 1',
                  width: '100%',
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                  backgroundColor: '#161613',
                  position: 'relative',
                }}
              >
                {/* Imagem principal — grayscale por defeito */}
                <div
                  className="artist-img-primary"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: i % 2 === 0 ? '#1e1e1a' : '#181815',
                    backgroundImage: artist.cover.includes('placeholder') ? undefined : `url(${artist.cover})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                  }}
                />
                {/* Segunda imagem — fade in no hover */}
                {artist.images?.[1] && (
                  <div
                    className="artist-img-secondary"
                    style={{
                      backgroundImage: `url(${artist.images[1]})`,
                    }}
                  />
                )}
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
                {name}
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

      <style>{`
        @media (max-width: 900px) {
          .artists-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .artists-grid { grid-template-columns: 1fr !important; }
        }
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
    </section>
  )
}
