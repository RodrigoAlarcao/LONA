**FOUNDATION — LANDING**  
*Para landing pages, portfolios e experiências visuais de impacto*  
v1.2 — Rodrigo Mendes

*Usar neste perfil: landing pages, portfolios, sites de apresentação, páginas de produto, experiências visuais. Foco em impacto visual, animação e velocidade de iteração. Sem overhead de TypeScript strict nem shadcn/ui.*

# **1\. Stack Tecnológico**

| Frontend | Infra |
| :---- | :---- |
| Next.js 14+ (App Router) | Vercel (deploy) |
| TypeScript — strict: false (ver nota) | Git \+ GitHub |
| Tailwind CSS v3 (npm install tailwindcss@3.4.1) | Supabase — apenas se houver formulário de contacto ou CMS simples |
| GSAP \+ ScrollTrigger (animação primária) |  |
| Framer Motion (apenas se necessário) |  |
| Lucide React (ícones SVG) |  |

| TypeScript sem strict mode |
| :---- |
| Neste perfil, TypeScript serve para autocompletion e catching de erros óbvios — não como garantia de tipo completa. O Claude não deve parar o fluxo a resolver tipos. Usar as Type quando necessário. O objectivo é velocidade de iteração visual. |

## **1.1 Hierarquia de Motion — Regra Fixa**

| Neste perfil, GSAP é a ferramenta primária de animação. |
| :---- |
| 1\. CSS puro: hover states, focus, fades, transições de cor. Sempre preferir antes de qualquer biblioteca. |
| 2\. GSAP \+ ScrollTrigger: scroll-driven reveals, timelines de página, animações de impacto, parallax, pinned sections. |
| 3\. Framer Motion (excepção): apenas se existirem componentes React com mount/unmount complexo que GSAP não resolve de forma limpa. |
| ⚠ Não importar Framer Motion por defeito. Só adicionar quando houver necessidade clara. |

## **1.2 Setup Completo — Comandos por Ordem**

*Executar nesta ordem exacta. Não pular passos. O Claude deve seguir esta sequência no início de qualquer projecto deste perfil.*

| PASSO 1 — Criar projecto Next.js |
| :---- |
| npx create-next-app@14 nome-do-projecto \\ |
|   \--typescript \--tailwind \--eslint \--app \--src-dir=false \--import-alias="@/\*" |

*⚠ create-next-app@14 instala Tailwind v3 correctamente. Sem @14, pode instalar Next.js 15 com Tailwind v4.*

| PASSO 2 — Verificar versões instaladas (obrigatório) |
| :---- |
| cat package.json | grep \-E "next|tailwind" |

*Confirmar: next@14.x.x e tailwindcss@3.x.x. Se tailwindcss@4, corrigir com: npm install tailwindcss@3.4.1*

| PASSO 3 — Instalar dependências core deste perfil |
| :---- |
| \# Animação — GSAP \+ ScrollTrigger (incluso) \+ SplitText (gratuito desde 2024\) |
| npm install gsap |
|  |
| \# Smooth scroll (integrar com ScrollTrigger via ticker — ver secção 2.2) |
| npm install @studio-freight/lenis |
|  |
| \# Ícones SVG |
| npm install lucide-react |

| PASSO 4 — Dependências condicionais (instalar se o PRD indicar) |
| :---- |
| \# Se houver formulário com envio de email |
| npm install resend |
|  |
| \# Se houver base de dados ou auth |
| npm install @supabase/supabase-js @supabase/ssr |
|  |
| \# Se houver mount/unmount complexo que GSAP não resolve (APENAS se necessário) |
| npm install framer-motion |

| PASSO 5 — Criar ficheiros de setup imediato |
| :---- |
| \# Hook SSR-safe para GSAP (obrigatório — ver secção 2.1) |
| touch hooks/useIsomorphicLayoutEffect.ts |
|  |
| \# Componente de smooth scroll com integração Lenis+ScrollTrigger (ver secção 2.2) |
| touch components/SmoothScroll.tsx |
|  |
| \# globals.css: preencher CSS variables do PRD secção 2.3 antes de qualquer componente |

