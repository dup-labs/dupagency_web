'use client'

import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { renderAccents } from '@/lib/caseRich'

// ─────────────────────────────────────────────────────────────────────────────
// CaseResumo — "01 — o cliente"
// ─────────────────────────────────────────────────────────────────────────────
// Duas colunas sobre fundo branco: quem é o cliente (título) à esquerda, contexto
// + chips de escopo à direita. Sem GSAP — só o fade/subida padrão do <Reveal>.
// ─────────────────────────────────────────────────────────────────────────────

interface CaseResumoProps {
  /** "01" — já formatado pelo content file, entra cru no eyebrow. */
  num: string
  /** Aceita **gradiente** e \n — resolvido via renderAccents. */
  title: string
  lead: string
  body: string
  chips: string[]
}

export default function CaseResumo({ num, title, lead, body, chips }: CaseResumoProps) {
  const t = useTranslations('cases.ui')

  return (
    <section
      id="case-resumo"
      className="relative z-10 border-t border-black/[.06]"
      style={{ padding: 'clamp(80px,10vw,130px) 0' }}
    >
      <div
        className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] items-start"
        style={{ gap: 'clamp(32px,6vw,90px)' }}
      >
        <Reveal>
          <span
            className="font-synonym uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--purple-vivid)' }}
          >
            {num} — {t('eyebrowClient')}
          </span>
          <h2
            className="font-chillax font-bold uppercase mt-5"
            style={{ fontSize: 'clamp(30px,3.6vw,46px)', lineHeight: 1.05 }}
          >
            {renderAccents(title)}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p
            className="font-synonym"
            style={{ fontSize: 'clamp(16px,1.3vw,19px)', lineHeight: 1.65, color: 'var(--neutral-800)' }}
          >
            {lead}
          </p>
          <p
            className="font-synonym mt-[22px]"
            style={{ fontSize: '16px', lineHeight: 1.65, color: 'var(--neutral-600)' }}
          >
            {body}
          </p>
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-[30px]">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="px-4 py-[9px] border border-black/10 rounded-pill font-synonym"
                  style={{ fontSize: '12px', color: 'var(--purple-mid-600)' }}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
