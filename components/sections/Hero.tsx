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
  const rightRef     = useRef<HTMLDivElement>(null)
  const bgImageRef     = useRef<HTMLImageElement>(null)
  const revealLayerRef = useRef<HTMLImageElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ── Reduced motion: mostrar tudo imediatamente ──────────────────
      if (prefersReducedMotion) {
        gsap.set(
          [labelRef.current, titleRef.current, taglineRef.current,
           subRef.current, bottomRef.current, rightRef.current],
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
      gsap.set(rightRef.current,    { opacity: 0 })
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

      // 6. Scroll indicator + right anchor — muito subtis, os últimos
      tl.to(
        bottomRef.current,
        { opacity: 1, duration: 0.5, ease: 'none' },
        1.55
      )
      tl.to(
        rightRef.current,
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
        1.3
      )
    }, containerRef)

    // Paint-brush trail — desactivado em touch devices
    const container = containerRef.current
    const isTouch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const cleanupFns: (() => void)[] = []

    if (!isTouch && container) {
      const canvas   = canvasRef.current
      const drawCtx  = canvas?.getContext('2d')
      if (canvas && drawCtx) {
        // Ajustar canvas ao container
        const resize = () => {
          const r = container.getBoundingClientRect()
          canvas.width  = r.width
          canvas.height = r.height
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(container)

        // Trail de pontos — cada um tem posição e timestamp
        const TRAIL_MS = 1800
        const MAX_PTS  = 30
        const points: { x: number; y: number; t: number }[] = []

        const handleMouseMove = (e: MouseEvent) => {
          const r = canvas.getBoundingClientRect()
          points.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: Date.now() })
          if (points.length > MAX_PTS) points.shift()
        }

        // rAF loop — desenha trail e compõe imagem pintada
        let rafId = 0
        const paintedImg = revealLayerRef.current

        const draw = () => {
          rafId = requestAnimationFrame(draw)
          const now = Date.now()

          // Remover pontos expirados
          while (points.length && now - points[0].t > TRAIL_MS) points.shift()

          drawCtx.clearRect(0, 0, canvas.width, canvas.height)

          if (!points.length || !paintedImg?.complete) return

          // ── Fase 1: desenhar manchas de tinta (máscara de alpha) ──────
          drawCtx.globalCompositeOperation = 'source-over'
          const n = points.length
          points.forEach((pt, i) => {
            const ageFrac = (now - pt.t) / TRAIL_MS      // 0=fresco 1=velho
            const idxFrac = i / (n > 1 ? n - 1 : 1)     // 0=mais antigo 1=mais recente
            const alpha   = (1 - ageFrac) * 0.88
            if (alpha <= 0) return
            const radius  = 35 + idxFrac * 85            // 35px → 120px

            const grad = drawCtx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius)
            grad.addColorStop(0,   `rgba(0,0,0,${alpha})`)
            grad.addColorStop(0.45, `rgba(0,0,0,${(alpha * 0.65).toFixed(3)})`)
            grad.addColorStop(1,   'rgba(0,0,0,0)')
            drawCtx.fillStyle = grad
            drawCtx.beginPath()
            drawCtx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
            drawCtx.fill()
          })

          // ── Fase 2: imagem pintada apenas onde existe alpha do trail ──
          drawCtx.globalCompositeOperation = 'source-in'
          drawCtx.drawImage(paintedImg, 0, 0, canvas.width, canvas.height)
          drawCtx.globalCompositeOperation = 'source-over'
        }

        container.addEventListener('mousemove', handleMouseMove)
        rafId = requestAnimationFrame(draw)

        cleanupFns.push(
          () => container.removeEventListener('mousemove', handleMouseMove),
          () => cancelAnimationFrame(rafId),
          () => ro.disconnect(),
        )
      }
    }

    return () => {
      ctx.revert()
      cleanupFns.forEach(fn => fn())
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-8 pt-24 md:px-10 md:pt-28"
    >
      {/* ── Layer 1: lona vazia (base) ───────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgImageRef}
        src="/images/hero-lona-empty.jpg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 2: lona pintada — hidden, usada pelo canvas drawImage ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={revealLayerRef}
        src="/images/hero-lona-painted.jpg"
        alt=""
        aria-hidden
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
      />

      {/* ── Layer 3: canvas — trail de pincel + compositing ───────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top: label de contexto ──────────────────────────────────── */}
      <div
        ref={labelRef}
        className="flex items-center gap-3"
        style={{ opacity: 0, position: 'relative', zIndex: 10 }}
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
      <div className="flex flex-col gap-6 md:gap-7" style={{ position: 'relative', zIndex: 10 }}>

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
        <div className="flex flex-col gap-4">
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

          {/* CTAs — IBM Plex Mono, maior presença */}
          <div ref={ctaRef} className="flex items-center gap-6">
            {/* CTA Marcas — destaque em accent */}
            <Link
              href="/contact"
              className="group flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-70"
              style={{
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              <span>{t('ctaBrands')}</span>
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>

            {/* Separador */}
            <span
              className="inline-block w-px h-4"
              style={{ backgroundColor: 'var(--color-dim)', opacity: 0.25 }}
              aria-hidden
            />

            {/* CTA Artistas — mais discreto */}
            <Link
              href="/artists"
              className="group flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-70"
              style={{
                color: 'var(--color-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
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

      {/* ── Direita: âncora de composição ────────────────────────────── */}
      <div
        ref={rightRef}
        className="hidden md:flex flex-col items-center absolute right-10 top-1/2 -translate-y-1/2"
        style={{ opacity: 0, zIndex: 10 }}
        aria-hidden
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--color-dim)',
            opacity: 0.35,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Lisboa, Portugal
        </span>
        <span
          className="mt-5 inline-block w-px"
          style={{ height: '56px', backgroundColor: 'var(--color-accent)', opacity: 0.45 }}
        />
      </div>

      {/* ── Bottom: scroll indicator ─────────────────────────────────── */}
      <div
        ref={bottomRef}
        className="flex items-center justify-between"
        style={{ position: 'relative', zIndex: 10 }}
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
