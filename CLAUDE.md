# dup.agency — Site 2026

Contexto completo do projeto para o Claude Code. Leia isso antes de tocar em qualquer arquivo.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS
- **Animações:** GSAP + ScrollTrigger
- **Fontes:** Chillax e Synonym via `next/font/local` (Fontshare, self-hosted)
- **Ícones:** Phosphor Icons 2.1 (Regular para UI padrão, Duotone para momentos destacados)
- **Linguagem:** TypeScript

---

## Estrutura de pastas

```
src/
  app/
    page.tsx          ← página principal (uma só página, scroll)
    layout.tsx
  components/
    layout/
      Nav.tsx
      BackgroundLayer.tsx   ← div fixed que muda de cor
    sections/
      Hero.tsx
      Parceiros.tsx
      PorQueFunciona.tsx
      ComoTrabalhamos.tsx
      Servicos.tsx
      CTAFinal.tsx
      Footer.tsx
    ui/               ← componentes pequenos reutilizáveis
  hooks/
    useActiveSection.ts   ← detecta seção ativa no scroll
    useScrollTrigger.ts   ← wrapper GSAP
  lib/
    gsap.ts           ← inicialização GSAP + ScrollTrigger
public/
  fonts/              ← Chillax e Synonym
  images/
    clients/          ← screenshots dos clientes (parceiros)
```

---

## Design Tokens

### Cores (primitivas)

```ts
const colors = {
  black: '#0d0d0d',
  white: '#ffffff',
  'purple-mid': '#897BBC',
  'purple-dark': '#53448A',
  'teal-light': '#AFD7D0',
  'neutral-100': '#e1e1e1',
  'neutral-600': '#676767',
  'neutral-800': '#3d3d3d',
}
```

### Gradientes

```ts
// grad-01: hero headline e elementos principais
'linear-gradient(165.59deg, #AFD7D0 14.645%, #897BBC 85.355%)'

// grad-02: lista de parceiros (data badge)
'linear-gradient(167.27deg, #B792A8 14.645%, #AD61C2 85.355%)'

// grad-03: seção Como Trabalhamos (cards)
'linear-gradient(174.05deg, #86C8D4 14.645%, #7FABED 85.355%)'

// grad-04: background da seção Por que Funciona
'linear-gradient(155.52deg, #AFD7D0 14.645%, #897BBC 85.355%)'
```

### Tipografia

| Token          | Família   | Style    | Size | Weight | LineHeight |
|----------------|-----------|----------|------|--------|------------|
| display-2xl    | Chillax   | Bold     | 64px | 700    | 68px       |
| display-xl     | Chillax   | Bold     | 48px | 700    | 51px       |
| display-lg     | Chillax   | Semibold | 36px | 600    | 38px       |
| display-sm     | Chillax   | Regular  | 24px | 400    | 28px       |
| body-lg        | Synonym   | Regular  | 16px | 400    | 26px       |
| body-md        | Synonym   | Regular  | 14px | 400    | 22px       |
| label-ui       | Synonym   | Regular  | 12px | 400    | 14px       |
| heading-02     | Synonym   | Bold     | 18px | 700    | 23px       |

### Espaçamento (tokens originais do Figma)

```
spacing/3  = 12px
spacing/6  = 24px
spacing/8  = 32px
spacing/12 = 48px
spacing/24 = 96px
```

### Border Radius

```
radius/xl   = 16px
radius/pill = 9999px
```

---

## Background Global — REGRA MAIS IMPORTANTE

Existe uma `<div>` com `position: fixed`, `z-index: 0`, cobrindo toda a tela.
Ela muda de cor com `transition: background-color 600ms ease` conforme a seção ativa.

**Mapeamento de cor por seção:**

| Seção             | Background                                      | Nav/Logo |
|-------------------|-------------------------------------------------|----------|
| Hero              | `#ffffff`                                       | dark      |
| Parceiros         | `#0d0d0d`                                       | light     |
| Por que Funciona  | grad-04 (`#AFD7D0` → `#897BBC`)                 | light     |
| Como Trabalhamos  | `#ffffff`                                       | dark      |
| Serviços          | `#897BBC`                                       | light     |
| CTA Final         | `#0d0d0d`                                       | light     |

