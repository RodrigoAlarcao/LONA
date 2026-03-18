**SKILL — REFERENCE COMPONENT**

*Hero GSAP com anotações linha a linha*

v1.0 — Rodrigo Mendes

| *Este documento é a "rosetta stone" de GSAP para este stack.* *Lê antes de implementar qualquer hero animado. Cada decisão está anotada com o porquê.* *Stack: Next.js 14 App Router \+ Tailwind CSS v3 \+ GSAP* |
| :---- |

# **1\. O Que Este Componente Demonstra**

Um hero completo com:

* Timeline de entrada orquestrada (badge → título → descrição → CTA)

* useIsomorphicLayoutEffect — SSR-safe em Next.js App Router

* gsap.context().revert() — cleanup correcto sem memory leaks

* ScrollTrigger reveal no scroll para elements abaixo do hero

* prefers-reduced-motion — acessibilidade obrigatória

* Refs em vez de document.querySelector — padrão React correcto

# **2\. Estrutura de Ficheiros**

| app/   page.tsx                    ← importa HeroSection components/   features/     HeroSection.tsx           ← componente principal (este ficheiro) hooks/   useIsomorphicLayoutEffect.ts ← hook SSR-safe (obrigatório) |
| :---- |

# **3\. Hook useIsomorphicLayoutEffect**

Criar sempre antes de qualquer componente GSAP. Sem este hook, Next.js lança warnings de servidor.

| // hooks/useIsomorphicLayoutEffect.ts import { useEffect, useLayoutEffect } from 'react' export const useIsomorphicLayoutEffect \=  // nome descritivo — não usar useLayoutEffect diretamente   typeof window \!== 'undefined'  // no servidor, window não existe     ? useLayoutEffect  // no browser: useLayoutEffect (síncrono, evita flash)     : useEffect  // no servidor SSR: useEffect (não corre no server) |
| :---- |

# **4\. HeroSection.tsx — Componente Completo Anotado**

## **4.1 Imports e Diretivas**

| 'use client'  // obrigatório: GSAP só corre no browser import { useRef } from 'react'  // refs para elementos DOM import gsap from 'gsap'  // core GSAP import { ScrollTrigger } from 'gsap/ScrollTrigger'  // plugin de scroll — importar do subpath import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'  // hook SSR-safe gsap.registerPlugin(ScrollTrigger)  // registar UMA vez por componente que usa ScrollTrigger |
| :---- |

## **4.2 Refs**

Regra fixa: nunca document.querySelector em React. Sempre useRef.

| const containerRef \= useRef\<HTMLElement\>(null)  // ref do section — scope do gsap.context const badgeRef    \= useRef\<HTMLDivElement\>(null)  // badge/label acima do título const titleRef    \= useRef\<HTMLHeadingElement\>(null)  // headline principal const descRef     \= useRef\<HTMLParagraphElement\>(null)  // subheadline / descrição const ctaRef      \= useRef\<HTMLDivElement\>(null)  // wrapper dos botões CTA const scrollElRef \= useRef\<HTMLDivElement\>(null)  // elemento abaixo do hero (ScrollTrigger) |
| :---- |

## **4.3 Setup de Animações**

