'use client'

import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

export default function GridLines() {
  const { navTheme } = useBackgroundContext()
  const color =
    navTheme === 'light' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
      }}
      aria-hidden
    >
      {/* Desktop: 12 linhas */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`d-${i}`}
          className="hidden md:block absolute top-0 bottom-0 w-px"
          style={{
            left: `${((i + 1) / 13) * 100}%`,
            background: color,
            transition: 'background-color 600ms ease',
          }}
        />
      ))}
      {/* Mobile: 6 linhas */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`m-${i}`}
          className="block md:hidden absolute top-0 bottom-0 w-px"
          style={{
            left: `${((i + 1) / 7) * 100}%`,
            background: color,
            transition: 'background-color 600ms ease',
          }}
        />
      ))}
    </div>
  )
}
