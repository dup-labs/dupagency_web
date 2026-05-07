'use client'

import { useState } from 'react'
import { submitLead } from '../actions/submitLead'

const INPUT_CTA: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.15)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-lg)',
  color: 'var(--white)',
  outline: 'none',
  boxSizing: 'border-box',
}

function CtaForm() {
  const [domain, setDomain] = useState('')
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await submitLead(domain.trim(), email.trim())
      if (!result.ok) { setError(result.error); setLoading(false); return }
      window.dispatchEvent(new CustomEvent('rc:start', { detail: { domain: domain.trim(), email: email.trim() } }))
    } catch {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '440px', margin: '0 auto 24px' }}
    >
      <input
        type="text"
        placeholder="URL do seu site (ex: minhalojavirtual.com.br)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        required
        disabled={loading}
        style={INPUT_CTA}
      />
      <input
        type="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        autoComplete="email"
        style={INPUT_CTA}
      />
      {error && (
        <p style={{ margin: 0, fontSize: 'var(--text-label-ui)', color: 'rgba(255,180,180,0.90)', textAlign: 'center' }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px 24px',
          borderRadius: 'var(--radius-pill)',
          border: 'none',
          background: 'var(--white)',
          color: 'var(--purple-mid)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--font-size-label-ui)',
          fontWeight: 400,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: 'var(--tracking-micro)',
          textTransform: 'uppercase',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? 'Iniciando...' : 'Analisar agora →'}
      </button>
    </form>
  )
}

export default function FinalCta() {
  return (
    <section
      id="rc-final-cta"
      className="relative z-10 flex items-center justify-center"
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '80px 24px',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2
          className="font-chillax uppercase"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, var(--text-display-xl))',
            fontWeight: 700,
            lineHeight: 'var(--leading-display)',
            color: 'var(--white)',
            marginBottom: '20px',
          }}
        >
          Comece agora. É gratuito.
        </h2>

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-body)',
            color: 'rgba(255,255,255,0.80)',
            marginBottom: '40px',
          }}
        >
          Descubra em segundos se o seu sitemap está limpo ou sabotando seu SEO.
        </p>

        <CtaForm />

        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.03em',
          }}
        >
          Feito pela dup.agency · boutique de tecnologia para e-commerce
        </p>
      </div>
    </section>
  )
}
