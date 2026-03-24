'use client'

import { useRef } from 'react'
import Image from 'next/image'
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
  artistName: string
  type: string
  year: number
  city: string
  location?: string
  duration?: string
  dimensions?: string
  status?: string
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
  format: string
  duration: string
  dimensions: string
  processCaption: string
  exploration: string
  allWork: string
  prev: string
  next: string
}

interface NavProject {
  slug: string
  title: string
  cover: string
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

  // Extract first sentence (up to 80 chars)
  const conceptText = (() => {
    const match = description.match(/^.{0,80}[^.]*\./)
    return match ? match[0] : description.slice(0, 100)
  })()

  // Image slots — fallback to cover if array is short
  const heroImage    = project.images[0] || project.cover
  const processImage = project.images[1] || project.cover
  const detailImage  = project.images[2] || project.cover

  // Refs
  const mainRef            = useRef<HTMLDivElement>(null)
  const titleRef           = useRef<HTMLHeadingElement>(null)
  const labelRef           = useRef<HTMLParagraphElement>(null)
  const scrollLineRef      = useRef<HTMLDivElement>(null)
  const scrollLineWrapRef  = useRef<HTMLDivElement>(null)
  const heroContainerRef   = useRef<HTMLDivElement>(null)
  const heroImgRef         = useRef<HTMLDivElement>(null)
  const metaRowRef         = useRef<HTMLDivElement>(null)
  const descRef            = useRef<HTMLDivElement>(null)
  const processWrapRef     = useRef<HTMLDivElement>(null)
  const processImgRef      = useRef<HTMLDivElement>(null)
  const galleryRef         = useRef<HTMLDivElement>(null)
  const coverImgRef        = useRef<HTMLDivElement>(null)
  const coverImgInnerRef   = useRef<HTMLDivElement>(null)
  const detailImgRef       = useRef<HTMLDivElement>(null)
  const detailImgInnerRef  = useRef<HTMLDivElement>(null)
  const conceptRef         = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [titleRef.current, labelRef.current, scrollLineWrapRef.current,
           metaRowRef.current, descRef.current, galleryRef.current, conceptRef.current],
          { opacity: 1, y: 0 }
        )
        if (scrollLineRef.current) gsap.set(scrollLineRef.current, { height: '40px' })
        return
      }

      // ── Cap 0: Hero entry animation ───────────────────────────────────
      gsap.timeline()
        .from(titleRef.current, { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
        .from(labelRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.6')
        .from(scrollLineWrapRef.current, { opacity: 0, duration: 0.4 }, '-=0.3')

      // Scroll indicator: loop height 0 → 40px
      if (scrollLineRef.current) {
        gsap.fromTo(
          scrollLineRef.current,
          { height: 0 },
          { height: '40px', duration: 1.2, ease: 'power1.inOut', repeat: -1, yoyo: true }
        )
      }

      // ── Cap 1: Metadata reveal ────────────────────────────────────────
      if (metaRowRef.current) {
        gsap.from(metaRowRef.current, {
          y: 20, opacity: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: metaRowRef.current, start: 'top 85%', once: true },
        })
      }

      // ── Cap 2: Description reveal ─────────────────────────────────────
      if (descRef.current) {
        gsap.from(descRef.current, {
          y: 20, opacity: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: descRef.current, start: 'top 85%', once: true },
        })
      }

      // ── Cap 0: Hero parallax ─────────────────────────────────────────
      if (heroImgRef.current && heroContainerRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ── Cap 3: Process image parallax ─────────────────────────────────
      if (processImgRef.current && processWrapRef.current) {
        gsap.to(processImgRef.current, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: processWrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ── Cap 4: Cover parallax ────────────────────────────────────────
      if (coverImgInnerRef.current && coverImgRef.current) {
        gsap.to(coverImgInnerRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: coverImgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ── Cap 4: Detail parallax ───────────────────────────────────────
      if (detailImgInnerRef.current && detailImgRef.current) {
        gsap.to(detailImgInnerRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: detailImgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ── Cap 4: Asymmetric gallery stagger ─────────────────────────────
      if (galleryRef.current) {
        const items = [coverImgRef.current, detailImgRef.current].filter(Boolean)
        gsap.from(items, {
          y: 60, opacity: 0, stagger: 0.2, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: galleryRef.current, start: 'top 75%', once: true },
        })
      }

      // ── Cap 5: Concept reveal ─────────────────────────────────────────
      if (conceptRef.current) {
        gsap.from(conceptRef.current, {
          y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: conceptRef.current, start: 'top 80%', once: true },
        })
      }
    }, mainRef)

    return () => ctx.revert()
  }, [])

  // Metadata — linha 1: quem/onde/quando
  const mainCols = [
    { label: labels.client,   value: project.client },
    { label: labels.artist,   value: project.artistName },
    { label: labels.location, value: project.location || project.city },
    { label: labels.year,     value: String(project.year) },
  ]

  // Metadata — linha 2: especificações técnicas
  const formatValue = project.type === 'street' ? 'LONA Street' : 'LONA Install'
  const secondaryCols = [
    { label: labels.format,     value: formatValue },
    ...(project.duration   ? [{ label: labels.duration,   value: project.duration   }] : []),
    ...(project.dimensions ? [{ label: labels.dimensions, value: project.dimensions }] : []),
  ]

  return (
    <div ref={mainRef}>

      {/* ── Cap. 0 — HERO (full viewport) ──────────────────────────────── */}
      <div
        ref={heroContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100svh',
          minHeight: '560px',
          overflow: 'hidden',
        }}
      >
        <div
          ref={heroImgRef}
          style={{
            position: 'absolute',
            top: '-10%',
            bottom: '-10%',
            left: 0,
            right: 0,
            willChange: 'transform',
          }}
        >
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </div>

        {/* Gradient overlay — text legível sem escurecer a imagem */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(8,8,6,0.85) 0%, transparent 60%)',
          }}
        />

        {/* Bottom-left: label + title */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vw, 3.5rem)',
            left: 'clamp(1.5rem, 5vw, 4rem)',
            right: 'clamp(6rem, 10vw, 8rem)',
          }}
        >
          <p
            ref={labelRef}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-dim)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {typeLabel} · {project.year}
            {project.status === 'exploracao' && (
              <span
                style={{
                  border: '1px solid var(--color-border)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '2px',
                  fontSize: '0.625rem',
                  letterSpacing: '0.14em',
                }}
              >
                {labels.exploration}
              </span>
            )}
          </p>

          <h1
            ref={titleRef}
            className="font-display"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom-right: scroll indicator */}
        <div
          ref={scrollLineWrapRef}
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vw, 3.5rem)',
            right: 'clamp(1.5rem, 5vw, 4rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            ref={scrollLineRef}
            style={{
              width: '1px',
              height: 0,
              backgroundColor: 'var(--color-dim)',
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      {/* ── Cap. 1 — METADATA ──────────────────────────────────────────── */}
      <div ref={metaRowRef}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>

          {/* Linha 1 — principal: cliente, artista, localização, ano */}
          <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '2rem 0' }}>
            <div
              className="meta-row-1"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}
            >
              {mainCols.map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    paddingLeft:  i > 0 ? 'clamp(1rem, 2vw, 2rem)' : 0,
                    paddingRight: i < mainCols.length - 1 ? 'clamp(1rem, 2vw, 2rem)' : 0,
                    borderRight:  i < mainCols.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                      textTransform: 'uppercase', letterSpacing: '0.14em',
                      color: 'var(--color-dim)', opacity: 0.45,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: '1.1rem', fontWeight: 300, color: 'var(--color-text)', lineHeight: 1.2 }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Linha 2 — secundária: formato, duração, dimensões */}
          {secondaryCols.length > 0 && (
            <div
              className="meta-row-2"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, paddingTop: '1.5rem', paddingBottom: '0.5rem' }}
            >
              {secondaryCols.map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    paddingRight: i < secondaryCols.length - 1 ? 'clamp(1rem, 2vw, 2rem)' : 0,
                    display: 'flex', flexDirection: 'column', gap: '0.375rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                      textTransform: 'uppercase', letterSpacing: '0.14em',
                      color: 'var(--color-dim)', opacity: 0.45,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                      color: 'var(--color-text)', opacity: 0.7, letterSpacing: '0.04em',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Cap. 2 — DESCRIÇÃO ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <div ref={descRef} style={{ maxWidth: '560px' }}>
          {/* Linha decorativa de galeria */}
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-accent)',
              marginBottom: '2rem',
            }}
          />
          <p
            className="font-body"
            style={{
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--color-dim)',
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* ── Cap. 3 — PROCESSO (full bleed) ─────────────────────────────── */}
      <div
        ref={processWrapRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '70vh',
          minHeight: '380px',
          overflow: 'hidden',
        }}
      >
        <div
          ref={processImgRef}
          style={{
            position: 'absolute',
            top: '-15%',
            bottom: '-15%',
            left: 0,
            right: 0,
          }}
        >
          <Image
            src={processImage}
            alt={`${title} — processo`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </div>

        {/* Caption */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: 'clamp(1.5rem, 5vw, 4rem)',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {labels.processCaption}{project.duration ? ` · ${project.duration}` : ''}
          </span>
        </div>
      </div>

      {/* ── Cap. 4 — A OBRA (layout assimétrico) ───────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <div
          ref={galleryRef}
          className="obra-grid"
          style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}
        >
          {/* Cover — 60% */}
          <div
            ref={coverImgRef}
            className="obra-cover"
            style={{
              flex: '0 0 60%',
              position: 'relative',
              height: '600px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={coverImgInnerRef}
              style={{
                position: 'absolute',
                top: '-10%',
                bottom: '-10%',
                left: 0,
                right: 0,
                willChange: 'transform',
              }}
            >
              <Image
                src={project.cover}
                alt={`${title} — obra`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>

          {/* Detail — 40% */}
          <div
            ref={detailImgRef}
            className="obra-detail"
            style={{
              flex: '1 1 0',
              position: 'relative',
              height: '600px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={detailImgInnerRef}
              style={{
                position: 'absolute',
                top: '-10%',
                bottom: '-10%',
                left: 0,
                right: 0,
                willChange: 'transform',
              }}
            >
              <Image
                src={detailImage}
                alt={`${title} — detalhe`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Cap. 5 — CONCEITO / CITAÇÃO ────────────────────────────────── */}
      <div
        ref={conceptRef}
        style={{
          padding: '7.5rem clamp(1.5rem, 5vw, 4rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Título como textura de fundo */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(4rem, 8vw, 8rem)',
              fontWeight: 300,
              color: 'var(--color-text)',
              opacity: 0.07,
              whiteSpace: 'nowrap',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {title}
          </span>
        </div>

        {/* Texto em primeiro plano */}
        <p
          className="font-body"
          style={{
            position: 'relative',
            maxWidth: '640px',
            margin: '0 auto',
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: 'var(--color-dim)',
          }}
        >
          {conceptText}
        </p>
      </div>

      {/* ── Cap. 6 — NAVEGAÇÃO ENTRE PROJETOS ──────────────────────────── */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '40vh',
          minHeight: '260px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {/* Lado esquerdo — Prev */}
        {prev ? (
          <Link
            href={{ pathname: '/work/[slug]', params: { slug: prev.slug } }}
            className="nav-link"
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="nav-img-wrap" style={{ position: 'absolute', inset: 0 }}>
              <Image
                src={prev.cover}
                alt={prev.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="50vw"
              />
            </div>
            <div className="nav-text-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-dim)',
                  marginBottom: '0.75rem',
                }}
              >
                {labels.prev}
              </p>
              <p
                className="font-display"
                style={{
                  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  fontWeight: 300,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href={{ pathname: '/work' } as any}
            className="nav-link"
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--color-dim)',
                margin: 0,
              }}
            >
              {labels.allWork}
            </p>
          </Link>
        )}

        {/* Divisor */}
        <div style={{ width: '1px', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

        {/* Lado direito — Next */}
        {next ? (
          <Link
            href={{ pathname: '/work/[slug]', params: { slug: next.slug } }}
            className="nav-link"
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="nav-img-wrap" style={{ position: 'absolute', inset: 0 }}>
              <Image
                src={next.cover}
                alt={next.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="50vw"
              />
            </div>
            <div className="nav-text-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-dim)',
                  marginBottom: '0.75rem',
                }}
              >
                {labels.next}
              </p>
              <p
                className="font-display"
                style={{
                  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  fontWeight: 300,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                {next.title}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href={{ pathname: '/work' } as any}
            className="nav-link"
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--color-dim)',
                margin: 0,
              }}
            >
              {labels.allWork}
            </p>
          </Link>
        )}
      </div>

      {/* CSS global para efeitos de hover (CSS-only, sem GSAP) */}
      <style>{`
        .nav-img-wrap {
          filter: brightness(0.3);
          transition: filter 0.5s ease;
        }
        .nav-link:hover .nav-img-wrap {
          filter: brightness(0.5);
        }
        .nav-text-content {
          transition: transform 0.3s ease;
        }
        .nav-link:hover .nav-text-content {
          transform: translateY(-4px);
        }

        /* Mobile: metadata em 2 colunas */
        @media (max-width: 767px) {
          .meta-row-1 { grid-template-columns: repeat(2, 1fr) !important; }
          .meta-row-2 { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* Mobile: gallery assimétrico empilhado (detail primeiro) */
        @media (max-width: 767px) {
          .obra-grid {
            flex-direction: column !important;
          }
          .obra-cover {
            flex: none !important;
            width: 100% !important;
            height: 280px !important;
            order: 2;
          }
          .obra-detail {
            flex: none !important;
            width: 100% !important;
            height: 220px !important;
            order: 1;
          }
        }
      `}</style>
    </div>
  )
}
