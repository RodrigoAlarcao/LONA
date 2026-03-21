'use client'

import { useRef, useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lang toggle — mantém o mesmo path e params, muda o locale
  const toggleLocale = () => {
    // @ts-expect-error — next-intl typing não suporta params aqui
    router.replace(pathname, { locale: locale === 'pt' ? 'en' : 'pt', params })
  }

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(navRef.current, { opacity: 1, y: 0 })
        return
      }

      // Nav entra de cima depois da hero animation (~1.5s de delay total)
      gsap.fromTo(
        navRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 1.5 }
      )
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-10"
      style={{
        opacity: 0,
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
        background: scrolled ? 'rgba(8, 8, 6, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      {/* Logo — Cormorant, peso visual de galeria */}
      <Link
        href="/"
        className="font-display text-xl font-bold tracking-[-0.02em] transition-opacity duration-300 hover:opacity-70"
        style={{ color: 'var(--color-text)' }}
      >
        LONA
      </Link>

      {/* Links de navegação — desktop */}
      <div className="hidden items-center gap-8 md:flex">
        <Link
          href="/about"
          className="text-label transition-colors duration-300"
          style={{ color: 'var(--color-dim)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
        >
          {t('sobre')}
        </Link>
        <Link
          href="/work"
          className="text-label transition-colors duration-300"
          style={{ color: 'var(--color-dim)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
        >
          {t('trabalho')}
        </Link>
        <Link
          href="/artists"
          className="text-label transition-colors duration-300"
          style={{ color: 'var(--color-dim)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
        >
          {t('artistas')}
        </Link>
      </div>

      {/* CTA + Lang toggle */}
      <div className="flex items-center gap-6">
        <Link
          href="/contact"
          className="group hidden text-label md:inline-flex items-center gap-2"
          style={{ color: 'var(--color-text)', transition: 'color 0.3s ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
        >
          <span>{t('cta')}</span>
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >→</span>
        </Link>

        {/* Separador */}
        <div
          className="hidden h-3 w-px md:block"
          style={{ backgroundColor: 'var(--color-border)', opacity: 0.6 }}
        />

        {/* Lang toggle */}
        <button
          onClick={toggleLocale}
          className="text-label transition-colors duration-300 hover:opacity-100"
          style={{ color: 'var(--color-dim)' }}
        >
          {t('lang')}
        </button>
      </div>
    </nav>
  )
}
