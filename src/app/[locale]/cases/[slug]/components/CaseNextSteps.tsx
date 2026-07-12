'use client'

import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { richTags } from '@/i18n/rich'

interface CaseNextStep {
  title: string
  body: string
}

interface CaseNextStepsProps {
  num: string
  steps: CaseNextStep[]
}

// ─────────────────────────────────────────────────────────────────────────────
// CaseNextSteps — fechamento do case, sobre fundo branco. O hover dos cards
// (translateY + shadow) já vem pronto via .case-hovercard (globals.css) —
// não reimplementar em JS como o protótipo fazia.
// ─────────────────────────────────────────────────────────────────────────────

export default function CaseNextSteps({ num, steps }: CaseNextStepsProps) {
  const t = useTranslations('cases.ui')

  return (
    <section
      id="case-next"
      className="relative z-10 border-t border-black/[.06]"
      style={{ padding: 'clamp(80px,10vw,130px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 md:px-8">
        <Reveal>
          <div className="max-w-[600px] mb-11">
            <span
              className="font-synonym uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--purple-vivid)' }}
            >
              {num} — {t('eyebrowNext')}
            </span>
            <h2
              className="font-chillax font-bold uppercase mt-4"
              style={{ fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: 1.05 }}
            >
              {t.rich('nextTitle', richTags)}
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <div className="case-hovercard h-full rounded-2xl bg-lilac-50 border border-black/5 px-[26px] py-[30px]">
                <span className="font-chillax font-bold text-grad-01" style={{ fontSize: 22 }}>
                  →
                </span>
                <h3 className="font-chillax font-semibold uppercase mt-4" style={{ fontSize: 17 }}>
                  {step.title}
                </h3>
                <p
                  className="font-synonym mt-2.5"
                  style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--neutral-600)' }}
                >
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
