'use client'

import { useEffect, useRef } from 'react'
import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

export default function CustomCursor() {
  const { navTheme } = useBackgroundContext()
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // navTheme 'dark' = fundo claro → ponto preto; 'light' = fundo escuro → ponto branco
  const dotColor = navTheme === 'dark' ? '#000000' : '#FFFFFF'
  const ringOpacity = navTheme === 'dark' ? 1 : 1

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -100, mouseY = -100
    let ringX  = -100, ringY  = -100
    let rafId: number
    let isHovering = false
    let isClicking = false

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function onMouseEnterInteractive() {
      isHovering = true
      ring.style.width   = '72px'
      ring.style.height  = '72px'
      ring.style.opacity = '1'
    }

    function onMouseLeaveInteractive() {
      isHovering = false
      ring.style.width   = '48px'
      ring.style.height  = '48px'
      ring.style.opacity = String(ringOpacity)
    }

    function onMouseDown() {
      isClicking = true
      ring.style.transform = `translate(-50%, -50%) scale(0.7)`
    }

    function onMouseUp() {
      isClicking = false
      ring.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.2 : 1})`
    }

    function addInteractiveListeners() {
      document.querySelectorAll<HTMLElement>('a, button, [role="button"], [tabindex]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive)
        el.addEventListener('mouseleave', onMouseLeaveInteractive)
      })
    }

    function loop() {
      // Dot: instantâneo
      dot.style.left = `${mouseX}px`
      dot.style.top  = `${mouseY}px`

      // Ring: lerp suave
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`

      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup',   onMouseUp)
    addInteractiveListeners()

    // Re-scan para elementos montados depois (ex: nav overlay)
    const observer = new MutationObserver(addInteractiveListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [ringOpacity])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          width:         '8px',
          height:        '8px',
          borderRadius:  '50%',
          background:    dotColor,
          transform:     'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex:        9999,
          transition:    'background 300ms ease'
        }}
      />

      {/* Ring — filter no pai, mask no filho → blur vaza pras bordas corretamente */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          width:         '48px',
          height:        '48px',
          filter:        'blur(6px)',
          opacity:       ringOpacity,
          transform:     'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex:        9998,
          transition:    'width 220ms ease, height 220ms ease, opacity 300ms ease, transform 120ms ease',
        }}
      >
        <div
          style={{
            position:     'absolute',
            inset:        0,
            borderRadius: '50%',
            background:   'conic-gradient(from 0deg, #B792A8, #AD61C2, #897BBC, #86C8D4, #AFD7D0, #B792A8)',
            WebkitMask:   'radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))',
            mask:         'radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))',
          }}
        />
      </div>
    </>
  )
}
