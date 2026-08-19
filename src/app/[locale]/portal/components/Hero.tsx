'use client'

import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import { ArrowRightIcon, ArrowDownIcon } from '@phosphor-icons/react'
import GridLines from '@/components/ui/GridLines'
import Reveal from '@/components/ui/Reveal'
import LightboxImage from '@/components/ui/LightboxImage'

// CTA "Quero conversar!" — mesmo link de agendamento usado na landing
// original do portal (dashboard/src/app/page.tsx).
const CALENDLY_URL = 'https://calendly.com/dupagency/novos-projetos-agenda-de-30-minutos?back=1'

const browserDots = (
  <>
    <span className="size-[11px] rounded-full bg-[#E0605E]" />
    <span className="size-[11px] rounded-full bg-[#E6B44C]" />
    <span className="size-[11px] rounded-full bg-[#5FB86B]" />
  </>
)

export default function Hero() {
  const t = useTranslations('portal.hero')

  return (
    <section
      id="portal-hero"
      className="relative z-10 overflow-hidden"
      style={{ paddingTop: 'calc(64px + 56px)', paddingBottom: '80px' }}
    >
      <GridLines />
      <div
        className="pointer-events-none absolute -top-[14%] left-1/2 h-[640px] w-[min(1100px,120%)] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(137,123,188,0.16), rgba(175,215,208,0.08) 42%, transparent 70%)',
        }}
      />

      <div className="relative z-[2] mx-auto flex max-w-[1020px] flex-col items-center gap-6 px-6 text-center md:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(137,123,188,0.35)] bg-[rgba(137,123,188,0.06)] px-[15px] py-[7px] font-synonym text-[11px] tracking-[0.14em] text-purple-dark uppercase">
            <span className="size-[7px] rounded-full" style={{ backgroundImage: 'var(--grad-site-01)' }} />
            {t('badge')}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="font-chillax font-bold uppercase text-black"
            style={{ fontSize: 'clamp(38px, 6.2vw, 88px)', lineHeight: 1.04, letterSpacing: '-0.01em', maxWidth: '15ch' }}
          >
            {t.rich('headline', richTags)}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p
            className="font-synonym text-neutral-600"
            style={{ fontSize: '17px', lineHeight: 1.6, maxWidth: '60ch' }}
          >
            {t('subheadline')}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[52px] items-center gap-2.5 rounded-pill bg-black px-7 font-synonym text-[12px] font-semibold tracking-micro text-white uppercase transition-colors hover:bg-purple-dark"
            >
              {t('ctaPrimary')}
              <ArrowRightIcon size={15} />
            </a>
            <a
              href="#portal-recursos"
              className="inline-flex h-[52px] items-center gap-2.5 rounded-pill border border-black/[.18] px-6 font-synonym text-[12px] font-semibold tracking-micro text-black uppercase transition-colors hover:border-black"
            >
              {t('ctaSecondary')}
              <ArrowDownIcon size={15} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={320} className="w-full">
          <div className="relative mt-8 w-full max-w-[1080px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_40px_100px_rgba(137,123,188,0.26)]">
            <div className="flex h-[38px] items-center gap-2 border-b border-black/[.07] bg-neutral-50 px-4">
              {browserDots}
              <span className="ml-3.5 font-synonym text-[11px] tracking-[0.04em] text-neutral-400">
                {t('browserUrl')}
              </span>
            </div>
            <LightboxImage
              src="/portal/hero-visao-geral.png"
              alt={t('screenshotAlt')}
              width={1700}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
