const mockResult = {
  site: 'minhaloja.com.br',
  niche: 'Moda feminina',
  keywords: ['moda feminina', 'vestidos', 'roupas online', 'loja de moda'],
  analyzedAt: '06/05/2026',
  overall_score: 58,
  top_gaps: [
    '3 H1s na mesma página — confunde crawlers e IAs sobre o tema principal',
    'Nenhum Schema implementado — Organization, FAQ e BreadcrumbList ausentes',
    '14 imagens sem alt text — invisíveis para IAs e para acessibilidade',
    'Conteúdo com 280 palavras — abaixo do mínimo para citabilidade',
  ],
}

function scoreColor(s: number) {
  if (s >= 80) return '#51A899'
  if (s >= 60) return '#897BBC'
  if (s >= 40) return '#D4A017'
  return '#C04040'
}

function scoreLabel(s: number) {
  if (s >= 80) return 'Bom'
  if (s >= 60) return 'Regular'
  if (s >= 40) return 'Atenção'
  return 'Crítico'
}

const R = 50
const CX = 64
const CY = 64
const CIRC = 2 * Math.PI * R
const score = mockResult.overall_score
const offset = CIRC * (1 - score / 100)
const color = scoreColor(score)

export default function ResultHero() {
  return (
    <section
      className="relative z-10"
      style={{ paddingTop: 'calc(64px + 56px)', paddingBottom: '80px', padding: 'calc(64px + 56px) 24px 80px' }}
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative' }}>

        {/* Breadcrumb */}
        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            color: 'var(--neutral-400)',
            letterSpacing: '0.06em',
            marginBottom: '32px',
          }}
        >
          <a href="/ferramentas/geo-audit" style={{ color: 'var(--purple-mid)', textDecoration: 'none' }}>
            GEO Audit
          </a>
          {' → '}
          Resultado
        </p>

        {/* Card principal */}
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--neutral-100)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Barra de gradiente topo */}
          <div style={{ height: '4px', background: 'var(--grad-site-01)' }} />

          <div style={{ padding: '40px 40px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>

            {/* Coluna esquerda — identidade + gaps */}
            <div>
              <span
                className="font-synonym"
                style={{
                  display: 'inline-block',
                  fontSize: 'var(--text-label-ui)',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--purple-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                Análise concluída · {mockResult.analyzedAt}
              </span>

              <h1
                className="font-chillax uppercase"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))',
                  fontWeight: 700,
                  lineHeight: 'var(--leading-display)',
                  color: 'var(--black)',
                  marginBottom: '8px',
                }}
              >
                {mockResult.site}
              </h1>

              <p
                className="font-synonym"
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--neutral-400)',
                  marginBottom: '4px',
                }}
              >
                {mockResult.niche}
              </p>

              <p
                className="font-synonym"
                style={{
                  fontSize: 'var(--text-label-ui)',
                  color: 'var(--neutral-400)',
                  marginBottom: '32px',
                  letterSpacing: '0.02em',
                }}
              >
                {mockResult.keywords.join(' · ')}
              </p>

              {/* Gaps críticos */}
              <p
                className="font-synonym"
                style={{
                  fontSize: 'var(--text-label-ui)',
                  fontWeight: 600,
                  letterSpacing: '0.10em',
                  color: 'var(--neutral-400)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                Gaps críticos identificados
              </p>

              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockResult.top_gaps.map((gap, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span
                      className="font-chillax"
                      style={{
                        flexShrink: 0,
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'rgba(200,64,64,0.10)',
                        color: '#C04040',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="font-synonym"
                      style={{
                        fontSize: 'var(--text-body-md)',
                        lineHeight: 'var(--leading-body)',
                        color: 'var(--neutral-800)',
                      }}
                    >
                      {gap}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Coluna direita — Score Dial */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <svg
                width="160"
                height="160"
                viewBox="0 0 128 128"
                fill="none"
                style={{ overflow: 'visible' }}
              >
                {/* Trilha */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  stroke="var(--neutral-100)"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Arco de progresso */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  stroke={color}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
                {/* Score */}
                <text
                  x={CX}
                  y={CY - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fontFamily="var(--font-display)"
                  fontSize="28"
                  fontWeight="700"
                >
                  {score}
                </text>
                <text
                  x={CX}
                  y={CY + 18}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--neutral-400)"
                  fontFamily="var(--font-body)"
                  fontSize="11"
                  fontWeight="500"
                >
                  /100
                </text>
              </svg>

              <div style={{ textAlign: 'center' }}>
                <span
                  className="font-synonym"
                  style={{
                    display: 'inline-block',
                    fontSize: 'var(--text-label-ui)',
                    fontWeight: 600,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color,
                    background: `${color}18`,
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 14px',
                    marginBottom: '8px',
                  }}
                >
                  {scoreLabel(score)}
                </span>
                <p
                  className="font-synonym"
                  style={{
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--neutral-600)',
                    lineHeight: 'var(--leading-body)',
                    maxWidth: '220px',
                    margin: '0 auto',
                  }}
                >
                  Score geral de GEO + SEO técnico
                </p>
              </div>

              {/* Mini métricas rápidas */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--neutral-50)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  { label: 'SEO Técnico',    score: 48 },
                  { label: 'GEO Readiness',  score: 34 },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-800)', fontWeight: 500 }}>
                        {m.label}
                      </span>
                      <span className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)' }}>
                        {m.score}/100
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${m.score}%`,
                          background: scoreColor(m.score),
                          borderRadius: 'var(--radius-pill)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
