# PRD — LONA
*Product Requirements Document*
v1.0 · Rodrigo Mendes · 2026-03

---

> **Fonte de verdade:** VIBE-PRD > FOUNDATION_LANDING > este documento.
> Em caso de conflito de estética ou tom, o VIBE-PRD prevalece.
> Em caso de conflito técnico sem derogação listada na secção 0.1, o FOUNDATION_LANDING prevalece.

---

## 0. Meta do Projecto

| Campo | Valor |
|---|---|
| Nome do projecto | lona-site |
| Tipo | Landing page + Portfolio (sem login) |
| Foundation a usar | FOUNDATION_LANDING.md v1.2 |
| Autor | Rodrigo Mendes |
| Data | 2026-03 |
| Versão PRD | v1.0 |
| Status | Aprovado — pronto para Claude Code |

---

## 0.1 Derogações ao FOUNDATION

| Regra do FOUNDATION | Derogação aplicada | Justificação |
|---|---|---|
| Sem i18n por defeito | Instalar e configurar `next-intl` | Site bilingue PT + EN obrigatório. PT é o idioma por defeito. |
| Conteúdo gerido por componentes | Conteúdo de projetos em ficheiros `.json` estáticos em `/data/` | Sem CMS ou backend. Portfolio é placeholder no MVP — estrutura de dados estática permite preencher depois sem tocar em código |
| Sem Framer Motion por defeito | Permitido para transições de página e mount/unmount de modais de imagem | As páginas `/work/[slug]` têm galeria de imagens com lightbox. GSAP não resolve mount/unmount de forma limpa. Hierarquia mantém-se: CSS → GSAP → Framer Motion (apenas lightbox e page transitions) |

---

## 1. Contexto e Objectivo

### 1.1 O problema

As marcas gastam budget em marketing que desaparece. Os artistas de rua executam trabalho de qualidade sem proteção contratual nem participação na valorização futura da obra. Não existe um intermediário que trate ambos com a seriedade que merecem.

### 1.2 A solução

A LONA conecta marcas a artistas de rua para criar obras permanentes — murais urbanos (LONA Street) e instalações interiores (LONA Install) — com contratos que garantem royalties aos artistas e obras que ficam para sempre.

O site é o cartão de visita desta convicção: deve convencer marcas de que há uma forma melhor de comunicar, e convencer artistas de que há uma casa que os trata com seriedade.

### 1.3 Público-alvo

| Segmento | Descrição |
|---|---|
| Primário | Diretores de marketing e brand managers de marcas portuguesas (e ibéricas) que procuram diferenciação e têm budget para comunicação não-standard |
| Secundário | Artistas visuais portugueses com linguagem própria que querem acesso a projetos com condições justas |
| Excluído | Marcas que querem um outdoor barato com "estilo urbano". Quem procura conteúdo descartável. |

### 1.4 Objectivos de sucesso

- Site publicado no Vercel com domínio próprio em menos de 3 semanas
- Lighthouse Performance > 90 em mobile
- Formulário de contacto funcional (Resend)
- Estrutura bilingue PT + EN implementada e navegável
- Portfolio com estrutura de dados preparada para conteúdo real (placeholder no MVP)
- Pelo menos 3 técnicas GSAP demonstradas: timeline de entrada, scroll-driven reveal, text reveal

---

## 2. Identidade Visual

> As decisões desta secção são informadas pelas palavras-guia do VIBE-PRD: **Permanente, Legítimo, Curado, Tensão, Raw.**

### 2.1 Tom e Personalidade

| Atributo | Definição |
|---|---|
| Tom visual | Editorial Bold — galeria de arte contemporânea com raízes na rua |
| Emoção alvo | "Isto é diferente de tudo o que vi — e tenho de contactar estas pessoas" |
| Elemento mais memorável | A animação de entrada do hero: título da LONA a revelar-se por clipPath como spray numa parede |
| Tema | Dark mode exclusivo |

### 2.2 Tipografia

