'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  src: string
  alt?: string
}

export default function AboutProcessImage({ src, alt = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef       = useRef<HTMLImageElement>(null)

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Fade-in do container
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      })

      // Parallax na imagem
      gsap.fromTo(
        imgRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '60vh',
        overflow: 'hidden',
        margin: '6rem 0',
        position: 'relative',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        aria-hidden={!alt}
        style={{
          position: 'absolute',
          top: '-15%',
          bottom: '-15%',
          left: 0,
          right: 0,
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
