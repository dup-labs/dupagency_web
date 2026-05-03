'use client'

import { useEffect, useRef } from 'react'
import { ChecksIcon } from '@phosphor-icons/react'
import { PhosphorIcon } from '@/components/ui/PhosphorIcon'
import { gsap } from '@/lib/gsap'

const FRASES = [
  'conversa produtiva',
  'conversa criativa',
  'conversa estratégica',
  'conversa leve',
  'conversa eficiente',
  'conversa honesta',
]

function ConversaRotator() {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    let phraseIdx = 0
    el.textContent = FRASES[0]

    const interval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % FRASES.length

      gsap.to(el, {
        y: '-120%',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          el.textContent = FRASES[phraseIdx]
          gsap.set(el, { y: '120%', opacity: 0 })
          gsap.to(el, { y: '0%', opacity: 1, duration: 0.5, ease: 'back.out(2)' })
        },
      })
    }, 2600)

    return () => clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
      <span ref={spanRef} className="text-grad-01 inline-block will-change-transform whitespace-nowrap" />
    </span>
  )
}

// CTAFinal tem fundo escuro — linhas claras. 1 div com gradient.
function GridLines() {
  const gradient =
    'linear-gradient(to right, transparent calc(100% - 1px), rgba(255,255,255,0.06) calc(100% - 1px), rgba(255,255,255,0.06) 100%)'
  return (
    <div
      className="grid-lines absolute inset-0 pointer-events-none"
      aria-hidden
      style={{ backgroundImage: gradient }}
    />
  )
}

export default function CTAFinal() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="cta-final"
      ref={sectionRef}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-12"
    >
      <GridLines />

      <div ref={contentRef} className="relative flex flex-col items-center text-center">
        <h2
          className="font-chillax font-bold uppercase text-white"
          style={{ fontSize: 'clamp(26px, 5vw, 64px)', lineHeight: 'var(--leading-display)' }}
        >
          A agenda é limitada.
          <br />
          Mas uma{' '}
          <ConversaRotator />,
          <br />
          é irresistível.
        </h2>

        <p className="mt-8 font-synonym text-body-md text-white opacity-50 text-center" style={{ lineHeight: 'var(--leading-body)' }}>
          Agende um papo com a gente e vamos juntos
          <br />traçar uma parceria de sucesso
        </p>

        <a
          href="https://calendly.com/dupagency/novos-projetos-agenda-de-30-minutos?back=1"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 border border-white rounded-pill px-8 py-4 font-synonym text-label-ui tracking-micro text-white hover:bg-white hover:text-black transition-colors duration-300"
        >
          <PhosphorIcon icon={ChecksIcon} size={16} weight="regular" />
          QUERO CONVERSAR!
        </a>
      </div>
    </section>
  )
}
