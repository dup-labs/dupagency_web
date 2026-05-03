'use client'

import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

// 1 div com linear-gradient repetido — substitui os 18 divs antes (12 desktop
// + 6 mobile). Cada linha vertical é uma faixa de 1px no fim de cada partição
// (100/13% no desktop, 100/7% no mobile). Reduz drasticamente o DOM size.
export default function GridLines() {
  const { navTheme } = useBackgroundContext()
  const color =
    navTheme === 'light' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  const gradient = `linear-gradient(to right, transparent calc(100% - 1px), ${color} calc(100% - 1px), ${color} 100%)`

  return (
    <div
      className="grid-lines absolute inset-0 pointer-events-none"
      aria-hidden
      style={
        {
          ['--grid-lines-bg' as string]: gradient,
          backgroundImage: 'var(--grid-lines-bg)',
          transition: 'background-image 600ms ease',
        } as React.CSSProperties
      }
    />
  )
}