| Papel | Fonte | Racional |
|---|---|---|
| Display / Títulos | **Cormorant Garamond** (weights: 300, 400, 600, 700) | Peso editorial, tensão entre elegância e brutalidade. A serifa fina em tamanho grande cria o contraste com o dark background que um grotesk nunca conseguiria |
| Body / Texto corrido | **DM Sans** (weights: 300, 400, 500) | Limpeza funcional que deixa o display respirar. Não compete. |
| Mono / Labels / Dados | **IBM Plex Mono** (weights: 400, 500) | Precisão, referência a documentos e contratos. Usado em badges, metadados de projetos, labels de navegação |

CSS variables:
```css
--font-display: 'Cormorant Garamond', serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'IBM Plex Mono', monospace;
```

Escalas tipográficas:
```
Hero h1:        clamp(4rem, 9vw, 8rem) — weight 700, tracking-tight, line-height 0.95
Section h2:     clamp(2.5rem, 5vw, 4.5rem) — weight 600, tracking-tight
Project title:  clamp(1.5rem, 3vw, 2.5rem) — weight 400 (Cormorant em peso leve é igualmente forte)
Body text:      1rem / 1.125rem — weight 300, line-height 1.7
Labels:         0.6875rem — IBM Plex Mono, uppercase, tracking 0.14em
```

### 2.3 Paleta de Cores

| Papel | Hex | Nota |
|---|---|---|
| Background principal | `#080806` | Preto com subtom quente — não é tech azul-cinzento, tem temperatura de parede de betão |
| Background secundário / surface | `#0F0F0C` | Cards, painéis, nav com blur |
| Cor dominante / acento | `#C9A96E` | Ocre quente — referência a tinta, a parede velha, a ouro sem glamour. Usado com parcimónia. |
| Texto principal | `#EDEAE3` | Off-white com subtom quente — nunca branco puro |
| Texto secundário / dim | `#6B6960` | Para metadados, labels secundárias, placeholders |
| Border / separator | `rgba(255, 255, 255, 0.06)` | Separadores quase invisíveis |
| Accent on dark | `#C9A96E` | Hover states, underlines, marcadores ativos |

CSS variables (definir em globals.css antes de qualquer componente):
```css
:root {
  --color-bg:       #080806;
  --color-surface:  #0F0F0C;
  --color-accent:   #C9A96E;
  --color-text:     #EDEAE3;
  --color-dim:      #6B6960;
  --color-border:   rgba(255, 255, 255, 0.06);
}
```

### 2.4 Detalhes Visuais

- **Noise texture:** SVG filter de grain em overlay sobre o background (opacity 0.03–0.05). Subtil — adiciona profundidade analógica sem parecer Figma template
- **Sem glassmorphism** — inconsistente com a estética raw do dark mode escolhido
- **Imagens a preto e branco ou com cor reduzida** no estado de hover das cards de portfolio — cor completa só na página de detalhe `/work/[slug]`
- **Linha fina `1px` em `--color-accent`** como elemento decorativo em separadores de secção (não usar hr — usar div com border-top)

### 2.5 Referências Visuais

- gagosian.com — gravidade institucional de galeria, imagens que respiram
- bureau-borsche.com — editorial bold, tipografia como estrutura
- pace.art — dark mode de galeria sem perder humanidade

---

## 3. Estrutura e Conteúdo

### 3.1 Mapa de Páginas / Rotas

| Rota (PT) | Rota (EN) | Descrição |
|---|---|---|
| `/` | `/en` | Homepage: Hero + Manifesto resumido + Formatos + Artistas (preview) + Portfolio (preview) + CTA contacto |
| `/sobre` | `/en/about` | Manifesto completo + equipa (placeholder no MVP) |
| `/trabalho` | `/en/work` | Grid de projetos (placeholder no MVP) |
| `/trabalho/[slug]` | `/en/work/[slug]` | Página de detalhe de projeto |
| `/artistas` | `/en/artists` | Roster de artistas (placeholder no MVP) |
| `/contacto` | `/en/contact` | Formulário de contacto |
| `/404` | — | Página 404 com design intencional |

**Nota de i18n:** PT é o locale por defeito (sem prefixo de URL). EN tem prefixo `/en/`. Implementar com `next-intl`.

### 3.2 Anatomia da Homepage

