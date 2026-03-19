'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  title: string
  type: string
  year: string
  client: string
  artist: string
}

// Grid spans: big-small, then small-big (3-col grid)
const GRID_COLS: Array<{ col: string; row?: string }> = [
  { col: '1 / 3' },       // Proj 1 — largo (cols 1-2)
  { col: '3 / 4' },       // Proj 2 — estreito (col 3)
  { col: '2 / 4' },       // Proj 3 — largo (cols 2-3), offset
]

export default function Work() {
  const t = useTranslations('work')
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
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const projects = t.raw('projects') as Project[]

  return (
    <article ref={sectionRef} style={{ padding: '7rem 2.5rem 0' }}>

      {/* ── Label ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3" style={{ marginBottom: '4rem' }}>
        <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>005</span>
        <span
          className="inline-block h-px w-8"
          style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }}
        />
        <span className="text-label">{t('label')}</span>
      </div>

      {/* ── Grid assimétrico ───────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(1rem, 2vw, 1.75rem)',
        }}
      >
        {projects.map((project, i) => (
          <div
            key={i}
            ref={el => { if (el) cardsRef.current[i] = el }}
            style={{
              gridColumn: GRID_COLS[i].col,
              opacity: 0, // will be animated in
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 0 5rem' }}>
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
    </article>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Imagem placeholder 4:3 com grayscale */}
      <div
        className="project-image-wrap"
        style={{
          aspectRatio: '4 / 3',
          width: '100%',
          backgroundColor: '#161613',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className="project-image-inner"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#1e1e1a',
            filter: 'grayscale(1)',
            transition: 'filter 0.6s ease',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.filter = 'grayscale(0)')}
          onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.filter = 'grayscale(1)')}
        />
      </div>

      {/* Label: tipo + ano */}
      <p
        className="text-label"
        style={{ color: 'var(--color-dim)', opacity: 0.6 }}
      >
        {project.type} · {project.year}
      </p>

      {/* Título */}
      <h3
        className="font-display font-light"
        style={{
          fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          lineHeight: 1.05,
          color: 'var(--color-text)',
          margin: 0,
        }}
      >
        {project.title}
      </h3>

      {/* Cliente · Artista */}
      <p
        className="text-label"
        style={{ color: 'var(--color-dim)', opacity: 0.55 }}
      >
        {project.client} · {project.artist}
      </p>

    </div>
  )
}