O Nav detecta a cor ativa via context e alterna entre texto preto e branco automaticamente.

---

## Seções — Comportamento de Scroll

### 1. Nav
- `position: fixed`, `top: 0`, `z-index: 50`
- Logo à esquerda: `dup.agency` (Chillax Light + Medium)
- Links à direita: PROCESSO / MANIFESTO / PARCEIROS / SERVIÇOS / CONTATO
- Separador vertical entre logo e links
- Cor do texto muda conforme o estado do BackgroundLayer (dark/light)

---

### 2. Hero
- Headline centralizada: "Clareza e segurança / para quem precisa / de paz operacional"
- Palavras com gradiente: "Clareza", "segurança", "paz operacional" usam grad-01
- Logos de clientes abaixo com `mix-blend-mode: luminosity` e `opacity: 0.4`
- **Manifesto com scroll:** texto grande, full-width, linhas com opacidade variável
  - Linha ativa: `opacity: 1`
  - Linhas adjacentes: `opacity: 0.15`
  - Scroll-driven via GSAP ScrollTrigger com `scrub: true`
  - Botão Play: hook preparado para sincronização futura com áudio — por ora apenas ativa scroll automático

**Texto completo do manifesto (respeitar quebras exatas):**
```
TRABALHAMOS COM O QUE ACREDITAMOS.

CRIAR, PENSAR, RESOLVER... ISSO É PRAZER.

VIVER EM QUALQUER LUGAR DO MUNDO ,
ABSORVER NOVAS IDEIAS, CULTURAS...

ESCOLHER ONDE COLOCAMOS NOSSO TEMPO
E ENERGIA... CRIANDO

FIZEMOS ESCOLHAS

MINIMALISMO: NA VIDA, EM CASA, NA EMPRESA...

AGENDA LIMITADA, PARCERIAS QUE FAZEM SENTIDO

AGENDA LIMITADA, PARCERIAS QUE FAZEM SENTIDO.
TROCA, EVOLUÇÃO, CRESCIMENTO. PARA TODOS.

PORQUE, NO FIM, SÃO AS PESSOAS QUE CONSTROEM TUDO

ENQUANTO VOCÊ PENSA NO PRÓXIMO PASSO DO NEGÓCIO
GARANTIMOS QUE TECNOLOGIA NÃO SEJA O MOTIVO PARA
NÃO CHEGAR LÁ.

É ASSIM QUE A GENTE TRABALHA.
E É EXATAMENTE POR ISSO QUE FUNCIONA.
```

---

### 3. Parceiros que Confiam
- Fundo: preto (`#0d0d0d`)
- Título: "parceiros que / confiam" — "confiam" em grad-01
- Lista de clientes em linhas com `border-bottom: 0.5px solid #3d3d3d`
- Opacidade decrescente do primeiro ao último item (100% → 40%)
- **Hover:** leve aumento de `letter-spacing` ou `font-size` no item ativo, transição suave
- **Hover:** screenshot do site do cliente aparece com `opacity` fade — posicionado à direita da lista
- Screenshot é imagem estática (não vídeo)

**Clientes e período:**
```
Bennemann        — desde 2021  — Projeto + Evolução
dux human health — 2021-2026   — Projeto + Evolução
lego             — desde 2021  — Projeto + Evolução
sharkninja       — desde 2021  — Projeto + Evolução
spicy            — desde 2021  — Evolução
sodastream       — desde 2021  — Evolução
authen           — desde 2021  — Projeto + Evolução
fom              — desde 2026  — Evolução
vitafor          — desde 2024  — Evolução
Oneup            — desde 2021  — Projeto + Evolução
max festa        — desde 2021  — Projeto + Evolução
eatclean         — desde 2021  — Projeto + Evolução
```

---

### 4. Por que Funciona
- Background: grad-04
- Título: "porque funciona" (Chillax Bold, branco)
- 3 itens numerados (01, 02, 03) com linha separadora branca
- Layout two-column: número + título à esquerda, texto à direita
- Entrada com fade + translateY conforme scroll (ScrollTrigger, `start: "top 80%"`)

