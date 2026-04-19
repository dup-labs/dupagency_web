'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

// ─── tipos de conteúdo ────────────────────────────────────────────────────────
type CardContent =
  | { type: 'text';  message: string }
  | { type: 'audio'; src: string }
  | { type: 'video'; src: string }

interface CardDef {
  slug:    string
  content: CardContent
  nome:    string
  cargo:   string
  empresa: string
  // posição final CSS dentro do container sticky (left/top em % ou px)
  final: { left: string; top: string }
  // deslocamento de onde o card parte, relativo à posição final
  from:  { x: number; y: number }
}

// ─── configuração dos cards ───────────────────────────────────────────────────
// Ajuste `final` (onde o card fica) e `from` (de onde ele vem) à vontade.
// `from.x` negativo = vem da esquerda; positivo = vem da direita.
// `from.y` positivo = vem de baixo (recomendado).

const CARDS: CardDef[] = [
  {
    slug:    'lorem',
    content: {
      type:    'text',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis, mauris ut congue iaculis, dolor arcu vestibulum dui, vitae ullamcorper neque felis vitae libero. Donec interdum lorem id nulla imperdiet, sed luctus nisi vehicula. Aliquam pellentesque, felis at consectetur pretium, ipsum eros iaculis ante, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis, mauris ut congue iaculis, dolor arcu vestibulum dui, vitae ullamcorper neque felis vitae libero. Donec interdum lorem id nulla imperdiet, sed luctus nisi vehicula. Aliquam pellentesque, felis at consectetur pretium, ipsum eros iaculis ante,',
    },
    nome:    'João Mendes',
    cargo:   'Head de E-commerce',
    empresa: 'Bennemann',
    final: { left: '4%',  top: '10%' },
    from:  { x: -320,     y: 500      },
  },
  {
    slug:    'ipsum',
    content: {
      type:    'text',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis, mauris ut congue iaculis, dolor arcu vestibulum dui, vitae ullamcorper neque felis vitae libero. Donec interdum lorem id nulla imperdiet, sed luctus nisi vehicula. Aliquam pellentesque, felis at consectetur pretium, ipsum eros iaculis ante,',
    },
    nome:    'Lorem Ipsum',
    cargo:   'Diretora de Marketing',
    empresa: 'Dux',
    final: { left: '68%', top: '8%'  },
    from:  { x: 320,      y: 480      },
  },
  {
    slug:    'dolor',
    content: {
      type:    'text',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis, mauris ut congue iaculis, dolor arcu vestibulum dui, vitae ullamcorper neque felis vitae libero. Donec interdum lorem id nulla imperdiet, sed luctus nisi vehicula. Aliquam pellentesque.',
    },
    nome:    'Lorem Ipsum',
    cargo:   'CEO',
    empresa: 'OneUp',
    final: { left: '4%',  top: '56%' },
    from:  { x: -320,     y: 440      },
  },
  {
    slug:    'sit',
    content: {
      type:    'text',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis, mauris ut congue iaculis, dolor arcu vestibulum dui, vitae ullamcorper neque felis vitae libero. Donec interdum lorem id nulla imperdiet, sed luctus nisi vehicula. Aliquam pellentesque, felis at consectetur pretium, ipsum eros iaculis ante',
    },
    nome:    'Lorem Ipsum',
    cargo:   'E-commerce Manager',
    empresa: 'SharkNinja',
    final: { left: '68%', top: '54%' },
    from:  { x: 320,      y: 420      },
  },
]

// progress no timeline (0-1) em que cada card começa a se mover
const CARD_STARTS = [0.05, 0.15, 0.25, 0.35]
const CARD_DUR    = 0.45  // duração de cada card (fração do timeline)

