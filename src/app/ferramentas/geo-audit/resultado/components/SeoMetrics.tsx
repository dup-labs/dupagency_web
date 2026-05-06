type Status = 'ok' | 'warn' | 'fail'

interface Metric {
  label: string
  value: string
  ideal: string
  status: Status
}

const STATUS_CONFIG: Record<Status, { bg: string; color: string; dot: string; label: string }> = {
  ok:   { bg: 'rgba(175,215,208,0.18)', color: '#51A899',  dot: '#51A899',  label: 'OK' },
  warn: { bg: 'rgba(212,160,23,0.12)',  color: '#9A7A00',  dot: '#D4A017',  label: 'Atenção' },
  fail: { bg: 'rgba(192,64,64,0.10)',   color: '#A83333',  dot: '#C04040',  label: 'Crítico' },
}

const GROUPS: { title: string; rows: Metric[] }[] = [
  {
    title: 'Meta Tags',
    rows: [
      { label: 'Title Tag',        value: '38 chars',  ideal: '50–60',   status: 'warn' },
      { label: 'Meta Description', value: '195 chars', ideal: '150–160', status: 'fail' },
      { label: 'OG Title',         value: '35 chars',  ideal: '40–60',   status: 'warn' },
      { label: 'OG Description',   value: '88 chars',  ideal: '100–200', status: 'warn' },
    ],
  },
  {
    title: 'Headings',
    rows: [
      { label: 'H1 único',      value: '3 encontrados', ideal: '1',          status: 'fail' },
      { label: 'H1 Length',     value: '82 chars',      ideal: '20–70',      status: 'warn' },
      { label: 'Keyword no H1', value: 'Não',           ideal: 'Sim',        status: 'fail' },
      { label: 'Hierarquia',    value: 'Irregular',     ideal: 'Sequencial', status: 'fail' },
    ],
  },
  {
    title: 'Conteúdo',
    rows: [
      { label: 'Word Count',      value: '280 words',  ideal: '600+',     status: 'fail' },
      { label: 'Parágrafos',      value: '~380 chars', ideal: '<300',     status: 'warn' },
      { label: 'Estrutura FAQ',   value: 'Ausente',    ideal: 'Presente', status: 'fail' },
      { label: 'Keyword Density', value: '0.4%',       ideal: '1–2%',     status: 'fail' },
    ],
  },
  {
    title: 'Imagens',
    rows: [
      { label: 'Alt Text presente',   value: '4/18', ideal: '18/18', status: 'fail' },
      { label: 'Alt Text descritivo', value: '2/4',  ideal: '4/4',   status: 'warn' },
    ],
  },
  {
    title: 'Schema Markup',
    rows: [
      { label: 'Organization',   value: 'Ausente', ideal: 'Presente', status: 'fail' },
      { label: 'FAQ Schema',     value: 'Ausente', ideal: 'Presente', status: 'fail' },
      { label: 'BreadcrumbList', value: 'Ausente', ideal: 'Presente', status: 'fail' },
    ],
  },
  {
    title: 'Links',
    rows: [
      { label: 'Links internos',  value: '6', ideal: '—', status: 'warn' },
      { label: 'Links externos',  value: '0', ideal: '—', status: 'warn' },
      { label: 'Links quebrados', value: '3', ideal: '0', status: 'fail' },
    ],
  },
]

function Badge({ status }: { status: Status }) {
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
      {s.label}
    </span>
  )
}

function MetricGroup({ title, rows }: { title: string; rows: Metric[] }) {
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
            key={row.label}
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
              {row.label}
            </span>
            <span
              className="font-synonym"
              style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', textAlign: 'right' }}
            >
              {row.value}
            </span>
            <Badge status={row.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SeoMetrics() {
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
          SEO Técnico
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
          17 pontos técnicos analisados
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {GROUPS.map((g) => (
            <MetricGroup key={g.title} title={g.title} rows={g.rows} />
          ))}
        </div>
      </div>
    </section>
  )
}
