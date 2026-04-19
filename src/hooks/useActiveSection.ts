'use client'

import { useEffect, useState } from 'react'

export type SectionId =
  | 'hero'
  | 'parceiros'
  | 'por-que-funciona'
  | 'como-trabalhamos'
  | 'servicos'
  | 'depoimentos'
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
  'cta-final': {
    background: 'var(--black)',
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
