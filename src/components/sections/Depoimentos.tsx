'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import { gsap, ScrollTrigger } from '@/lib/gsap'

type CardContent =
  | { type: 'text'; message: string }
  | { type: 'audio'; src: string }
  | { type: 'video'; src: string }

interface CardDef {
  slug: string
  content: CardContent
  nome: string
  cargo: string
  empresa: string
  tempo: string
  // Posições absolutas do card desktop (pin-scene). Cobre top/bottom +
  // left/right do parent. Inspirado no projeto dupagency_new/Testimonials.
  posClasses: string
}

const CARDS: CardDef[] = [
  {
    slug: 'card-0',
    content: {
      type: 'text',
      message:
        'Ótimos parceiros. Desenvolvimento, acompanhamento, evolução e suporte da loja online. Atendimento rápido e qualificado, sempre trazendo a visão técnica e de performance com dicas e orientações que trazem segurança para a tomada de decisões. Pontos fundamentais na parceria e para o bom desempenho do e-commerce.',
    },
    nome: 'Eduardo Bennemann',
    cargo: 'Diretor E-commerce',
    empresa: 'Bennemann',
    tempo: '5 anos de parceria',
    posClasses: 'top-[50px] left-[10px]',
  },
  {
    slug: 'card-1',
    content: {
      type: 'text',
      message:
        'O trabalho é de excelência. São extremamente ágeis, entendem rapidamente a criticidade de cada demanda e, acima de tudo, pensam sempre na experiência do cliente final. \n É uma parceria de alto nível, baseada em confiança e entrega consistente.',
    },
    nome: 'Rodrigo Schenkman',
    cargo: 'CEO',
    empresa: 'One Up',
    tempo: '4 anos de parceria',
    posClasses: 'top-[150px] right-[40px]',
  },
  {
    slug: 'card-2',
    content: {
      type: 'text',
      message:
        'Minha experiência com a Dup Agency é de parceria total. Cada entrega, projeto e melhorias foram sempre entregues com agilidade e excelência. Quando entrei na FOM, fiz questão de trazê-los  para me apoiar no novo projeto, para trazer inovação e crescimento da performance. \n Muito obrigada por toda a dedicação de vocês!',
    },
    nome: 'Vivian',
    cargo: 'Especialista de e-commerce',
    empresa: 'Positive Market / FOM',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[170px] left-[80px]',
  },
  {
    slug: 'card-3',
    content: {
      type: 'text',
      message:
        'Quase todo mundo fala de parceria, mas com vocês isso realmente acontece no dia a dia! Eu amo trabalhar com o time.. São ágeis, prestativos e sempre disponíveis quando a gente precisa. Dá uma tranquilidade enorme saber que posso confiar 100% no que vocês entregam. Isso faz muita diferença na rotina e no crescimento do nosso e-commerce.',
    },
    nome: 'Helena Guimarães',
    cargo: 'Coordenadora de E-commerce',
    empresa: 'Authen',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[670px] left-[350px]',
  },
  {
    slug: 'card-4',
    content: {
      type: 'text',
      message:
        'Ter uma equipe parceira faz toda a diferença no e-commerce, e foi exatamente isso que encontramos com a Dup. Sempre muito ágeis e comprometidos em buscar soluções que realmente impactam a performance da loja. O suporte próximo, a visão estratégica e a qualidade das entregas nos trazem muita confiança para evoluir continuamente nosso projeto online.',
    },
    nome: 'Camila Bertozzi',
    cargo: 'Proprietária',
    empresa: 'MaxFesta',
    tempo: '5 anos de parceria',
    posClasses: 'bottom-[720px] left-[1050px]',
  },
  {
    slug: 'card-5',
    content: {
      type: 'text',
      message:
        'Sempre muito disponíveis e parceiros no dia a dia, trazendo recomendações técnicas que sustentam as melhores decisões para os projetos desenvolvidos. Além disso, conduz todo o processo com muita transparência e comprometimentos, sendo um fornecedor que buscamos manter sempre próximo do nosso pool de parceiros.',
    },
    nome: 'Daniela Aiko',
    cargo: 'Diretora de Atendimento',
    empresa: 'Agência Íonz',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[270px] left-[750px]',
  },
  {
    slug: 'card-6',
    content: {
      type: 'text',
      message:
        'A Dup Agency é uma parceira indispensável para a evolução de todos os sites que operamos. Sempre atenta às novas tendências do mercado, se atualizando para trazer sugestões de melhorias, dispostos para discutir ideias que também sejam um desafio. \n A parceria de mais ou menos 8 anos com os responsáveis pela agência vem bem antes da sua criação. É um alívio encontrar profissionais assim, que entregam excelência no trabalho e honestidade nas tratativas, deixando nossa preocupação nos resultados, como deve ser. Por esse motivo a indico de olhos fechados!',
    },
    nome: 'Renan Lima',
    cargo: 'Coordenador de Ecommerce',
    empresa: 'Lego.com.br',
    tempo: '6 anos de parceria',
    posClasses: 'bottom-[209px] left-[1190px]',
  },
  {
    slug: 'card-7',
    content: {
      type: 'text',
      message:
        'A relação de confiança construída ao longo do tempo é um dos grandes valores da parceria e flui de forma muito positiva e natural. Desde as demandas mais simples até grandes projetos, a troca constante de ideias nos ajuda a tomar decisões e nos deixa seguros sobre a entrega e a execução..',
    },
    nome: 'Gian Pedrosa',
    cargo: 'Analista de Projetos E-commerce',
    empresa: 'Spicy',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[70px] left-[320px]',
  }
]

