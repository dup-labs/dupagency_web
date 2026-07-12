'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Reveal — fade + subida quando entra na viewport
// ─────────────────────────────────────────────────────────────────────────────
// IntersectionObserver + CSS, não GSAP: é one-shot e não depende de progresso de
// scroll, então ScrollTrigger seria peso morto (e mais um trigger pra refresh).
// Os estados vivem em .case-reveal (globals.css), que já respeita
// prefers-reduced-motion.
//
//   variant="card" → entrada com escala (usada nos cards da timeline)
// ─────────────────────────────────────────────────────────────────────────────

interface RevealProps {
  children: ReactNode
  /** Atraso da transição, em ms — escalona itens irmãos. */
  delay?: number
  variant?: 'default' | 'card'
  className?: string
  /** Elemento renderizado. Útil pra não quebrar semântica (ex: 'li'). */
  as?: 'div' | 'li'
}

export default function Reveal({
  children,
  delay = 0,
  variant = 'default',
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        io.unobserve(el) // one-shot: não re-esconde ao voltar o scroll
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  const cls = ['case-reveal', variant === 'card' && 'case-reveal--card', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={cls}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
