const ITEMS = [
  'Correção de redirects, loops e URLs 404 no sitemap',
  'Desenvolvimento de novas funcionalidades para a loja',
  'Evolução contínua — agenda garantida, ritmo constante',
  'Monitoramento técnico e decisões tomadas junto com você',
]

export default function RedirectUpsell() {
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
          Resolver é só
          <br />o começo.
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
          Além de corrigir o que apareceu aqui, a gente pode ser o parceiro técnico
          da sua loja — desenvolvendo novas funcionalidades, evoluindo a operação
          e garantindo que a tecnologia nunca seja o motivo pra você não crescer.
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
          Quero resolver com a dup.agency →
        </a>
      </div>
    </div>
  )
}
