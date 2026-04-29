'use client'

import { useState, useRef } from 'react'
import { useBackgroundContext } from './BackgroundLayer'

const links = [
  { label: 'MANIFESTO', href: '#manifesto',         slug: 'manifesto' },
  { label: 'PARCEIROS', href: '#parceiros',         slug: 'parceiros' },
  { label: 'PROCESSO',  href: '#como-trabalhamos',  slug: 'processo'  },
  { label: 'SERVIÇOS',  href: '#servicos',          slug: 'servicos'  },
  { label: 'CONTATO',   href: '#cta-final',         slug: 'contato'   },
]

export default function Nav() {
  const { navTheme } = useBackgroundContext()
  const [open, setOpen]       = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [imageY, setImageY]   = useState(0)
  const listRef               = useRef<HTMLDivElement>(null)

  const isDark    = navTheme === 'dark'
  const textColor = open || !isDark ? 'text-white' : 'text-black'

  function handleMouseEnter(slug: string, e: React.MouseEvent<HTMLAnchorElement>) {
    setHovered(slug)
    const listTop = listRef.current?.getBoundingClientRect().top ?? 0
    const itemTop = e.currentTarget.getBoundingClientRect().top
    setImageY(itemTop - listTop)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 transition-colors duration-300 ${textColor}`}>
        <a href="#hero" className="flex items-center font-chillax" style={{ fontSize: '24px', lineHeight: 1 }}>
          <span className="font-light tracking-tight">dup</span>
          <span className="font-medium tracking-tight">.agency</span>
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="font-synonym font-normal tracking-widest transition-opacity duration-200 opacity-70 hover:opacity-100"
          style={{ fontSize: '12px' }}
        >
          {open ? '[ fechar ]' : '[ menu ]'}
        </button>
      </nav>

      {/* Overlay full-screen */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-start transition-all duration-400 ease-out"
        style={{
          ...(open ? {
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          } : {}),
          background:    open ? 'rgba(13,13,13,0.7)' : 'rgba(13,13,13,0)',
          pointerEvents: open ? 'auto' : 'none',
          opacity:       open ? 1 : 0,
        }}
      >
        <div
          ref={listRef}
          className="relative flex flex-col px-4 md:px-12"
          style={{ paddingTop: 80 }}
        >
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              onMouseEnter={(e) => handleMouseEnter(link.slug, e)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center font-chillax font-bold text-white uppercase py-2"
              style={{
                fontSize:       'clamp(64px, 6vw, 160px)',
                borderBottom:   '1px solid rgba(255,255,255,0.10)',
                opacity:        open ? 1 : 0,
                transform:      open ? 'translateY(0)' : 'translateY(20px)',
                transition:     `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s, letter-spacing 0.3s ease`,
                textDecoration: 'none',
                letterSpacing:  hovered === link.slug ? '0.05em' : '0em',
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Imagem hover — igual ao Parceiros */}
          <div
            className="absolute pointer-events-none"
            style={{
              right:      '8%',
              top:        imageY,
              width:      240,
              height:     160,
              opacity:    hovered ? 1 : 0,
              transform:  'translateY(-30%) rotate(-4deg)',
              transition: 'opacity 0.25s ease, top 0.15s ease',
              zIndex:     20,
            }}
          >
            {links.map((link) => (
              <div
                key={link.slug}
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  opacity:    hovered === link.slug ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  background: 'rgba(255,255,255,0.06)',
                  border:     '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-chillax text-white opacity-20 uppercase" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>
                    {link.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