| # | Secção | Objectivo / Conteúdo | Animação GSAP |
|---|---|---|---|
| 1 | **Nav** | Logo LONA + links (Sobre, Trabalho, Artistas) + CTA "Iniciar projecto" + toggle PT/EN | Entrada: `gsap.from`, `y: -30`, `opacity: 0`, delay após hero |
| 2 | **Hero** | Tagline principal + sub + dois CTAs (Marcas / Artistas) | Timeline: LONA reveal por clipPath (spray effect) → tagline sobe → sub → CTAs. `stagger: 0.12s` |
| 3 | **Manifesto** | Excerto do manifesto (3–4 frases-chave) com link para /sobre | SplitText por linhas, scroll-driven reveal com scrub |
| 4 | **Formatos** | LONA Street + LONA Install — descrição de cada formato | Staggered reveal por cards ao scroll |
| 5 | **Artistas** | Preview de 3–4 artistas do roster com nome e foto (placeholder) | Horizontal scroll com GSAP pin |
| 6 | **Portfolio preview** | Grid de 3 projetos recentes (placeholder) | Staggered reveal, imagem em grayscale → cor no hover |
| 7 | **CTA Final** | "Queres uma obra?" — headline + formulário inline ou link para /contacto | Fade in simples, sem distração |
| 8 | **Footer** | Links + copyright + "Lisboa, Portugal" + toggle língua | ScrollTrigger fade |

---

## 4. Animações GSAP — Especificações

### 4.1 Animações Obrigatórias

| Localização | Padrão GSAP | Descrição do comportamento |
|---|---|---|
| **Hero — LONA logo/título** | clipPath reveal | O título principal revela-se da esquerda para a direita via `clipPath` — como spray a cobrir uma parede. `transformOrigin: 'left'`, `scaleX: 0 → 1`, `duration: 1.2s`, `ease: power3.inOut` |
| **Hero — sequência completa** | Timeline entrada | clipPath do título → tagline sobe (`y: 50, opacity: 0`) → sub → CTAs. `stagger: 0.1s`, `ease: power3.out` |
| **Manifesto** | SplitText por linhas + scrub | Cada linha do excerto do manifesto revela com scroll. `scrollTrigger: { scrub: 1 }`. Não é fade — é reveal progressivo que acompanha o utilizador |
| **Secção Artistas** | Horizontal scroll pinned | Container pinned, artistas deslizam horizontalmente. `gsap.to(container, { x: -totalWidth, scrollTrigger: { scrub: 1, pin: true } })` |
| **Cards de portfolio** | Staggered reveal | `gsap.from('.project-card', { y: 60, opacity: 0, stagger: 0.15, scrollTrigger: { start: 'top 80%' } })` |
| **Image grayscale → color** | CSS filter transition | No hover de cada card: `filter: grayscale(1) → grayscale(0)`. CSS puro com `transition: filter 0.6s ease` — não usar GSAP para isto |

### 4.2 Animações Opcionais (se tempo permitir)

- Custom cursor com follower (ver SKILL_MICROINTERACTIONS.md — secção 1)
- Magnetic button no CTA principal do hero (ver SKILL_MICROINTERACTIONS.md — secção 2)
- Parallax subtil no hero com mousemove (±15px no background)
- Text scramble nos labels de navegação ao hover (ver SKILL_MICROINTERACTIONS.md — secção 3.1)

### 4.3 Acessibilidade de Animações

**Obrigatório:** implementar `prefers-reduced-motion`. Se ativo:
- Desativar todas as timelines GSAP
- `gsap.set()` com estado final imediato para todos os elementos
- Manter transições CSS de hover (são opt-in pelo utilizador — não desativar)

---

## 5. Funcionalidades e Requisitos

### 5.1 Must Have (MVP)

- Hero com animação de entrada (clipPath reveal obrigatório)
- Estrutura bilingue PT + EN com `next-intl`
- Secções: Hero, Manifesto, Formatos, Artistas preview, Portfolio preview, CTA, Footer
- Páginas: `/sobre`, `/trabalho`, `/trabalho/[slug]`, `/artistas`, `/contacto`
- Formulário de contacto funcional com validação (Resend)
- Portfolio com estrutura de dados estática em `/data/projects.json` (conteúdo placeholder)
- Artistas com estrutura de dados estática em `/data/artists.json` (conteúdo placeholder)
- Site responsivo: testado em 375px, 768px, 1280px, 1440px
- Deploy no Vercel com preview automático
- Página 404 com design intencional
- Lighthouse Performance > 90