| PASSO 6 — Configurar fontes com next/font (nunca link directo Google Fonts) |
| :---- |
| // app/layout.tsx — padrão obrigatório |
| import { Syne, Space\_Mono } from 'next/font/google' // substituir pelas fontes do PRD |
|  |
| const syne \= Syne({ subsets: \['latin'\], weight: \['400','600','700','800'\], variable: '--font-display' }) |
| const mono \= Space\_Mono({ subsets: \['latin'\], weight: \['400','700'\], variable: '--font-mono' }) |
|  |
| // No body: className={\`${syne.variable} ${mono.variable}\`} |

*As fontes são definidas pelo PRD (secção 2.2). Substituir Syne/Space\_Mono pelas fontes escolhidas para o projecto.*

| PASSO 7 — Verificar que o servidor arranca sem erros |
| :---- |
| npm run dev |

*Só avançar para os componentes depois de confirmar que compila sem erros. Não acumular erros de setup.*

| 🚀 Critério de Arranque — Quando Parar o Setup e Começar a Construir |
| :---- |
| Se as três condições abaixo estiverem satisfeitas, começar o Hero imediatamente: |
| npm run dev compila sem erros |
| globals.css tem os design tokens preenchidos (cores \+ fontes do PRD secção 2.3) |
| A animação do Hero está descrita no PRD secção 4.1 |
| Não esperar por: tipos perfeitos, estrutura de pastas ideal, ou todas as dependências condicionais instaladas. Setup é meio — construir é o fim. |

| PASSO 8 — Instalar Claude Skills (obrigatório para output de qualidade) |
| :---- |
| Skills são instruções especializadas que o Claude carrega automaticamente por contexto. |
| 1\. Anthropic frontend-design (estética): Evita interfaces genéricas com Inter/Roboto e gradientes roxos. |
| 2\. Vercel React Best Practices (performance): 57 regras de performance para React/Next.js ordenadas por impacto. |

## **1.3 Sistema de Layout — Padrões Fixos**

*Usar sempre estes padrões. Nunca inventar valores de padding, max-width ou grid ad-hoc.*

| // Container \+ Section wrapper (usar em TODAS as secções) |
| :---- |
| \<section className="py-24 md:py-32"\> |
|   \<div className="max-w-\[1200px\] mx-auto px-6 md:px-10"\> |
|   \</div\> |
|  |
| // Grids |
| // 3 colunas (features): grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 |
| // 3 colunas (pricing): grid grid-cols-1 lg:grid-cols-3 gap-4 items-start |
| // 2 colunas (text+img): grid grid-cols-1 lg:grid-cols-2 gap-16 items-center |
|  |
| // Tipografia |
| // Hero h1: text-\[clamp(3rem,7vw,6rem)\] font-extrabold leading-\[1.05\] tracking-tight |
| // Section h2: text-\[clamp(2rem,4vw,3.5rem)\] font-bold leading-\[1.1\] tracking-tight |
| // Body/desc: text-base md:text-lg leading-relaxed |
| // Label/badge: font-mono text-\[11px\] uppercase tracking-\[0.12em\] |
|  |
| // Espaçamentos |
| // Section padding: py-24 md:py-32 (mínimo py-16) |
| // Horizontal: px-6 md:px-10 (no container, não na section) |
| // Gap entre cards: gap-4 (tight) | gap-6 (normal) | gap-8 (airy) |
| // Header → conteúdo: mb-12 md:mb-16 |
| // Max-width textos: max-w-\[560px\] |

## **1.4 CSS Variables — Design Tokens**

*Definir SEMPRE em globals.css antes de qualquer componente.*

| /\* globals.css — estrutura obrigatória \*/ |
| :---- |
| :root { |
|   \--color-bg: ;       /\* background principal — preencher do PRD \*/ |
|   \--color-surface: ;  /\* cards, panels \*/ |
|   \--color-accent: ;   /\* cor dominante \*/ |
|   \--color-text: ;     /\* texto principal \*/ |
|   \--color-dim: ;      /\* texto secundário, placeholders \*/ |
|   \--color-border: rgba(255,255,255,0.06); /\* separadores \*/ |
| } |

# **2\. GSAP — Guia de Uso**

## **2.1 Setup**

| npm install gsap |
| :---- |
|  |
| // Em qualquer Client Component |
| 'use client' |
| import gsap from 'gsap' |
| import { ScrollTrigger } from 'gsap/ScrollTrigger' |
| gsap.registerPlugin(ScrollTrigger) |

Registar plugins uma vez, no componente onde são usados ou num ficheiro de init global.

