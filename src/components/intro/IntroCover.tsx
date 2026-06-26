'use client'

import { useLayoutEffect, useRef } from 'react'
import { useIntro } from './IntroProvider'
import { INTRO } from './timeline'
import { gsap } from '@/lib/gsap'

// ─────────────────────────────────────────────────────────────────────────────
// INTRO COVER — a cobertura branca opaca da intro (chave da PERF/LCP).
// ─────────────────────────────────────────────────────────────────────────────
// O hero (headline = maior elemento = candidato a LCP) é renderizado VISÍVEL e
// pinta já no 1º frame. Esta camada branca (z-20, abaixo do logo z-30 e das
// paredes z-40) cobre o hero durante o branco+logo e SOME no revealAt — sob as
// paredes, que então sobem revelando o hero que já estava lá. Assim o Lighthouse
// registra o LCP no primeiro paint do hero, não em ~2,7s.
//
// Sempre renderizada (server/client iguais → sem mismatch de hidratação);
// escondida por CSS e só visível com data-intro="play" (ver globals .hero-cover).
// ─────────────────────────────────────────────────────────────────────────────

export default function IntroCover() {
  const { shouldPlay, tl } = useIntro()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!shouldPlay || !tl || !ref.current) return
    const ctx = gsap.context(() => {
      // Some sob a cobertura das paredes (revealAt). immediateRender:false p/ não
      // sumir já no build — antes disso o CSS .hero-cover mantém ela opaca.
      tl.to(ref.current, { autoAlpha: 0, duration: 0.01, ease: 'none', immediateRender: false }, INTRO.tinta.revealAt)
    })
    return () => ctx.revert()
  }, [shouldPlay, tl])

  return <div ref={ref} className="hero-cover fixed inset-0 z-20 bg-white pointer-events-none" aria-hidden />
}
