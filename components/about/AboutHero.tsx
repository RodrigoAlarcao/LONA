'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export default function AboutHero() {
  const t = useTranslations('aboutPage.hero')

  const wrapperRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([labelRef.current, headingRef.current], { opacity: 1, y: 0, clipPath: 'none' })
        return
      }

      const tl = gsap.timeline()

      // Label — entra de cima, subtil
      tl.fromTo(
        labelRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
        0
      )

      // Headline — clipPath spray reveal, igual ao hero da homepage
      tl.fromTo(
        headingRef.current,
        { clipPath: 'inset(0 100% 0 0)', scale: 1.012 },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          duration: 1.15,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
        },
        0.12
      )
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={wrapperRef}
      style={{
        padding: 'clamp(7rem, 14vw, 10rem) 2.5rem clamp(4rem, 8vw, 6rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Label */}
      <div
        ref={labelRef}
        style={{ opacity: 0, marginBottom: '2.5rem' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-dim)',
            opacity: 0.55,
          }}
        >
          {t('label')}
        </span>
      </div>

      {/* Headline */}
      <h1
        ref={headingRef}
        className="font-display font-light"
        style={{
          fontSize: 'clamp(3rem, 6.5vw, 6rem)',
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
          whiteSpace: 'pre-line',
          clipPath: 'inset(0 100% 0 0)',
          willChange: 'clip-path, transform',
        }}
      >
        {t('heading')}
      </h1>
    </section>
  )
}
