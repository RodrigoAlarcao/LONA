'use client'

import { useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'

export default function NotFound() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(wrapRef.current, { opacity: 1 })
      return
    }
    gsap.fromTo(wrapRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        ref={wrapRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          opacity: 0,
        }}
      >
        {/* 404 label */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--color-dim)',
            opacity: 0.5,
          }}
        >
          404
        </span>

        {/* Linha accent */}
        <div
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'var(--color-accent)',
          }}
        />

        {/* Headline */}
        <h1
          className="font-display font-light"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          Esta parede não existe.
        </h1>

        {/* Sublinha */}
        <p
          className="font-body font-light"
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--color-dim)',
            margin: 0,
          }}
        >
          Mas temos outras que valem a pena ver.
        </p>

        {/* Link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            marginTop: '0.5rem',
            transition: 'opacity 0.25s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <span>Voltar ao início</span>
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          >
            →
          </span>
        </Link>
      </div>
    </div>
  )
}
