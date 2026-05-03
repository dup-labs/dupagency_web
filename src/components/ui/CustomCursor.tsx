'use client'

import { useEffect, useRef, useState } from 'react'
import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [tabindex]'

export default function CustomCursor() {
  const { navTheme } = useBackgroundContext()
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Só monta em devices com hover real e que não pediram reduced-motion.
  // Checagem em useEffect pra não quebrar SSR e pra reagir a mudanças.
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const noHover  = window.matchMedia('(hover: none)').matches
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noHover || reduced) return

    // Adia mount pra depois do load — o cursor não é crítico pra primeira pintura.
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
    const w = window as IdleWindow
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200))
    const id = schedule(() => setEnabled(true), { timeout: 1500 })
    return () => {
      const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (cancel) cancel(id as number)
      else clearTimeout(id as unknown as ReturnType<typeof setTimeout>)
    }
  }, [])

  // navTheme 'dark' = fundo claro → ponto preto; 'light' = fundo escuro → ponto branco
  const dotColor = navTheme === 'dark' ? '#000000' : '#FFFFFF'

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return
    const dot  = dotRef.current
    const ring = ringRef.current

    let mouseX = -100, mouseY = -100
    let ringX  = -100, ringY  = -100
    let rafId = 0
    let isHovering = false
    let isShrinking = false

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function applyRingSize() {
      if (isShrinking) {
        ring.style.width  = '24px'
        ring.style.height = '24px'
      } else if (isHovering) {
        ring.style.width  = '72px'
        ring.style.height = '72px'
      } else {
        ring.style.width  = '48px'
        ring.style.height = '48px'
      }
    }

    // Event delegation: 1 listener no document em vez de N por elemento.
    // Cobre elementos montados depois sem precisar de MutationObserver.
    function onPointerOver(e: Event) {
      const target = e.target as Element | null
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        isHovering = true
        applyRingSize()
      }
    }
    function onPointerOut(e: Event) {
      const target = e.target as Element | null
      const related = (e as PointerEvent).relatedTarget as Element | null
      if (
        target?.closest?.(INTERACTIVE_SELECTOR) &&
        !related?.closest?.(INTERACTIVE_SELECTOR)
      ) {
        isHovering = false
        applyRingSize()
      }
    }

    function onCursorShrink(e: Event) {
      isShrinking = !!(e as CustomEvent).detail
      applyRingSize()
    }

    function onMouseDown() {
      ring.style.transform = `translate(-50%, -50%) scale(0.7)`
    }
    function onMouseUp() {
      ring.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.2 : 1})`
    }

    function loop() {
      dot.style.left = `${mouseX}px`
      dot.style.top  = `${mouseY}px`
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown,  { passive: true })
    window.addEventListener('mouseup',   onMouseUp,    { passive: true })
    window.addEventListener('cursor:shrink', onCursorShrink)
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout',  onPointerOut,  { passive: true })

    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('cursor:shrink', onCursorShrink)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout',  onPointerOut)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position:      'fixed',
          width:         '8px',
          height:        '8px',
          borderRadius:  '50%',
          background:    dotColor,
          transform:     'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex:        9999,
          transition:    'background 300ms ease',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position:      'fixed',
          width:         '48px',
          height:        '48px',
          filter:        'blur(6px)',
          transform:     'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex:        9998,
          transition:    'width 220ms ease, height 220ms ease, transform 120ms ease',
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
