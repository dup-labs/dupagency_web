'use client'

import { createContext, useContext, useEffect } from 'react'
import { useActiveSection, NavTheme, SECTION_CONFIGS } from '@/hooks/useActiveSection'
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

  return (
    <BackgroundContext.Provider value={{ navTheme: config.navTheme }}>
      {/*
        Cada seção tem seu próprio div de fundo. Transicionamos opacity (não
        background), o que permite cross-fade entre cor sólida ↔ gradiente.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {(Object.entries(SECTION_CONFIGS) as [string, typeof SECTION_CONFIGS[keyof typeof SECTION_CONFIGS]][]).map(
          ([id, cfg]) => (
            <div
              key={id}
              className="absolute inset-0"
              style={{
                background: cfg.background,
                opacity: activeSection === id ? 1 : 0,
                transition: 'opacity 600ms ease',
              }}
            />
          ),
        )}
      </div>
      {children}
    </BackgroundContext.Provider>
  )
}
