'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

export default function AboutManifesto() {
  const t = useTranslations('aboutPage.manifesto')

  // Block order and type are structural — hardcoded here, text comes from translations
  const blocks: Array<{ key: string; type: 'p' | 'em' }> = [
    { key: 'p0', type: 'p' },
    { key: 'p1', type: 'p' },
    { key: 'p2', type: 'p' },
    { key: 'p3', type: 'p' },
    { key: 'p4', type: 'p' },
    { key: 'em0', type: 'em' },
    { key: 'em1', type: 'em' },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const blockRefs  = useRef<(HTMLElement | null)[]>([])

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Só atrasar se a página carregou no topo (hero visível)
      const isAtTop = window.scrollY === 0

      blockRefs.current.forEach((el) => {
        if (!el) return

        // Calcular se o elemento já está visível no viewport ao carregar
        const rect = el.getBoundingClientRect()
        const inViewOnLoad = rect.top < window.innerHeight * 0.82
        const delay = isAtTop && inViewOnLoad ? 1.4 : 0

        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '0 2.5rem clamp(5rem, 10vw, 8rem)',
        maxWidth: '680px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Label de secção */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--color-dim)',
          opacity: 0.4,
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '1.5rem',
            height: '1px',
            backgroundColor: 'var(--color-dim)',
            opacity: 0.4,
          }}
        />
        {t('label')}
      </div>

      {/* Blocos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {blocks.map(({ key, type }, i) => {
          const text = t(key as Parameters<typeof t>[0])

          if (type === 'em') {
            return (
              <p
                key={key}
                ref={el => { blockRefs.current[i] = el }}
                className="font-display"
                style={{
                  fontSize: 'clamp(1.375rem, 2.5vw, 1.75rem)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  lineHeight: 1.35,
                  color: 'var(--color-text)',
                  whiteSpace: 'pre-line',
                  marginTop: '0.75rem',
                  marginBottom: '0.75rem',
                }}
              >
                {text}
              </p>
            )
          }

          return (
            <p
              key={key}
              ref={el => { blockRefs.current[i] = el }}
              className="font-body font-light"
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'var(--color-dim)',
              }}
            >
              {text}
            </p>
          )
        })}
      </div>
    </section>
  )
}
