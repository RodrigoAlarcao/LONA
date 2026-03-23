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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fechar menu ao mudar de rota
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Bloquear scroll do body quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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

  const navLinks = [
    { href: '/about',   label: t('sobre') },
    { href: '/work',    label: t('trabalho') },
    { href: '/artists', label: t('artistas') },
  ]

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-10"
        style={{
          opacity: 0,
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
          background: scrolled || menuOpen ? 'rgba(8, 8, 6, 0.97)' : 'transparent',
          backdropFilter: scrolled && !menuOpen ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled && !menuOpen ? 'blur(12px)' : 'none',
          borderBottom: scrolled && !menuOpen ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-[-0.02em] transition-opacity duration-300 hover:opacity-70"
          style={{ color: 'var(--color-text)' }}
        >
          LONA
        </Link>

        {/* Links de navegação — desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href as any}
              className="text-label transition-colors duration-300"
              style={{ color: 'var(--color-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-dim)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Lang toggle + Hamburger */}
        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="group hidden text-label md:inline-flex items-center gap-2"
            style={{ color: 'var(--color-text)', transition: 'color 0.3s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
          >
            <span>{t('cta')}</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </Link>

          <div className="hidden h-3 w-px md:block" style={{ backgroundColor: 'var(--color-border)', opacity: 0.6 }} />

          <button
            onClick={toggleLocale}
            className="text-label transition-colors duration-300 hover:opacity-100"
            style={{ color: 'var(--color-dim)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('lang')}
          </button>

          {/* Hamburger — só mobile */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden flex flex-col justify-center items-center gap-[5px]"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', width: '28px', height: '28px' }}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            <span style={{
              display: 'block', width: '20px', height: '1.5px',
              backgroundColor: 'var(--color-text)',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none',
              transformOrigin: 'center',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '1.5px',
              backgroundColor: 'var(--color-text)',
              transition: 'opacity 0.2s ease',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '20px', height: '1.5px',
              backgroundColor: 'var(--color-text)',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none',
              transformOrigin: 'center',
            }} />
          </button>
        </div>
      </nav>

      {/* Menu mobile — overlay fullscreen */}
      <div
        className="md:hidden fixed inset-0 z-40 flex flex-col"
        style={{
          background: 'var(--color-bg)',
          paddingTop: '5.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingBottom: '3rem',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Links principais */}
        <nav className="flex flex-col" style={{ gap: '0.25rem', marginBottom: 'auto' }}>
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href as any}
              onClick={() => setMenuOpen(false)}
              className="font-display font-light"
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
                lineHeight: 1.15,
                color: 'var(--color-text)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border)',
                transition: 'color 0.2s ease',
                transitionDelay: `${i * 0.04}s`,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Rodapé do overlay */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2.5rem' }}>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="group inline-flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-accent)',
              textDecoration: 'none',
            }}
          >
            <span>{t('cta')}</span>
            <span aria-hidden>→</span>
          </Link>
          <button
            onClick={() => { toggleLocale(); setMenuOpen(false) }}
            className="text-label self-start"
            style={{ color: 'var(--color-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {t('lang')}
          </button>
        </div>
      </div>
    </>
  )
}
