'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { gsap } from '@/lib/gsap'
import { INTRO_SESSION_KEY } from './timeline'

// ─────────────────────────────────────────────────────────────────────────────
// ORQUESTRADOR DA INTRO DO HERO
// ─────────────────────────────────────────────────────────────────────────────
// O Nav vive no layout e o Hero na page — são irmãos. Pra UMA timeline reger os
// dois, este provider os envolve e expõe uma `master timeline` (pausada) onde
// cada componente pendura seus tweens em posições de tempo absolutas (ver
// timeline.ts). O provider decide SE a intro roda, espera as fontes carregarem
// (o stroke-draw mede o glifo da Chillax) e dá play.
//
// A decisão de rodar acontece ANTES da pintura, via script inline no <head> do
// layout, que seta html[data-intro="play"|"done"] baseado em:
//   · é a home?              (a cena é do hero da home)
//   · prefers-reduced-motion (acessibilidade → nunca anima)
//   · já rodou nesta sessão? (sessionStorage → roda 1×)
//   · ?intro=1 na URL        (override pra tunar no dev)
// O CSS (globals) usa esse atributo pra esconder os alvos `.intro-hide` sem
// flash. Aqui só LEMOS o atributo — síncrono, no primeiro render do client.
// ─────────────────────────────────────────────────────────────────────────────

interface IntroContextValue {
  /** true quando a intro vai/está rodando (alvos começam escondidos via CSS). */
  shouldPlay: boolean
  /** Master timeline pausada — null quando a intro não roda. */
  tl: gsap.core.Timeline | null
}

const IntroContext = createContext<IntroContextValue>({
  shouldPlay: false,
  tl: null,
})

export function useIntro() {
  return useContext(IntroContext)
}

export default function IntroProvider({ children }: { children: ReactNode }) {
  // Lê a decisão tomada pelo script inline (data-intro). Lazy initializer roda
  // de forma síncrona no 1º render do client (o provider é pai, renderiza antes
  // dos filhos), então o valor já está disponível pros filhos via context. No
  // SSR document é undefined → false; não afeta o HTML (alvos têm intro-hide
  // sempre; o CSS é quem decide), logo sem mismatch de hidratação.
  const [shouldPlay] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.dataset.intro === 'play'
  })

  // Master timeline criada uma vez, pausada. Filhos adicionam tweens no mount.
  const [tl] = useState<gsap.core.Timeline | null>(() => {
    if (!shouldPlay || typeof window === 'undefined') return null
    return gsap.timeline({
      paused: true,
      onComplete() {
        // Libera o estado final: remove o gate do CSS e marca a sessão.
        document.documentElement.setAttribute('data-intro', 'done')
      },
    })
  })

  useEffect(() => {
    if (!shouldPlay || !tl) return

    // `cancelled` (não um ref persistente) é o que previne play duplicado: em
    // StrictMode dev cada setup tem seu próprio `cancelled`, o cleanup cancela o
    // anterior e só o último setup chega ao tl.play(). Um guard via ref ficaria
    // preso em true depois do 1º cleanup e o play nunca dispararia.
    let cancelled = false
    // Espera a Chillax/Synonym carregarem antes de medir e desenhar. fonts.ready
    // resolve na hora se já estiverem prontas. rAF garante que todos os filhos
    // já rodaram seus useLayoutEffect (pendurando os tweens) antes do play.
    const fonts = document.fonts?.ready ?? Promise.resolve()
    fonts.then(() => {
      if (cancelled) return
      requestAnimationFrame(() => {
        if (cancelled) return
        try {
          sessionStorage.setItem(INTRO_SESSION_KEY, '1')
        } catch {
          // sessionStorage indisponível (modo privado/embed) — segue sem marcar.
        }
        tl.play(0)
      })
    })

    return () => {
      cancelled = true
    }
  }, [shouldPlay, tl])

  // Limpa a timeline no unmount.
  useEffect(() => {
    return () => {
      tl?.kill()
    }
  }, [tl])

  return (
    <IntroContext.Provider value={{ shouldPlay, tl }}>
      {children}
    </IntroContext.Provider>
  )
}