* Hook: Usar useIsomorphicLayoutEffect para animações (ver abaixo)  
* Cleanup: Sempre limpar com gsap.context().revert() no return — previne memory leaks

| // hooks/useIsomorphicLayoutEffect.ts |
| :---- |
| import { useEffect, useLayoutEffect } from 'react' |
|  |
| export const useIsomorphicLayoutEffect \= |
|   typeof window \!== 'undefined' ? useLayoutEffect : useEffect |
|  |
| // Usar em todos os componentes com GSAP — nunca useLayoutEffect directamente. |

## **2.2 Lenis \+ ScrollTrigger — Integração Obrigatória**

*Quando se usa Lenis e ScrollTrigger em simultâneo, é obrigatório sincronizá-los. Sem esta integração, o ScrollTrigger dessincroniza do smooth scroll.*

| // Adicionar em SmoothScroll.jsx após criar a instância Lenis |
| :---- |
| lenis.on('scroll', ScrollTrigger.update) |
| gsap.ticker.add((time) \=\> lenis.raf(time \* 1000)) |
| gsap.ticker.lagSmoothing(0) |
|  |
| // Nota: NÃO usar o requestAnimationFrame loop simples do Lenis. |
| // O gsap.ticker substitui-o e garante sincronização perfeita. |

## **2.3 Padrões de Animação**

*★ \= adicionado em v1.2 (aprendizagens Awwwards)*

| Padrão | Quando usar | Exemplo de código |
| :---- | :---- | :---- |
| Staggered reveal | Listas, cards, features | gsap.from('.card', {y:40, opacity:0, stagger:0.1, scrollTrigger:...}) |
| Parallax | Hero backgrounds, imagens | gsap.to(el, {yPercent:-30, scrollTrigger:{scrub:true}}) |
| Pinned section | Storytelling, steps | scrollTrigger: {pin:true, scrub:1, end:'+=500'} |
| Text reveal | Headings de impacto | SplitText por linhas → gsap.from com clipPath ou y |
| Counter | Estatísticas, números | gsap.to(obj, {val:100, onUpdate, snap:1}) |
| Page transition | Entre rotas | Timeline \+ overlay \+ Router.push após complete |
| Magnetic hover | Botões CTA, ícones | mousemove listener \+ gsap.to com ease:'power2.out' |
| Image unmask / reveal ★ | Secções de conteúdo, hero alternativo | gsap.to(clipPath, {scaleX:1, transformOrigin:'left', scrollTrigger:{scrub:true}}) |
| Scrolling cards horizontal ★ | Testemunhos, portfolios, galerias | ScrollTrigger pin \+ gsap.to(container, {x: \-totalWidth, scrub:1}) |

## **2.4 Regras de Qualidade**

* Performance: Animar apenas transform (x, y, rotation, scale) e opacity — nunca width, height, top, left  
* Refs: Usar refs para elementos DOM. Nunca document.querySelector em React  
* Refresh: ScrollTrigger.refresh() após mudanças de layout dinâmico ou resize  
* A11y: Testar prefers-reduced-motion: se activo, desactivar todas as animações ou reduzir a fades simples  
* Next.js: Em Next.js App Router, GSAP vive sempre em Client Components ('use client')

| // Template de cleanup correcto |
| :---- |
| useIsomorphicLayoutEffect(() \=\> { |
|   const ctx \= gsap.context(() \=\> { |
|     // todas as animações aqui dentro |
|   }, containerRef) |
|   return () \=\> ctx.revert() |
| }, \[\]) |

| Padrão proibido — nunca usar: |
| :---- |
| ScrollTrigger.getAll().forEach(t \=\> t.kill()) |
| Este padrão mata todos os ScrollTriggers da página, incluindo os de outros componentes. Usar sempre gsap.context().revert(). |

## **2.5 Licença GSAP**

* Gratuito: Core \+ ScrollTrigger \+ SplitText: gratuitos para uso pessoal, portfolios, sites institucionais sem paywall  
* Club: MorphSVG, DrawSVG: ainda requerem Club GreenSock (licença paga)  
* Comercial: SaaS ou produto com monetização: verificar greensock.com/licensing antes de usar

# **3\. Design Visual — Impacto Primeiro**

| O objectivo deste perfil é impacto visual memorável. |
| :---- |
| Cada projecto deve ter uma identidade distinta. Não existe 'template seguro'. Ser ousado é o ponto de partida. |

