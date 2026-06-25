'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'

// Mapeia o `tipo` do dado (string PT) pra chave de tradução em home.parceiros.tipo.
const TIPO_KEY: Record<string, string> = {
  'Projeto + Evolução': 'projetoEvolucao',
  'Evolução': 'evolucao',
}

interface Cliente {
  nome: string
  periodo: string
  tipo: string
  slug: string
  href: string
  image: string
  alt: string
  bg?: string
}

// `image` aponta pra /public/images/clients/{slug}.png — solte os arquivos lá.
// `bg` é opcional: cor de fundo do card de hover (fallback: var(--neutral-900)).
const CLIENTES: Cliente[] = [
  {
    nome: 'Bennemann',
    periodo: '2021 - 2026',
    tipo: 'Projeto + Evolução',
    slug: 'bennemann',
    href: 'https://www.bennemann.com.br',
    image: '/images/partners/bennemann.svg',
    bg: '#204239',
    alt: 'Bennemann — marca gaúcha fundada em 2002, especialista em mochilas, pastas, bolsas e acessórios em couro bovino legítimo com design funcional e minimalista. Produção 100% brasileira, garantia vitalícia e presença em mais de 20 países. Cliente dup.agency desde 2021.',
  },
  {
    nome: 'dux human health',
    periodo: 'desde 2020',
    tipo: 'Projeto + Evolução',
    slug: 'dux',
    href: 'https://www.duxhumanhealth.com',
    image: '/images/partners/duxhumanhealth.svg',
    bg: '#151521',
    alt: 'Dux Human Health — marca brasileira de suplementos nutricionais fundada em 2015, com mais de 300 produtos que conectam ciência e natureza. Referência em whey protein, creatina, vitaminas e bem-estar. Parte do grupo Dux Company. Cliente dup.agency desde 2020.',
  },
  {
    nome: 'LEGO',
    periodo: 'desde 2022',
    tipo: 'Projeto + Evolução',
    slug: 'lego',
    href: 'https://www.lego.com.br',
    image: '/images/partners/lego.svg',
    bg: '#ffcf00',
    alt: 'LEGO — marca dinamarquesa fundada em 1932, líder global em brinquedos de construção presente em mais de 130 países. Operação brasileira gerida pela Mcassab. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'SharkNinja',
    periodo: 'desde 2022',
    tipo: 'Projeto + Evolução',
    slug: 'sharkninja',
    href: 'https://www.sharkninjabrasil.com.br/',
    image: '/images/partners/sharkninja.svg',
    bg: '#ffffff',
    alt: 'SharkNinja — empresa global presente em mais de 32 países. Duas divisões no Brasil: Ninja (eletrodomésticos de cozinha de alta performance) e Shark Beauty (secadores e modeladores multifuncionais, com Marina Ruy Barbosa como embaixadora). Operação brasileira gerida pela Mcassab. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'Spicy',
    periodo: 'desde 2022',
    tipo: 'Evolução',
    slug: 'spicy',
    href: 'https://www.spicy.com.br',
    image: '/images/partners/spicy.svg',
    bg: '#76232f',
    alt: 'Spicy — marca do grupo Mcassab especializada em utensílios de cozinha, mesa posta, decoração e acessórios para bar. Com lojas físicas em shoppings pelo Brasil e e-commerce próprio. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'SodaStream',
    periodo: 'desde 2022',
    tipo: 'Evolução',
    slug: 'sodastream',
    href: 'https://www.sodastream.com.br',
    image: '/images/partners/sodastream.svg',
    bg: '#75a7ad',
    alt: 'SodaStream — marca global líder em máquinas de carbonatação doméstica. Operação brasileira gerida pela Mcassab. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'Mga',
    periodo: 'desde 2022',
    tipo: 'Evolução',
    slug: 'mga',
    href: 'https://www.mgastorebrasil.com.br',
    image: '/images/partners/mga.webp',
    bg: '#75a7ad',
    alt: 'MGA Store — loja oficial das marcas MGA Entertainment no Brasil, distribuídas pela Mcassab. Portfólio com LOL Surprise, Rainbow High, Bratz e Miniverse. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'Authen',
    periodo: 'desde 2024',
    tipo: 'Projeto + Evolução',
    slug: 'authen',
    href: 'https://www.authen.com.br',
    image: '/images/partners/authen.svg',
    bg: '#ffffff',
    alt: 'Authen — marca brasileira de roupas esportivas tecnológicas com foco no público feminino. Especializada em corrida e alta performance. Eleita referência entre corredoras brasileiras. Cliente dup.agency desde 2024.',
  },
  {
    nome: 'Max Festa',
    periodo: 'desde 2022',
    tipo: 'Projeto + Evolução',
    slug: 'maxfesta',
    href: 'https://www.maxfesta.com.br',
    image: '/images/partners/maxfesta.svg',
    bg: '#F23160',
    alt: 'Max Festa — loja especializada em artigos de festa e decoração, do básico ao personalizado. Com loja física em São Bernardo do Campo/SP e envios para todo o Brasil. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'FOM',
    periodo: 'desde 2026',
    tipo: 'Evolução',
    slug: 'fom',
    href: 'https://www.fom.com.br',
    image: '/images/partners/fom.svg',
    bg: '#fba382',
    alt: 'FOM — marca 100% brasileira fundada em 2004, especializada em almofadas e acessórios de conforto com design ergonômico e enchimento de micropérolas hipoalergênicas. Com e-commerce, franquias e pontos próprios pelo Brasil. Cliente dup.agency desde 2026.',
  },
  {
    nome: 'Vitafor',
    periodo: 'desde 2025',
    tipo: 'Evolução',
    slug: 'vitafor',
    href: 'https://www.vitafor.com.br',
    image: '/images/partners/vitafor.svg',
    bg: '#370101',
    alt: 'Vitafor — marca brasileira líder em suplementos nutricionais prescritos por nutricionistas e médicos no Brasil. Com laboratório de análises próprio. Cliente dup.agency desde 2025.',
  },
  {
    nome: 'OneUp',
    periodo: 'desde 2022',
    tipo: 'Projeto + Evolução',
    slug: 'oneup',
    href: 'https://www.oneup.com.br',
    image: '/images/partners/oneup.webp',
    bg: '#000000',
    alt: 'OneUp — grife de moda feminina fundada em 1976. Uma das mais tradicionais do segmento de luxo no Brasil, com mais de 40 anos valorizando a sofisticação e originalidade da mulher contemporânea. Cliente dup.agency desde 2022.',
  },
  {
    nome: 'EatClean',
    periodo: 'desde 2023',
    tipo: 'Projeto + Evolução',
    slug: 'eatclean',
    href: 'https://www.eatclean.com.br',
    image: '/images/partners/eatclean.svg',
    bg: '#00291C',
    alt: 'EatClean — marca vegana de suplementos alimentares e naturais, parte do grupo Dux Company. Para quem busca nutrição de qualidade com ingredientes limpos e sem origem animal. Cliente dup.agency desde 2023.',
  },
]

