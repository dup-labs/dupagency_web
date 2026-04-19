'use client'

import { useState, useRef } from 'react'

interface Cliente {
  nome: string
  periodo: string
  tipo: string
  slug: string
  href: string
}

const CLIENTES: Cliente[] = [
  { nome: 'Bennemann',        periodo: 'desde 2021', tipo: 'Projeto + Evolução', slug: 'bennemann', href: 'https://www.bennemann.com.br' },
  { nome: 'dux human health', periodo: 'desde 2020',  tipo: 'Projeto + Evolução', slug: 'dux',       href: 'https://www.duxhumanhealth.com' },
  { nome: 'LEGO',             periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'lego',      href: 'https://www.lego.com.br' },
  { nome: 'SharkNinja',       periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'sharkninja',href: 'https://www.sharkninja.com.br' },
  { nome: 'Spicy',            periodo: 'desde 2022', tipo: 'Evolução',           slug: 'spicy',     href: 'https://www.spicy.com.br' },
  { nome: 'SodaStream',       periodo: 'desde 2022', tipo: 'Evolução',           slug: 'sodastream',href: 'https://www.sodastream.com.br' },
  { nome: 'Authen',           periodo: 'desde 2024', tipo: 'Projeto + Evolução', slug: 'authen',    href: 'https://www.authen.com.br' },
  { nome: 'FOM',              periodo: 'desde 2026', tipo: 'Evolução',           slug: 'fom',       href: 'https://www.fom.com.br' },
  { nome: 'Vitafor',          periodo: 'desde 2024', tipo: 'Evolução',           slug: 'vitafor',   href: 'https://www.vitafor.com.br' },
  { nome: 'OneUp',            periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'oneup',     href: 'https://www.oneup.com.br' },
  { nome: 'Max Festa',        periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'maxfesta',  href: 'https://www.maxfesta.com.br' },
  { nome: 'EatClean',         periodo: 'desde 2023', tipo: 'Projeto + Evolução', slug: 'eatclean',  href: 'https://www.eatclean.com.br' },
]

const total = CLIENTES.length

function getOpacity(index: number): number {
  return 1 - (index / (total - 1)) * 0.6
}

export default function Parceiros() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [imageY, setImageY] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  function handleMouseEnter(slug: string, e: React.MouseEvent<HTMLAnchorElement>) {
    setHovered(slug)
    const listTop = listRef.current?.getBoundingClientRect().top ?? 0
    const itemTop = e.currentTarget.getBoundingClientRect().top
    setImageY(itemTop - listTop)
  }

  return (
    <section
      id="parceiros"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-8 py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto w-full">

        <div className="text-center mb-16">
          <h2
            className="font-chillax font-bold text-white uppercase"
            style={{ fontSize: 'clamp(36px, 5vw, 48px)', lineHeight: 'var(--leading-display)' }}
          >
            parceiros que
            <br />
            <span className="text-grad-01">confiam</span>
          </h2>
          <p
            className="mt-5 font-synonym text-body-md text-neutral-600 max-w-md mx-auto"
            style={{ lineHeight: 'var(--leading-body)' }}
          >
            A gente entra pra organizar, planejar e executar evoluções com
            clareza, explicando prós, contras, e riscos antes de qualquer decisão
          </p>
        </div>

        <div className="relative">
          <ul ref={listRef}>
            {CLIENTES.map((cliente, i) => (
              <a
                key={cliente.slug}
                href={cliente.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 py-4"
                style={{
                  borderBottom: '0.5px solid var(--neutral-800)',
                  opacity: getOpacity(i),
                  display: 'flex',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => handleMouseEnter(cliente.slug, e)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="font-synonym text-label-ui text-neutral-600 shrink-0 w-20 text-right text-grad-01 whitespace-nowrap">
                  {cliente.periodo}
                </span>
                <span
                  className="font-chillax font-bold text-white uppercase flex-1 transition-all duration-300"
                  style={{
                    fontSize: 'clamp(18px, 2.2vw, 26px)',
                    letterSpacing: hovered === cliente.slug ? '0.05em' : '0em',
                  }}
                >
                  {cliente.nome}
                </span>
                <span className="font-synonym text-label-ui text-neutral-600 shrink-0 hidden md:block">
                  {cliente.tipo}
                </span>

                {/* Imagem inline — mobile only */}
                <div
                  className="block md:hidden shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 80, height: 50, background: 'var(--neutral-900)' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-chillax text-neutral-800 uppercase" style={{ fontSize: '9px' }}>
                      {cliente.nome}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </ul>

          <div
            className="absolute pointer-events-none"
            style={{
              right: '18%',
              top: imageY,
              width: 200,
              height: 130,
              opacity: hovered ? 1 : 0,
              transform: 'translateY(-30%) rotate(-6deg)',
              transition: 'opacity 0.25s ease, top 0.15s ease',
              zIndex: 20,
            }}
          >
            {CLIENTES.map((cliente) => (
              <div
                key={cliente.slug}
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  opacity: hovered === cliente.slug ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  background: 'var(--neutral-900)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-chillax text-neutral-800 text-sm">{cliente.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
