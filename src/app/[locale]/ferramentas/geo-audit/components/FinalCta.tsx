'use client'

import { useTranslations } from 'next-intl'
import AuditForm from './AuditForm'

export default function FinalCta() {
  const t = useTranslations('ferramentas.geoAudit')
  return (
    <section
      id="geo-final-cta"
      className="relative z-10 flex items-center justify-center"
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '80px 24px',
        overflow: 'hidden',
      }}
    >

      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, var(--text-display-xl))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--white)',
            marginBottom: '20px',
          }}
        >
          {t('ctaFinal.headline')}
        </h2>

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-body)',
            color: 'rgba(255,255,255,0.80)',
            marginBottom: '40px',
          }}
        >
          {t('ctaFinal.body')}
        </p>

        <AuditForm variant="cta" />

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.03em',
          }}
        >
          {t('ctaFinal.footer')}
        </p>
      </div>
    </section>
  )
}
