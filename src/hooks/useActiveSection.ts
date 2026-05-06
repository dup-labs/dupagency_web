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
  // geo-audit
  | 'geo-hero'
  | 'geo-what-is-geo'
  | 'geo-services'
  | 'geo-how-it-works'
  | 'geo-checker-upsell'
  | 'geo-faq'
  | 'geo-final-cta'

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
  // geo-audit
  'geo-hero': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'geo-what-is-geo': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'geo-services': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'geo-how-it-works': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'geo-checker-upsell': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'geo-faq': {
    background: 'var(--white)',
    navTheme: 'dark',
  },
  'geo-final-cta': {
    background: 'var(--grad-site-01)',
    navTheme: 'light',
  },
}

const SECTION_IDS = Object.keys(SECTION_CONFIGS) as SectionId[]

function getSectionRect(el: HTMLElement): DOMRect {
  const parent = el.parentElement
  if (parent?.hasAttribute('data-gsap-pin-spacer')) {
    return parent.getBoundingClientRect()
  }
  return el.getBoundingClientRect()
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    let rafId: number

    function update() {
      // Linha de troca a 50% do topo: fundo muda quando a nova seção ocupa
      // metade da tela, evitando texto legível no fundo errado.
      const mid = window.innerHeight * 0.5
      let found: SectionId | null = null
      let closestDist = Infinity

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue

        const rect = getSectionRect(el)

        if (rect.top <= mid && rect.bottom >= mid) {
          found = id
          break
        }

        const dist = Math.abs((rect.top + rect.bottom) / 2 - mid)
        if (dist < closestDist) {
          closestDist = dist
          found = id
        }
      }

      // Seções no final da página nunca atingem a linha de 15% porque o scroll
      // acaba antes. Quando chegamos ao fundo, ativamos a última seção visível.
      const atScrollBottom =
        window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 80
      if (atScrollBottom) {
        for (const id of [...SECTION_IDS].reverse()) {
          const el = document.getElementById(id)
          if (!el) continue
          const rect = getSectionRect(el)
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            found = id
            break
          }
        }
      }

      if (found) setActiveSection((prev) => (prev !== found ? found : prev))
    }

    function onScroll() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return {
    activeSection,
    config: SECTION_CONFIGS[activeSection],
  }
}
