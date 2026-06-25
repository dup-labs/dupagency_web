import { useTranslations } from 'next-intl'

type Priority = 'alta' | 'média' | 'baixa'

interface Rec {
  priority: Priority
  // `key` resolve mockDemo.planCategories.<key> e mockDemo.planActions.<key>
  key: string
}

const RECOMMENDATIONS: Rec[] = [
  { priority: 'alta',  key: 'headings' },
  { priority: 'alta',  key: 'schema' },
  { priority: 'alta',  key: 'imagens' },
  { priority: 'alta',  key: 'conteudo' },
  { priority: 'média', key: 'metaTags' },
  { priority: 'média', key: 'faq' },
  { priority: 'média', key: 'geo' },
  { priority: 'baixa', key: 'links' },
]

const PRIORITY_CONFIG: Record<Priority, { bg: string; color: string; dot: string; label: string }> = {
  alta:  { bg: 'rgba(192,64,64,0.10)',  color: '#A83333', dot: '#C04040', label: 'Alta' },
  média: { bg: 'rgba(212,160,23,0.12)', color: '#9A7A00', dot: '#D4A017', label: 'Média' },
  baixa: { bg: 'rgba(81,168,153,0.15)', color: '#51A899', dot: '#51A899', label: 'Baixa' },
}

const ORDER: Priority[] = ['alta', 'média', 'baixa']

const PRIORITY_LABEL_KEY: Record<Priority, 'prioridadeAlta' | 'prioridadeMedia' | 'prioridadeBaixa'> = {
  alta:  'prioridadeAlta',
  média: 'prioridadeMedia',
  baixa: 'prioridadeBaixa',
}

export default function ActionPlan() {
  const t = useTranslations('ferramentas.geoAudit.resultado')
  const tm = useTranslations('ferramentas.geoAudit.mockDemo')
  return (
    <section id="plano" className="relative z-10" style={{ padding: '0 24px 80px', scrollMarginTop: '120px' }}>
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
          {t('tabs.plano')}
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
          {t('planoSection.headline')}
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
          {t('planoSection.subheadline')}
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
              {t('planoSection.recomendacoesLabel', { n: RECOMMENDATIONS.length })}
            </span>
          </div>

          <div>
            {ORDER.map((priority) => {
              const items = RECOMMENDATIONS.filter((r) => r.priority === priority)
              if (!items.length) return null
              const p = PRIORITY_CONFIG[priority]
              return (
                <div key={priority}>
                  {/* Separador de grupo */}
                  <div
                    style={{
                      padding: '10px 28px',
                      background: p.bg,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderTop: priority !== 'alta' ? '1px solid var(--neutral-100)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: p.dot,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-synonym"
                      style={{
                        fontSize: 'var(--text-label-ui)',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: p.color,
                      }}
                    >
                      {t(`planoSection.${PRIORITY_LABEL_KEY[priority]}`)}
                    </span>
                  </div>

                  {items.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: '16px',
                        alignItems: 'start',
                        padding: '16px 28px',
                        borderTop: '1px solid var(--neutral-100)',
                      }}
                    >
                      <span
                        className="font-synonym"
                        style={{
                          fontSize: 'var(--text-label-ui)',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--neutral-400)',
                          background: 'var(--neutral-100)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '3px 10px',
                          whiteSpace: 'nowrap',
                          marginTop: '1px',
                        }}
                      >
                        {tm(`planCategories.${rec.key}`)}
                      </span>
                      <span
                        className="font-synonym"
                        style={{
                          fontSize: 'var(--text-body-md)',
                          lineHeight: 'var(--leading-body)',
                          color: 'var(--neutral-800)',
                        }}
                      >
                        {tm(`planActions.${rec.key}`)}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