**Conteúdo:**
```
01 — Paz operacional de verdade
     O sentimento de preocupação com quebras e bugs vai embora...

02 — Alinhamento, explicação e decisão em equipe.
     Tudo que vai pra loja passa por você antes...

03 — A qualidade de sempre, com a tranquilidade de sempre.
     Nossa operação sempre seremos nós — estejamos em Buenos Aires...
```

---

### 5. Como Trabalhamos
- Background: branco, linhas de grid em `#cccccc`
- **Scroll-pinned scene via GSAP ScrollTrigger (pin: true)**
- Sequência de animação:
  1. Círculos concêntricos aparecem com fade de opacidade (do centro para fora)
  2. Título "como trabalhamos" surge no centro — "trabalhamos" em grad-01
  3. Texto descritivo aparece abaixo do título
  4. 4 cards surgem do fundo (escala pequena + opacidade baixa) e avançam em direção à tela
  5. Estado inicial: card 1 = 100%, card 2 = 60%, card 3 = 30%, card 4 = 10%
  6. Todos avançam em paralelo até card 4 = 100% e card 3 espiadinho no canto
  7. Unpin — página continua descendo

**Cards (frente para trás → avançam nessa ordem):**
```
01. Imersão
    A gente mergulha fundo no que tá acontecendo — entende a loja,
    a operação, os gargalos e as oportunidades.

02. Planejamento
    Com tudo mapeado, fica claro onde estão os maiores ganhos.
    A gente organiza as prioridades junto com você.

03. Execução
    Aqui tudo anda. Ritmo constante, entregas no combinado,
    e a conversa sempre aberta.

04. Validação
    Revisão contínua do que foi feito, garantindo qualidade
    e alinhamento em cada entrega.
```

- Cards têm `backdrop-blur`, `background: rgba(0,0,0,0.7)`, `border-radius: 16px`
- Título dos cards em grad-03 (`#86C8D4` → `#7FABED`)

---

### 6. Serviços
- Background: `#897BBC`
- **3 linhas de marquee controlado por scroll (scrub)**
- Linha 1: cards da esquerda → direita (começa fora da tela à esquerda)
- Linha 2: cards da direita → esquerda (começa fora da tela à direita)
- Linha 3: cards da esquerda → direita
- Animação termina com os 4 cards centralizados na tela
- Voltar o scroll desfaz a animação (scrub bidirecional)
- Implementar com GSAP ScrollTrigger + `scrub: 1`

**4 Serviços:**
```
Blueprint de Projeto
  Imersão completa, entrega de um documento estratégico:
  o que a VTEX resolve nativamente, o que precisa de customização,
  os riscos e os pontos de atenção.

Consultoria Estratégica
  Você continua com a sua agência. A gente entra como o cérebro
  estratégico da operação — decidindo o que executar, em que ordem
  e com quais riscos.

Projeto de Implantação
  Construção do zero, migração de plataforma ou reestruturação
  completa. Projetos a partir de R$ 60.000.

Evolução Contínua
  Parceiro técnico mês a mês. Agenda garantida, foco no que importa,
  e um sênior executando com qualidade todo mês.
  Planos Base, Growth e Premium.
```

- Cards com fundo `#53448A` (purple-dark/600), `border-radius: 16px`
- Ícone no topo de cada card (SVG — um por serviço)
- Máscara suave nas bordas da seção para os cards "desaparecerem" antes de centralizar

---

### 7. CTA Final
- Background: preto (`#0d0d0d`)
- Grid decorativo de fundo (mesmo padrão do hero)
- Título: "a agenda é limitada. / Mas uma conversa produtiva, / É IRRESISTÍVEL."
  - "conversa produtiva" em grad-01
- Subtítulo: "Responda 5 perguntas rápidas, / e marcamos um papo sobre como podemos somar!"
- Botão pill: "QUERO CONVERSAR!" com ícone Checks, `border: 1px solid white`
- Fade de entrada com ScrollTrigger

---

### 8. Footer
- Fundo preto, `height: 80px`
- Ícones de redes: Instagram, Spotify, YouTube, WhatsApp, LinkedIn (Phosphor Icons)
- Copyright: "dup.agency - 2026" — `color: #3d3d3d`, `font-size: 12px`

