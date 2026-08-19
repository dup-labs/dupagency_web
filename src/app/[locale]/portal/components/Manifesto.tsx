'use client'

import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import { EyeIcon, ArchiveIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { PhosphorIcon } from '@/components/ui/PhosphorIcon'
import GridLines from '@/components/ui/GridLines'
import Reveal from '@/components/ui/Reveal'

const CARDS = [
  { key: 'card1', icon: EyeIcon },
  { key: 'card2', icon: ArchiveIcon },
  { key: 'card3', icon: UsersThreeIcon },
] as const

export default function Manifesto() {
  const t = useTranslations('portal.manifesto')

  return (
    <section id="portal-manifesto" className="relative z-10 overflow-hidden" style={{ padding: '100px 24px' }}>
      <GridLines />
      <div className="relative z-[2] mx-auto max-w-[1120px]">
        <Reveal>
          <span className="font-synonym text-[11px] tracking-[0.16em] text-white/50 uppercase">
            {t('eyebrow')}
          </span>
        </Reveal>

        <Reveal delay={60}>
          <h2
            className="mt-[18px] font-chillax font-bold uppercase text-white text-pretty"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.08, maxWidth: '20ch' }}
          >
            {t.rich('headline', richTags)}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-[22px] font-synonym text-white/60" style={{ fontSize: '16px', lineHeight: 1.65, maxWidth: '56ch' }}>
            {t('body')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.key} delay={i * 100}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[.03] p-7">
                <PhosphorIcon icon={card.icon} size={28} />
                <h3 className="mt-[18px] mb-2 font-chillax text-[19px] font-semibold uppercase text-white">
                  {t(`${card.key}.title`)}
                </h3>
                <p className="font-synonym text-[14px] text-white/62" style={{ lineHeight: 1.6 }}>
                  {t(`${card.key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
