'use client'

import { useEffect, useRef } from 'react'

// Grid de blueprint fixo atrás da página inteira, com parallax bem sutil
// (~0.04 do scroll — mesmo fator do protótipo). Nas seções escuras ele some
// sozinho: linha rgba(13,13,13,.045) sobre preto é invisível, e essas seções
// desenham o próprio grid claro por cima (lab-draft-grid--dark).
export default function LabGrid() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translateY(${window.scrollY * 0.04}px)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="lab-draft-grid fixed left-0 right-0 z-0 pointer-events-none"
      style={{ top: '-20%', bottom: '-20%' }}
      aria-hidden
    />
  )
}
