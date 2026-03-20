'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

export default function Formats() {
  const t = useTranslations('formats')

  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const streetRef   = useRef<HTMLDivElement>(null)
  const installRef  = useRef<HTMLDivElement>(null)
  const decorRef    = useRef<HTMLImageElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return

      // Heading — entra sozinho primeiro
      gsap.from(headingRef.current, {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      // Imagem decorativa — fade in ao entrar no viewport
      gsap.from(decorRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      // Dois blocos em stagger — 0.18s de delay entre eles
      gsap.from([streetRef.current, installRef.current], {
        y: 48,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: streetRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-32 md:px-10 md:py-44"
    >
      {/* ── Imagem decorativa de processo ────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={decorRef}
        src="/images/process/process-spray-detail.jpg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '45%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.10,
          zIndex: 0,
          pointerEvents: 'none',
          WebkitMaskImage: [
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.8) 55%, transparent 100%)',
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          ].join(', '),
          WebkitMaskComposite: 'source-in',
          maskImage: [
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.8) 55%, transparent 100%)',
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          ].join(', '),
          maskComposite: 'intersect',
        }}
      />
      {/* ── Label de secção ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-16 md:mb-20">
        <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>
          003
        </span>
        <span
          className="inline-block h-px w-8"
          style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }}
        />
        <span className="text-label">{t('label')}</span>
      </div>

      {/* ── Heading de secção ───────────────────────────────────────── */}
      <h2
        ref={headingRef}
        className="font-display font-light leading-[1.05] mb-20 md:mb-28"
        style={{
          fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
          color: 'var(--color-text)',
          maxWidth: '600px',
          whiteSpace: 'pre-line',
        }}
      >
        {t('heading')}
      </h2>

      {/* ── Dois blocos — grid editorial sem borders ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-16 lg:gap-24">

        {/* LONA Street */}
        <div ref={streetRef} className="flex flex-col gap-7">
          {/* Label */}
          <div className="flex items-center gap-3">
            <span
              className="text-label"
              style={{ color: 'var(--color-accent)', opacity: 0.8 }}
            >
              {t('street.label').toUpperCase()} — {t('street.index')}
            </span>
          </div>

          {/* Título */}
          <h3
            className="font-display font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              color: 'var(--color-text)',
            }}
          >
            {t('street.title')}
          </h3>

          {/* Descrição */}
          <p
            className="font-body font-light leading-relaxed"
            style={{
              fontSize: '1rem',
              color: 'var(--color-dim)',
              lineHeight: '1.75',
              maxWidth: '480px',
            }}
          >
            {t('street.description')}
          </p>

          {/* Linha de detalhe */}
          <p
            className="text-label"
            style={{
              color: 'var(--color-dim)',
              opacity: 0.5,
              marginTop: '0.5rem',
            }}
          >
            {t('street.detail')}
          </p>
        </div>

        {/* LONA Install */}
        <div ref={installRef} className="flex flex-col gap-7">
          {/* Label */}
          <div className="flex items-center gap-3">
            <span
              className="text-label"
              style={{ color: 'var(--color-dim)', opacity: 0.6 }}
            >
              {t('install.label').toUpperCase()} — {t('install.index')}
            </span>
          </div>

          {/* Título */}
          <h3
            className="font-display font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              color: 'var(--color-text)',
            }}
          >
            {t('install.title')}
          </h3>

          {/* Descrição */}
          <p
            className="font-body font-light leading-relaxed"
            style={{
              fontSize: '1rem',
              color: 'var(--color-dim)',
              lineHeight: '1.75',
              maxWidth: '480px',
            }}
          >
            {t('install.description')}
          </p>

          {/* Linha de detalhe */}
          <p
            className="text-label"
            style={{
              color: 'var(--color-dim)',
              opacity: 0.5,
              marginTop: '0.5rem',
            }}
          >
            {t('install.detail')}
          </p>
        </div>

      </div>
    </section>
  )
}
