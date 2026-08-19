'use client'

import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import GridLines from '@/components/ui/GridLines'
import Reveal from '@/components/ui/Reveal'

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const

export default function ComoFunciona() {
  const t = useTranslations('portal.comoFunciona')

  return (
    <section id="portal-como-funciona" className="relative z-10 overflow-hidden" style={{ padding: '100px 24px' }}>
      <GridLines />
      <div className="relative z-[2] mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mx-auto mb-16 max-w-[640px] text-center">
            <span className="font-synonym text-[11px] tracking-[0.16em] text-white/50 uppercase">
              {t('eyebrow')}
            </span>
            <h2
              className="mt-4 font-chillax font-bold uppercase text-white"
              style={{ fontSize: 'clamp(30px, 4.2vw, 52px)', lineHeight: 1.05 }}
            >
              {t.rich('headline', richTags)}
            </h2>
            <p className="mt-4 font-synonym text-[15px] text-white/58" style={{ lineHeight: 1.6 }}>
              {t('subheadline')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((key, i) => (
            <Reveal key={key} delay={i * 90}>
              <div className="rounded-2xl p-[1.5px]" style={{ backgroundImage: 'var(--grad-site-01)' }}>
                <div className="flex h-full flex-col rounded-[14.5px] bg-black p-[26px]">
                  <span className="font-chillax text-[13px] font-bold text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="mt-3 mb-2.5 font-chillax text-[20px] leading-[1.15] font-bold uppercase"
                    style={{
                      backgroundImage: 'linear-gradient(174deg,#afd7d0,#897bbc)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }}
                  >
                    {t(`${key}.title`)}
                  </h3>
                  <p className="font-synonym text-[13.5px] text-white/72" style={{ lineHeight: 1.6 }}>
                    {t(`${key}.body`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
