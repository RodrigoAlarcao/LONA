'use client'

import { useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import projectsData from '@/data/projects.json'

gsap.registerPlugin(ScrollTrigger)

// Grid spans: big-small, then small-big (3-col grid)
const GRID_COLS: Array<{ col: string }> = [
  { col: '1 / 3' },  // largo (cols 1-2)
  { col: '3 / 4' },  // estreito (col 3)
  { col: '2 / 4' },  // largo (cols 2-3), offset
]

// Mostrar só os 3 primeiros na homepage
const projects = projectsData.slice(0, 3)

export default function Work() {
  const t      = useTranslations('work')
  const locale = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef   = useRef<HTMLDivElement[]>([])

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const verLabel = locale === 'en' ? 'See project' : 'Ver projecto'

  return (
    <article ref={sectionRef} style={{ padding: '7rem 2.5rem 0' }}>

      {/* ── Label ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3" style={{ marginBottom: '4rem' }}>
        <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>005</span>
        <span className="inline-block h-px w-8" style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }} />
        <span className="text-label">{t('label')}</span>
      </div>

      {/* ── Grid assimétrico ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(1rem, 2vw, 1.75rem)' }}>
        {projects.map((project, i) => {
          const title = locale === 'en' ? project.titleEn : project.title
          return (
            <div
              key={project.slug}
              ref={el => { if (el) cardsRef.current[i] = el }}
              style={{ gridColumn: GRID_COLS[i].col, opacity: 0 }}
            >
              <Link
                href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                className="project-card"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textDecoration: 'none', cursor: 'pointer' }}
              >
                {/* Imagem 4:3 com grayscale */}
                <div style={{ aspectRatio: '4 / 3', width: '100%', backgroundColor: '#161613', overflow: 'hidden', position: 'relative' }}>
                  <div
                    className="project-image-inner"
                    style={{ position: 'absolute', inset: 0, backgroundColor: '#1e1e1a', filter: 'grayscale(1)', transition: 'filter 0.6s ease' }}
                  />
                </div>

                {/* Tipo · Ano */}
                <p className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.6 }}>
                  {project.type.toUpperCase()} · {project.year}
                </p>

                {/* Título */}
                <h3 className="font-display font-light" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', lineHeight: 1.05, color: 'var(--color-text)', margin: 0 }}>
                  {title}
                </h3>

                {/* Cliente · Artista */}
                <p className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.55 }}>
                  {project.client} · {project.artistName}
                </p>

                {/* Hover label */}
                <p
                  className="project-hover-label"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--color-dim)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    margin: 0,
                  }}
                >
                  {verLabel} →
                </p>
              </Link>
            </div>
          )
        })}
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 0 5rem' }}>
        <Link
          href={t('ctaLink') as any}
          className="group inline-flex items-center gap-3"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-dim)', textDecoration: 'none', transition: 'color 0.25s ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
        >
          <span>{t('cta')}</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
        </Link>
      </div>

      {/* CSS: hover no card activa imagem color + label */}
      <style>{`
        .project-card:hover .project-image-inner { filter: grayscale(0) !important; }
        .project-card:hover .project-hover-label { opacity: 1 !important; }
      `}</style>
    </article>
  )
}