---

## Regras de Implementação

1. **Um componente por seção** — cada seção é um arquivo isolado em `src/components/sections/`
2. **GSAP só no client** — usar `'use client'` + `useEffect` + `useLayoutEffect` para ScrollTrigger
3. **Cleanup obrigatório** — todo ScrollTrigger deve ter `return () => ctx.revert()` no cleanup
4. **Fontes locais** — Chillax e Synonym via `next/font/local`, nunca CDN externo
5. **Sem background em seção** — nenhuma seção tem `background` próprio; a cor vem do BackgroundLayer fixed
6. **Seções com `position: relative` e `z-index: 1`** — para ficarem acima do BackgroundLayer
7. **Tailwind apenas com classes utilitárias** — sem `style` inline exceto para gradientes e valores dinâmicos de GSAP
8. **TypeScript strict** — sem `any`

---

## Ordem de Implementação Sugerida

1. `BackgroundLayer.tsx` + `useActiveSection.ts` (fundação de tudo)
2. `Nav.tsx` (depende do BackgroundLayer)
3. `Hero.tsx` — headline estática primeiro, manifesto scroll depois
4. `Parceiros.tsx` — lista + hover + imagem
5. `PorQueFunciona.tsx` — mais simples, boa pra testar ScrollTrigger
6. `ComoTrabalhamos.tsx` — cena pinada (mais complexa)
7. `Servicos.tsx` — marquee scroll
8. `CTAFinal.tsx` + `Footer.tsx`

---

## Assets do Figma

- **Arquivo design system:** `5lab3dt5A80bprpQ3ZyQQA`
- **Arquivo site:** `qHWzIM2Uf43tOrWFgbDYEM`
- **Node da página Home:** `2009:30`
- Tokens CSS gerados: `dup-tokens.css`, `tailwind.config.ts`

---

## Contexto da Agência

- **dup.agency** — boutique de tecnologia e-commerce, dois seniores: Dup (dev) e Lari (tech lead)
- Especialização: VTEX, Nuvemshop
- Modelo: parceria contínua, agenda limitada, sem turnover
- Sem funcionários, nunca terão
- Nomadismo digital — vivem em países diferentes em rotação
- Tom de voz: "papo de café" — casual, direto, positivo, sem corporativês
- Idioma de todo o conteúdo: Português Brasileiro

## Idioma

Responda sempre em Português Brasileiro. Faça perguntas em Português Brasileiro.

## Ícones

Usamos @phosphor-icons/react v2.1.
Todo ícone usa o gradiente principal do design system (**--grad-01**).

**NUNCA** use `color`, `currentColor` ou cores sólidas em ícones.
**SEMPRE** use as variáveis CSS do design system — nunca escreva hex diretamente.

### Wrapper obrigatório

Encapsule todos os ícones no componente `<PhosphorIcon />`:

```tsx
// components/ui/PhosphorIcon.tsx
import { type Icon } from "@phosphor-icons/react";

const GRADIENT_ID = "dup-grad-01";

export function PhosphorIcon({ icon: Icon, size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <defs>
        <linearGradient
          id={GRADIENT_ID}
          x1="0%" y1="0%" x2="100%" y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          {/* var(--teal-mint) → var(--purple-mid) = --grad-01 */}
          <stop offset="0%"   stopColor="var(--teal-mint)" />
          <stop offset="100%" stopColor="var(--purple-mid)" />
        </linearGradient>
      </defs>
      <Icon size={size} fill={`url(#${GRADIENT_ID})`} {...props} />
    </svg>
  );
}
```

### Uso

```tsx
// ✅ correto
<PhosphorIcon icon={House} size={32} />

// ❌ errado
<House size={32} color="#897BBC" />
<House size={32} color="var(--purple-mid)" />
```

### Referência de tokens de gradiente (design system)

| Token CSS         | Uso                        |
|-------------------|----------------------------|
| `--grad-01`       | ★ ícones e elementos brand |
| `--teal-mint`     | stop inicial do grad-01    |
| `--purple-mid`    | stop final do grad-01      |
| `--grad-site-01`  | textos display (Chillax)   |