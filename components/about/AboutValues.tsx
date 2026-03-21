'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

// Imagens associadas a valores específicos (por índice)
const VALUE_IMAGES: Record<number, string> = {
  1: '/images/process/process-artist-planning.jpg',
  3: '/images/process/process-finished-signature.jpg',
}

export default function AboutValues() {
  const t = useTranslations('aboutPage.values')

  const valueKeys = ['v0', 'v1', 'v2', 'v3', 'v4'] as const

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLDivElement>(null)
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs  = useRef<(HTMLDivElement | null)[]>([])

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

      itemRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        })
      })

      // Imagens entram com delay em relação ao texto
      imageRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.18,
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

      {/* Layout editorial — coluna de items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3rem, 5vw, 4.5rem)' }}>
        {valueKeys.map((vk, i) => {
          const hasImage = i in VALUE_IMAGES

          return (
            <div
              key={vk}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(2.5rem, 5vw, 5rem)',
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'clamp(2rem, 3vw, 3rem)',
              }}
            >
              {/* Texto — esquerda */}
              <div
                ref={el => { itemRefs.current[i] = el }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  maxWidth: hasImage ? undefined : '600px',
                }}
              >
                {/* Número de índice */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--color-dim)',
                    opacity: 0.35,
                    marginBottom: '0.25rem',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

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
                    maxWidth: '480px',
                  }}
                >
                  {t(`${vk}Desc` as Parameters<typeof t>[0])}
                </p>
              </div>

              {/* Imagem — direita (só em valores 1 e 3) */}
              {hasImage && (
                <div
                  ref={el => { imageRefs.current[i] = el }}
                  style={{
                    flexShrink: 0,
                    width: '45%',
                    maxWidth: '480px',
                    aspectRatio: '4 / 3',
                    overflow: 'hidden',
                    backgroundColor: '#161613',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={VALUE_IMAGES[i]}
                    alt=""
                    aria-hidden
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      filter: 'grayscale(0.3)',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