### 5.2 Should Have (V1 pós-MVP)

- Open Graph meta tags por página (incluindo imagem OG por projeto)
- Preloader animado (pontuado separadamente no Awwwards)
- Custom cursor (SKILL_MICROINTERACTIONS)
- Vercel Analytics ativo
- Domínio próprio configurado

### 5.3 Won't Have (Fora de scope)

- CMS ou painel de administração
- Autenticação de utilizadores
- Área de cliente para marcas ou artistas
- Blog ou secção de notícias
- Scroll-driven video (sem vídeo disponível no MVP)
- Múltiplos temas de cor (dark mode exclusivo)

---

## 6. Notas Técnicas Específicas

### 6.1 Dependências adicionais (além do FOUNDATION_LANDING base)

```bash
# i18n bilingue
npm install next-intl

# Formulário com validação
npm install react-hook-form zod @hookform/resolvers

# Envio de email
npm install resend

# Smooth scroll (integrar com ScrollTrigger via ticker)
npm install @studio-freight/lenis

# Framer Motion — APENAS para lightbox de imagens e page transitions
npm install framer-motion
```

### 6.2 Estrutura de dados estática

```
/data/
  projects.json     ← lista de projetos com campos: id, slug, title, client, artist, type (street|install), year, description, images[], tags[]
  artists.json      ← lista de artistas: id, slug, name, bio, medium, location, images[]
/public/
  images/
    projects/       ← imagens por projeto (placeholder no MVP)
    artists/        ← fotos dos artistas (placeholder no MVP)
  video/            ← reservado para V2 (scroll-driven video)
```

**Schema de projeto (TypeScript):**
```typescript
interface Project {
  id: string
  slug: string
  title: string        // PT
  titleEn: string      // EN
  client: string
  artist: string       // slug do artista
  type: 'street' | 'install'
  year: number
  city: string
  description: string  // PT
  descriptionEn: string // EN
  images: string[]     // paths relativos a /public/
  cover: string        // imagem principal para grid
  tags: string[]
}
```

### 6.3 Estrutura i18n com next-intl

```
/messages/
  pt.json    ← strings PT (idioma por defeito)
  en.json    ← strings EN
```

Locales configurados em `next.config.js`: `defaultLocale: 'pt'`, `locales: ['pt', 'en']`.

Toggle de língua na nav: link simples que altera o locale — não precisa de dropdown.

### 6.4 Formulário de Contacto

Campos obrigatórios:
- Nome
- Email
- Empresa (opcional)
- Tipo de interesse: Marca / Artista / Outro (radio ou select)
- Mensagem

Validação: `zod` com `react-hook-form`. Feedback inline — erros por campo, não toast genérico.

Envio: Server Action Next.js → `resend`. Email para endereço configurado em `RESEND_TO_EMAIL`.

Não usar um endpoint `/api/contact` separado — usar Server Action diretamente.

### 6.5 Variáveis de Ambiente

| Variável | Propósito |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL base para Open Graph e canonical |
| `RESEND_API_KEY` | Envio de email do formulário |
| `RESEND_TO_EMAIL` | Email de destino (não expor no browser) |

### 6.6 SEO e Meta (base)

| Campo | Valor |
|---|---|
| Title (PT) | `LONA — Arte que faz marcas` |
| Title (EN) | `LONA — Art that makes brands` |
| Description (PT) | `Conectamos marcas a artistas para criar obras permanentes. LONA Street e LONA Install — duas formas de deixar legado.` |
| Description (EN) | `We connect brands and artists to create permanent works. LONA Street and LONA Install — two ways to leave a legacy.` |
| OG Image | `/public/og-image.png` (1200×630px) — criar como placeholder escuro com logo LONA |
| Canonical URL | `https://lona.pt` (placeholder até domínio confirmado) |
| Lang default | `pt` |

### 6.7 Noise Texture (implementação)

Adicionar como SVG filter em globals.css — zero peso adicional:

```css
/* globals.css */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,..."); /* SVG noise pattern */
}
```

