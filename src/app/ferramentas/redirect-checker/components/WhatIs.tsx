const CARDS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="url(#rc-grad-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="rc-grad-1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Redirects desnecessários',
    body: 'Cada redirect é uma instrução extra pro Google. Cadeias longas diluem PageRank e aumentam o tempo de resposta.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="url(#rc-grad-2)" strokeWidth="1.5" />
        <path d="M12 8v4M12 16h.01" stroke="url(#rc-grad-2)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="rc-grad-2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Erros 404',
    body: 'URLs mortas no sitemap confundem o crawler e indicam descuido técnico para os buscadores.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 7l-10 10M7 7h10v10" stroke="url(#rc-grad-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="rc-grad-3" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Loops de redirecionamento',
    body: 'Quando A aponta pra B e B aponta pra A, o crawler desiste. Sua página some do índice.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="url(#rc-grad-4)" strokeWidth="1.5" />
        <path d="M12 8v4l3 3" stroke="url(#rc-grad-4)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="rc-grad-4" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFD7D0" /><stop offset="1" stopColor="#897BBC" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'URLs lentas',
    body: 'Páginas acima de 3s no TTFB são despriorizadas no crawl. Velocidade é critério de indexação.',
  },
]

export default function WhatIs() {
  return (
    <section id="rc-what-is" className="relative z-10" style={{ padding: '80px 24px' }}>
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
          Saúde do Sitemap
        </p>

        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, var(--text-display-lg))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--black)',
            maxWidth: '640px',
            marginBottom: '20px',
          }}
        >
          Seu sitemap tem erros que o Google já está penalizando.
        </h2>

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-body)',
            color: 'var(--neutral-600)',
            maxWidth: '680px',
            marginBottom: '56px',
          }}
        >
          Um sitemap com redirects desnecessários, URLs retornando 404, loops de redirecionamento ou páginas lentas polui o índice do Google e desperdiça crawl budget — sem que você perceba.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              style={{
                background: 'var(--neutral-50)',
                border: '1px solid var(--neutral-100)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>{card.icon}</div>
              <h3
                className="font-chillax"
                style={{
                  fontSize: 'var(--text-heading-02)',
                  fontWeight: 600,
                  color: 'var(--black)',
                  marginBottom: '10px',
                  lineHeight: 'var(--leading-heading)',
                }}
              >
                {card.title}
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
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
