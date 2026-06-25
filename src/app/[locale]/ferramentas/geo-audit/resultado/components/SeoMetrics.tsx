import { useTranslations } from 'next-intl'

type Status = 'ok' | 'warn' | 'fail'

// `labelKey` aponta para mockDemo.seoRowLabels.*
// `value` é uma string já pronta para renderizar (números/termos universais)
// ou uma chave de mockDemo.seoValues.* (com {n} quando aplicável)
interface Metric {
  labelKey: string
  value: string
  status: Status
}

const STATUS_CONFIG: Record<Status, { bg: string; color: string; dot: string }> = {
  ok:   { bg: 'rgba(175,215,208,0.18)', color: '#51A899',  dot: '#51A899' },
  warn: { bg: 'rgba(212,160,23,0.12)',  color: '#9A7A00',  dot: '#D4A017' },
  fail: { bg: 'rgba(192,64,64,0.10)',   color: '#A83333',  dot: '#C04040' },
}

interface Group {
  titleKey: string
  rows: Metric[]
}

const GROUPS: Group[] = [
  {
    titleKey: 'seoSection.metaTags',
    rows: [
      { labelKey: 'titleTag',        value: 'chars:38',  status: 'warn' },
      { labelKey: 'metaDescription', value: 'chars:195', status: 'fail' },
      { labelKey: 'ogTitle',         value: 'chars:35',  status: 'warn' },
      { labelKey: 'ogDescription',   value: 'chars:88',  status: 'warn' },
    ],
  },
  {
    titleKey: 'seoSection.headings',
    rows: [
      { labelKey: 'h1Unico',    value: 'encontrados:3', status: 'fail' },
      { labelKey: 'h1Length',   value: 'chars:82',      status: 'warn' },
      { labelKey: 'keywordH1',  value: 'nao',           status: 'fail' },
      { labelKey: 'hierarquia', value: 'irregular',     status: 'fail' },
    ],
  },
  {
    titleKey: 'seoSection.conteudo',
    rows: [
      { labelKey: 'wordCount',      value: 'words:280',      status: 'fail' },
      { labelKey: 'paragrafos',     value: 'charsApprox:380', status: 'warn' },
      { labelKey: 'estruturaFaq',   value: 'ausente',        status: 'fail' },
      { labelKey: 'keywordDensity', value: '0.4%',           status: 'fail' },
    ],
  },
  {
    titleKey: 'seoSection.imagens',
    rows: [
      { labelKey: 'altPresente',   value: '4/18', status: 'fail' },
      { labelKey: 'altDescritivo', value: '2/4',  status: 'warn' },
    ],
  },
  {
    titleKey: 'seoSection.schemaMarkup',
    rows: [
      { labelKey: 'organization',   value: 'ausente', status: 'fail' },
      { labelKey: 'faqSchema',      value: 'ausente', status: 'fail' },
      { labelKey: 'breadcrumbList', value: 'ausente', status: 'fail' },
    ],
  },
  {
    titleKey: 'mockDemo.seoGroups.links',
    rows: [
      { labelKey: 'linksInternos',  value: '6', status: 'warn' },
      { labelKey: 'linksExternos',  value: '0', status: 'warn' },
      { labelKey: 'linksQuebrados', value: '3', status: 'fail' },
    ],
  },
]

const STATUS_LABEL_KEY: Record<Status, 'ok' | 'atencao' | 'critico'> = {
  ok: 'ok',
  warn: 'atencao',
  fail: 'critico',
}

function Badge({ status }: { status: Status }) {
  const t = useTranslations('ferramentas.geoAudit.resultado.status')
  const s = STATUS_CONFIG[status]
  return (
    <span
      className="font-synonym"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: 'var(--text-label-ui)',
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        borderRadius: 'var(--radius-pill)',
        padding: '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
      {t(STATUS_LABEL_KEY[status])}
    </span>
  )
}

// Resolve `row.value` para texto final.
// Formatos com `:` carregam um número (ex.: "chars:38"); os demais são
// chaves diretas de mockDemo.seoValues.* ou literais já prontos (ex.: "4/18").
function resolveValue(value: string, tm: (k: string, v?: Record<string, string | number | Date>) => string): string {
  const KEYS_WITH_N = ['chars', 'words', 'charsApprox'] as const
  const KEYS_PLAIN = ['nao', 'sim', 'irregular', 'sequencial', 'ausente', 'presente'] as const

  const sep = value.indexOf(':')
  if (sep !== -1) {
    const key = value.slice(0, sep)
    const n = Number(value.slice(sep + 1))
    if ((KEYS_WITH_N as readonly string[]).includes(key)) {
      return tm(`seoValues.${key}`, { n })
    }
  }
  if ((KEYS_PLAIN as readonly string[]).includes(value)) {
    return tm(`seoValues.${value}`)
  }
  return value
}

function MetricGroup({
  title,
  rows,
  tm,
}: {
  title: string
  rows: Metric[]
  tm: (k: string, v?: Record<string, string | number | Date>) => string
}) {
  return (
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
      <div
        style={{
          background: 'var(--grad-site-01)',
          padding: '12px 20px',
        }}
      >
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
          {title}
        </span>
      </div>

      {/* Rows */}
      <div>
        {rows.map((row, i) => (
          <div
            key={row.labelKey}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderTop: i > 0 ? '1px solid var(--neutral-100)' : 'none',
            }}
          >
            <span
              className="font-synonym"
              style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-800)' }}
            >
              {tm(`seoRowLabels.${row.labelKey}`)}
            </span>
            <span
              className="font-synonym"
              style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', textAlign: 'right' }}
            >
              {resolveValue(row.value, tm)}
            </span>
            <Badge status={row.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SeoMetrics() {
  const t = useTranslations('ferramentas.geoAudit.resultado')
  const tm = useTranslations('ferramentas.geoAudit.mockDemo')
  return (
    <section id="seo" className="relative z-10" style={{ padding: '0 24px 80px', scrollMarginTop: '120px' }}>
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
          {t('seoTecnico')}
        </p>

        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--black)',
            marginBottom: '40px',
          }}
        >
          {tm('seoHeadline')}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {GROUPS.map((g) => {
            // titleKey "mockDemo.*" vem do namespace mockDemo; o restante de resultado.*
            const title = g.titleKey.startsWith('mockDemo.')
              ? tm(g.titleKey.slice('mockDemo.'.length))
              : t(g.titleKey)
            return (
              <MetricGroup
                key={g.titleKey}
                title={title}
                rows={g.rows}
                tm={tm}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
