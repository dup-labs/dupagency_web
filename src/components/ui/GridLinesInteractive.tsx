'use client'

import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// GridLinesInteractive — as linhas verticais do hero, mas em SVG, que se
// ENCURVAM perto do cursor (distorção tipo campo magnético).
// ─────────────────────────────────────────────────────────────────────────────
// Cada linha é um <path> amostrado de cima a baixo (a cada STEP px). A cada
// frame, todo ponto recebe um empurrão horizontal proporcional à proximidade
// do mouse (falloff quadrático dentro de RADIUS), repelindo a linha pra longe
// do cursor. O mouse é suavizado (lerp) → as linhas "arrastam" atrás dele.
// Só roda com ponteiro fino e sem reduced-motion; no touch fica reto e estático.
// ─────────────────────────────────────────────────────────────────────────────

const STEP     = 26   // px entre pontos de amostragem na vertical
const RADIUS    = 200 // raio de influência do cursor (px)
const MAX_PUSH  = 30  // deslocamento horizontal máximo (px)
const LERP      = 0.12 // suavização do mouse (menor = mais preguiçoso/arrastado)
const STROKE    = 'rgba(0,0,0,0.05)'

export default function GridLinesInteractive() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    if (!wrap || !svg) return

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const NS = 'http://www.w3.org/2000/svg'

    let W = 0
    let H = 0
    let lines: { x: number; ys: number[]; path: SVGPathElement }[] = []

    function build() {
      const rect = wrap!.getBoundingClientRect()
      W = rect.width
      H = rect.height
      const cols = W >= 768 ? 12 : 6
      svg!.setAttribute('viewBox', `0 0 ${W} ${H}`)
      while (svg!.firstChild) svg!.removeChild(svg!.firstChild)
      lines = []
      for (let i = 0; i < cols; i++) {
        const x = ((i + 1) / (cols + 1)) * W
        const ys: number[] = []
        for (let y = 0; y <= H; y += STEP) ys.push(y)
        if (ys[ys.length - 1] !== H) ys.push(H)
        const path = document.createElementNS(NS, 'path')
        path.setAttribute('stroke', STROKE)
        path.setAttribute('stroke-width', '1')
        path.setAttribute('fill', 'none')
        path.setAttribute('vector-effect', 'non-scaling-stroke')
        path.setAttribute('d', `M ${x} 0 L ${x} ${H}`)
        svg!.appendChild(path)
        lines.push({ x, ys, path })
      }
    }

    function straighten() {
      for (const ln of lines) ln.path.setAttribute('d', `M ${ln.x} 0 L ${ln.x} ${H}`)
    }

    build()

    const ro = new ResizeObserver(() => build())
    ro.observe(wrap)

    // Sem mouse (touch) ou reduced-motion: linhas retas, só responsivas.
    if (!fine || reduce) {
      return () => ro.disconnect()
    }

    let tx = -9999
    let ty = -9999 // alvo (coords locais do wrapper)
    let mx = -9999
    let my = -9999 // posição suavizada
    let raf = 0
    let running = false

    function render() {
      mx += (tx - mx) * LERP
      my += (ty - my) * LERP
      const r2 = RADIUS * RADIUS
      let maxDisp = 0

      for (const ln of lines) {
        let d = 'M '
        for (let k = 0; k < ln.ys.length; k++) {
          const y = ln.ys[k]
          const dx = ln.x - mx
          const dy = y - my
          const dist2 = dx * dx + dy * dy
          let px = ln.x
          if (dist2 < r2) {
            const f = 1 - dist2 / r2 // 0..1, máximo no centro
            const dist = Math.sqrt(dist2) || 1
            const push = (dx / dist) * MAX_PUSH * f * f // repele pra longe do cursor
            px = ln.x + push
            const ad = push < 0 ? -push : push
            if (ad > maxDisp) maxDisp = ad
          }
          d += k === 0 ? `${px} ${y}` : ` L ${px} ${y}`
        }
        ln.path.setAttribute('d', d)
      }

      // Continua enquanto houver curvatura visível ou o mouse ainda está chegando.
      const settling = Math.abs(tx - mx) > 0.5 || Math.abs(ty - my) > 0.5
      if (maxDisp > 0.3 || settling) {
        raf = requestAnimationFrame(render)
      } else {
        straighten()
        running = false
      }
    }

    function kick() {
      if (!running) {
        running = true
        raf = requestAnimationFrame(render)
      }
    }

    function onMove(e: MouseEvent) {
      const rect = wrap!.getBoundingClientRect()
      tx = e.clientX - rect.left
      ty = e.clientY - rect.top
      kick()
    }

    function onLeave() {
      tx = -9999
      ty = -9999
      kick()
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none" aria-hidden>
      <svg ref={svgRef} className="block w-full h-full" preserveAspectRatio="none" />
    </div>
  )
}
