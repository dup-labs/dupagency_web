import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { GeoAuditResult } from '../../actions/analyzeAndDeliver'
import Footer from '@/components/sections/Footer'
import CheckerUpsell from '../../components/CheckerUpsell'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>
}): Promise<Metadata> {
  const { hash } = await params
  const { data } = await supabase
    .from('geo_audits')
    .select('result_data')
    .eq('hash', hash)
    .single()
  const r = data?.result_data as GeoAuditResult | null
  return {
    title: r
      ? `GEO Audit — ${r.domain} — Score ${r.overall_score}/100 | dup.agency`
      : 'GEO Audit | dup.agency',
    robots: { index: false, follow: false },
  }
}

// ---------- sub-components ----------

function scoreColor(s: number) {
  if (s >= 70) return '#51A899'
  if (s >= 50) return '#897BBC'
  if (s >= 35) return '#D4A017'
  return '#C04040'
}

function barColor(s: number) {
  if (s >= 7) return '#51A899'
  if (s >= 5) return '#897BBC'
  return '#D4A017'
}

type Priority = 'alta' | 'média' | 'baixa'
const PRIORITY_CONFIG: Record<Priority, { bg: string; color: string; dot: string; label: string }> = {
  alta:  { bg: 'rgba(192,64,64,0.10)',  color: '#A83333', dot: '#C04040', label: 'Alta' },
  média: { bg: 'rgba(212,160,23,0.12)', color: '#9A7A00', dot: '#D4A017', label: 'Média' },
  baixa: { bg: 'rgba(81,168,153,0.15)', color: '#51A899', dot: '#51A899', label: 'Baixa' },
}

