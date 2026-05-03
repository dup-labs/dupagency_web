'use client'

import { useEffect, useState } from 'react'

export type SectionId =
  | 'hero'
  | 'parceiros'
  | 'por-que-funciona'
  | 'como-trabalhamos'
  | 'servicos'
  | 'depoimentos'
  | 'faq-dark'
  | 'faq'
  | 'cta-final'

export type NavTheme = 'dark' | 'light'

interface SectionConfig {
  background: string
  navTheme: NavTheme
}

export const SECTION_CONFIGS: Record<SectionId, SectionConfig> = {
  hero: {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  parceiros: {
    background: 'var(--black)',
    navTheme: 'light',
  },
  'por-que-funciona': {
    background: 'var(--grad-site-04)',
    navTheme: 'light',
  },
  'como-trabalhamos': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  servicos: {
    background: 'var(--white)',
    navTheme: 'light',
  },
  depoimentos: {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  // ATENÇÃO: 'faq-dark' precisa vir ANTES de 'faq' aqui — o useActiveSection
  // itera nesta ordem e usa o primeiro id cuja box contém a linha de detecção.
  // Quando o sentinel da metade inferior do FAQ cruza essa linha, ele vence o
  // próprio FAQ e o BG transiciona pra preto antes do CTAFinal/Footer.
  'faq-dark': {
    background: 'var(--black)',
    navTheme: 'light',
  },
  faq: {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'cta-final': {
    background: 'var(--black)',
    navTheme: 'light',
  },
}

const SECTION_IDS = Object.keys(SECTION_CONFIGS) as SectionId[]

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    // Linha de detecção a 15% do topo da viewport — mesma posição do impl
    // anterior (rectreading), só que via rootMargin do IntersectionObserver:
    // top -15% recorta os primeiros 15% do viewport, bottom -85% recorta os
    // últimos 85%. Resta uma "linha" a 15% — qualquer seção que cruze essa
    // linha vira ativa.
    const intersecting = new Set<SectionId>()

    function pickActive() {
      // Itera na ordem de SECTION_IDS e pega o primeiro intersectando.
      // Para FAQ: 'faq-dark' vem antes de 'faq', então quando o sentinel
      // dark cobre a linha, ele vence — exatamente o comportamento desejado.
      for (const id of SECTION_IDS) {
        if (intersecting.has(id)) {
          setActiveSection((prev) => (prev !== id ? id : prev))
          return
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id as SectionId
          if (e.isIntersecting) intersecting.add(id)
          else intersecting.delete(id)
        }
        pickActive()
      },
      { rootMargin: '-15% 0px -85% 0px', threshold: 0 },
    )

    // Observa cada seção. Se a seção tem pin do GSAP, o pai vira spacer e
    // determina o footprint real — observamos o spacer nesse caso.
    function observeAll() {
      observer.disconnect()
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const parent = el.parentElement
        const target =
          parent?.hasAttribute('data-gsap-pin-spacer') ? parent : el
        observer.observe(target)
      }
    }

    observeAll()

    // GSAP cria pin-spacers depois do mount. Re-observa quando ScrollTrigger
    // dispara refresh (que reorganiza spacers).
    let rafId = 0
    function onRefresh() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(observeAll)
    }
    window.addEventListener('scrolltrigger:refresh', onRefresh)

    return () => {
      observer.disconnect()
      window.removeEventListener('scrolltrigger:refresh', onRefresh)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return {
    activeSection,
    config: SECTION_CONFIGS[activeSection],
  }
}
