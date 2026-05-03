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

  // 'por-que-funciona' é a única seção com background gradient — o resto
  // são cores sólidas (branco / preto). Renderizamos como duas camadas:
  //
  // 1. Solid layer com backgroundColor que transiciona via CSS. Transições
  //    entre seções de mesma cor (ex: cta-final → faq-dark, ambas pretas)
  //    não disparam transition nenhuma — sem flicker. Transições entre
  //    cores diferentes interpolam direto (sem o body bleed-through que o
  //    cross-fade anterior causava).
  // 2. Gradient layer que faz fade in/out quando 'por-que-funciona' ativa.
  const isGradient = activeSection === 'por-que-funciona'

  return (
    <BackgroundContext.Provider value={{ navTheme: config.navTheme }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: isGradient ? 'rgba(0,0,0,0)' : config.background,
            transition: 'background-color 600ms ease',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--grad-site-04)',
            opacity: isGradient ? 1 : 0,
            transition: 'opacity 600ms ease',
          }}
        />
      </div>
      {children}
    </BackgroundContext.Provider>
  )
}
