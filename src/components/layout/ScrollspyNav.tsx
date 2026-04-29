'use client'

import { useEffect, useRef, useState } from 'react'
import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

const SECTIONS = [
  { id: 'hero',             label: 'Início' },
  { id: 'manifesto',        label: 'Manifesto' },
  { id: 'parceiros',        label: 'Parceiros' },
  { id: 'por-que-funciona', label: 'Por que' },
  { id: 'como-trabalhamos', label: 'Processo' },
  { id: 'servicos',         label: 'Serviços' },
  { id: 'cta-final',        label: 'Contato' },
]

const ROW_H  = 32
const SLOT_W = 16

export default function ScrollspyNav() {
  const { navTheme } = useBackgroundContext()
  const isLight = navTheme === 'light'

  const [activeId,  setActiveId]  = useState<string>(SECTIONS[0].id)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const els = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el)
    if (!els.length) return

    // rootMargin -50%/-50% reduz a raiz a uma linha no centro da viewport.
    // A seção que cruza essa linha é a "ativa" — funciona pra qualquer altura.
    // #manifesto vive dentro de #hero, então mantemos um Set dos que estão
    // intersectando e escolhemos o de maior índice em SECTIONS — assim o
    // filho (mais específico) ganha do pai.
    const intersecting = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) intersecting.add(e.target.id)
          else                  intersecting.delete(e.target.id)
        }
        for (let i = SECTIONS.length - 1; i >= 0; i--) {
          if (intersecting.has(SECTIONS[i].id)) {
            setActiveId(SECTIONS[i].id)
            return
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))

    let raf = 0
    const update = () => {
      const first = els[0]
      const last  = els[els.length - 1]
      const start = first.offsetTop
      const end   = last.offsetTop + last.offsetHeight
      const cur   = window.scrollY + window.innerHeight / 2
      const p     = Math.max(0, Math.min(1, (cur - start) / (end - start)))
      // Atualiza DOM direto — sem setState, sem re-render do React por frame.
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${p})`
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll',   onScroll, { passive: true })
    window.addEventListener('resize',   onScroll)
    update()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const activeIndex    = Math.max(0, SECTIONS.findIndex((s) => s.id === activeId))
  const trackColor     = isLight ? 'rgba(255,255,255,0.22)' : 'rgba(13,13,13,0.18)'
  const inactiveBorder = isLight ? 'rgba(255,255,255,0.55)' : 'rgba(13,13,13,0.40)'
  const labelColor     = isLight ? '#ffffff'                : '#0d0d0d'
  const lineHeight     = (SECTIONS.length - 1) * ROW_H

  return (
    <nav
      aria-label="Navegação por seção"
      className="hidden lg:flex fixed right-8 z-40 flex-col pointer-events-none"
      style={{ bottom: 40 }}
    >
      {/* Trilho + linha de progresso — vão do centro do 1º dot ao centro do último */}
      <span
        aria-hidden
        className="absolute w-px"
        style={{
          right: SLOT_W / 2 - 0.5,
          top: ROW_H / 2,
          height: lineHeight,
          background: trackColor,
          transition: 'background 0.4s ease',
        }}
      />
      <span
        ref={progressRef}
        aria-hidden
        className="absolute w-px origin-top"
        style={{
          right: SLOT_W / 2 - 0.5,
          top: ROW_H / 2,
          height: lineHeight,
          background: 'linear-gradient(180deg, #AFD7D0 0%, #897BBC 100%)',
          transform: 'scaleY(0)',
          willChange: 'transform',
        }}
      />

      {SECTIONS.map((section, i) => {
        const isActive  = section.id === activeId
        const isHovered = section.id === hoveredId
        const showLabel = isActive || isHovered
        const isVisited = i <= activeIndex
        const dotSize   = isActive ? 12 : 8
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="relative flex items-center justify-end gap-3 pointer-events-auto"
            style={{ height: ROW_H }}
            aria-label={section.label}
            aria-current={isActive ? 'true' : undefined}
            onMouseEnter={() => setHoveredId(section.id)}
            onMouseLeave={() => setHoveredId((v) => (v === section.id ? null : v))}
          >
            <span
              className="font-synonym uppercase whitespace-nowrap"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: labelColor,
                opacity: showLabel ? 1 : 0,
                transform: `translateX(${showLabel ? 0 : 8}px)`,
                transition: 'opacity 0.3s ease, transform 0.3s ease, color 0.4s ease',
              }}
            >
              {section.label}
            </span>
            <span
              className="flex items-center justify-center shrink-0"
              style={{ width: SLOT_W, height: SLOT_W }}
            >
              <span
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: '50%',
                  background: isVisited ? '#0d0d0d' : 'transparent',
                  border: isVisited ? 'none' : '1px solid #0d0d0d',
                  boxShadow: isActive
                    ? '0 0 10px 1px rgba(137,123,188,0.55), 0 0 0 4px rgba(137,123,188,0.18)'
                    : '0 0 6px 0.5px rgba(137,123,188,0.35)',
                  transition: 'width 0.25s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                }}
              />
            </span>
          </a>
        )
      })}
    </nav>
  )
}
