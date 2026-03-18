# SKILL — Microinteractions
**Stack: Next.js App Router + Tailwind CSS + GSAP**
*Usar este documento quando o projecto precisa de cursor customizado, hover effects, magnetic buttons, ou outras microinterações que elevam a experiência de nível funcional para nível Awwwards.*

---

## Contexto e Filosofia

Microinterações são a diferença entre um site bem construído e um site que se sente *vivo*. Não são decoração — são a camada de resposta que comunica qualidade ao utilizador sem que ele perceba porquê.

**Regra de ouro:** Uma microinteração bem feita é invisível. O utilizador sente que o site responde bem — não que o site tem animações.

### Hierarquia de Ferramentas para Microinterações

| Tipo de microinteração | Ferramenta preferida |
|---|---|
| Hover states simples (cor, opacity, scale) | CSS puro — `transition` |
| Animações de entrada/saída de elementos | Animista (CSS keyframes) |
| Cursor customizado | GSAP |
| Magnetic buttons | GSAP |
| Hover com distorção ou efeito complexo | GSAP |
| Scroll reveals simples | GSAP ScrollTrigger |

**Regra:** Não usar GSAP onde CSS resolve. GSAP é para o que CSS não consegue fazer de forma limpa.

---

## Recurso: Animista

**URL:** https://animista.net

Biblioteca de CSS animations on-demand, gratuita para uso pessoal e comercial (licença FreeBSD). Funciona como playground: ajustas duração, easing, delay e copias o CSS gerado.

### Quando usar Animista

- Animações de entrada de elementos UI (badges, tags, cards)
- Estados de loading (spinners, pulsos)
- Feedback de sucesso/erro em formulários
- Efeitos de atenção (shake, bounce, pulse)
- Qualquer animação de um único elemento sem dependência de scroll ou outros elementos

### Quando NÃO usar Animista

- Animações orquestradas (múltiplos elementos em sequência) → usar GSAP timeline
- Scroll-driven animations → usar GSAP ScrollTrigger
- Animações dependentes de estado React (mount/unmount) → usar Framer Motion

### Como integrar no projecto

```css
/* globals.css — adicionar os keyframes do Animista aqui */
/* Exemplo: scale-up-center */
@keyframes scale-up-center {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
```

```tsx
// Uso em componente React
<div className={isVisible ? 'animate-scale-up' : ''}>
  conteúdo
</div>
```

⚠ **Não importar Animista como dependência npm.** Copiar apenas os keyframes necessários para `globals.css`. Zero bundle overhead.

---

## 1. Custom Cursor

O padrão mais identificável de sites Awwwards. O cursor substitui o default do browser por um elemento DOM animado com GSAP.

### Arquitectura

```
components/
  ui/
    CustomCursor.tsx   ← componente do cursor
hooks/
  useCursor.ts         ← lógica de movimento e estados
```

### Hook — `useCursor.ts`

```typescript
'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export function useCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null) // círculo maior, segue com delay

  const moveCursor = useCallback((e: MouseEvent) => {
    const { clientX: x, clientY: y } = e

    // Cursor principal — movimento imediato
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0,       // sem delay — 1:1 com o rato
      ease: 'none',
    })

    // Follower — segue com inércia
    gsap.to(followerRef.current, {
      x,
      y,
      duration: 0.4,     // delay visual cria sensação de peso
      ease: 'power2.out',
    })
  }, [])

  const handleHoverEnter = useCallback(() => {
    gsap.to(followerRef.current, {
      scale: 2.5,        // expande ao entrar em elemento interactivo
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const handleHoverLeave = useCallback(() => {
    gsap.to(followerRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('mousemove', moveCursor)

    // Aplicar hover effect em todos os elementos interactivos
    const interactives = document.querySelectorAll('a, button, [data-cursor]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', handleHoverEnter)
      el.addEventListener('mouseleave', handleHoverLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverEnter)
        el.removeEventListener('mouseleave', handleHoverLeave)
      })
    }
  }, [moveCursor, handleHoverEnter, handleHoverLeave])

  return { cursorRef, followerRef }
}
```

### Componente — `CustomCursor.tsx`

```tsx
'use client'

import { useCursor } from '@/hooks/useCursor'

export function CustomCursor() {
  const { cursorRef, followerRef } = useCursor()

  return (
    <>
      {/* Ponto central — move 1:1 com o rato */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]
                   bg-[var(--color-accent)] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />

      {/* Follower — círculo maior com inércia */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]
                   border border-[var(--color-accent)] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform', opacity: 0.7 }}
      />
    </>
  )
}
```

