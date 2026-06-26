'use client'

import { useId, useLayoutEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useIntro } from './IntroProvider'
import { INTRO } from './timeline'
import { HEADLINE_VECTORS } from './headlineVectors'
import { gsap } from '@/lib/gsap'

// ─────────────────────────────────────────────────────────────────────────────
// HERO HEADLINE — stroke-draw das palavras-grad com VETORES (Fase 2)
// ─────────────────────────────────────────────────────────────────────────────
// As palavras-grad (Clareza/segurança/paz operacional etc) são vetores que o
// Bruno desenhou (contorno por letra, em _headline-vectors/ → headlineVectors.ts,
// um conjunto de paths por palavra/idioma). Cada letra (path) desenha o contorno
// via dasharray medido por getTotalLength (preciso), depois é preenchida com o
// gradiente grad-01 quando as faixas de tinta cobrem a tela (Fase 3).
//
// As conectoras (E / para quem precisa / de) seguem TEXTO VIVO (HTML), e o
// headline inteiro continua i18n: o texto vem das messages; só as palavras-grad
// usam o vetor do idioma ativo. Um <span class="sr-only"> mantém o texto real
// no DOM pra SEO/leitores de tela.
// ─────────────────────────────────────────────────────────────────────────────

// Ajustes do desenho — afinar aqui.
const STROKE_W       = 16    // espessura do traço (unidades do viewBox ≈ 1000/em)
const LETTER_DUR     = 0.34  // duração do desenho de cada letra
const LETTER_STAGGER = 0.035 // intervalo entre letras dentro de uma palavra
const BASELINE_UNITS = 707   // baseline dos vetores (cap height na escala do Bruno)

// Mapa idioma → vetores das palavras-grad, na ordem de leitura do headline.
const VECTOR_KEYS: Record<string, string[]> = {
  pt: ['pt-clareza', 'pt-seguranca', 'shared-paz-operacional'],
  en: ['en-clarity', 'en-confidence', 'en-operational-peace-of-mind'],
  es: ['es-claridad', 'es-seguridad', 'shared-paz-operacional'],
}

type Token = { text: string; grad: boolean }
type Line = Token[]

// "<g>Clareza</g> e <g>segurança</g><br></br>para quem precisa<br></br>de <g>paz operacional</g>"
// → [[{Clareza,grad},{ e ,—},{segurança,grad}], [{para quem precisa,—}], …]
function parseHeadline(raw: string): Line[] {
  return raw
    .split(/<br\s*\/?>(?:<\/br>)?/i)
    .map((lineStr) => {
      const tokens: Token[] = []
      const re = /<g>(.*?)<\/g>/gi
      let last = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(lineStr))) {
        if (m.index > last) tokens.push({ text: lineStr.slice(last, m.index), grad: false })
        tokens.push({ text: m[1], grad: true })
        last = m.index + m[0].length
      }
      if (last < lineStr.length) tokens.push({ text: lineStr.slice(last), grad: false })
      return tokens
    })
    .filter((line) => line.length > 0)
}

// Palavra-grad: SVG com os paths do vetor. Cada letra desenha o contorno
// (dasharray) e depois é preenchida (gradiente) no beat da tinta.
function GradWord({ vectorKey, text, index }: { vectorKey: string; text: string; index: number }) {
  const gradId = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const { shouldPlay, tl } = useIntro()
  const vec = HEADLINE_VECTORS[vectorKey]

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!shouldPlay || !tl || !svg || !vec) return
    const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[]
    // Paths vêm direita→esquerda (z-order do Figma); reverte p/ desenhar L→R.
    const ordered = [...paths].reverse()

    ordered.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, {
        fill: 'transparent',
        stroke: `url(#${gradId})`,
        strokeWidth: STROKE_W,
        strokeDasharray: len,
        strokeDashoffset: len,
      })
    })

    const wordStart = INTRO.stroke.at + index * INTRO.stroke.stagger
    // Desenho: cada letra traça o contorno, em sequência (L→R).
    tl.to(
      ordered,
      { strokeDashoffset: 0, duration: LETTER_DUR, ease: 'power1.inOut', stagger: LETTER_STAGGER },
      wordStart,
    )
    // Pintura (Fase 3): escondida sob as faixas, a palavra vira preenchida.
    tl.set(paths, { fill: `url(#${gradId})`, strokeWidth: 0 }, INTRO.tinta.paintAt)
  }, [shouldPlay, tl, vec, gradId, index])

  if (!vec) return <span>{text}</span>

  const vbH = Number(vec.viewBox.split(' ')[3]) || 1000
  // Altura em em mantém a cap height visual constante (BASELINE_UNITS/1000 em);
  // o "drop" desce o glifo pra baseline casar com as conectoras (descendentes
  // como o Ç ficam abaixo da linha).
  const heightEm = vbH / 1000
  const dropEm = (vbH - BASELINE_UNITS) / 1000

  return (
    <span className="inline-block whitespace-nowrap" style={{ verticalAlign: `${-dropEm}em` }}>
      <span className="sr-only">{text}</span>
      <svg
        ref={svgRef}
        viewBox={vec.viewBox}
        aria-hidden
        style={{ height: `${heightEm}em`, width: 'auto', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradId} x1="12%" y1="0%" x2="88%" y2="100%">
            <stop offset="0%" stopColor="var(--teal-mint)" />
            <stop offset="100%" stopColor="var(--purple-mid)" />
          </linearGradient>
        </defs>
        {vec.paths.map((d, i) => (
          <path key={i} d={d} fill={`url(#${gradId})`} stroke="none" />
        ))}
      </svg>
    </span>
  )
}

// Conectora: texto preto normal. Fade no beat conectoras (bounce real = Fase 4).
function Connector({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { shouldPlay, tl } = useIntro()

  useLayoutEffect(() => {
    if (!shouldPlay || !tl || !ref.current) return
    tl.fromTo(
      ref.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: INTRO.conectoras.dur, ease: 'power2.out' },
      INTRO.conectoras.at,
    )
  }, [shouldPlay, tl])

  return (
    <span ref={ref} className="intro-hide">
      {text}
    </span>
  )
}

export default function HeroHeadline({
  raw,
  className,
  style,
}: {
  raw: string
  className?: string
  style?: React.CSSProperties
}) {
  const locale = useLocale()
  const lines = parseHeadline(raw)
  const rootRef = useRef<HTMLHeadingElement>(null)
  const { shouldPlay, tl } = useIntro()

  const keys = VECTOR_KEYS[locale] ?? VECTOR_KEYS.pt

  // Revela o bloco do headline no início do beat stroke. Nasce escondido
  // (.intro-hide) só pra cobrir o frame antes dos paths serem preparados.
  useLayoutEffect(() => {
    if (!shouldPlay || !tl || !rootRef.current) return
    tl.set(rootRef.current, { opacity: 1 }, INTRO.stroke.at)
  }, [shouldPlay, tl])

  // Índice global das palavras-grad (mapeia pro vetor do idioma e pro stagger).
  let gradIndex = 0

  return (
    <h1 ref={rootRef} className={`intro-hide ${className ?? ''}`} style={style}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((tok, ti) => {
            if (!tok.grad) return <Connector key={ti} text={tok.text} />
            const gi = gradIndex++
            return <GradWord key={ti} vectorKey={keys[gi]} text={tok.text} index={gi} />
          })}
        </span>
      ))}
    </h1>
  )
}
