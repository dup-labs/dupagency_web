'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { renderAccents } from '@/lib/caseRich'
import { useMouseParallax } from '@/hooks/useMouseParallax'

interface CaseDepoimentoProps {
  num: string
  quote: string
  author: string
  role: string
  logo?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// CaseDepoimento — a voz do cliente, sobre fundo preto (BackgroundLayer cuida
// da cor via useActiveSection; a seção nunca define background próprio).
// ─────────────────────────────────────────────────────────────────────────────

export default function CaseDepoimento({ num, quote, author, role, logo }: CaseDepoimentoProps) {
  const t = useTranslations('cases.ui')
  const blobRef = useRef<HTMLDivElement>(null)

  useMouseParallax([{ ref: blobRef, strength: 20 }])

  return (
    <section
      id="case-depoimento"
      className="relative z-10 overflow-hidden"
      style={{ padding: 'clamp(90px,12vw,150px) 0' }}
    >
      {/* Blob decorativo — só efeito visual, nunca captura clique/hover */}
      <div
        ref={blobRef}
        aria-hidden
        className="absolute pointer-events-none rounded-pill"
        style={{
          width: 360,
          height: 360,
          bottom: -100,
          left: -60,
          background: 'radial-gradient(circle, rgba(173,97,194,.28), transparent 70%)',
        }}
      />

      <div className="relative max-w-[920px] mx-auto px-6 md:px-8">
        <Reveal>
          <span
            className="font-synonym uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--teal-mint)' }}
          >
            {num} — {t('eyebrowVoice')}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <blockquote
            className="font-chillax font-semibold text-white"
            style={{ fontSize: 'clamp(22px,2.8vw,36px)', lineHeight: 1.28, marginTop: 26, textWrap: 'pretty' }}
          >
            &ldquo;{renderAccents(quote)}&rdquo;
          </blockquote>
        </Reveal>

        <Reveal delay={160}>
          <div className="flex items-center gap-4" style={{ marginTop: 34 }}>
            <div
              className="rounded-pill shrink-0 flex items-center justify-center overflow-hidden w-[46px] h-[46px]"
              style={logo ? { background: 'rgba(255,255,255,0.1)' } : { background: 'var(--grad-site-01)' }}
            >
              {logo && (
                <Image src={logo} alt="" width={28} height={28} className="object-contain" />
              )}
            </div>
            <div>
              <div
                className="font-chillax font-bold uppercase text-white"
                style={{ fontSize: 13, letterSpacing: '0.02em' }}
              >
                {author}
              </div>
              <div className="font-synonym text-white/50" style={{ fontSize: 12 }}>
                {role}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
