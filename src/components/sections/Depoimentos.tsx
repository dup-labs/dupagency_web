'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DEPOIMENTOS, type CardContent } from '@/content/depoimentos'

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
        {DEPOIMENTOS.map((card, i) => (
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
        {DEPOIMENTOS.map((card, i) => (
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
