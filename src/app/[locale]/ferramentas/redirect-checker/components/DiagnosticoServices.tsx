'use client'

import { useTranslations } from 'next-intl'

const SERVICE_KEYS = ['step1', 'step2', 'step3'] as const

// Mock decorativo. `tkey` → ferramentas.redirectChecker.mock.metrics.<tkey>.{label,value};
// status → mock.status.<status>.
const METRICS = [
  { tkey: 'redirects', status: 'warning'  },
  { tkey: 'errors',    status: 'critical' },
  { tkey: 'loops',     status: 'ok'       },
  { tkey: 'slow',      status: 'warning'  },
  { tkey: 'sitemap',   status: 'ok'       },
]

const STATUS_COLORS = {
  ok:       { bg: 'rgba(175,215,208,0.20)', color: '#3D9688', dot: '#51A899' },
  warning:  { bg: 'rgba(247,198,100,0.15)', color: '#9A7A00', dot: '#D4A017' },
  critical: { bg: 'rgba(220,80,80,0.12)',   color: '#A83333', dot: '#C04040' },
}

export default function DiagnosticoServices() {
  const t = useTranslations('ferramentas.redirectChecker.whatWeDo')
  const tm = useTranslations('ferramentas.redirectChecker.mock')
  const SERVICES = SERVICE_KEYS.map((k) => ({
    title: t(`${k}.title`),
    body: t(`${k}.body`),
  }))

  return (
    <section id="rc-services" className="relative z-10" style={{ padding: '80px 24px' }}>
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '64px',
          alignItems: 'start',
        }}
      >
        {/* Coluna esquerda */}
        <div>
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
              marginBottom: '16px',
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
              marginBottom: '40px',
            }}
          >
            {t('body')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  className="font-chillax"
                  style={{
                    flexShrink: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--grad-site-01)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-label-ui)',
                    fontWeight: 700,
                    color: 'var(--white)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3
                    className="font-chillax"
                    style={{
                      fontSize: 'var(--text-heading-02)',
                      fontWeight: 600,
                      color: 'var(--black)',
                      marginBottom: '6px',
                      lineHeight: 'var(--leading-heading)',
                    }}
                  >
                    {s.title}
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
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita — preview do relatório */}
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--neutral-100)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <p
            className="font-synonym"
            style={{
              fontSize: 'var(--text-label-ui)',
              fontWeight: 600,
              letterSpacing: '0.10em',
              color: 'var(--neutral-400)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            {tm('previewTitle')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {METRICS.map((m) => {
              const s = STATUS_COLORS[m.status as keyof typeof STATUS_COLORS]
              return (
                <div
                  key={m.tkey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    background: s.bg,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0, display: 'inline-block' }} />
                    <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-800)' }}>
                      {tm(`metrics.${m.tkey}.label`)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span className="font-synonym" style={{ fontSize: '11px', color: 'var(--neutral-600)' }}>
                      {tm(`metrics.${m.tkey}.value`)}
                    </span>
                    <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, color: s.color }}>
                      {tm(`status.${m.status}`)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            style={{
              borderTop: '1px solid var(--neutral-100)',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {[
              { label: tm('scores.clean'), score: 825, max: 847 },
              { label: tm('scores.health'), score: 72, max: 100 },
            ].map((sc) => (
              <div key={sc.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-800)', fontWeight: 500 }}>
                    {sc.label}
                  </span>
                  <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)' }}>
                    {sc.score}/{sc.max}
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round((sc.score / sc.max) * 100)}%`,
                      background: 'var(--grad-site-01)',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