// ─── sub-componentes de conteúdo ──────────────────────────────────────────────
function CardMessage({ content }: { content: CardContent }) {
  if (content.type === 'text') {
    return (
      <p
        className="font-synonym text-black"
        style={{ fontSize: '13px', lineHeight: 'var(--leading-body)', opacity: 0.72 }}
      >
        "{content.message}"
      </p>
    )
  }
  if (content.type === 'audio') {
    return (
      <audio controls src={content.src} className="w-full" style={{ height: 36 }}>
        Seu browser não suporta áudio.
      </audio>
    )
  }
  if (content.type === 'video') {
    return (
      <video
        src={content.src}
        controls
        className="w-full rounded-lg"
        style={{ maxHeight: 140 }}
      />
    )
  }
}

// ─── componente principal ─────────────────────────────────────────────────────
export default function Depoimentos() {
  const outerRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return

    const ctx = gsap.context(() => {
      // posição inicial de cada card
      CARDS.forEach((card, i) => {
        gsap.set(cardRefs.current[i], { x: card.from.x, y: card.from.y, opacity: 0 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:            outerRef.current,
          start:              'top top',
          end:                'bottom bottom',
          scrub:              1.5,
          invalidateOnRefresh: true,
        },
      })

      CARDS.forEach((_, i) => {
        const s = CARD_STARTS[i]
        tl.to(cardRefs.current[i], {
          x:        0,
          y:        0,
          opacity:  1,
          duration: CARD_DUR,
          ease:     'power2.out',
        }, s)
      })
    }, innerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="depoimentos"
      ref={outerRef}
      className="relative z-10"
      style={{ height: '300vh' }}
    >
      <div
        ref={innerRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Título centralizado — sempre visível, na frente dos cards */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <h2
            className="font-chillax font-bold text-black uppercase"
            style={{ fontSize: 'clamp(28px, 3.6vw, 52px)', lineHeight: 'var(--leading-display)' }}
          >
            o que diz quem
            <br />
            <span className="text-grad-01">confia em nós</span>
          </h2>
          <p
            className="mt-4 font-synonym text-neutral-600 max-w-xs"
            style={{ fontSize: '13px', lineHeight: 'var(--leading-body)' }}
          >
            Perguntamos a nossos parceiros o que os faz continuar
            confiando em nosso trabalho, aqui estão algumas respostas
          </p>
        </div>

        {/* Cards — desktop */}
        <div className="hidden md:block absolute inset-0" style={{ zIndex: 5 }}>
          {CARDS.map((card, i) => (
            <div
              key={card.slug}
              ref={(el) => { cardRefs.current[i] = el }}
              className="absolute flex flex-col gap-3 p-5 rounded-2xl"
              style={{
                top:             card.final.top,
                left:            card.final.left,
                width:           'min(280px, 26vw)',
                background:      'rgba(255,255,255,0.88)',
                backdropFilter:  'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow:       '0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
                border:          '1px solid rgba(0,0,0,0.07)',
                willChange:      'transform, opacity',
              }}
            >
              <CardMessage content={card.content} />
              <div className="flex flex-col gap-0">
                <span className="font-chillax font-bold text-black uppercase" style={{ fontSize: '12px' }}>
                  {card.nome}
                </span>
                <span className="font-synonym text-neutral-600" style={{ fontSize: '11px' }}>
                  {card.cargo} — {card.empresa}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cards — mobile: coluna simples, sem animação de scroll */}
        <div className="flex md:hidden flex-col gap-3 px-5 pt-48 pb-10 overflow-y-auto h-full">
          {CARDS.map((card) => (
            <div
              key={card.slug}
              className="flex flex-col gap-3 p-5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.9)',
                boxShadow:  '0 4px 20px rgba(0,0,0,0.06)',
                border:     '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <CardMessage content={card.content} />
              <div className="flex flex-col gap-0">
                <span className="font-chillax font-bold text-black uppercase" style={{ fontSize: '12px' }}>
                  {card.nome}
                </span>
                <span className="font-synonym text-neutral-600" style={{ fontSize: '11px' }}>
                  {card.cargo} — {card.empresa}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
