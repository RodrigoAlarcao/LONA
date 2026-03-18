'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export default function Hero() {
  const t = useTranslations('hero')

  const containerRef = useRef<HTMLElement>(null)
  const labelRef     = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const taglineRef   = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const bottomRef    = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ── Reduced motion: mostrar tudo imediatamente ──────────────────
      if (prefersReducedMotion) {
        gsap.set(
          [labelRef.current, titleRef.current, taglineRef.current,
           subRef.current, bottomRef.current],
          { opacity: 1, y: 0, scale: 1, clipPath: 'none' }
        )
        if (ctaRef.current)
          gsap.set(Array.from(ctaRef.current.children), { opacity: 1, y: 0 })
        return
      }

      // ── Estados iniciais (definidos antes do primeiro frame) ─────────
      // Tagline, sub e bottom não têm inline style — GSAP define antes da paint
      gsap.set(taglineRef.current,  { y: 50, opacity: 0 })
      gsap.set(subRef.current,      { y: 28, opacity: 0 })
      gsap.set(bottomRef.current,   { opacity: 0 })
      if (ctaRef.current)
        gsap.set(Array.from(ctaRef.current.children), { y: 18, opacity: 0 })

      // ── Timeline principal ──────────────────────────────────────────
      const tl = gsap.timeline()

      // 1. Label — entra suavemente de cima antes de tudo
      tl.fromTo(
        labelRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0
      )

      // 2. LONA — spray reveal
      //    clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)
      //    "100% da direita" colapsa para "0% da direita" = revela da esquerda
      //    scale 1.015 → 1.0 dá o peso de "tinta a assentar na parede"
      //    ease power3.inOut: arranque lento (pressão a acumular) →
      //    meio rápido (spray a abrir) → desaceleração final (tinta a secar)
      tl.fromTo(
        titleRef.current,
        {
          clipPath: 'inset(0 100% 0 0)',
          scale: 1.015,
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
        },
        0.15  // label aparece ligeiramente antes
      )

      // 3. Tagline sobe com suavidade
      //    Arranca durante o spray (0.7s) — não espera que LONA termine
      //    Dá a sensação de que os elementos emergem em cascata
      tl.to(
        taglineRef.current,
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        0.7
      )

      // 4. Sub — aparece com menos peso
      tl.to(
        subRef.current,
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.95
      )

      // 5. CTAs em stagger — os últimos a aparecer
      if (ctaRef.current) {
        tl.to(
          Array.from(ctaRef.current.children),
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
          1.2
        )
      }

      // 6. Scroll indicator — muito subtil, o último
      tl.to(
        bottomRef.current,
        { opacity: 1, duration: 0.5, ease: 'none' },
        1.55
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pb-8 pt-24 md:px-10 md:pt-28"
    >
      {/* ── Top: label de contexto ──────────────────────────────────── */}
      <div
        ref={labelRef}
        className="flex items-center gap-3"
        style={{ opacity: 0 }}
      >
        <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>
          001
        </span>
        <span
          className="inline-block h-px w-8"
          style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }}
        />
        <span className="text-label">LONA Street</span>
        <span className="text-label" style={{ opacity: 0.3 }}>·</span>
        <span className="text-label">LONA Install</span>
      </div>

      {/* ── Centro: conteúdo principal ──────────────────────────────── */}
      <div className="flex flex-col gap-6 md:gap-7">

        {/* LONA — o elemento que define a página inteira */}
        {/*
          Tamanho: clamp(5.5rem, 14vw, 12.5rem)
          — Mobile 375px: 5.5rem = 88px (LONA ocupa ~360px da largura de 375px)
          — Desktop 1440px: min(14vw=201px, 12.5rem=200px) ≈ 200px
          — Cormorant Garamond 700: letras mais largas que sans-serif → impacto máximo

          clipPath inicial: inset(0 100% 0 0)
          = corta 100% da direita = palavra completamente escondida
          GSAP anima para inset(0 0% 0 0) = completamente revelada

          A metáfora: como um rolo de spray que passa da esquerda para a direita
          e a tinta cobre a parede progressivamente
        */}
        <h1
          ref={titleRef}
          className="font-display font-bold leading-[0.9] tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(5.5rem, 14vw, 12.5rem)',
            color: 'var(--color-text)',
            // Estado inicial: palavra escondida, clipPath do lado direito
            // GSAP vai animar isto para inset(0 0% 0 0)
            clipPath: 'inset(0 100% 0 0)',
            transformOrigin: 'left center',
            // willChange: 'clip-path, transform' — ativa compositing antecipado
            willChange: 'clip-path, transform',
          }}
        >
          LONA
        </h1>

        {/* Tagline — Cormorant light cria tensão com o 700 acima */}
        <h2
          ref={taglineRef}
          className="font-display leading-[1.05]"
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 2.6rem)',
            fontWeight: 300,
            color: 'var(--color-text)',
            maxWidth: '660px',
          }}
        >
          {t('tagline')}
        </h2>

        {/* Sub + CTAs — agrupados para alinhar com a tagline */}
        <div className="flex flex-col gap-6">
          <p
            ref={subRef}
            className="font-body font-light leading-relaxed"
            style={{
              fontSize: '1rem',
              color: 'var(--color-dim)',
              maxWidth: '420px',
              lineHeight: '1.7',
            }}
          >
            {t('sub')}
          </p>

          {/* CTAs — IBM Plex Mono, energia de documento */}
          <div ref={ctaRef} className="flex items-center gap-8">
            {/* CTA Marcas — destaque em accent */}
            <Link
              href="/contact"
              className="group flex items-center gap-2 text-label transition-opacity duration-300 hover:opacity-70"
              style={{ color: 'var(--color-accent)' }}
            >
              <span>{t('ctaBrands')}</span>
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>

            {/* CTA Artistas — mais discreto */}
            <Link
              href="/artists"
              className="group flex items-center gap-2 text-label transition-opacity duration-300 hover:opacity-70"
              style={{ color: 'var(--color-dim)' }}
            >
              <span>{t('ctaArtists')}</span>
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom: scroll indicator ─────────────────────────────────── */}
      <div
        ref={bottomRef}
        className="flex items-center justify-between"
        aria-hidden
      >
        <span
          className="inline-block h-px"
          style={{ width: '40px', backgroundColor: 'var(--color-dim)', opacity: 0.25 }}
        />
        <span className="text-label" style={{ opacity: 0.4 }}>
          Scroll
        </span>
      </div>
    </section>
  )
}
