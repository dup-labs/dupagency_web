import { useTranslations } from 'next-intl'

const GEO_CATEGORIES = [
  { categoryKey: 'clareza',      score: 5 },
  { categoryKey: 'citabilidade', score: 3 },
  { categoryKey: 'respostas',    score: 2 },
  { categoryKey: 'autoridade',   score: 4 },
  { categoryKey: 'estrutura',    score: 3 },
] as const

function barColor(s: number) {
  if (s >= 7) return '#51A899'
  if (s >= 5) return '#897BBC'
  return '#D4A017'
}

export default function GeoReadiness() {
  const t = useTranslations('ferramentas.geoAudit.resultado')
  const tm = useTranslations('ferramentas.geoAudit.mockDemo')
  return (
    <section id="geo" className="relative z-10" style={{ padding: '0 24px 80px', scrollMarginTop: '120px' }}>
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
          {t('geoReadiness')}
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
          {t('geoSection.headline')}
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
          {tm('geoIntro')}
        </p>

        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--neutral-100)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Header */}
          <div style={{ background: 'var(--grad-site-01)', padding: '12px 28px' }}>
            <span
              className="font-synonym"
              style={{
                fontSize: 'var(--text-label-ui)',
                fontWeight: 600,
                letterSpacing: '0.10em',
                color: 'rgba(255,255,255,0.90)',
                textTransform: 'uppercase',
              }}
            >
              {t('geoSection.scoreTitle')}
            </span>
          </div>

          <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {GEO_CATEGORIES.map((c, i) => {
              const color = barColor(c.score)
              return (
                <div key={c.categoryKey} style={{ borderTop: i > 0 ? '1px solid var(--neutral-100)' : 'none', paddingTop: i > 0 ? '28px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span
                      className="font-synonym"
                      style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--neutral-800)' }}
                    >
                      {t(`geoSection.categories.${c.categoryKey}`)}
                    </span>
                    <span
                      className="font-chillax"
                      style={{ fontSize: 'var(--text-heading-02)', fontWeight: 700, color }}
                    >
                      {c.score}<span style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-400)', fontWeight: 400 }}>/10</span>
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', overflow: 'hidden', marginBottom: '8px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${c.score * 10}%`,
                        background: color,
                        borderRadius: 'var(--radius-pill)',
                      }}
                    />
                  </div>
                  <p
                    className="font-synonym"
                    style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', lineHeight: 'var(--leading-body)', margin: 0 }}
                  >
                    {tm(`geoObs.${c.categoryKey}`)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Nota */}
          <div
            style={{
              borderTop: '1px solid var(--neutral-100)',
              padding: '16px 28px',
              background: 'var(--neutral-50)',
            }}
          >
            <p
              className="font-synonym"
              style={{
                fontSize: 'var(--text-label-ui)',
                color: 'var(--neutral-400)',
                lineHeight: 'var(--leading-body)',
                margin: 0,
              }}
            >
              {tm.rich('geoNote', { em: (chunks) => <em>{chunks}</em> })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
