'use client'

import { useEffect, useState } from 'react'

export function DebugOverlay() {
  const [scrollY, setScrollY]     = useState(-1)
  const [gsapOk, setGsapOk]       = useState<boolean | null>(null)
  const [stOk, setStOk]           = useState<boolean | null>(null)
  const [events, setEvents]       = useState(0)
  const [jsOk, setJsOk]           = useState(false)

  useEffect(() => {
    setJsOk(true)

    // Testa se GSAP e ScrollTrigger carregaram
    import('@/lib/gsap').then(({ gsap, ScrollTrigger }) => {
      setGsapOk(!!gsap)
      setStOk(!!ScrollTrigger)
    }).catch(() => {
      setGsapOk(false)
      setStOk(false)
    })

    const handler = () => {
      setScrollY(Math.round(window.scrollY))
      setEvents(n => n + 1)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const row = (label: string, val: string, ok?: boolean) => (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ opacity: 0.6, minWidth: 70 }}>{label}</span>
      <span style={{ color: ok === false ? '#f87171' : ok === true ? '#4ade80' : 'white' }}>{val}</span>
    </div>
  )

  return (
    <div style={{
      position: 'fixed', bottom: 12, left: 12, zIndex: 99999,
      background: 'rgba(0,0,0,0.85)', color: 'white',
      padding: '10px 14px', borderRadius: 10, fontSize: 11,
      fontFamily: 'monospace', lineHeight: 1.7,
      backdropFilter: 'none', pointerEvents: 'none',
    }}>
      {row('JS', jsOk ? '✓ ok' : '✗ off', jsOk)}
      {row('GSAP', gsapOk === null ? '...' : gsapOk ? '✓ ok' : '✗ fail', gsapOk ?? undefined)}
      {row('ST', stOk === null ? '...' : stOk ? '✓ ok' : '✗ fail', stOk ?? undefined)}
      {row('scrollY', scrollY === -1 ? 'aguarda...' : `${scrollY}px`)}
      {row('events', String(events))}
    </div>
  )
}
