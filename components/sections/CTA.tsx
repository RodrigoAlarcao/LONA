'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const t = useTranslations('cta')
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const linksRef    = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(
        [headingRef.current, subRef.current, linksRef.current],
        {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(6rem, 14vw, 11rem) 2.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Headline */}
      <h2
        ref={headingRef}
        className="font-display font-light"
        style={{
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          lineHeight: 1.02,
          color: 'var(--color-text)',
          whiteSpace: 'pre-line',
          marginBottom: '2rem',
        }}
      >
        {t('heading')}
      </h2>

      {/* Subtítulo */}
      <p
        ref={subRef}
        className="font-body font-light"
        style={{
          fontSize: '1.0625rem',
          lineHeight: 1.75,
          color: 'var(--color-dim)',
          maxWidth: '520px',
          marginBottom: '3.5rem',
        }}
      >
        {t('sub')}
      </p>

      {/* Links em mono */}
      <div
        ref={linksRef}
        className="flex flex-wrap items-center gap-x-10 gap-y-4"
      >
        {/* CTA primário — accent */}
        <Link
          href={t('ctaPrimaryLink') as any}
          className="group inline-flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            transition: 'opacity 0.25s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <span>{t('ctaPrimary')}</span>
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          >
            →
          </span>
        </Link>

        {/* Separador */}
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '1px',
            height: '0.9em',
            backgroundColor: 'var(--color-border)',
            opacity: 0.6,
            alignSelf: 'center',
          }}
        />

        {/* CTA secundário — dim */}
        <Link
          href={t('ctaSecondaryLink') as any}
          className="group inline-flex items-center gap-2"
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
          <span>{t('ctaSecondary')}</span>
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          >
            →
          </span>
        </Link>
      </div>
    </section>
  )
}
