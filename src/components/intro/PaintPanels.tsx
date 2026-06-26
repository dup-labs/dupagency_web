'use client'

import { useEffect, useRef } from 'react'
import { useIntro } from './IntroProvider'
import { INTRO, PAINT_BANDS, PAINT_EXIT_EASE } from './timeline'
import { gsap, CustomEase } from '@/lib/gsap'

// ─────────────────────────────────────────────────────────────────────────────
// PAINT PANELS — as 3 faixas de tinta (Fase 3)
// ─────────────────────────────────────────────────────────────────────────────
// Referência: loader do poetic.com. 3 faixas full-screen empilhadas em z-index
// (purple-vivid / purple-mid / teal-mint). No beat da tinta elas DESCEM cobrindo
// tudo (a "tinta caindo"), seguram um instante — é quando as palavras-grad viram
// preenchido (ver HeroHeadline) — e SAEM por baixo com stagger de 80ms e o
// easing exato da referência, revelando as palavras pintadas.
// ─────────────────────────────────────────────────────────────────────────────

export default function PaintPanels() {
  const { shouldPlay, tl } = useIntro()
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!shouldPlay || !tl) return
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[]
    if (panels.length !== PAINT_BANDS.length) return

    const t = INTRO.tinta
    let exitEase: string | gsap.EaseFunction = 'power4.inOut'
    try {
      exitEase = CustomEase.create('paintExit', PAINT_EXIT_EASE)
    } catch {
      // CustomEase indisponível — power4.inOut aproxima o cubic-bezier.
    }

    // gsap.context isola os tweens — o cleanup (StrictMode/unmount) os remove.
    const ctx = gsap.context(() => {
      // Estado inicial: painéis fora da tela, em cima (yPercent -100) já no setup.
      // y:0/x:0 EXPLÍCITOS são críticos: a classe CSS .paint-panel esconde o painel
      // com `transform: translateY(-100%)`, e o GSAP, ao tocar o elemento, lê o
      // transform COMPUTADO (sempre matriz em px) e interpreta isso como y:-922px
      // (≈ altura da viewport). Esse px lixo fica grudado em todos os estados e a
      // faixa nunca sai de fato. Zerar x/y aqui descarta a leitura errada.
      gsap.set(panels, { xPercent: 0, yPercent: -100, x: 0, y: 0 })

      // Entrada: descem cobrindo. Ordem trás→frente (teal primeiro; purple-vivid
      // fecha por cima).
      tl.fromTo(
        [...panels].reverse(),
        { yPercent: -100 },
        { yPercent: 0, duration: t.enter, ease: 'power3.inOut', stagger: t.enterStagger },
        t.at,
      )
      // Saída: saem por baixo revelando. Ordem frente→trás (z maior sai primeiro),
      // stagger 80ms, easing da referência (cubic-bezier 0.76,0,0.24,1).
      tl.to(
        panels,
        { yPercent: 100, duration: t.exit, ease: exitEase, stagger: t.stagger },
        t.at + t.enter + t.coverHold,
      )
    })

    return () => ctx.revert()
  }, [shouldPlay, tl])

  return (
    <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none" aria-hidden>
      {PAINT_BANDS.map((band, i) => (
        <div
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el
          }}
          data-paint={i}
          className="paint-panel absolute inset-0"
          style={{
            background: band.color,
            zIndex: band.z,
          }}
        />
      ))}
    </div>
  )
}
