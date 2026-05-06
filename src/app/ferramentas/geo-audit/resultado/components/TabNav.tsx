'use client'

import { useEffect, useState } from 'react'

const TABS = [
  { href: '#seo',   id: 'seo',   label: 'SEO Técnico' },
  { href: '#geo',   id: 'geo',   label: 'GEO Readiness' },
  { href: '#plano', id: 'plano', label: 'Plano de Ação' },
]

export default function TabNav() {
  const [active, setActive] = useState<string>('seo')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      {
        rootMargin: '-120px 0px -50% 0px',
        threshold: 0,
      }
    )

    TABS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-16 z-40 tab-strip"
      style={{
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map(({ href, id, label }) => {
          const isActive = active === id
          return (
            <a
              key={href}
              href={href}
              className="font-synonym"
              style={{
                display: 'inline-block',
                padding: '14px 16px',
                fontSize: 'var(--text-body-md)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--black)' : 'var(--neutral-600)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderBottom: isActive
                  ? '2px solid var(--black)'
                  : '2px solid transparent',
                transition: 'color 200ms ease, border-color 200ms ease, font-weight 200ms ease',
              }}
            >
              {label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
