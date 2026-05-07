'use client'

import { createContext, useContext, useEffect } from 'react'
import { useActiveSection, NavTheme } from '@/hooks/useActiveSection'
import { ScrollTrigger } from '@/lib/gsap'

interface BackgroundContextValue {
  navTheme: NavTheme
}

const BackgroundContext = createContext<BackgroundContextValue>({
  navTheme: 'dark',
})

export function useBackgroundContext() {
  return useContext(BackgroundContext)
}

export default function BackgroundLayer({
  children,
}: {
  children: React.ReactNode
}) {
  const { activeSection, config } = useActiveSection()

  useEffect(() => {
    // Recalcula todos os ScrollTriggers depois que todos os filhos montam e
    // o layout está estável. Sem isso, seções com pin:true calculam posições
    // erradas porque os spacers ainda não existem quando as outras montam.
    const id = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => clearTimeout(id)
  }, [])

  const isPorQueFunciona = activeSection === 'por-que-funciona'
  const isGeoFinalCta    = activeSection === 'geo-final-cta' || activeSection === 'rc-final-cta'
  const isGradient       = isPorQueFunciona || isGeoFinalCta

  return (
    <BackgroundContext.Provider value={{ navTheme: config.navTheme }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Solid layer — transparente quando gradient section está ativa */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: isGradient ? 'rgba(0,0,0,0)' : config.background,
            transition: 'background-color 600ms ease',
          }}
        />
        {/* Gradient layer — home: por-que-funciona */}
        <div
          className="absolute inset-0"
          style={{
            background:  'var(--grad-site-04)',
            opacity:     isPorQueFunciona ? 1 : 0,
            transition:  'opacity 600ms ease',
          }}
        />
        {/* Gradient layer — geo-audit: geo-final-cta */}
        <div
          className="absolute inset-0"
          style={{
            background:  'var(--grad-site-01)',
            opacity:     isGeoFinalCta ? 1 : 0,
            transition:  'opacity 600ms ease',
          }}
        />
      </div>
      {children}
    </BackgroundContext.Provider>
  )
}
