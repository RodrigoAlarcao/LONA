'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface Artist {
  slug: string
  name: string
  location: string
  medium: string
  mediumEn: string
  bio: string
  bioEn: string
  portrait: string
  action: string
}

interface Project {
  slug: string
  title: string
  titleEn: string
  client: string
  type: string
  year: number
  cover: string
  status?: string
}

interface Labels {
  associatedProject: string
  viewProject: string
  allArtists: string
  exploration: string
}

interface Props {
  artist: Artist
  project: Project | null
  locale: string
  labels: Labels
}

export default function ArtistDetail({ artist, project, locale, labels }: Props) {
  const sectionRef      = useRef<HTMLElement>(null)
  const heroRef         = useRef<HTMLDivElement>(null)
  const portraitRef     = useRef<HTMLDivElement>(null)
  const portraitImgRef  = useRef<HTMLDivElement>(null)
  const bioRef          = useRef<HTMLDivElement>(null)
  const actionOuterRef  = useRef<HTMLDivElement>(null)
  const actionInnerRef  = useRef<HTMLDivElement>(null)
  const projectCardRef  = useRef<HTMLDivElement>(null)
  const backRef         = useRef<HTMLDivElement>(null)

  const bio    = locale === 'en' ? artist.bioEn    : artist.bio
  const medium = locale === 'en' ? artist.mediumEn : artist.medium

  const artistsHref  = locale === 'en' ? '/en/artists'  : '/artistas'
  const workHref     = locale === 'en' ? '/en/work'     : '/trabalho'
  const projectTitle = project ? (locale === 'en' ? project.titleEn : project.title) : null

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [heroRef.current, portraitRef.current, bioRef.current, actionOuterRef.current, projectCardRef.current, backRef.current],
          { opacity: 1 }
        )
        return
      }

      // Hero fade in on mount
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      )

      // Portrait + bio stagger
      gsap.fromTo(
        [portraitRef.current, bioRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: portraitRef.current, start: 'top 85%', once: true },
        }
      )

      // Portrait parallax on scroll
      if (portraitImgRef.current) {
        gsap.fromTo(
          portraitImgRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: portraitRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // Action image parallax
      if (actionInnerRef.current) {
        gsap.fromTo(
          actionInnerRef.current,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: actionOuterRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // Action outer fade
      gsap.fromTo(
        actionOuterRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: actionOuterRef.current, start: 'top 85%', once: true },
        }
      )

      // Project card
      gsap.fromTo(
        projectCardRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: projectCardRef.current, start: 'top 88%', once: true },
        }
      )

      // Back link
      gsap.fromTo(
        backRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: backRef.current, start: 'top 92%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <article ref={sectionRef}>

      {/* ── CAP. 0 — HERO ─────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(8rem, 14vw, 12rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)',
          opacity: 0,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--color-dim)',
            opacity: 0.45,
            marginBottom: '1.75rem',
          }}
        >
          {artist.location} · {medium}
        </p>
        <h1
          className="font-display font-light"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          {artist.name}
        </h1>
      </div>

      {/* ── CAP. 1 — PORTRAIT + BIO ───────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 7rem)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'start',
        }}
        className="artist-portrait-grid"
      >
        {/* Portrait */}
        <div
          ref={portraitRef}
          style={{
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#161613',
            opacity: 0,
          }}
        >
          <div
            ref={portraitImgRef}
            style={{
              position: 'absolute',
              top: '-8%',
              bottom: '-8%',
              left: 0,
              right: 0,
              willChange: 'transform',
            }}
          >
            <Image
              src={artist.portrait}
              alt={artist.name}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              priority
            />
          </div>
        </div>

        {/* Bio */}
        <div
          ref={bioRef}
          style={{
            paddingTop: 'clamp(1rem, 3vw, 3rem)',
            opacity: 0,
          }}
        >
          <p
            className="font-body font-light"
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
              lineHeight: 1.8,
              color: 'var(--color-dim)',
              opacity: 0.85,
              marginBottom: '2rem',
            }}
          >
            {bio}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-dim)',
              opacity: 0.4,
            }}
          >
            {artist.location}
          </p>
        </div>
      </div>

      {/* ── CAP. 2 — ACTION IMAGE (full bleed) ────────────────────────── */}
      <div
        ref={actionOuterRef}
        style={{
          width: '100%',
          height: '70vh',
          overflow: 'hidden',
          position: 'relative',
          opacity: 0,
          marginBottom: 'clamp(4rem, 8vw, 7rem)',
        }}
      >
        <div
          ref={actionInnerRef}
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
            src={artist.action}
            alt={`${artist.name} — em acção`}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* ── CAP. 3 — PROJETO ASSOCIADO ────────────────────────────────── */}
      {project && (
        <div
          ref={projectCardRef}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 7rem)',
            opacity: 0,
          }}
        >
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
            {labels.associatedProject}
          </p>

          <Link
            href={`${workHref}/${project.slug}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block', maxWidth: '560px' }}
            className="project-card-link"
          >
            {/* Cover */}
            <div
              style={{
                aspectRatio: '16 / 9',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#161613',
                marginBottom: '1.25rem',
              }}
            >
              <Image
                src={project.cover}
                alt={projectTitle ?? project.title}
                fill
                sizes="(max-width: 767px) 100vw, 560px"
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                className="project-card-img"
              />
              {project.status === 'exploracao' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--color-bg)',
                    background: 'var(--color-text)',
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  {labels.exploration}
                </span>
              )}
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h3
                  className="font-display font-light project-card-title"
                  style={{
                    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text)',
                    marginBottom: '0.375rem',
                  }}
                >
                  {projectTitle}
                </h3>
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
                  {project.client} · {project.year}
                </p>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-dim)',
                  opacity: 0.5,
                  whiteSpace: 'nowrap',
                }}
                className="project-card-cta"
              >
                {labels.viewProject} →
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* ── BACK LINK ─────────────────────────────────────────────────── */}
      <div
        ref={backRef}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem)',
          borderTop: '1px solid var(--color-border)',
          paddingTop: 'clamp(2rem, 4vw, 3rem)',
          opacity: 0,
        }}
      >
        <Link
          href={artistsHref}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-dim)',
            opacity: 0.5,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          className="back-link"
        >
          {labels.allArtists}
        </Link>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .artist-portrait-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .project-card-link:hover .project-card-img { transform: scale(1.04); }
        .project-card-link:hover .project-card-title { color: var(--color-accent) !important; }
        .project-card-link:hover .project-card-cta { opacity: 1 !important; }
        .back-link:hover { opacity: 1 !important; }
      `}</style>
    </article>
  )
}
