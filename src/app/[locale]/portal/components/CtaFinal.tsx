'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { CheckIcon } from '@phosphor-icons/react'
import GridLines from '@/components/ui/GridLines'
import { gsap } from '@/lib/gsap'

const CALENDLY_URL = 'https://calendly.com/dupagency/novos-projetos-agenda-de-30-minutos?back=1'

// Palavra que roda no meio da frase — mesmo padrão do ConversaRotator da
// home (src/components/sections/CTAFinal.tsx), com as frases da landing
// original do portal.
function PortalRotator({ frases }: { frases: string[] }) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el || frases.length === 0) return

    let phraseIdx = 0
    el.textContent = frases[0] ?? ''

    const interval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % frases.length

      gsap.to(el, {
        y: '-120%',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          el.textContent = frases[phraseIdx] ?? ''
          gsap.set(el, { y: '120%', opacity: 0 })
          gsap.to(el, { y: '0%', opacity: 1, duration: 0.5, ease: 'back.out(2)' })
        },
      })
    }, 2400)

    return () => clearInterval(interval)
  }, [frases])

  return (
    <span className="relative inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
      <span ref={spanRef} className="text-grad-01 inline-block whitespace-nowrap will-change-transform" />
    </span>
  )
}

export default function CtaFinal() {
  const t = useTranslations('portal.ctaFinal')
  const frases = t.raw('frases') as string[]

  return (
    <section
      id="portal-cta"
      className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center md:px-8"
    >
      <GridLines />
      <div
        className="pointer-events-none absolute -bottom-[22%] left-1/2 h-[560px] w-[min(900px,110%)] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(137,123,188,0.28), transparent 68%)' }}
      />

      <div className="relative z-[2] flex flex-col items-center">
        <h2
          className="m-0 font-chillax font-bold uppercase text-white"
          style={{ fontSize: 'clamp(30px, 5vw, 64px)', lineHeight: 1.08, maxWidth: '18ch' }}
        >
          {t('headline1')}
          <br />
          {t('rotatorPrefix')} <PortalRotator frases={frases} />
          {t('rotatorMid')} {t('rotatorTail')}
        </h2>

        <p className="mt-[26px] font-synonym text-[15px] text-white/55" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {t('subheadline')}
        </p>

        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[34px] inline-flex items-center gap-3 rounded-pill border border-white px-[34px] py-4 font-synonym text-[12px] font-semibold tracking-micro text-white uppercase transition-colors hover:bg-white hover:text-black"
        >
          <CheckIcon size={16} />
          {t('button')}
        </a>
      </div>
    </section>
  )
}
