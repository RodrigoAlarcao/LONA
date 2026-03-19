'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

type Block = { type: 'p' | 'em'; text: string }

export default function AboutManifesto() {
  const t = useTranslations('aboutPage.manifesto')
  const blocks = t.raw('blocks') as Block[]

  const sectionRef = useRef<HTMLElement>(null)
  const blockRefs  = useRef<(HTMLElement | null)[]>([])

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      blockRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
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

      {/* Blocos do manifesto */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {blocks.map((block, i) => {
          if (block.type === 'em') {
            return (
              <p
                key={i}
                ref={el => { blockRefs.current[i] = el }}
                className="font-display"
                style={{
                  fontSize: 'clamp(1.375rem, 2.5vw, 1.75rem)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  lineHeight: 1.35,
                  color: 'var(--color-text)',
                  whiteSpace: 'pre-line',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {block.text}
              </p>
            )
          }

          return (
            <p
              key={i}
              ref={el => { blockRefs.current[i] = el }}
              className="font-body font-light"
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'var(--color-dim)',
              }}
            >
              {block.text}
            </p>
          )
        })}
      </div>
    </section>
  )
}
