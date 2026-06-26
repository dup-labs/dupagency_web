'use client'

import { useLayoutEffect, useRef } from 'react'
import { useIntro } from './IntroProvider'
import { INTRO } from './timeline'
import { LOGO_VECTOR } from './logoVector'
import { gsap } from '@/lib/gsap'

const LOGO_COLOR = '#1A1A1A' // cor do logo (igual ao SVG original)

// ─────────────────────────────────────────────────────────────────────────────
// LOGO INTRO — o logo dup.agency desenhando no centro (flow "logo central").
// ─────────────────────────────────────────────────────────────────────────────
// Logo MONOLINE: cada traço é um <path> aberto que se desenha via dasharray
// (getTotalLength) na ordem esquerda→direita (ordenado por getBBox). O ponto (o
// "." de dup.agency) é o único elemento preenchido — entra com fade no fim. As
// paredes de tinta (z-40) descem por cima (z-30) e, sob a cobertura, o logo sai
// de cena (revealAt) — o hero assume embaixo.
//
// O vetor vem de logoVector.ts. Enquanto strokes estiver vazio, renderiza um
// PLACEHOLDER (wordmark vivo) com fade+scale só pra validar o timing.
//
// ⚠️ immediateRender:false em TODOS os tweens em posição futura — senão o GSAP
// aplica o estado final já no build (zero-duration sets e fromTo fazem isso por
// padrão), revelando/escondendo elementos antes da hora.
// ─────────────────────────────────────────────────────────────────────────────

const PATH_DUR = 0.8 // duração do desenho de cada traço

export default function LogoIntro() {
  const { shouldPlay, tl } = useIntro()
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const hasVector = LOGO_VECTOR.strokes.length > 0

  useLayoutEffect(() => {
    if (!shouldPlay || !tl || !rootRef.current) return
    const root = rootRef.current

    const ctx = gsap.context(() => {
      if (hasVector && svgRef.current) {
        const strokeEls = Array.from(svgRef.current.querySelectorAll('[data-logo-stroke]')) as SVGPathElement[]
        const fillEls = Array.from(svgRef.current.querySelectorAll('[data-logo-fill]')) as SVGPathElement[]

        // Desenha esquerda→direita: ordena os traços pela posição x do bounding box.
        const ordered = strokeEls
          .map((el) => ({ el, x: el.getBBox().x }))
          .sort((a, b) => a.x - b.x)
          .map((o) => o.el)

        // Cada traço nasce ESCONDIDO (autoAlpha:0 = visibility hidden). Senão o
        // linecap round renderiza um "ponto" no início do path mesmo com o traço
        // zerado (dashoffset = len) — 16 traços = 16 pontinhos parados na tela. O
        // traço só fica visível no instante em que começa a desenhar; o ponto que
        // sobra vira a "ponta da caneta", natural.
        ordered.forEach((p, i) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 0 })
          const start = INTRO.logo.at + i * INTRO.logo.stagger
          tl.to(p, { autoAlpha: 1, duration: 0.001, immediateRender: false }, start)
          tl.to(p, { strokeDashoffset: 0, duration: PATH_DUR, ease: 'power1.inOut', immediateRender: false }, start)
        })

        // O ponto (".") entra com fade logo após os traços fecharem.
        gsap.set(fillEls, { autoAlpha: 0 })
        const drawTotal = (ordered.length - 1) * INTRO.logo.stagger + PATH_DUR
        tl.to(
          fillEls,
          { autoAlpha: 1, duration: 0.2, ease: 'power2.out', immediateRender: false },
          INTRO.logo.at + drawTotal - 0.1,
        )
      } else {
        // PLACEHOLDER temporário (sem o SVG): fade+scale só pra validar o timing.
        gsap.set(root, { opacity: 0, scale: 0.92 })
        tl.to(root, { opacity: 1, scale: 1, duration: INTRO.logo.dur, ease: 'power2.out', immediateRender: false }, INTRO.logo.at)
      }

      // Sob as paredes, o logo sai de cena: o hero assume embaixo (revealAt).
      tl.to(root, { autoAlpha: 0, duration: 0.01, ease: 'none', immediateRender: false }, INTRO.tinta.revealAt)
    })

    return () => ctx.revert()
  }, [shouldPlay, tl, hasVector])

  return (
    <div
      ref={rootRef}
      className="logo-intro pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
      aria-hidden
    >
      {hasVector ? (
        <svg
          ref={svgRef}
          viewBox={LOGO_VECTOR.viewBox}
          style={{ width: 'clamp(280px, 56vw, 560px)', height: 'auto', overflow: 'visible' }}
        >
          {LOGO_VECTOR.strokes.map((s, i) => (
            <path
              key={`s${i}`}
              data-logo-stroke
              d={s.d}
              fill="none"
              stroke={LOGO_COLOR}
              strokeWidth={s.w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {LOGO_VECTOR.fills.map((d, i) => (
            <path key={`f${i}`} data-logo-fill d={d} fill={LOGO_COLOR} stroke="none" />
          ))}
        </svg>
      ) : (
        <span
          className="font-chillax font-bold lowercase text-black select-none"
          style={{ fontSize: 'clamp(40px, 8vw, 88px)', letterSpacing: '-0.01em' }}
        >
          dup.agency
        </span>
      )}
    </div>
  )
}
