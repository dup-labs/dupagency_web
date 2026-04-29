'use client'

import { useState, useRef, useEffect } from 'react'

interface Cliente {
  nome: string
  periodo: string
  tipo: string
  slug: string
  href: string
  image: string
  bg?: string
}

// `image` aponta pra /public/images/clients/{slug}.png — solte os arquivos lá.
// `bg` é opcional: cor de fundo do card de hover (fallback: var(--neutral-900)).
const CLIENTES: Cliente[] = [
  { nome: 'Bennemann',        periodo: 'desde 2021', tipo: 'Projeto + Evolução', slug: 'bennemann', href: 'https://www.bennemann.com.br',      image: '/images/partners/bennemann.svg', bg: '#204239' },
  { nome: 'dux human health', periodo: 'desde 2020', tipo: 'Projeto + Evolução', slug: 'dux',       href: 'https://www.duxhumanhealth.com',    image: '/images/partners/duxhumanhealth.svg',       bg: '#151521' },
  { nome: 'LEGO',             periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'lego',      href: 'https://www.lego.com.br',           image: '/images/partners/lego.svg',      bg: '#ffcf00' },
  { nome: 'SharkNinja',       periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'sharkninja',href: 'https://www.sharkninjabrasil.com.br/',     image: '/images/partners/sharkninja.svg',bg: '#ffffff' },
  { nome: 'Spicy',            periodo: 'desde 2022', tipo: 'Evolução',           slug: 'spicy',     href: 'https://www.spicy.com.br',          image: '/images/partners/spicy.svg',     bg: '#76232f' },
  { nome: 'SodaStream',       periodo: 'desde 2022', tipo: 'Evolução',           slug: 'sodastream',href: 'https://www.sodastream.com.br',     image: '/images/partners/sodastream.svg',bg: '#75a7ad' },
  { nome: 'Mga',       periodo: 'desde 2022', tipo: 'Evolução',           slug: 'mga',href: 'https://www.mgastorebrasil.com.br',     image: '/images/partners/mga.webp',bg: '#75a7ad' },
  { nome: 'Authen',           periodo: 'desde 2024', tipo: 'Projeto + Evolução', slug: 'authen',    href: 'https://www.authen.com.br',         image: '/images/partners/authen.png',    bg: '#ffffff' },
  { nome: 'FOM',              periodo: 'desde 2026', tipo: 'Evolução',           slug: 'fom',       href: 'https://www.fom.com.br',            image: '/images/partners/fom.svg',       bg: '#fba382' },
  { nome: 'Vitafor',          periodo: 'desde 2025', tipo: 'Evolução',           slug: 'vitafor',   href: 'https://www.vitafor.com.br',        image: '/images/partners/vitafor.svg',   bg: '#370101' },
  { nome: 'OneUp',            periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'oneup',     href: 'https://www.oneup.com.br',          image: '/images/partners/oneup.webp',     bg: '#000000' },
  { nome: 'Max Festa',        periodo: 'desde 2022', tipo: 'Projeto + Evolução', slug: 'maxfesta',  href: 'https://www.maxfesta.com.br',       image: '/images/partners/maxfesta.png',  bg: '#F23160' },
  { nome: 'EatClean',         periodo: 'desde 2023', tipo: 'Projeto + Evolução', slug: 'eatclean',  href: 'https://www.eatclean.com.br',       image: '/images/partners/eatclean.svg',  bg: '#00291C' },
]

const total = CLIENTES.length

function getOpacity(index: number): number {
  return 1 - (index / (total - 1)) * 0.6
}

const IMG_W = 200
const IMG_H = 130

export default function Parceiros() {
  const [hovered, setHovered] = useState<string | null>(null)
  const listRef   = useRef<HTMLUListElement>(null)
  const imageRef  = useRef<HTMLDivElement>(null)
  const target    = useRef({ x: 0, y: 0 })
  const current   = useRef({ x: 0, y: 0 })
  const initialized = useRef(false)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18
      current.current.y += (target.current.y - current.current.y) * 0.18
      if (imageRef.current) {
        imageRef.current.style.transform =
          `translate3d(${current.current.x}px, ${current.current.y}px, 0) rotate(-6deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLUListElement>) {
    const rect = listRef.current?.getBoundingClientRect()
    if (!rect) return
    target.current.x = e.clientX - rect.left + 20
    target.current.y = e.clientY - rect.top  + 20
    if (!initialized.current) {
      current.current.x = target.current.x
      current.current.y = target.current.y
      initialized.current = true
    }
  }

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('cursor:shrink', { detail: !!hovered }))
    return () => {
      window.dispatchEvent(new CustomEvent('cursor:shrink', { detail: false }))
    }
  }, [hovered])

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
          <ul
            ref={listRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
          >
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
                onMouseEnter={() => setHovered(cliente.slug)}
              >
                <span className="font-synonym text-label-ui text-neutral-600 shrink-0 w-24 text-right text-grad-01 whitespace-nowrap">
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
                  className="block md:hidden shrink-0 rounded-lg overflow-hidden relative flex justify-center items-center"
                  style={{ width: 80, height: 50, background: cliente.bg ?? 'var(--neutral-300)' }}
                >
                  <img
                    src={cliente.image}
                    alt={cliente.nome}
                    className="w[90%] h-[90%] object-contain object-center"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              </a>
            ))}
          </ul>

          <div
            ref={imageRef}
            className="hidden md:block absolute pointer-events-none top-0 left-0"
            style={{
              width: IMG_W,
              height: IMG_H,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              willChange: 'transform',
              zIndex: 20,
            }}
          >
            {CLIENTES.map((cliente) => (
              <div
                key={cliente.slug}
                className="absolute inset-0 rounded-xl overflow-hidden flex justify-center items-center"
                style={{
                  opacity: hovered === cliente.slug ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  background: cliente.bg ?? 'var(--neutral-900)',
                }}
              >
                <img
                  src={cliente.image}
                  alt={cliente.nome}
                  className="w-1/2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
