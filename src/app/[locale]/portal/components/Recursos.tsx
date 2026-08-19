'use client'

import { type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import {
  ChartDonutIcon,
  HandHeartIcon,
  TextboxIcon,
  MicrophoneIcon,
  PaperclipIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CalendarDotsIcon,
  CalendarCheckIcon,
  CheckIcon,
  CalendarPlusIcon,
  FileTextIcon,
  GlobeHemisphereWestIcon,
  ArrowsLeftRightIcon,
  GaugeIcon,
  TicketIcon,
  type Icon,
} from '@phosphor-icons/react'
import { PhosphorIcon } from '@/components/ui/PhosphorIcon'
import Reveal from '@/components/ui/Reveal'
import LightboxImage from '@/components/ui/LightboxImage'

const browserDotsSm = (
  <>
    <span className="size-[9px] rounded-full bg-[#E0605E]" />
    <span className="size-[9px] rounded-full bg-[#E6B44C]" />
    <span className="size-[9px] rounded-full bg-[#5FB86B]" />
  </>
)

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_80px_rgba(137,123,188,0.2)]">
      <div className="flex h-[34px] items-center gap-[7px] border-b border-black/[.07] bg-neutral-50 px-3.5">
        {browserDotsSm}
      </div>
      {children}
    </div>
  )
}

function Bullet({ icon, children }: { icon: Icon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 font-synonym text-[14.5px] text-neutral-800">
      <PhosphorIcon icon={icon} size={19} />
      {children}
    </div>
  )
}

function Chip({ icon: IconCmp, children }: { icon?: Icon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[.12] px-3.5 py-2 font-synonym text-[13px] text-neutral-800">
      {IconCmp && <IconCmp size={16} className="text-purple-mid" />}
      {children}
    </span>
  )
}

function Tag({ bg, color, children }: { bg: string; color: string; children: ReactNode }) {
  return (
    <span
      className="rounded-full px-[13px] py-1.5 font-synonym text-[11px] font-semibold tracking-[0.05em] uppercase"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  )
}

const eyebrowNum = 'inline-block font-chillax text-[14px] font-semibold tracking-[0.06em] text-[#AD61C2]'
const featureTitle = 'my-3 mb-4 font-chillax font-bold uppercase'
const featureBody = 'mb-5 max-w-[46ch] font-synonym text-[16px] text-neutral-600'

