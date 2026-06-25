'use client'

import { useTranslations } from 'next-intl'

const AUDIT_INCLUDE_KEYS = ['item1', 'item2', 'item3', 'item4'] as const

const CHECKER_PLATFORMS = [
  { name: 'ChatGPT',    icon: '⬡' },
  { name: 'Gemini',     icon: '◇' },
  { name: 'Perplexity', icon: '◈' },
]

export default function CheckerUpsell() {
  const t = useTranslations('ferramentas.geoAudit')
  return (
    <section id="geo-checker-upsell" className="relative z-10" style={{ padding: '80px 24px' }}>
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
          {t('auditVsChecker.eyebrow')}
        </p>

        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--black)',
            marginBottom: '12px',
          }}
        >
          {t('auditVsChecker.headline')}
        </h2>

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-body)',
            color: 'var(--neutral-600)',
            maxWidth: '640px',
            marginBottom: '40px',
          }}
        >
          {t('auditVsChecker.body')}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'var(--neutral-100)',
          }}
        >
          {/* Coluna esquerda — o que o audit inclui */}
          <div
            style={{
              background: 'var(--grad-site-01)',
              padding: '48px 40px',
            }}
          >
            <span
              className="font-synonym"
              style={{
                display: 'inline-block',
                fontSize: 'var(--text-label-ui)',
                fontWeight: 600,
                letterSpacing: '0.10em',
                color: 'rgba(255,255,255,0.70)',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px',
                marginBottom: '24px',
              }}
            >
              {t('auditVsChecker.auditIncludes.label')}
            </span>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {AUDIT_INCLUDE_KEYS.map((itemKey) => (
                <li
                  key={itemKey}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.20)" />
                    <path
                      d="M5.5 9l2.5 2.5 4.5-5"
                      stroke="rgba(255,255,255,0.90)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="font-synonym"
                    style={{
                      fontSize: 'var(--text-body-md)',
                      lineHeight: 'var(--leading-body)',
                      color: 'var(--white)',
                    }}
                  >
                    {t(`auditVsChecker.auditIncludes.${itemKey}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna direita — GEO Checker */}
          <div
            style={{
              background: '#0d0d0d',
              padding: '48px 40px',
            }}
          >
            <span
              className="font-synonym"
              style={{
                display: 'inline-block',
                fontSize: 'var(--text-label-ui)',
                fontWeight: 600,
                letterSpacing: '0.10em',
                color: 'rgba(255,255,255,0.70)',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px',
                marginBottom: '24px',
              }}
            >
              {t('auditVsChecker.reportLabel')}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {CHECKER_PLATFORMS.map((p) => (
                <div
                  key={p.name}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    className="font-synonym"
                    style={{
                      fontSize: 'var(--text-body-md)',
                      color: 'var(--white)',
                      fontWeight: 500,
                    }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="font-synonym"
                    style={{
                      fontSize: 'var(--text-body-md)',
                      color: 'rgba(255,255,255,0.50)',
                      fontStyle: 'italic',
                    }}
                  >
                    {t('auditVsChecker.checkerCardQuestion')} →{' '}
                    <span style={{ color: 'rgba(255,255,255,0.70)', letterSpacing: '0.1em' }}>?</span>
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/5511973558096"
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-geo-checker"
              data-cta="whatsapp"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 20px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--white)',
                background: 'transparent',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-label-ui)',
                fontWeight: 400,
                cursor: 'pointer',
                letterSpacing: 'var(--tracking-micro)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              {t('auditVsChecker.checkerCta')} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