Alternativa: componente `<NoiseOverlay />` com SVG feTurbulence — mais controlável.

---

## 7. Critérios de Qualidade e Entrega

### 7.1 Checklist de QA antes do Deploy

- [ ] Lighthouse Performance > 90 (mobile e desktop)
- [ ] Sem erros na consola do browser
- [ ] Responsivo: testado em 375px, 768px, 1280px, 1440px
- [ ] Todas as animações GSAP com `gsap.context().revert()`
- [ ] `prefers-reduced-motion` implementado em todos os componentes com GSAP
- [ ] Imagens com `next/image`, formatos WebP/AVIF
- [ ] `next/font` para todas as fontes Google — zero layout shift
- [ ] i18n: todas as strings em PT e EN — sem strings hardcoded em componentes
- [ ] Formulário de contacto testado (envio real com Resend)
- [ ] Vercel Analytics ativo
- [ ] Página 404 com design intencional implementada
- [ ] Open Graph tags configuradas

### 7.2 Definição de "Completo"

Este projecto está completo quando:
- Todos os Must Have da secção 5.1 estão implementados
- Checklist 7.1 completo
- Site publicado no Vercel com preview a funcionar
- PT e EN navegáveis sem strings em falta
- Formulário a enviar email real

---

## 8. Timeline e Fases

| Fase | Duração estimada | Entregável | Notas |
|---|---|---|---|
| Setup | 1 dia | Repo + Vercel + next-intl configurado + globals.css | FOUNDATION_LANDING passos 1–7 + instalar next-intl |
| Design tokens + Nav + Footer | 1 dia | Tokens definidos, Nav bilingue funcional | Antes de qualquer secção de conteúdo |
| Hero | 2 dias | Hero animado com clipPath reveal | A animação mais importante — não comprometer |
| Manifesto + Formatos | 1–2 dias | Secções 3 e 4 da homepage | SplitText scrub no manifesto |
| Artistas + Portfolio preview | 2 dias | Secções 5 e 6 com dados placeholder | Horizontal scroll nos artistas |
| Páginas internas | 2–3 dias | /sobre, /trabalho, /trabalho/[slug], /artistas, /contacto | Formulário funcional incluído |
| QA + Deploy | 1–2 dias | Site publicado | Checklist 7.1 completo |

---

## 9. Prompt de Início para o Claude Code

```
Vou criar o site da LONA — uma empresa que conecta marcas a artistas para criar obras permanentes.

Tens três documentos:
1. LONA_VIBE-PRD.md — a camada emocional: quem é a LONA, como se sente, palavras-guia.
2. FOUNDATION_LANDING.md v1.2 — stack e padrões técnicos para landing pages.
3. LONA_PRD.md (este documento) — requisitos específicos, identidade visual, estrutura.

Lê os três antes de começar. Hierarquia: VIBE-PRD > FOUNDATION > PRD (exceto derogações na secção 0.1 do PRD).

Stack: Next.js 14 + Tailwind CSS v3 + GSAP + next-intl (bilingue PT/EN). TypeScript sem strict mode. Dark mode exclusivo.

ESTÉTICA (proibições absolutas):
- Nunca Inter, Roboto, Arial, Space Grotesk — usar Cormorant Garamond (display) + DM Sans (body) + IBM Plex Mono (labels)
- Nunca gradientes roxos/azuis genéricos — paleta definida na secção 2.3 do PRD
- Energia de galeria de arte contemporânea, não de startup de tech

PERFORMANCE (regras fixas):
- Animar apenas transform e opacity — nunca width, height, top, left
- next/image em todas as imagens, formatos WebP/AVIF
- next/font para todas as fontes Google — zero layout shift
- gsap.context().revert() em todos os cleanups

As derogações ao FOUNDATION estão na secção 0.1 do PRD.

Começa pelo setup: cria a estrutura de pastas, instala as dependências (incluindo next-intl, react-hook-form, zod, resend, @studio-freight/lenis), configura globals.css com os design tokens da secção 2.3 do PRD, e configura next-intl com os ficheiros /messages/pt.json e /messages/en.json base.
```

---

*LONA PRD · v1.0 · Rodrigo Mendes · 2026*
