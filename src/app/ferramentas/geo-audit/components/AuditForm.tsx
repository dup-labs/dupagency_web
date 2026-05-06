'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitAudit } from '../actions/submitAudit'

interface Props {
  variant: 'hero' | 'cta'
}

const INPUT_STYLE_HERO = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--neutral-200)',
  background: 'var(--white)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-lg)',
  color: 'var(--black)',
  outline: 'none',
}

const INPUT_STYLE_CTA = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.15)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-lg)',
  color: 'var(--white)',
  outline: 'none',
}

export default function AuditForm({ variant }: Props) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCta = variant === 'cta'
  const inputStyle = isCta ? INPUT_STYLE_CTA : INPUT_STYLE_HERO

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const result = await submitAudit(url.trim(), email.trim())
      if (!result.ok) {
        setError(result.error)
        setLoading(false)
        return
      }
      router.push(`/ferramentas/geo-audit/analisando/${result.hash}`)
    } catch {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: isCta ? '440px' : '480px',
        margin: '0 auto 24px',
      }}
    >
      <input
        type="text"
        inputMode="url"
        placeholder="URL do seu site (ex: minhalojavirtual.com.br)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        disabled={loading}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        style={inputStyle}
      />

      {error && (
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-label-ui)',
            color: isCta ? 'rgba(255,180,180,0.90)' : '#C04040',
            textAlign: 'center',
          }}
        >
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
          background: isCta ? 'var(--white)' : 'var(--grad-site-01)',
          color: isCta ? 'var(--purple-mid)' : 'var(--white)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-lg)',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.02em',
          boxShadow: isCta ? '0 4px 20px rgba(0,0,0,0.15)' : 'var(--shadow-brand)',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? 'Enviando...' : 'Analisar agora →'}
      </button>
    </form>
  )
}
