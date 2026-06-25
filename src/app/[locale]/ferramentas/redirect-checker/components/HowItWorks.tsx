'use client'

import { useTranslations } from 'next-intl'

const STEP_KEYS = ['step1', 'step2', 'step3'] as const

export default function HowItWorks() {
  const t = useTranslations('ferramentas.redirectChecker.howItWorks')
  const STEPS = STEP_KEYS.map((k, i) => ({
    number: String(i + 1).padStart(2, '0'),
    title: t(`${k}.title`),
    body: t(`${k}.body`),
  }))

  return (
    <section id="rc-how-it-works" className="relative z-10" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative' }}>
        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--purple-mid)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          {t('sectionLabel')}
        </p>

        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--black)',
            marginBottom: '56px',
          }}
        >
          {t('headline')}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2px',
            background: 'var(--neutral-100)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                background: 'var(--neutral-50)',
                padding: '32px 28px',
              }}
            >
              <div
                className="font-chillax text-grad-01"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: '20px',
                }}
              >
                {step.number}
              </div>

              <h3
                className="font-chillax"
                style={{
                  fontSize: 'var(--text-heading-01)',
                  fontWeight: 600,
                  color: 'var(--black)',
                  marginBottom: '12px',
                  lineHeight: 'var(--leading-heading)',
                }}
              >
                {step.title}
              </h3>

              <p
                className="font-synonym"
                style={{
                  fontSize: 'var(--text-body-md)',
                  lineHeight: 'var(--leading-body)',
                  color: 'var(--neutral-600)',
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
