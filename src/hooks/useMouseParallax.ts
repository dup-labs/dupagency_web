'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap } from '@/lib/gsap'

// ─────────────────────────────────────────────────────────────────────────────
// useMouseParallax — camadas que reagem ao mouse indo pro lado OPOSTO.
// ─────────────────────────────────────────────────────────────────────────────
// Cada camada tem força (deslocamento máx em px no extremo da tela) e duração
// (suavização do seguir). Variar força E duração entre camadas é o que dá o
// efeito "desencontrado" — uma arrasta mais que a outra. Só com ponteiro fino
// (mouse) e respeitando prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export interface ParallaxLayer {
  ref: RefObject<HTMLElement | null>
  /** Deslocamento máx em px quando o mouse está no extremo da viewport. */
  strength: number
  /** Suavização do seguir, em s. Valores diferentes entre camadas = desencontro. */
  duration?: number
}

export function useMouseParallax(layers: ParallaxLayer[]) {
  // Guarda a lista mais recente sem re-assinar o listener a cada render.
  const layersRef = useRef(layers)
  layersRef.current = layers

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    // quickTo cria setters interpolados (suaves) por camada — buttery, sem rAF na mão.
    const setters = layersRef.current
      .filter((l) => l.ref.current)
      .map((l) => ({
        strength: l.strength,
        xTo: gsap.quickTo(l.ref.current!, 'x', { duration: l.duration ?? 0.6, ease: 'power3.out' }),
        yTo: gsap.quickTo(l.ref.current!, 'y', { duration: l.duration ?? 0.6, ease: 'power3.out' }),
      }))
    if (!setters.length) return

    function onMove(e: MouseEvent) {
      // -1..1 a partir do centro da viewport.
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      for (const s of setters) {
        s.xTo(-nx * s.strength) // sinal negativo → vai pro lado oposto ao mouse
        s.yTo(-ny * s.strength)
      }
    }

    function recenter() {
      for (const s of setters) {
        s.xTo(0)
        s.yTo(0)
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', recenter)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', recenter)
      recenter()
    }
  }, [])
}