### Integração no layout

```tsx
// app/layout.tsx
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="cursor-none"> {/* Esconder cursor default */}
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
```

### Variantes de cursor

```tsx
// data-cursor="text" — cursor muda para modo texto (ver secção 1.1)
// data-cursor="drag" — cursor muda para modo drag em carousels
// data-cursor="view" — cursor muda para "VIEW" em imagens de projecto

// Exemplo de uso:
<div data-cursor="view">
  <img src="..." />
</div>
```

**Regra mobile:** Desactivar completamente em touch devices. O cursor não faz sentido sem rato.

```tsx
// Adicionar ao início do useCursor
const isTouchDevice = 'ontouchstart' in window
if (isTouchDevice) return { cursorRef: { current: null }, followerRef: { current: null } }
```

---

## 2. Magnetic Buttons

Botões que "atraem" o cursor quando está próximo. Efeito premium muito associado a agências criativas.

### Hook — `useMagnetic.ts`

```typescript
'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Distância do cursor ao centro do botão
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(el, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)', // efeito elástico de retorno — sinal de qualidade
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return { ref }
}
```

### Uso em componente

```tsx
'use client'

import { useMagnetic } from '@/hooks/useMagnetic'

export function MagneticButton({ children, ...props }) {
  const { ref } = useMagnetic(0.4) // 0.4 = força moderada (0.2 suave, 0.6 intenso)

  return (
    <button
      ref={ref}
      style={{ willChange: 'transform', display: 'inline-block' }}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Regra de uso:** Aplicar apenas em CTAs primários e elementos de destaque. Nunca em todos os botões da página — perde o impacto.

---

## 3. Text Hover Effects

### 3.1 SplitText Scramble (efeito "hacker")

```tsx
'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const scramble = useCallback(() => {
    const el = ref.current
    if (!el) return

    let iteration = 0
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      el.innerText = text
        .split('')
        .map((char, i) => {
          if (i < iteration) return text[i] // já resolvido
          if (char === ' ') return ' '
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      if (iteration >= text.length) {
        clearInterval(intervalRef.current)
      }
      iteration += 0.5 // velocidade de resolução
    }, 30)
  }, [text])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    if (ref.current) ref.current.innerText = text
  }, [text])

  return (
    <span
      ref={ref}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className="cursor-pointer font-mono"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {text}
    </span>
  )
}
```

### 3.2 Underline Reveal com CSS (preferir sobre GSAP para hovers simples)

```css
/* globals.css */
.link-underline {
  position: relative;
  display: inline-block;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

```tsx
<a href="/about" className="link-underline">About</a>
```

---

## 4. Image Hover Effects

### 4.1 Scale + Reveal de Caption (CSS)

```tsx
export function ProjectCard({ image, title, year }) {
  return (
    <div className="group relative overflow-hidden">
      <img
        src={image}
        className="w-full h-full object-cover
                   transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                   group-hover:scale-105" // scale suave — nunca > 1.08
        alt={title}
      />

      {/* Caption revela ao hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                      transition-colors duration-500 flex items-end p-6">
        <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-400 ease-out">
          <p className="text-white font-mono text-xs uppercase tracking-widest">{year}</p>
          <h3 className="text-white text-xl font-bold mt-1">{title}</h3>
        </div>
      </div>
    </div>
  )
}
```

### 4.2 Parallax em mousemove com GSAP

Para imagens hero onde o fundo se move suavemente com o rato:

```tsx
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export function ParallaxHero({ src }: { src: string }) {
  const imageRef = useRef<HTMLImageElement>(null)

  useIsomorphicLayoutEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const xPos = (clientX / window.innerWidth - 0.5) * 20  // ±10px
      const yPos = (clientY / window.innerHeight - 0.5) * 20

      gsap.to(imageRef.current, {
        x: xPos,
        y: yPos,
        duration: 0.8,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="overflow-hidden">
      <img
        ref={imageRef}
        src={src}
        className="w-[110%] h-[110%] object-cover -ml-[5%] -mt-[5%]"
        // 110% para ter margem de movimento sem revelar edges
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
```

---

## 5. Scroll Reveal — Padrão Base

O reveal mais comum. Usar como base para todos os elementos que entram no viewport.

```tsx
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: React.ReactNode
  y?: number       // distância vertical (default: 40)
  delay?: number   // delay em segundos (default: 0)
}

export function Reveal({ children, y = 40, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',         // trigger quando 85% do viewport
          toggleActions: 'play none none none', // uma vez apenas
        }
      })
    }, ref)

    return () => ctx.revert()
  }, [y, delay])

  return (
    <div ref={ref} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  )
}
```

```tsx
// Uso:
<Reveal delay={0.1}>
  <h2>Título da secção</h2>
</Reveal>
<Reveal delay={0.2}>
  <p>Parágrafo que segue o título</p>
</Reveal>
```

---

## 6. Loading States com Animista

Para feedback de UI (submissão de formulário, carregamento de dados), usar Animista em vez de GSAP:

```css
/* globals.css — copiar de animista.net */

/* Pulse — para indicadores de "a carregar" */
@keyframes pulse-scale {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Fade in — para conteúdo que aparece */
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Shake — para erros de formulário */
@keyframes shake-horizontal {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70% { transform: translateX(-6px); }
  20%, 40%, 60% { transform: translateX(6px); }
  80% { transform: translateX(4px); }
  90% { transform: translateX(-4px); }
}

.animate-pulse-scale { animation: pulse-scale 1.5s ease-in-out infinite; }
.animate-fade-in { animation: fade-in 0.4s ease both; }
.animate-shake { animation: shake-horizontal 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; }
```

```tsx
// Feedback de erro num input
<input className={hasError ? 'animate-shake border-red-500' : ''} />

// Indicador de loading
<div className="w-4 h-4 rounded-full bg-[var(--color-accent)] animate-pulse-scale" />
```

---

## 7. Performance — Checklist

- [ ] `pointer-events-none` no cursor — nunca interferir com cliques
- [ ] `cursor-none` no `<body>` quando custom cursor activo
- [ ] `will-change: transform` apenas em elementos que animam activamente — remover após animação se possível
- [ ] CSS puro para hovers simples — não usar GSAP onde `transition` resolve
- [ ] Magnetic buttons apenas em CTAs de destaque — nunca em todos os botões
- [ ] Custom cursor desactivado em touch devices (verificar `'ontouchstart' in window`)
- [ ] `prefers-reduced-motion`: desactivar cursor follower e magnetic, manter funcionalidade base
- [ ] Testar com DevTools → Performance → verificar que não há jank (frame drops)

---

## 8. Mobile e Acessibilidade

```typescript
// Utilitário — verificar se é touch device
export const isTouchDevice = () =>
  typeof window !== 'undefined' && 'ontouchstart' in window

// Utilitário — verificar prefers-reduced-motion
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

```tsx
// Padrão de uso em hooks de microinteração
useIsomorphicLayoutEffect(() => {
  if (isTouchDevice() || prefersReducedMotion()) return
  // setup de animações aqui
}, [])
```

**Regras:**
- Custom cursor e magnetic buttons: desactivar em touch e reduced-motion
- Scroll reveals: em reduced-motion, mostrar imediatamente sem animação (`gsap.set` com estado final)
- Text scramble: desactivar em reduced-motion, manter texto estático
- Image parallax: desactivar em reduced-motion, manter imagem estática

---

## Quick Reference

```
Custom cursor:     GSAP to() com duration:0 (ponto) + duration:0.4 (follower)
Magnetic button:   GSAP to() com elastic.out no mouseleave
Text scramble:     setInterval nativo — não precisa GSAP
Underline hover:   CSS puro — transition + scaleX
Image hover:       CSS puro — group-hover Tailwind
Image parallax:    GSAP to() com mousemove listener
Scroll reveal:     GSAP ScrollTrigger com start:'top 85%'
Loading/feedback:  Animista CSS keyframes (zero JS)
```

---

## Recursos

- **Animista** — https://animista.net — CSS animations on-demand, gratuito (FreeBSD)
- **Made with GSAP** — https://gsap.com/showcase — inspiração para efeitos mais avançados
- **GSAP Easing Visualizer** — https://gsap.com/docs/v3/Eases — escolher easings com precisão

---

*Compatível com FOUNDATION_LANDING.md v1.2*
*Próximo SKILL previsto: SKILL_HERO_CINEMATICO.md (retrospectiva Lavande)*