| ★ Pensar como Graphic Designer, não Web Designer — v1.2 |
| :---- |
| A distinção mais importante para atingir nível Awwwards: abandonar o raciocínio de layout web (header → hero → features → footer) e começar a pensar como um designer de revista ou poster. |
| Os layouts de revistas impressas têm mais em comum com sites Awwwards do que qualquer template web: texto em tamanhos extremos, elementos que 'existem' na página com intencionalidade compositiva, espaço negativo como elemento activo. |
| Antes de desenhar qualquer secção, pergunta: como ficaria isto numa página de revista de design? Esse é o bar. |
| Referência mental: abre uma revista de design (Wallpaper, Monocle, Étapes) e usa a sua lógica compositiva, não a de um template Bootstrap. |

## **3.1 Tipografia**

* Proibido: Nunca Inter, Roboto, Arial, Space Grotesk como fonte principal — são defaults de AI sem personalidade  
* Regra: Escolher fontes com carácter: display \+ body com contraste de personalidade  
* Contraste de tamanho como estrutura: headings massivos \+ parágrafos pequenos não são apenas escolha tipográfica — são a grelha visual da página

| ★ Type Foundries Pagas — v1.2 |
| :---- |
| Os sites Awwwards raramente usam Google Fonts gratuitas. Para projectos onde a identidade é crítica, considerar fontes premium de foundries como Klim Type Foundry, Pangram Pangram, Dinamo, ou Grilli Type. |
| A maioria das foundries oferece licença de trial gratuita para testes. Para portfólios pessoais, muitas têm licenças desktop acessíveis (30–100€). Verificar sempre os termos antes de usar em produção comercial. |

| Tom | Display |
| :---- | :---- |
| Cinematográfico | Cormorant, Bodoni Moda |
| Futurista | Clash Display, Syne |
| Editorial Bold | Cabinet Grotesk, Bebas Neue |
| Orgânico / Natural | Fraunces, Young Serif |
| Tech / Preciso | IBM Plex Mono, Space Mono |

## **3.2 Composição Visual**

* Layout: Assimetria intencional — evitar layouts totalmente simétricos e grids previsíveis  
* Depth: Sobreposição de elementos: texto sobre imagem, shapes sobre background, layers de depth  
* Espaço: Espaço negativo generoso — o silêncio é tão importante quanto o conteúdo  
* Ruptura: Grid-breaking: elementos que saem do container, títulos oversized, margens assimétricas  
* Ritmo: Full-bleed sections: alternar entre conteúdo contido e elementos que tocam as bordas do écran

## **3.3 Backgrounds e Atmosfera**

* Gradients: Gradient meshes: múltiplos radial-gradients sobrepostos com mix-blend-mode  
* Texture: Noise texture sobre cor sólida ou gradient — adiciona profundidade sem peso visual  
* Glass: Glassmorphism: backdrop-blur com bg-white/10 — verificar contraste em light mode  
* Shadow: Shadows dramáticos: sombras grandes e difusas criam hierarquia e dimensão  
* Grain: Grain overlay com SVG filter — efeito analógico que diferencia do digital limpo  
* ★ Background image no hero: Secções hero com imagem de fundo de qualidade são a norma em Awwwards, não a excepção — ausência de imagem no hero é uma desvantagem competitiva

## **3.4 Animação como Design**

* Filosofia: Uma timeline de entrada bem orquestrada vale mais que 20 micro-interacções dispersas  
* Timing: Stagger de 0.08–0.12s entre elementos consecutivos  
* Easing: power2.out para entradas, power2.in para saídas, power3.inOut para estado-a-estado  
* Duração: Entradas 0.6–0.9s, transições de estado 0.2–0.4s, saídas 0.3–0.5s

# **4\. Estrutura de Landing Page**

## **4.1 Anatomia Padrão**

| Secção | Objectivo | Notas de Animação |
| :---- | :---- | :---- |
| Hero | Impacto imediato, proposta de valor | Timeline de entrada: logo → título → sub → CTA, stagger |
| Social proof | Credibilidade (logos, números) | Counter animation ao entrar em viewport |
| Features / Como funciona | Explicar o produto | Scroll-driven: cada feature revela ao scroll |
| Showcase / Demo | Mostrar, não contar | Pinned section com animação scrub ou video loop |
| Testemunhos | Prova social qualitativa | Scrolling cards horizontal ou fade stagger |
| CTA final | Conversão | Simples, directo, sem distracção visual |