function CardMessage({ content, audioFallback }: { content: CardContent; audioFallback: string }) {
  if (content.type === 'text') {
    return (
      <p
        className="font-synonym text-black"
        style={{
          fontSize: '13px',
          lineHeight: 'var(--leading-body)',
          opacity: 0.78,
        }}
      >
        &ldquo;{content.message}&rdquo;
      </p>
    )
  }
  if (content.type === 'audio') {
    return (
      <audio controls src={content.src} className="w-full h-12 mb-2">
        {audioFallback}
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
  return null
}

export default function Depoimentos() {
  const t = useTranslations('home.depoimentos')
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      if (cards.length === 0) return

      const tl = gsap.timeline()
      tl.fromTo(
        cards,
        { y: 1400 },
        {
          y: 0,
          ease: 'power3.out',
          stagger: { each: 0.12, from: 'random' },
        },
      )

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2400',
        scrub: 1,
        animation: tl,
        pin: true,
        invalidateOnRefresh: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Mobile: fade-in via IntersectionObserver (GSAP ScrollTrigger inconsistente
  // no mobile — ver memory project_mobile_gsap). Cada card sobe de baixo com
  // pequeno stagger conforme entra na viewport.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 767px)').matches) return

    const cards = mobileCardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="relative z-10 md:min-h-screen overflow-hidden depoimentos-grid-bg"
    >
      {/* Grid lines vêm via .depoimentos-grid-bg (background-image gradient
          na própria section). Esse approach já fornece a variação de cor
          que o backdrop-filter dos cards precisa pra produzir o blur
          visível — sem precisar de divs adicionais que duplicariam linhas
          (gradient põe linhas em `tile - 1px`, divs poriam em `tile`,
          ficando 1px de distância visualmente coladas). */}

      {/* Headline — desktop: absolute centralizado durante o pin.
          Mobile: estático no topo, antes dos cards. */}
      <div
        className="md:absolute md:inset-0 flex flex-col items-center justify-center text-center px-6 md:pointer-events-none pt-24 pb-8 md:pt-0 md:pb-0"
        style={{ zIndex: 10 }}
      >
        <h2
          className="font-chillax font-bold text-black uppercase"
          style={{
            fontSize: 'clamp(28px, 3.6vw, 52px)',
            lineHeight: 'var(--leading-display)',
          }}
        >
          {t.rich('headline', richTags)}
        </h2>
        <p
          className="mt-4 font-synonym text-neutral-600 max-w-xs"
          style={{ fontSize: '13px', lineHeight: 'var(--leading-body)' }}
        >
          {t('subheadline')}
        </p>
      </div>

      {/* Cards desktop — animados via ScrollTrigger pinned. zIndex 20 pra
          ficar acima da headline (10) e do GridLines (0). */}
      <div
        className="hidden md:block absolute inset-0"
        style={{ zIndex: 20 }}
      >
        {CARDS.map((card, i) => (
          <div
            key={card.slug}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className={`absolute w-56 lg:w-80 ${card.posClasses}`}
          >
            <article
              className="card-testimonial"
              style={{
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
              }}
            >
              <CardMessage content={card.content} audioFallback={t('audioFallback')} />
              <div className="w-full flex flex-col gap-0">
                <span
                  className="font-chillax font-bold text-black uppercase"
                  style={{ fontSize: '12px' }}
                >
                  {card.nome}
                </span>
                <span
                  className="font-synonym text-neutral-600"
                  style={{ fontSize: '11px' }}
                >
                  {card.cargo} — {card.empresa}
                </span>
                <small
                  className="font-synonym text-neutral-400"
                  style={{ fontSize: '10px' }}
                >{card.tempo.replace(/\D+/g, '')} {t('parceiroLabel')}</small>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Cards mobile — coluna simples com fade-in (IntersectionObserver). */}
      <div
        className="flex md:hidden flex-col gap-4 px-5 pb-12 relative"
        style={{ zIndex: 20 }}
      >
        {CARDS.map((card, i) => (
          <div
            key={card.slug}
            ref={(el) => {
              mobileCardRefs.current[i] = el
            }}
            className="card-testimonial-mobile-reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <article className="card-testimonial">
              <CardMessage content={card.content} audioFallback={t('audioFallback')} />
              <div className="w-full flex flex-col gap-0">
                <span
                  className="font-chillax font-bold text-black uppercase"
                  style={{ fontSize: '12px' }}
                >
                  {card.nome}
                </span>
                <span
                  className="font-synonym text-neutral-600"
                  style={{ fontSize: '11px' }}
                >
                  {card.cargo} — {card.empresa}
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