| useIsomorphicLayoutEffect(() \=\> {  // hook SSR-safe (não useLayoutEffect diretamente)   // \--- Acessibilidade: prefers-reduced-motion \---   const prefersReduced \= window.matchMedia(     '(prefers-reduced-motion: reduce)'   ).matches  // verificar preferência do utilizador   // \--- Scope: gsap.context \---   const ctx \= gsap.context(() \=\> {  // scope todas as animações a containerRef     if (prefersReduced) {       // Acessibilidade: mostrar tudo sem animação       gsap.set(         \[badgeRef.current, titleRef.current,          descRef.current, ctaRef.current\],         { opacity: 1, y: 0 }  // sem animação — estado final imediato       )       return  // sair sem criar timelines     }     // \--- Timeline de entrada \---     const tl \= gsap.timeline({       defaults: {         ease: 'power3.out',  // easing suave para entradas         duration: 0.8  // duração base — sobrescritível por elemento       }     })     tl       .from(badgeRef.current, {         y: \-20, opacity: 0,  // badge desce do topo         duration: 0.6  // mais rápido que o título       })       .from(titleRef.current, {         y: 60, opacity: 0,  // título sobe de baixo (movimento maior \= mais impacto)         duration: 0.9  // o elemento mais importante — duração máxima       }, '-=0.4')  // overlap: começa 0.4s antes do anterior terminar       .from(descRef.current, {         y: 30, opacity: 0  // movimento mais suave que o título       }, '-=0.5')       .from(ctaRef.current, {         y: 20, opacity: 0,         duration: 0.6  // CTAs — rápidos, já com atenção do utilizador       }, '-=0.4')     // \--- ScrollTrigger reveal para elemento abaixo \---     gsap.from(scrollElRef.current, {       y: 50, opacity: 0,       duration: 0.8,       scrollTrigger: {         trigger: scrollElRef.current,  // elemento que dispara a animação         start: 'top 80%',  // quando o topo do elemento atinge 80% do viewport         toggleActions: 'play none none none'  // só anima uma vez (entrada)       }     })   }, containerRef)  // scope: só selectors dentro de containerRef   return () \=\> ctx.revert()  // cleanup: remove todas as animações deste scope                               // previne memory leaks em navegação SPA }, \[\])  // \[\] \= só uma vez ao montar o componente |
| :---- |

## **4.4 JSX com Refs**

| return (   \<section ref={containerRef}  // ref do scope gsap.context     className="relative py-32 md:py-40"   \>     \<div className="max-w-\[1200px\] mx-auto px-6 md:px-10"\>       {/\* Badge \*/}       \<div ref={badgeRef}  // ref individual para GSAP         className="inline-flex items-center gap-2 mb-6                   font-mono text-\[11px\] uppercase tracking-\[0.12em\]                   text-\[var(--color-dim)\]"       \>         \<span className="w-1.5 h-1.5 rounded-full                        bg-\[var(--color-accent)\]" /\>         Label do projeto       \</div\>       {/\* Headline \*/}       \<h1 ref={titleRef}  // elemento mais importante da página         className="text-\[clamp(3rem,7vw,6rem)\]  // escala fluida                   font-extrabold leading-\[1.05\]  // line-height apertado para display                   tracking-tight                  // spacing apertado para grandes tamanhos                   text-\[var(--color-text)\]"       \>         Título principal da página       \</h1\>       {/\* Descrição \*/}       \<p ref={descRef}         className="mt-6 text-base md:text-lg leading-relaxed                   text-\[var(--color-dim)\] max-w-\[560px\]"         // max-w-\[560px\]: nunca texto longo a largura total       \>         Subheadline que complementa o título.       \</p\>       {/\* CTAs \*/}       \<div ref={ctaRef}  // agrupar CTAs num wrapper único         className="mt-10 flex items-center gap-4"       \>         \<button className="px-6 py-3 rounded-lg font-medium                          bg-\[var(--color-accent)\] text-white                          transition-opacity hover:opacity-80"           // CSS puro para hover — não usar GSAP para hover simples         \>           CTA Primário         \</button\>         \<button className="px-6 py-3 font-medium                          text-\[var(--color-dim)\]                          transition-colors hover:text-\[var(--color-text)\]"         \>           CTA Secundário         \</button\>       \</div\>     \</div\>     {/\* Elemento abaixo — animado com ScrollTrigger \*/}     \<div ref={scrollElRef}  // scroll reveal       className="mt-24 max-w-\[1200px\] mx-auto px-6 md:px-10"     \>       {/\* features, showcase, etc. \*/}     \</div\>   \</section\> ) |
| :---- |

# **5\. Anti-Padrões — O Que Não Fazer**

| Anti-Padrão | Problema | Solução Correta |
| :---- | :---- | :---- |
| document.querySelector('.hero') | Quebra com SSR e hidratação | useRef \+ ref={titleRef} |
| useLayoutEffect direto | Warning de servidor no Next.js | useIsomorphicLayoutEffect |
| ScrollTrigger.getAll().forEach(t \=\> t.kill()) | Mata ScrollTriggers de outros componentes | gsap.context().revert() |
| gsap.to(el, { width: '100%' }) | Força reflow, causa jank | Animar só transform e opacity |
| Sem cleanup no useEffect | Memory leaks em navegação SPA | return () \=\> ctx.revert() |
| Framer Motion \+ GSAP juntos | Conflito de animações, bundle maior | Escolher um. GSAP é primário neste perfil |
| Sem prefers-reduced-motion | Causa desconforto em utilizadores sensíveis | Verificar sempre antes de criar timelines |

# **6\. Checklist Antes de Commitar**

Verificar sempre antes de fazer commit de qualquer componente com GSAP:

* □  ctx.revert() no return do hook

* □  prefers-reduced-motion verificado

* □  Nenhum document.querySelector

* □  Nenhum useLayoutEffect direto (usar hook)

* □  Animações só em transform e opacity

* □  ScrollTrigger.refresh() após layout dinâmico (se aplicável)

* □  Testado com npm run build (sem erros TypeScript)

# **7\. Adaptar Este Componente**

Este Hero é o ponto de partida. Para cada projeto, ajustar:

* **Tipografia:** substituir text-\[clamp(...)\] pelas fontes e escalas do PRD secção 2.2

* **Cores:** as var(--color-\*) vêm de globals.css — definir antes de tocar neste componente

* **Timing:** ajustar duration e stagger — ver tabela de referência no FOUNDATION\_LANDING secção 3.4

* **Movimento:** y:60 para títulos grandes, y:30 para elementos secundários, y:20 para CTAs

* **Estrutura:** adicionar ou remover elementos (media, stats, etc.) — a timeline é facilmente extensível

*SKILL\_REFERENCE\_COMPONENT.md · v1.0 · Rodrigo Mendes*