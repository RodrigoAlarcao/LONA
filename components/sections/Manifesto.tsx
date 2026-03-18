'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function Manifesto() {
  const t = useTranslations('manifesto')

  const sectionRef = useRef<HTMLElement>(null)
  const phrasesRef = useRef<(HTMLParagraphElement | null)[]>([])
  const ctaRef     = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return

      const elements = phrasesRef.current.filter(Boolean) as HTMLParagraphElement[]
      if (!elements.length) return

      // Dividir cada frase pelas suas linhas de renderização
      const splits = elements.map(el => new SplitText(el, { type: 'lines' }))
      const allLines = splits.flatMap(s => s.lines)

      // Estado inicial — escondido
      gsap.set(allLines, { y: 40, opacity: 0 })

      // Timeline única vinculada ao scroll (scrub:1 = suave, 1s de lag)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 50%',
          scrub: 1,
        },
      })

      // Cada linha entra com um offset de 0.12 na timeline
      allLines.forEach((line, i) => {
        tl.to(
          line,
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          i * 0.12
        )
      })

      // CTA — ScrollTrigger próprio, once:true, não acoplado ao scrub
      // Garante visibilidade independentemente do progresso do scroll
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { y: 16, opacity: 0 })
        gsap.to(ctaRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            once: true,
          },
        })
      }

      // Reverter SplitText no cleanup
      return () => splits.forEach(s => s.revert())
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const lines: string[] = t.raw('lines')

  return (
    <section
      ref={sectionRef}
      className="px-6 py-32 md:px-10 md:py-44"
    >
      {/* ── Label de secção ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-16 md:mb-20">
        <span className="text-label" style={{ color: 'var(--color-dim)', opacity: 0.5 }}>
          002
        </span>
        <span
          className="inline-block h-px w-8"
          style={{ backgroundColor: 'var(--color-dim)', opacity: 0.3 }}
        />
        <span className="text-label">{t('label')}</span>
      </div>

      {/* ── Frases — cada uma é uma linha de manifesto ──────────────── */}
      <div className="flex flex-col gap-8 md:gap-10">
        {lines.map((phrase, i) => {
          const isThesis = i === lines.length - 1
          return (
            <p
              key={i}
              ref={el => { phrasesRef.current[i] = el }}
              className="font-display leading-[1.1]"
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                fontWeight: isThesis ? 600 : 300,
                color: isThesis ? 'var(--color-accent)' : 'var(--color-text)',
                maxWidth: '820px',
              }}
            >
              {phrase}
            </p>
          )
        })}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div ref={ctaRef} className="mt-20 md:mt-28">
        <Link
          href={t('ctaLink')}
          className="group inline-flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-dim)',
            textDecoration: 'none',
            transition: 'color 0.25s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
        >
          <span>{t('cta')}</span>
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
