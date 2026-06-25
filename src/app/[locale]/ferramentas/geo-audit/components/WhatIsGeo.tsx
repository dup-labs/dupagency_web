'use client'

import { useTranslations } from 'next-intl'

const CARDS = [
  {
    tkey: 'pillar1',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="url(#geo-grad-1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="geo-grad-1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" />
            <stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    tkey: 'pillar2',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="url(#geo-grad-2)" strokeWidth="1.5" />
        <path d="M7 8h10M7 12h7M7 16h5" stroke="url(#geo-grad-2)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="geo-grad-2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" />
            <stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    tkey: 'pillar3',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="url(#geo-grad-3)" strokeWidth="1.5" />
        <path d="M12 8v4l3 3" stroke="url(#geo-grad-3)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="geo-grad-3" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" />
            <stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    tkey: 'pillar4',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          stroke="url(#geo-grad-4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="geo-grad-4" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" />
            <stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
]

export default function WhatIsGeo() {
  const t = useTranslations('ferramentas.geoAudit')
  return (
    <section id="geo-what-is-geo" className="relative z-10" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative' }}>
        {/* Label */}
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
          {t('whatIsGeo.sectionLabel')}
        </p>

        {/* H2 */}
        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--black)',
            maxWidth: '640px',
            marginBottom: '20px',
          }}
        >
          {t('whatIsGeo.headline')}
        </h2>

        {/* Definição */}
        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-body)',
            color: 'var(--neutral-600)',
            maxWidth: '680px',
            marginBottom: '56px',
          }}
        >
          {t('whatIsGeo.body')}
        </p>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.tkey}
              style={{
                background: 'var(--neutral-50)',
                border: '1px solid var(--neutral-100)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>{card.icon}</div>
              <h3
                className="font-chillax"
                style={{
                  fontSize: 'var(--text-heading-02)',
                  fontWeight: 600,
                  color: 'var(--black)',
                  marginBottom: '10px',
                  lineHeight: 'var(--leading-heading)',
                }}
              >
                {t(`whatIsGeo.${card.tkey}.title`)}
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
                {t(`whatIsGeo.${card.tkey}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
