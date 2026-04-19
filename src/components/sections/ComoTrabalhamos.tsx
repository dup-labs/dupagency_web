'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const CARDS = [
  {
    num: '01',
    titulo: 'Antes de tudo a gente entende',
    texto:
      'A gente mergulha fundo no que tá acontecendo — entende a loja, a operação, os gargalos e as oportunidades. Só com esse contexto a gente consegue ter certeza do melhor caminho.',
  },
  {
    num: '02',
    titulo: 'O caminho fica claro antes de começar',
    texto:
      'Com tudo mapeado, fica claro onde estão os maiores ganhos. A gente organiza as prioridades junto com você, pra que cada passo faça sentido antes de qualquer coisa começar.',
  },
  {
    num: '03',
    titulo: 'Ritmo constante, entrega no combinado',
    texto:
      'Aqui tudo anda. Ritmo constante, entregas no combinado, e a conversa sempre aberta.',
  },
  {
    num: '04',
    titulo: 'Nada sai sem um ok claro',
    texto:
      'Revisão contínua do que foi feito, garantindo qualidade e alinhamento em cada entrega.',
  },
]

const INITIAL = [
  { z: -1800, x:  420, y:  220 },
  { z: -1900, x: -280, y:  160 },
  { z: -2000, x:  160, y:  -60 },
  { z: -2100, x: -240, y: -170 },
]

const FINAL = [
  { z:  600, x:  380, y: -200 },
  { z:  660, x: -280, y: -250 },
  { z:  720, x:  320, y:  180 },
  { z:  760, x: -450, y:  120 },
]

const FINAL_MOBILE = [
  { z:  500, x:   80, y: -320 },
  { z:  540, x:  -80, y: -280 },
  { z:  580, x:   80, y:  280 },
  { z:  620, x:  -80, y:  240 },
]

const STARTS = [0.15, 0.25, 0.35, 0.45]

const N_CIRCLES = 7

export default function ComoTrabalhamos() {
  const outerRef  = useRef<HTMLElement>(null)   // trigger do ScrollTrigger
  const innerRef  = useRef<HTMLDivElement>(null) // sticky div, scope do GSAP context
  const circleEls = useRef<(HTMLDivElement | null)[]>([])
  const titleRef  = useRef<HTMLDivElement>(null)
  const cardEls   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return

    const finals = window.innerWidth < 768 ? FINAL_MOBILE : FINAL

    const ctx = gsap.context(() => {
      gsap.set(circleEls.current, { opacity: 0, scale: 0.8 })
      gsap.set(titleRef.current,  { opacity: 0, y: 24 })

      cardEls.current.forEach((el, i) => {
        if (!el) return
        const init = INITIAL[i]
        // Sem filter no set inicial — evita criar compositing layers desnecessários
        gsap.set(el, { xPercent: -50, yPercent: -50, z: init.z, x: init.x, y: init.y, opacity: 0 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,  // elemento alto — calcula posições corretamente
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(circleEls.current, {
        opacity: (i: number) => 1 - i * 0.13,
        scale: 1,
        duration: 0.85,
        stagger: { each: 0.04, from: 'start' },
        ease: 'power1.out',
      }, 0)

      tl.to(circleEls.current, {
        opacity: 0,
        duration: 0.30,
        stagger: { each: 0.03, from: 'start' },
        ease: 'power1.in',
      }, 0.60)

      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.08)

      cardEls.current.forEach((el, i) => {
        if (!el) return
        const f = finals[i]
        const s = STARTS[i]
        const dur = 0.44

        // Só movimento + opacity — sem filter animado para evitar layer churn
        tl.to(el, { z: f.z, x: f.x, y: f.y, duration: dur, ease: 'none' }, s)
        tl.to(el, {
          keyframes: [
            { opacity: 1, duration: dur * 0.35, ease: 'power1.out' },
            { opacity: 1, duration: dur * 0.50, ease: 'none'       },
            { opacity: 0, duration: dur * 0.15, ease: 'power1.in'  },
          ],
        }, s)
      })
    }, innerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="como-trabalhamos"
      ref={outerRef}
      className="relative z-10"
      style={{ height: '480vh' }}
    >
      <div
        ref={innerRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Círculos concêntricos */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          {Array.from({ length: N_CIRCLES }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { circleEls.current[i] = el }}
              className="absolute rounded-full"
              style={{
                width:  `max(${(i + 1) * 13}vw, ${(i + 1) * 14}vh)`,
                height: `max(${(i + 1) * 13}vw, ${(i + 1) * 14}vh)`,
                border: '1px solid var(--neutral-200)',
                filter: `blur(${Math.max(0.3, (N_CIRCLES - i - 1) * 0.6)}px)`,
              }}
            />
          ))}
        </div>

        {/* Título */}
        <div
          ref={titleRef}
          className="absolute top-0 left-0 right-0 flex flex-col items-center pt-20 md:pt-27 pointer-events-none px-6 md:px-8"
          style={{ zIndex: 5 }}
        >
          <h2
            className="font-chillax font-bold text-center uppercase text-black"
            style={{ fontSize: 'clamp(24px, 3.2vw, 44px)', lineHeight: 'var(--leading-display)' }}
          >
            como <span className="text-grad-01">trabalhamos</span>
          </h2>
          <p
            className="mt-2 font-synonym text-neutral-600 text-center max-w-sm"
            style={{ fontSize: '13px', lineHeight: 'var(--leading-body)' }}
          >
            Processos bem construídos para te dar clareza em todas as etapas e
            juntos podermos aproveitar nosso tempo para evoluir e pensar em
            coisas novas.
          </p>
        </div>

        {/* Cards — perspectiva 3D */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.num}
              ref={(el) => { cardEls.current[i] = el }}
              className="flex flex-col justify-start rounded-xl p-6 gap-2"
              style={{
                position:   'absolute',
                top:        '50%',
                left:       '50%',
                width:      'min(380px, 56vw)',
                zIndex:     i + 1,
                willChange: 'transform, opacity',
                // Fundo sólido — backdropFilter removido (causa layer churn com 3D)
                background: 'linear-gradient(145deg, #1a1a1a 0%, #111111 100%)',
                border:     '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div>
                <h3
                  className="font-chillax font-bold text-white uppercase leading-snug"
                  style={{ fontSize: 'clamp(16px, 2vw, 24px)' }}
                >
                  <small className="text-white" style={{ fontSize: 'var(--text-caption)' }}>
                    {card.num}.
                  </small>{' '}
                  {card.titulo}
                </h3>
              </div>
              <p
                className="font-synonym text-white opacity-55"
                style={{ fontSize: '13px', lineHeight: 'var(--leading-body)' }}
              >
                {card.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
