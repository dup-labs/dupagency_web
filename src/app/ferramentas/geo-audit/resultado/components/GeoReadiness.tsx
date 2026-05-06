const GEO_CATEGORIES = [
  { category: 'Clareza de Marca',      score: 5, obs: 'Proposta de valor vaga, sem definição direta do que a marca vende' },
  { category: 'Citabilidade',          score: 3, obs: 'Sem dados concretos, estatísticas ou afirmações que IAs possam extrair' },
  { category: 'Respostas Diretas',     score: 2, obs: 'Nenhuma estrutura de FAQ ou Q&A detectada' },
  { category: 'Sinais de Autoridade',  score: 4, obs: 'Sem menção a clientes, cases, prêmios ou credenciais' },
  { category: 'Estrutura Técnica GEO', score: 3, obs: 'Schema ausente, meta tags genéricas, headings sem foco em resposta' },
]

function barColor(s: number) {
  if (s >= 7) return '#51A899'
  if (s >= 5) return '#897BBC'
  return '#D4A017'
}

export default function GeoReadiness() {
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
          GEO Readiness
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
          5 categorias de presença nas IAs
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
          O GEO Readiness avalia o potencial do seu site de ser citado por modelos de linguagem.
          Cada categoria vale até 10 pontos.
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
              GEO Readiness Score
            </span>
          </div>

          <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {GEO_CATEGORIES.map((c, i) => {
              const color = barColor(c.score)
              return (
                <div key={c.category} style={{ borderTop: i > 0 ? '1px solid var(--neutral-100)' : 'none', paddingTop: i > 0 ? '28px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span
                      className="font-synonym"
                      style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--neutral-800)' }}
                    >
                      {c.category}
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
                    {c.obs}
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
              Este score avalia o <em>potencial estrutural</em> do site. O GEO Checker verifica
              se você já aparece de fato nas respostas reais do ChatGPT, Gemini e Perplexity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