function ResultHero({ result }: { result: GeoAuditResult }) {
  const overall = result.overall_score
  const r = 50
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - overall / 100)
  const col = scoreColor(overall)

  return (
    <section
      className="relative z-10"
      style={{
        paddingTop: 'calc(64px + 48px)',
        paddingBottom: '48px',
        padding: 'calc(64px + 48px) 24px 48px',
        background: 'var(--white)',
      }}
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            color: 'var(--neutral-400)',
            marginBottom: '32px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <a href="/ferramentas/geo-audit" style={{ color: 'var(--neutral-400)', textDecoration: 'none' }}>GEO Audit</a>
          <span>›</span>
          <span style={{ color: 'var(--neutral-600)' }}>Resultado</span>
        </p>

        {/* Card principal */}
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--neutral-100)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Barra de gradiente no topo */}
          <div style={{ height: '4px', background: 'var(--grad-site-01)' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              padding: '32px 36px',
            }}
          >
            {/* Dial + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r={r} fill="none" stroke="var(--neutral-100)" strokeWidth="10" />
                <circle
                  cx="64" cy="64" r={r} fill="none"
                  stroke={col} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  transform="rotate(-90 64 64)"
                />
                <text x="64" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="700" fill={col}>{overall}</text>
                <text x="64" y="78" textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#999">/100</text>
              </svg>
              <div>
                <p
                  className="font-synonym"
                  style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-400)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  Score geral
                </p>
                <p
                  className="font-chillax"
                  style={{ fontSize: 'var(--text-heading-02)', fontWeight: 700, color: 'var(--black)', marginBottom: '4px', wordBreak: 'break-all' }}
                >
                  {result.domain}
                </p>
                <p className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {result.company_name}
                </p>
              </div>
            </div>

            {/* Sub-scores */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              {[
                { label: 'SEO Técnico', score: result.seo_score },
                { label: 'GEO Readiness', score: result.geo_score },
              ].map(({ label, score }) => {
                const c = scoreColor(score)
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-800)' }}>{label}</span>
                      <span className="font-chillax" style={{ fontSize: 'var(--text-body-md)', fontWeight: 700, color: c }}>{score}</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${score}%`, background: c, borderRadius: 'var(--radius-pill)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TabNav() {
  const TABS = [
    { href: '#seo', label: 'SEO Técnico' },
    { href: '#geo', label: 'GEO Readiness' },
    { href: '#plano', label: 'Plano de Ação' },
  ]
  return (
    <nav
      className="sticky top-16 z-40"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 16px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="font-synonym"
            style={{
              display: 'inline-block',
              padding: '14px 16px',
              fontSize: 'var(--text-body-md)',
              fontWeight: 500,
              color: 'var(--neutral-600)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              borderBottom: '2px solid transparent',
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

function SeoMetrics({ result }: { result: GeoAuditResult }) {
  const seo = result.seo
  const groups = [
    {
      label: 'Meta Tags',
      rows: [
        { label: 'Title', value: seo.title || '—', badge: seo.title_length > 0 && seo.title_length <= 60 ? { text: 'OK', ok: true } : { text: `${seo.title_length} chars`, ok: false } },
        { label: 'Description', value: seo.description || '—', badge: seo.description_length > 0 && seo.description_length <= 160 ? { text: 'OK', ok: true } : { text: `${seo.description_length} chars`, ok: false } },
        { label: 'OG Image', value: seo.og_image ? 'Presente' : 'Ausente', badge: { text: seo.og_image ? 'OK' : 'Faltando', ok: !!seo.og_image } },
        { label: 'Canonical', value: seo.canonical || 'Não definido', badge: { text: seo.canonical ? 'OK' : 'Faltando', ok: !!seo.canonical } },
      ],
    },
    {
      label: 'Headings',
      rows: [
        { label: 'H1', value: `${seo.h1_count} encontrado${seo.h1_count !== 1 ? 's' : ''}${seo.h1_texts[0] ? ` — "${seo.h1_texts[0].slice(0, 60)}"` : ''}`, badge: seo.h1_count === 1 ? { text: 'OK', ok: true } : { text: seo.h1_count === 0 ? 'Ausente' : 'Múltiplos', ok: false } },
        { label: 'H2', value: `${seo.h2_count} encontrado${seo.h2_count !== 1 ? 's' : ''}`, badge: seo.h2_count >= 2 ? { text: 'OK', ok: true } : { text: 'Poucos', ok: false } },
      ],
    },
    {
      label: 'Conteúdo',
      rows: [
        { label: 'Palavras estimadas', value: `~${seo.word_count.toLocaleString('pt-BR')}`, badge: seo.word_count >= 600 ? { text: 'OK', ok: true } : { text: 'Raso', ok: false } },
      ],
    },
    {
      label: 'Imagens',
      rows: [
        { label: 'Total de imagens', value: String(seo.images_total), badge: { text: String(seo.images_total), ok: true } },
        { label: 'Sem alt text', value: `${seo.images_missing_alt} imagem${seo.images_missing_alt !== 1 ? 's' : ''}`, badge: seo.images_missing_alt === 0 ? { text: 'OK', ok: true } : { text: String(seo.images_missing_alt), ok: false } },
      ],
    },
    {
      label: 'Schema Markup',
      rows: [
        { label: 'Tipos encontrados', value: seo.schema_types.length > 0 ? seo.schema_types.join(', ') : 'Nenhum', badge: seo.schema_types.length > 0 ? { text: 'Presente', ok: true } : { text: 'Ausente', ok: false } },
        { label: 'Organization', value: seo.has_organization_schema ? 'Implementado' : 'Não encontrado', badge: { text: seo.has_organization_schema ? 'OK' : 'Faltando', ok: seo.has_organization_schema } },
        { label: 'FAQ Schema', value: seo.has_faq_schema ? 'Implementado' : 'Não encontrado', badge: { text: seo.has_faq_schema ? 'OK' : 'Faltando', ok: seo.has_faq_schema } },
      ],
    },
  ]

  return (
    <section id="seo" className="relative z-10" style={{ padding: '0 24px 80px', scrollMarginTop: '120px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <p className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--purple-mid)', textTransform: 'uppercase', marginBottom: '16px' }}>SEO Técnico</p>
        <h2 className="font-chillax uppercase" style={{ fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))', fontWeight: 700, lineHeight: 'var(--leading-display)', color: 'var(--black)', marginBottom: '12px' }}>Análise da estrutura</h2>
        <p className="font-synonym" style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--leading-body)', color: 'var(--neutral-600)', marginBottom: '40px' }}>Score SEO: <strong style={{ color: scoreColor(result.seo_score) }}>{result.seo_score}/100</strong></p>

        <div style={{ background: 'var(--white)', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {groups.map((group, gi) => (
            <div key={group.label}>
              <div style={{ background: 'var(--grad-site-01)', padding: '10px 28px' }}>
                <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.90)', textTransform: 'uppercase' }}>{group.label}</span>
              </div>
              {group.rows.map((row, ri) => (
                <div key={ri} className="seo-row" style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: '8px 16px', alignItems: 'start', padding: '14px 28px', borderTop: '1px solid var(--neutral-100)' }}>
                  <span className="seo-row-label font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-400)', paddingTop: '1px' }}>{row.label}</span>
                  <span className="seo-row-value font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-800)', lineHeight: 'var(--leading-body)', wordBreak: 'break-word' }}>{row.value}</span>
                  <span className="seo-row-badge font-synonym" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: row.badge.ok ? 'rgba(81,168,153,0.12)' : 'rgba(192,64,64,0.10)', color: row.badge.ok ? '#51A899' : '#A83333' }}>{row.badge.text}</span>
                </div>
              ))}
              {gi < groups.length - 1 && <div style={{ height: '8px', background: 'var(--neutral-50)', borderTop: '1px solid var(--neutral-100)' }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GeoSection({ result }: { result: GeoAuditResult }) {
  const geo = result.geo
  const categories = [
    { label: 'Clareza de Marca',      data: geo.brand_clarity },
    { label: 'Citabilidade',          data: geo.citability },
    { label: 'Respostas Diretas',     data: geo.direct_answers },
    { label: 'Sinais de Autoridade',  data: geo.authority_signals },
    { label: 'Estrutura Técnica GEO', data: geo.technical_structure },
  ]

  return (
    <section id="geo" className="relative z-10" style={{ padding: '0 24px 80px', scrollMarginTop: '120px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <p className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--purple-mid)', textTransform: 'uppercase', marginBottom: '16px' }}>GEO Readiness</p>
        <h2 className="font-chillax uppercase" style={{ fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))', fontWeight: 700, lineHeight: 'var(--leading-display)', color: 'var(--black)', marginBottom: '12px' }}>5 categorias de presença nas IAs</h2>
        <p className="font-synonym" style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--leading-body)', color: 'var(--neutral-600)', marginBottom: '40px' }}>Score GEO: <strong style={{ color: scoreColor(result.geo_score) }}>{result.geo_score}/100</strong></p>

        <div style={{ background: 'var(--white)', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ background: 'var(--grad-site-01)', padding: '12px 28px' }}>
            <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.90)', textTransform: 'uppercase' }}>GEO Readiness Score</span>
          </div>
          <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {categories.map(({ label, data }, i) => {
              const col = barColor(data.score)
              return (
                <div key={label} style={{ borderTop: i > 0 ? '1px solid var(--neutral-100)' : 'none', paddingTop: i > 0 ? '28px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--neutral-800)' }}>{label}</span>
                    <span className="font-chillax" style={{ fontSize: 'var(--text-heading-02)', fontWeight: 700, color: col }}>
                      {data.score}<span style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-400)', fontWeight: 400 }}>/10</span>
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${data.score * 10}%`, background: col, borderRadius: 'var(--radius-pill)' }} />
                  </div>
                  <p className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', lineHeight: 'var(--leading-body)', margin: 0 }}>{data.obs}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function ActionPlanSection({ result }: { result: GeoAuditResult }) {
  const ORDER: Priority[] = ['alta', 'média', 'baixa']

  return (
    <section id="plano" className="relative z-10" style={{ padding: '0 24px 80px', scrollMarginTop: '120px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <p className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--purple-mid)', textTransform: 'uppercase', marginBottom: '16px' }}>Plano de ação</p>
        <h2 className="font-chillax uppercase" style={{ fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))', fontWeight: 700, lineHeight: 'var(--leading-display)', color: 'var(--black)', marginBottom: '12px' }}>O que fazer agora</h2>
        <p className="font-synonym" style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--leading-body)', color: 'var(--neutral-600)', marginBottom: '40px' }}>Ordenado por impacto. Comece pelas prioridades altas.</p>

        <div style={{ background: 'var(--white)', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ background: 'var(--grad-site-01)', padding: '12px 28px' }}>
            <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.90)', textTransform: 'uppercase' }}>{result.action_plan.length} recomendações</span>
          </div>
          {ORDER.map((priority) => {
            const items = result.action_plan.filter((r) => r.priority === priority)
            if (!items.length) return null
            const p = PRIORITY_CONFIG[priority]
            return (
              <div key={priority}>
                <div style={{ padding: '10px 28px', background: p.bg, display: 'flex', alignItems: 'center', gap: '8px', borderTop: priority !== 'alta' ? '1px solid var(--neutral-100)' : 'none' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.dot, display: 'inline-block', flexShrink: 0 }} />
                  <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.color }}>Prioridade {p.label}</span>
                </div>
                {items.map((rec, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'start', padding: '16px 28px', borderTop: '1px solid var(--neutral-100)' }}>
                    <span className="action-pill font-synonym" style={{ fontSize: 'var(--text-label-ui)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--neutral-400)', background: 'var(--neutral-100)', borderRadius: 'var(--radius-pill)', padding: '3px 10px', whiteSpace: 'nowrap', marginTop: '1px', display: 'inline-block' }}>{rec.category}</span>
                    <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', lineHeight: 'var(--leading-body)', color: 'var(--neutral-800)' }}>{rec.action}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ---------- page ----------

export default async function ResultadoHashPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await params

  if (!hash || !/^[0-9a-f]{32}$/.test(hash)) notFound()

  const { data, error } = await supabase
    .from('geo_audits')
    .select('status, result_data')
    .eq('hash', hash)
    .single()

  if (error || !data) notFound()

  if (data.status === 'pending' || data.status === 'analyzing') {
    redirect(`/ferramentas/geo-audit/analisando/${hash}`)
  }

  if (data.status === 'error' || !data.result_data) {
    redirect('/ferramentas/geo-audit?erro=analise-falhou')
  }

  const result = data.result_data as GeoAuditResult

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }

        /* Nav com blur — igual à página /ferramentas/geo-audit */
        nav:has(a[href="#manifesto"]) {
          background: rgba(255,255,255,0.85) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border-bottom: 1px solid rgba(0,0,0,0.06) !important;
        }

        /* Mobile: grid de métricas SEO empilha */
        @media (max-width: 600px) {
          .seo-row {
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto !important;
          }
          .seo-row-label {
            grid-column: 1;
            grid-row: 1;
          }
          .seo-row-badge {
            grid-column: 2;
            grid-row: 1;
          }
          .seo-row-value {
            grid-column: 1 / -1;
            grid-row: 2;
            color: var(--neutral-600) !important;
          }
          .action-pill {
            white-space: normal !important;
            max-width: 120px;
          }
        }
      `}</style>

      <ResultHero result={result} />
      <TabNav />
      <SeoMetrics result={result} />
      <GeoSection result={result} />
      <ActionPlanSection result={result} />
      <CheckerUpsell />
      <Footer />
    </>
  )
}
