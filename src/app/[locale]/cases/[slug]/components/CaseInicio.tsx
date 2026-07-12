'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { renderAccents } from '@/lib/caseRich'

// ─────────────────────────────────────────────────────────────────────────────
// CaseInicio — "02 — como começou"
// ─────────────────────────────────────────────────────────────────────────────
// Fundo preto vem do BackgroundLayer (id "case-inicio" já registrado em
// useActiveSection) — a seção não pinta cor própria. Blob decorativo é só
// atmosfera: aria-hidden, sem pointer-events, com parallax de mouse.
// ─────────────────────────────────────────────────────────────────────────────

interface CaseInicioProps {
  /** "02" — já formatado pelo content file, entra cru no eyebrow. */
  num: string
  /** Aceita **gradiente** — resolvido via renderAccents. */
  statement: string
  body: string
}

export default function CaseInicio({ num, statement, body }: CaseInicioProps) {
  const t = useTranslations('cases.ui')
  const blobRef = useRef<HTMLDivElement>(null)

  useMouseParallax([{ ref: blobRef, strength: 26 }])

  return (
    <section
      id="case-inicio"
      className="relative z-10 overflow-hidden"
      style={{ padding: 'clamp(90px,12vw,150px) 0' }}
    >
      <div
        ref={blobRef}
        aria-hidden
        className="absolute rounded-pill pointer-events-none"
        style={{
          top: -80,
          right: -60,
          width: 340,
          height: 340,
          background: 'radial-gradient(circle, rgba(137,123,188,.4), transparent 70%)',
        }}
      />

      <div className="relative max-w-[1000px] mx-auto px-6 md:px-8">
        <Reveal>
          <span
            className="font-synonym uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--teal-mint)' }}
          >
            {num} — {t('eyebrowStart')}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <p
            className="font-chillax font-bold uppercase text-white mt-[26px]"
            style={{ fontSize: 'clamp(24px,3.2vw,42px)', lineHeight: 1.18, textWrap: 'pretty' }}
          >
            {renderAccents(statement)}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p
            className="font-synonym text-white/60 mt-7 max-w-[60ch]"
            style={{ fontSize: 'clamp(15px,1.2vw,18px)', lineHeight: 1.7 }}
          >
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
