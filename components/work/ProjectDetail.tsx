'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

interface Project {
  slug: string
  title: string
  titleEn: string
  client: string
  artist: string
  type: string
  year: number
  city: string
  description: string
  descriptionEn: string
  images: string[]
  cover: string
}

interface Labels {
  client: string
  artist: string
  location: string
  year: string
  prev: string
  next: string
}

interface NavProject {
  slug: string
  title: string
}

interface Props {
  project: Project
  locale: string
  prev: NavProject | null
  next: NavProject | null
  labels: Labels
}

export default function ProjectDetail({ project, locale, prev, next, labels }: Props) {
  const title       = locale === 'en' ? project.titleEn : project.title
  const description = locale === 'en' ? project.descriptionEn : project.description
  const typeLabel   = project.type.toUpperCase()

  const mainRef       = useRef<HTMLDivElement>(null)
  const heroRef       = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const techRef       = useRef<HTMLDivElement>(null)
  const descRef       = useRef<HTMLParagraphElement>(null)
  const galleryRef    = useRef<HTMLDivElement>(null)
  const navRef        = useRef<HTMLDivElement>(null)

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  // --- ESC to close lightbox ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // --- Fade-in animations ---
  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const targets = [heroRef.current, techRef.current, descRef.current, galleryRef.current, navRef.current].filter(Boolean)
      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1 })
        return
      }
      gsap.from(targets, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12,
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  // Gallery images: show cover + extra images, pad to at least 4 placeholders
  const galleryImages: Array<string | null> = [
    project.cover,
    ...project.images.filter((img) => img !== project.cover),
  ]
  while (galleryImages.length < 4) galleryImages.push(null)

  return (
    <div ref={mainRef}>

      {/* ── 1. HERO ────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '70vh',
          minHeight: '420px',
          overflow: 'hidden',
          opacity: 0,
        }}
      >
        {/* Placeholder image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#1a1a17',
            backgroundImage: project.cover.startsWith('/images/projects/placeholder')
              ? undefined
              : `url(${project.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Overlay escuro */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.42)',
          }}
        />

        {/* Conteúdo sobre a imagem */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vw, 3.5rem)',
            left: 'clamp(1.5rem, 5vw, 4rem)',
            right: 'clamp(1.5rem, 5vw, 4rem)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '0.875rem',
            }}
          >
            {typeLabel} · {project.year}
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#fff',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* ── 2. FICHA TÉCNICA ────────────────────────────────────────────── */}
      <div
        ref={techRef}
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          opacity: 0,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1.75rem clamp(1.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
          }}
        >
          {[
            { label: labels.client,   value: project.client    },
            { label: labels.artist,   value: project.artist    },
            { label: labels.location, value: project.city      },
            { label: labels.year,     value: String(project.year) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-dim)',
                  opacity: 0.45,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text)',
                  letterSpacing: '0.04em',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. DESCRIÇÃO ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <p
          ref={descRef}
          className="font-body font-light"
          style={{
            maxWidth: '680px',
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: 'var(--color-dim)',
            opacity: 0,
          }}
        >
          {description}
        </p>
      </div>

      {/* ── 4. GALERIA ──────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 7rem)',
        }}
      >
        <div
          ref={galleryRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(0.75rem, 2vw, 1.25rem)',
            opacity: 0,
          }}
        >
          {galleryImages.map((src, i) => (
            <button
              key={i}
              onClick={() => src && setLightboxIdx(i)}
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '4 / 3',
                backgroundColor: '#161613',
                overflow: 'hidden',
                border: 'none',
                padding: 0,
                cursor: src ? 'zoom-in' : 'default',
                position: 'relative',
              }}
              aria-label={src ? `Ver imagem ${i + 1}` : undefined}
            >
              {src && !src.includes('placeholder') ? (
                <img
                  src={src}
                  alt={`${title} — ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: i % 2 === 0 ? '#1e1e1a' : '#181815',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. NAVEGAÇÃO ENTRE PROJECTOS ─────────────────────────────── */}
      <div
        ref={navRef}
        style={{
          borderTop: '1px solid var(--color-border)',
          opacity: 0,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem clamp(1.5rem, 5vw, 4rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-dim)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
            >
              <span style={{ opacity: 0.45 }}>{labels.prev}</span>
              <span>{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/work/${next.slug}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-dim)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                alignItems: 'flex-end',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
            >
              <span style={{ opacity: 0.45 }}>{labels.next}</span>
              <span>{next.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => setLightboxIdx(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              cursor: 'zoom-out',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                position: 'relative',
              }}
            >
              {galleryImages[lightboxIdx] && !galleryImages[lightboxIdx]!.includes('placeholder') ? (
                <img
                  src={galleryImages[lightboxIdx]!}
                  alt={`${title} — lightbox`}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                /* Placeholder no lightbox */
                <div
                  style={{
                    width: 'min(800px, 80vw)',
                    aspectRatio: '4 / 3',
                    backgroundColor: '#1e1e1a',
                  }}
                />
              )}

              {/* Botão fechar */}
              <button
                onClick={() => setLightboxIdx(null)}
                style={{
                  position: 'absolute',
                  top: '-2.5rem',
                  right: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)')}
              >
                ESC / Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