const total = CLIENTES.length

function getOpacity(index: number): number {
  return 1 - (index / (total - 1)) * 0.6
}

const IMG_W = 200
const IMG_H = 130

export default function Parceiros() {
  const t = useTranslations('home.parceiros')
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
            {t.rich('headline', richTags)}
          </h2>
          <p
            className="mt-5 font-synonym text-body-md text-neutral-600 max-w-md mx-auto"
            style={{ lineHeight: 'var(--leading-body)' }}
          >
            {t('subheadline')}
          </p>
        </div>

        <div className="relative">
          <ul
            ref={listRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
          >
            {CLIENTES.map((cliente, i) => (
              <li key={cliente.slug} style={{ listStyle: 'none' }}>
                <a
                  href={cliente.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`parceiro-${cliente.slug}`}
                  data-parceiro={cliente.nome}
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
                    {/desde/i.test(cliente.periodo)
                      ? cliente.periodo.replace(/desde/i, t('desde'))
                      : cliente.periodo}
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
                    {t(`tipo.${TIPO_KEY[cliente.tipo] ?? 'evolucao'}`)}
                  </span>

                  {/* Imagem inline — mobile only */}
                  <div
                    className="flex md:hidden shrink-0 rounded-lg overflow-hidden relative justify-center items-center"
                    style={{ width: 80, height: 50, background: cliente.bg ?? 'var(--neutral-300)' }}
                  >
                    <Image
                      src={cliente.image}
                      alt={cliente.alt}
                      width={72}
                      height={45}
                      loading="lazy"
                      className="w-[90%] h-[90%] object-contain object-center"
                    />
                  </div>
                </a>
              </li>
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
                {/* Hover-image desktop. Aspectos variam por logo, então
                    deixamos width/height auto e limitamos via maxW/maxH —
                    evita o warning de aspect-ratio errada do Lighthouse. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cliente.image}
                  alt={cliente.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ maxWidth: '50%', maxHeight: '70%', width: 'auto', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
