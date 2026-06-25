'use client'

import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import GridLines from '@/components/ui/GridLines'
import AuditForm from './AuditForm'

export default function Hero() {
  const t = useTranslations('ferramentas.geoAudit')
  return (
    <section
      id="geo-hero"
      className="relative z-10"
      style={{
        paddingTop: 'calc(64px + 72px)',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}
    >
      <GridLines />

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 12px',
            marginBottom: '32px',
          }}
        >
          <span
            className="font-synonym"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--neutral-400)',
              textTransform: 'uppercase',
            }}
          >
            {t('hero.label')}
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-chillax font-bold uppercase text-black select-none"
          style={{
            fontSize: 'clamp(30px, 5.1vw, 54px)',
            lineHeight: 'var(--leading-display)',
            marginBottom: '24px',
          }}
        >
          {t.rich('hero.headline', richTags)}
        </h1>

        {/* Subtítulo */}
        <p
          className="mt-6 md:mt-8 font-synonym text-body-md md:text-body-lg text-neutral-600 max-w-lg text-center"
          style={{ lineHeight: 'var(--leading-body)', margin: '0 auto 40px' }}
        >
          {t('hero.subheadline')}
        </p>

        <AuditForm variant="hero" />

        {/* Badges */}
        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            color: 'var(--neutral-400)',
            letterSpacing: '0.03em',
          }}
        >
          {t('hero.trust')}
        </p>
      </div>
    </section>
  )
}