| ★ Checklist de Nível Mínimo Awwwards — v1.2 |
| :---- |
| Para um site ser considerado para nível Awwwards (Honorable Mention ou superior), deve ter pelo menos: |
| Preloader / loader animado (pontuado separadamente no Awwwards) |
| Animação de entrada no hero (SplitText ou clipPath reveal no mínimo) |
| Pelo menos uma animação scroll-driven com scrub (não apenas fade-in) |
| Background image ou visual de impacto no hero (ausência é desvantagem) |
| Custom cursor ou micro-interaction de hover num elemento principal |
| Pelo menos uma quebra de grelha intencional (elemento fora do container, título oversized) |
| Página 404 e loader com design intencional (pontuados individualmente no Awwwards) |

## **4.2 Performance**

* Imagens: next/image em todas as imagens. Formatos WebP/AVIF. Lazy loading por defeito.  
* Fontes: next/font para Google Fonts — zero layout shift, carregamento optimizado  
* Bundle: GSAP carrega leve (\~30KB gzip). ScrollTrigger é adicional (\~15KB). Não carregar plugins não usados.  
* Score: Lighthouse score \> 90 em Performance antes de qualquer deploy

# **5\. Lições de Projecto**

*Após cada projecto, adicionar 2–3 linhas aqui com o que correu mal e como foi resolvido.*

| Data | Problema encontrado | Como foi resolvido |
| :---- | :---- | :---- |
| 2025-01 | ScrollTrigger dessincronizado com Lenis | Adicionar lenis.on('scroll', ScrollTrigger.update) — ver secção 2.2 |
| \--- | \--- | \--- |

# **6\. Git & Vercel**

* Primeiro: Criar projecto Vercel antes de começar — preview automático em cada push  
* Branches: Branch main → produção. Iterar em branches de feature.  
* Commits: Commits frequentes e descritivos — em landing pages, cada commit pode ser uma secção ou animação  
* gitignore: .env.local, node\_modules/, .next/, .vercel/

# **7\. Instrução para o Claude**

| Prompt de início de projecto: |
| :---- |
| "Vou criar uma landing page / site de portfolio. Tens dois documentos: |
| 1\. FOUNDATION\_LANDING.md — stack e padrões de design para landing pages. |
| 2\. PRD.md — o briefing desta página específica. |
| Stack: Next.js \+ Tailwind \+ GSAP. TypeScript sem strict mode — não parar para resolver tipos. Hierarquia de motion: CSS → GSAP → Framer Motion (só se necessário). O objectivo é impacto visual máximo. As derogações ao FOUNDATION estão na secção 0.1 do PRD. Começa pela secção \[hero / nome da primeira secção\]." |

## **7.1 Checklist de Início**

* Repositório GitHub criado  
* Projecto Vercel criado e ligado  
* DECISION\_FRAMEWORK.md consultado — confirmar que LANDING é o perfil correcto  
* npm install gsap executado  
* Tom visual e tipografia decididos (antes do primeiro componente)  
* Referências visuais / moodboard definido  
* Estrutura de secções decidida (hero, features, CTA...)  
* PRD escrito (incluindo secção 0.1 Derogações)  
* Este documento partilhado com o Claude

# **PASSO 8 — Declarar intenção estética e regras de performance no primeiro prompt**

## Incluir SEMPRE no primeiro prompt ao Claude Code neste perfil:

ESTÉTICA (proibições absolutas):  
\- Nunca Inter, Roboto, Arial, Space Grotesk como fonte principal  
\- Nunca gradientes roxos/azuis genéricos sem justificação no PRD  
\- Usar apenas as fontes e paleta definidas na secção 2 do PRD  
\- Qualquer decisão visual deve ser consistente com as   
  palavras-guia do VIBE-PRD

PERFORMANCE (regras fixas):  
\- Animar apenas transform e opacity — nunca width, height, top, left  
\- next/image em todas as imagens, formatos WebP/AVIF  
\- next/font para todas as fontes Google — zero layout shift  
\- Zero document.querySelector — usar sempre refs React  
\- gsap.context().revert() em todos os cleanup de GSAP

Sem esta declaração, o Claude Code tende a produzir outputs conservadores e esteticamente genéricos nas primeiras decisões.

*FOUNDATION\_LANDING.md · v1.2 · Rodrigo Mendes*