export default function Recursos() {
  const t = useTranslations('portal.recursos')

  return (
    <section id="portal-recursos" className="relative z-10 overflow-hidden" style={{ padding: '100px 24px' }}>
      <div className="relative z-[2] mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mx-auto mb-20 max-w-[720px] text-center">
            <span className="font-synonym text-[11px] tracking-[0.16em] text-neutral-400 uppercase">
              {t('eyebrow')}
            </span>
            <h2
              className="mt-4 font-chillax font-bold uppercase"
              style={{ fontSize: 'clamp(32px, 4.4vw, 56px)', lineHeight: 1.05 }}
            >
              {t.rich('headline', richTags)}
            </h2>
          </div>
        </Reveal>

        {/* 01 — Horas */}
        <div className="mb-[110px] grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.12fr] md:gap-16">
          <Reveal>
            <div>
              <span className={eyebrowNum}>{t('feature1.num')}</span>
              <h3 className={featureTitle} style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.12 }}>
                {t('feature1.title')}
              </h3>
              <p className={featureBody} style={{ lineHeight: 1.65 }}>{t('feature1.body')}</p>
              <div className="flex flex-col gap-3">
                <Bullet icon={ChartDonutIcon}>{t('feature1.bullet1')}</Bullet>
                <Bullet icon={HandHeartIcon}>{t('feature1.bullet2')}</Bullet>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="order-first md:order-none">
            <BrowserFrame>
              <LightboxImage src="/portal/horas.png" alt={t('feature1.imgAlt')} width={1700} height={900} className="h-auto w-full" />
            </BrowserFrame>
          </Reveal>
        </div>

        {/* 02 — Atividades */}
        <div className="mb-[110px] grid grid-cols-1 items-center gap-8 md:grid-cols-[1.12fr_1fr] md:gap-16">
          <Reveal delay={100} className="order-first">
            <div className="grid grid-cols-1 gap-[18px]">
              <BrowserFrame>
                <LightboxImage src="/portal/board-atividades.png" alt={t('feature2.imgAlt1')} width={1700} height={900} className="h-auto w-full" />
              </BrowserFrame>
              <div className="overflow-hidden rounded-2xl border border-[rgba(137,123,188,0.35)] bg-white shadow-[0_20px_50px_rgba(137,123,188,0.18)]">
                <LightboxImage src="/portal/atividade-audio.png" alt={t('feature2.imgAlt2')} width={1700} height={900} className="h-auto w-full" />
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div>
              <span className={eyebrowNum}>{t('feature2.num')}</span>
              <h3 className={featureTitle} style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.12 }}>
                {t('feature2.title')}
              </h3>
              <p className={featureBody} style={{ lineHeight: 1.65 }}>{t('feature2.body')}</p>
              <div className="flex flex-wrap gap-2.5">
                <Chip icon={TextboxIcon}>{t('feature2.chipTexto')}</Chip>
                <Chip icon={MicrophoneIcon}>{t('feature2.chipAudio')}</Chip>
                <Chip icon={PaperclipIcon}>{t('feature2.chipAnexo')}</Chip>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 03 — Documentações */}
        <div className="mb-[110px] grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.12fr] md:gap-16">
          <Reveal>
            <div>
              <span className={eyebrowNum}>{t('feature3.num')}</span>
              <h3 className={featureTitle} style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.12 }}>
                {t('feature3.title')}
              </h3>
              <p className={featureBody} style={{ lineHeight: 1.65 }}>{t('feature3.body')}</p>
              <div className="flex flex-wrap gap-2.5">
                <Tag bg="#E4E3E8" color="#53448A">{t('feature3.tagVtex')}</Tag>
                <Tag bg="#E9EDEC" color="#3E7F72">{t('feature3.tagProcessos')}</Tag>
                <Tag bg="#E5EAEB" color="#3897A8">{t('feature3.tagSeo')}</Tag>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="order-first md:order-none">
            <BrowserFrame>
              <LightboxImage src="/portal/documentacoes.png" alt={t('feature3.imgAlt')} width={1700} height={900} className="h-auto w-full" />
            </BrowserFrame>
          </Reveal>
        </div>

        {/* 04 — Agendar */}
        <div className="mb-[110px] grid grid-cols-1 items-center gap-8 md:grid-cols-[1.12fr_1fr] md:gap-16">
          <Reveal delay={100} className="order-first">
            <div
              className="overflow-hidden rounded-2xl p-9"
              style={{ backgroundImage: 'var(--grad-site-01)' }}
            >
              <div className="rounded-[14px] bg-white p-6 shadow-[0_24px_60px_rgba(13,13,13,0.16)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-chillax text-[16px] font-semibold">{t('feature4.mockMonth')}</span>
                  <span className="inline-flex gap-2 text-neutral-200">
                    <CaretLeftIcon size={14} />
                    <CaretRightIcon size={14} />
                  </span>
                </div>
                <div className="mb-3.5 font-synonym text-[11px] text-neutral-400">
                  {t('feature4.mockLabel')}
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 rounded-[10px] border border-black/10 px-3.5 py-3">
                    <PhosphorIcon icon={CalendarDotsIcon} size={18} />
                    <span className="flex-1 font-synonym text-[13.5px] text-neutral-800">{t('feature4.mockDay1')}</span>
                    <span className="font-synonym text-[13px] font-semibold text-purple-dark">{t('feature4.mockTime1')}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[10px] border-[1.5px] border-purple-mid bg-[#FAF9FC] px-3.5 py-3">
                    <CalendarCheckIcon size={18} weight="fill" className="text-purple-mid" />
                    <span className="flex-1 font-synonym text-[13.5px] font-semibold text-neutral-800">{t('feature4.mockDay2')}</span>
                    <span className="font-synonym text-[13px] font-semibold text-purple-dark">{t('feature4.mockTime2')}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[10px] border border-black/10 px-3.5 py-3">
                    <PhosphorIcon icon={CalendarDotsIcon} size={18} />
                    <span className="flex-1 font-synonym text-[13.5px] text-neutral-800">{t('feature4.mockDay3')}</span>
                    <span className="font-synonym text-[13px] font-semibold text-purple-dark">{t('feature4.mockTime3')}</span>
                  </div>
                </div>
                <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-pill bg-purple-mid font-synonym text-[12px] font-semibold tracking-micro text-white uppercase">
                  <CheckIcon size={15} />
                  {t('feature4.mockConfirm')}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div>
              <span className={eyebrowNum}>{t('feature4.num')}</span>
              <h3 className={featureTitle} style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.12 }}>
                {t('feature4.title')}
              </h3>
              <p className={featureBody} style={{ lineHeight: 1.65 }}>{t('feature4.body')}</p>
              <div className="flex flex-col gap-3">
                <Bullet icon={CalendarPlusIcon}>{t('feature4.bullet1')}</Bullet>
                <Bullet icon={FileTextIcon}>{t('feature4.bullet2')}</Bullet>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 05 — Ferramentas */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.12fr] md:gap-16">
          <Reveal>
            <div>
              <span className={eyebrowNum}>{t('feature5.num')}</span>
              <h3 className={featureTitle} style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.12 }}>
                {t('feature5.title')}
              </h3>
              <p className={featureBody} style={{ lineHeight: 1.65 }}>{t('feature5.body')}</p>
              <div className="flex flex-wrap gap-2.5">
                <Chip icon={GlobeHemisphereWestIcon}>{t('feature5.chipGeo')}</Chip>
                <Chip icon={ArrowsLeftRightIcon}>{t('feature5.chipRedirect')}</Chip>
                <Chip icon={GaugeIcon}>{t('feature5.chipSpeed')}</Chip>
                <Chip icon={TicketIcon}>{t('feature5.chipCupons')}</Chip>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="order-first md:order-none">
            <BrowserFrame>
              <LightboxImage src="/portal/ferramentas.png" alt={t('feature5.imgAlt')} width={1700} height={900} className="h-auto w-full" />
            </BrowserFrame>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
