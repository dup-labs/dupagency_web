'use client'

import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'

const ITEM_KEYS = ['item1', 'item2', 'item3', 'item4'] as const

export default function RedirectUpsell() {
  const t = useTranslations('ferramentas.redirectChecker.resultado.cta')
  const ITEMS = ITEM_KEYS.map((k) => t(k))

  return (
    <div
      style={{
        marginTop: '32px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: '#0d0d0d',
        padding: '48px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '40px',
        alignItems: 'center',
      }}
    >
      {/* Coluna esquerda — copy */}
      <div>
        <span
          className="font-synonym"
          style={{
            display: 'inline-block',
            fontSize: 'var(--text-label-ui)',
            fontWeight: 600,
            letterSpacing: '0.10em',
            color: 'rgba(255,255,255,0.50)',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 12px',
            marginBottom: '24px',
          }}
        >
          dup.agency
        </span>

        <h3
          className="font-chillax font-bold uppercase"
          style={{
            fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)',
            lineHeight: 'var(--leading-display)',
            color: '#ffffff',
            marginBottom: '12px',
          }}
        >
          {t.rich('headline', richTags)}
        </h3>

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--leading-body)',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '380px',
          }}
        >
          {t('body')}
        </p>
      </div>

      {/* Coluna direita — lista + CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ITEMS.map((item) => (
            <li
              key={item}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.10)" />
                <path d="M5.5 9l2.5 2.5 4.5-5" stroke="rgba(175,215,208,0.90)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span
                className="font-synonym"
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'rgba(255,255,255,0.80)',
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="https://wa.me/5511973558096"
          target="_blank"
          rel="noopener noreferrer"
          id="cta-whatsapp-redirect"
          data-cta="whatsapp"
          className="font-synonym"
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 20px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(255,255,255,0.30)',
            background: 'transparent',
            color: '#ffffff',
            fontSize: 'var(--font-size-label-ui)',
            fontWeight: 400,
            letterSpacing: 'var(--tracking-micro)',
            textTransform: 'uppercase',
            textDecoration: 'none',
            textAlign: 'center',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          {t('button')} →
        </a>
      </div>
    </div>
  )
}
