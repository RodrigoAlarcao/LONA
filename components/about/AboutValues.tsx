'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

export default function AboutValues() {
  const t = useTranslations('aboutPage.values')

  // Structure is hardcoded, text comes from translations
  const valueKeys = ['v0', 'v1', 'v2', 'v3', 'v4'] as const

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLDivElement>(null)
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([])

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, start: 'top 80%', once: true },
      })

      itemRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 2.5rem clamp(5rem, 10vw, 9rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Label */}
      <div
        ref={labelRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '4rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-dim)',
            opacity: 0.4,
          }}
        >
          {t('label')}
        </span>
        <span
          style={{
            display: 'inline-block',
            height: '1px',
            width: '2rem',
            backgroundColor: 'var(--color-dim)',
            opacity: 0.25,
          }}
        />
      </div>

      {/* Grid 2 colunas */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: 'clamp(3rem, 5vw, 4.5rem) clamp(3rem, 6vw, 6rem)' }}
      >
        {valueKeys.map((vk, i) => (
          <div
            key={vk}
            ref={el => { itemRefs.current[i] = el }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.375rem, 2.2vw, 1.75rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: 'var(--color-text)',
                letterSpacing: '-0.01em',
              }}
            >
              {t(`${vk}Title` as Parameters<typeof t>[0])}
            </h3>
            <p
              className="font-body font-light"
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--color-dim)',
                maxWidth: '420px',
              }}
            >
              {t(`${vk}Desc` as Parameters<typeof t>[0])}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
