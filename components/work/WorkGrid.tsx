'use client'

import { useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  slug: string
  title: string
  titleEn: string
  client: string
  artist: string
  type: string
  year: number
  city: string
  cover: string
}

interface Labels {
  heading: string
  all: string
  street: string
  install: string
  noProjects: string
}

interface Props {
  projects: Project[]
  locale: string
  labels: Labels
}

type Filter = 'all' | 'street' | 'install'

export default function WorkGrid({ projects, locale, labels }: Props) {
  const [active, setActive] = useState<Filter>('all')
  const sectionRef     = useRef<HTMLElement>(null)
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs      = useRef<(HTMLDivElement | null)[]>([])
  const containerRefs  = useRef<(HTMLDivElement | null)[]>([])

  const filtered = active === 'all' ? projects : projects.filter((p) => p.type === active)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Parallax nas imagens
      imageRefs.current.forEach((img, i) => {
        const container = containerRefs.current[i]
        if (!img || !container) return
        gsap.fromTo(
          img,
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [active])

  const filterStyle = (f: Filter): React.CSSProperties => ({
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    background: 'none',
    border: 'none',
    padding: '0.25rem 0',
    cursor: 'pointer',
    color: active === f ? 'var(--color-text)' : 'var(--color-dim)',
    opacity: active === f ? 1 : 0.45,
    borderBottom: active === f ? '1px solid var(--color-text)' : '1px solid transparent',
    transition: 'color 0.2s ease, opacity 0.2s ease',
  })

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(7rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(5rem, 10vw, 8rem)',
      }}
    >
      {/* Heading */}
      <h1
        className="font-display font-light"
        style={{
          fontSize: 'clamp(2.75rem, 7vw, 6rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        {labels.heading}
      </h1>

      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1.25rem',
        }}
      >
        {(['all', 'street', 'install'] as Filter[]).map((f) => (
          <button key={f} style={filterStyle(f)} onClick={() => setActive(f)}>
            {f === 'all' ? labels.all : f === 'street' ? labels.street : labels.install}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'var(--color-dim)',
            opacity: 0.45,
          }}
        >
          {labels.noProjects}
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {filtered.map((project, i) => {
            const title = locale === 'en' ? project.titleEn : project.title
            return (
              <div
                key={project.slug}
                ref={el => { cardRefs.current[i] = el }}
              >
                <Link
                  href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                  className="project-card"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }}
                >
                  {/* Imagem */}
                  <div
                    ref={el => { containerRefs.current[i] = el }}
                    style={{ aspectRatio: '4 / 3', width: '100%', backgroundColor: '#161613', overflow: 'hidden', marginBottom: '0.5rem', position: 'relative' }}
                  >
                    <div
                      ref={el => { imageRefs.current[i] = el }}
                      className="project-image-inner"
                      style={{
                        position: 'absolute',
                        top: '-15%',
                        bottom: '-15%',
                        left: 0,
                        right: 0,
                        backgroundColor: i % 2 === 0 ? '#1e1e1a' : '#181815',
                        backgroundImage: project.cover.includes('placeholder') ? undefined : `url(${project.cover})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        willChange: 'transform',
                      }}
                    />
                  </div>

                  {/* Meta */}
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-dim)', opacity: 0.5, margin: 0 }}>
                    {project.type.toUpperCase()} · {project.year}
                  </p>

                  <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', lineHeight: 1.05, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.01em' }}>
                    {title}
                  </h2>

                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-dim)', opacity: 0.45, letterSpacing: '0.06em', margin: 0 }}>
                    {project.client} · {project.city}
                  </p>

                  {/* Hover label */}
                  <p
                    className="project-hover-label"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-dim)', opacity: 0, transition: 'opacity 0.3s ease', margin: 0 }}
                  >
                    {locale === 'en' ? 'See project' : 'Ver projecto'} →
                  </p>
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* CSS: hover activa imagem scale + label */}
      <style>{`
        .project-card:hover .project-image-inner { transform: scale(1.03) !important; }
        .project-card:hover .project-hover-label { opacity: 1 !important; }
      `}</style>
    </section>
  )
}
