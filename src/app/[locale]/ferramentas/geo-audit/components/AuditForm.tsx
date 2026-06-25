'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
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

function AuditFormInner({ variant }: Props) {
  const t = useTranslations('ferramentas.geoAudit')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const erro = searchParams.get('erro')
    if (erro) {
      setError(erro === 'analise-falhou' ? t('form.errorAnalise') : t('form.errorGenerico'))
    }
  }, [searchParams, t])

  const isCta = variant === 'cta'
  const inputStyle = isCta ? INPUT_STYLE_CTA : INPUT_STYLE_HERO

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const result = await submitAudit(url.trim(), email.trim(), locale)
      if (!result.ok) {
        setError(result.error)
        setLoading(false)
        return
      }
      router.push(`/ferramentas/geo-audit/analisando/${result.hash}`)
    } catch {
      setError(t('form.errorInesperado'))
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
        placeholder={t('form.urlPlaceholder')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        disabled={loading}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder={t('form.emailPlaceholder')}
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
          fontSize: 'var(--font-size-label-ui)',
          fontWeight: 400,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: 'var(--tracking-micro)',
          textTransform: 'uppercase',
          boxShadow: isCta ? '0 4px 20px rgba(0,0,0,0.15)' : 'var(--shadow-brand)',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? t('form.submitting') : `${t('hero.cta')} →`}
      </button>
    </form>
  )
}

export default function AuditForm({ variant }: Props) {
  return (
    <Suspense>
      <AuditFormInner variant={variant} />
    </Suspense>
  )
}
