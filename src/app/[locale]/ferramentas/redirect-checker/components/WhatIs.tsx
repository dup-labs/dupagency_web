'use client'

import { useTranslations } from 'next-intl'

const CARD_ICONS = [
  (
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="url(#rc-grad-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="rc-grad-1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
        </linearGradient>
      </defs>
    </svg>
  ),
  (
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="url(#rc-grad-2)" strokeWidth="1.5" />
      <path d="M12 8v4M12 16h.01" stroke="url(#rc-grad-2)" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="rc-grad-2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
        </linearGradient>
      </defs>
    </svg>
  ),
  (
    <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 7l-10 10M7 7h10v10" stroke="url(#rc-grad-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="rc-grad-3" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
        </linearGradient>
      </defs>
    </svg>
  ),
  (
    <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="url(#rc-grad-4)" strokeWidth="1.5" />
      <path d="M12 8v4l3 3" stroke="url(#rc-grad-4)" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="rc-grad-4" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
        </linearGradient>
      </defs>
    </svg>
  ),
]

const CARD_KEYS = ['p1', 'p2', 'p3', 'p4'] as const

export default function WhatIs() {
  const t = useTranslations('ferramentas.redirectChecker.problems')
  const cards = CARD_KEYS.map((k, i) => ({
    icon: CARD_ICONS[i],
    title: t(`${k}.title`),
    body: t(`${k}.body`),
  }))

  return (
    <section id="rc-what-is" className="relative z-10" style={{ padding: '80px 24px' }}>
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
            maxWidth: '640px',
            marginBottom: '20px',
          }}
        >
          {t('headline')}
        </h2>

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
          {t('body')}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
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
                {card.title}
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
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
