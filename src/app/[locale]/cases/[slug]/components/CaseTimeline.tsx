'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import { gsap } from '@/lib/gsap'
import Reveal from '@/components/ui/Reveal'

interface CaseTimelineMilestone {
  year: string
  tag: string
  title: string
  description: string
  result: string
  /** Print da entrega. Sem isso, o card não renderiza a moldura. */
  image?: string
}

interface CaseTimelineProps {
  num: string
  milestones: CaseTimelineMilestone[]
}

export default function CaseTimeline({ num, milestones }: CaseTimelineProps) {
  const t = useTranslations('cases.ui')
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  // Único ScrollTrigger da página: a spine se preenche proporcional ao scroll
  // do track (sem pin — o "how" é só o quanto já rolou entre início e fim).
  // O estado inicial (scaleY(0)) já nasce no JSX pra não haver flash de spine
  // cheia antes do JS assumir.
  useEffect(() => {
    if (!trackRef.current || !fillRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(fillRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="case-historico"
      ref={sectionRef}
      className="relative z-10"
      style={{ padding: 'clamp(80px,10vw,130px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 md:px-8">
        <Reveal>
          <div className="max-w-[640px] mx-auto text-center">
            <span
              className="font-synonym uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--purple-vivid)' }}
            >
              {num} — {t('eyebrowHistory')}
            </span>
            <h2
              className="font-chillax font-bold uppercase mt-[18px]"
              style={{ fontSize: 'clamp(30px,3.8vw,50px)', lineHeight: 1.04 }}
            >
              {t.rich('historyTitle', richTags)}
            </h2>
            <p
              className="font-synonym text-[var(--neutral-600)] max-w-[44ch] mx-auto mt-4"
              style={{ fontSize: '14px', lineHeight: 'var(--leading-body)' }}
            >
              {t('historySub')}
            </p>
          </div>
        </Reveal>

        {/* Track: escopo do trigger do spine-fill — a proporção rolada entre o
            topo e o fim desta div é o que dita o quanto a linha preenche. */}
        <div ref={trackRef} className="relative mt-[60px]">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 w-[2px] left-5 md:left-1/2 md:-translate-x-1/2"
            style={{ background: 'rgba(13,13,13,.1)' }}
          />
          <div
            ref={fillRef}
            aria-hidden
            className="absolute top-0 h-full w-[2px] left-5 md:left-1/2 md:-translate-x-1/2"
            style={{
              background: 'linear-gradient(var(--teal-mint), var(--purple-mid), var(--purple-vivid))',
              transform: 'scaleY(0)',
              transformOrigin: 'top',
            }}
          />

          <div className="flex flex-col gap-[clamp(28px,4vw,54px)]">
            {milestones.map((m, i) => (
              <div
                key={`${m.year}-${i}`}
                className="relative pl-11 md:pl-0 md:grid md:grid-cols-2 md:items-center"
                style={{ gap: 'clamp(24px,4vw,64px)' }}
              >
                {/* Nó na spine — mesmo ponto de ancoragem (top-34) nos dois layouts;
                    só o "left" muda entre a borda (mobile) e o centro (desktop). */}
                <span
                  aria-hidden
                  className="absolute w-[15px] h-[15px] rounded-pill bg-white border-[3px] left-5 top-[34px] -translate-x-1/2 -translate-y-1/2 md:left-1/2 z-[3]"
                  style={{ borderColor: 'var(--purple-mid)', boxShadow: '0 0 0 5px var(--lilac-50)' }}
                />

                <Reveal variant="card" className={i % 2 === 0 ? undefined : 'md:col-start-2'}>
                  <div
                    className="bg-white rounded-2xl px-[26px] pt-[26px] pb-6"
                    style={{ border: '1px solid rgba(13,13,13,.07)', boxShadow: '0 10px 30px rgba(13,13,13,.05)' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="font-chillax font-bold text-grad-01"
                        style={{ fontSize: '26px', lineHeight: 1 }}
                      >
                        {m.year}
                      </span>
                      <span
                        className="font-synonym uppercase bg-lilac-100 text-[var(--purple-mid-600)] px-[13px] py-1.5 rounded-pill"
                        style={{ fontSize: '10px', letterSpacing: '.08em' }}
                      >
                        {m.tag}
                      </span>
                    </div>

                    {m.image && (
                      <div className="relative rounded-xl overflow-hidden h-[150px] bg-lilac-100 mb-[18px]">
                        <Image
                          src={m.image}
                          alt={m.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 90vw, 40vw"
                        />
                      </div>
                    )}

                    <h3
                      className="font-chillax font-semibold uppercase"
                      style={{ fontSize: '19px', lineHeight: 1.18 }}
                    >
                      {m.title}
                    </h3>
                    <p
                      className="font-synonym text-[13.5px] text-[var(--neutral-600)] mt-2.5"
                      style={{ lineHeight: 1.6 }}
                    >
                      {m.description}
                    </p>

                    <div
                      className="flex gap-2.5 items-start mt-4 pt-3.5"
                      style={{ borderTop: '1px solid rgba(13,13,13,.07)' }}
                    >
                      <span
                        aria-hidden
                        className="shrink-0 mt-0.5 w-4 h-4 rounded-pill flex items-center justify-center"
                        style={{ background: 'var(--grad-site-01)' }}
                      >
                        <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.4">
                          <polyline points="3,8 7,12 13,4" />
                        </svg>
                      </span>
                      <span className="font-synonym text-[12.5px] text-black" style={{ lineHeight: 1.5 }}>
                        <strong className="font-semibold">{t('resultLabel')}</strong> {m.result}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
