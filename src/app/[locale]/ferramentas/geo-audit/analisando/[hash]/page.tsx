'use client'

import { useEffect, useState, useMemo, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export default function AnalisandoPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = use(params)
  const t = useTranslations('ferramentas.geoAudit.analisando')
  const messages = useMemo(() => t.raw('messages') as string[], [t])
  const router = useRouter()
  const [msgIndex, setMsgIndex] = useState(0)
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, messages.length - 1))
    }, 2800)

    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'))
    }, 500)

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit-status/${hash}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data.status === 'ready') {
          clearAll()
          router.push(`/ferramentas/geo-audit/resultado/${hash}`)
        } else if (data.status === 'error') {
          clearAll()
          router.push('/ferramentas/geo-audit?erro=analise-falhou')
        }
      } catch { /* tenta novamente no próximo tick */ }
    }, 3000)

    function clearAll() {
      clearInterval(msgTimer)
      clearInterval(dotsTimer)
      clearInterval(poll)
    }

    return clearAll
  }, [hash, router, messages])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--white)',
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '4px solid var(--neutral-100)',
          borderTopColor: '#897BBC',
          animation: 'spin 0.9s linear infinite',
          marginBottom: '40px',
        }}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <p
        className="font-synonym"
        style={{
          fontSize: 'var(--text-body-lg)',
          color: 'var(--neutral-800)',
          textAlign: 'center',
          marginBottom: '8px',
          minHeight: '28px',
          transition: 'opacity 0.3s',
        }}
      >
        {messages[msgIndex]}
      </p>

      <p
        className="font-synonym"
        style={{
          fontSize: 'var(--text-label-ui)',
          color: 'var(--neutral-400)',
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}
      >
        {t('andamento')}{dots}
      </p>

      {/* Progress dots */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '48px',
        }}
      >
        {messages.map((_, i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: i === msgIndex ? '#897BBC' : 'var(--neutral-200)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      <p
        className="font-synonym"
        style={{
          fontSize: 'var(--text-label-ui)',
          color: 'var(--neutral-300)',
          marginTop: '64px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        dup.agency
      </p>
    </div>
  )
}
