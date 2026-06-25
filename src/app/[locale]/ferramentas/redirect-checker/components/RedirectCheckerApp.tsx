'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getPathname } from '@/i18n/navigation'
import { richTags } from '@/i18n/rich'
import GridLines from '@/components/ui/GridLines'
import { submitLead } from '../actions/submitLead'
import { saveResult } from '../actions/saveResult'
import ResultView, { categorize } from './ResultView'
import type { UrlResult } from './ResultView'

// ── Types ─────────────────────────────────────────────────────────────────────

type Stage = 'form' | 'checking' | 'results'

interface CheckingStats {
  totalUrls: number
  checked:   number
  ok:        number
  redirects: number
  errors:    number
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const INPUT_HERO: React.CSSProperties = {
  width:        '100%',
  padding:      '14px 18px',
  borderRadius: 'var(--radius-xl)',
  border:       '1px solid var(--neutral-200)',
  background:   'var(--white)',
  fontFamily:   'var(--font-body)',
  fontSize:     'var(--text-body-lg)',
  color:        'var(--black)',
  outline:      'none',
  boxSizing:    'border-box',
}

// ── Stage: Form ───────────────────────────────────────────────────────────────

function StageForm({ onStart }: { onStart: (domain: string, email: string) => void }) {
  const t = useTranslations('ferramentas.redirectChecker')
  const locale = useLocale()
  const [domain,  setDomain]  = useState('')
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await submitLead(domain.trim(), email.trim(), locale)
      if (!result.ok) { setError(result.error); setLoading(false); return }
      onStart(domain.trim(), email.trim())
    } catch {
      setError(t('form.errorInesperado'))
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px', margin: '0 auto 24px' }}
    >
      <input
        type="text"
        placeholder={t('form.urlPlaceholder')}
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        required
        disabled={loading}
        style={INPUT_HERO}
      />
      <input
        type="email"
        placeholder={t('form.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        autoComplete="email"
        style={INPUT_HERO}
      />
      {error && (
        <p style={{ margin: 0, fontSize: 'var(--text-label-ui)', color: '#C04040', textAlign: 'center' }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width:         '100%',
          padding:       '15px 24px',
          borderRadius:  'var(--radius-pill)',
          border:        'none',
          background:    'var(--grad-site-01)',
          color:         'var(--white)',
          fontFamily:    'var(--font-body)',
          fontSize:      'var(--font-size-label-ui)',
          fontWeight:    400,
          cursor:        loading ? 'not-allowed' : 'pointer',
          letterSpacing: 'var(--tracking-micro)',
          textTransform: 'uppercase',
          boxShadow:     'var(--shadow-brand)',
          opacity:       loading ? 0.7 : 1,
          transition:    'opacity 0.2s',
        }}
      >
        {loading ? t('form.submitting') : `${t('hero.cta')} →`}
      </button>
    </form>
  )
}

// ── Stage: Checking ───────────────────────────────────────────────────────────

function StageChecking({ domain, stats }: { domain: string; stats: CheckingStats }) {
  const t = useTranslations('ferramentas.redirectChecker.checking')
  const pct = stats.totalUrls > 0 ? Math.round((stats.checked / stats.totalUrls) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', background: 'var(--white)' }}>
      <style>{`@keyframes rc-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ width: 64, height: 64, borderRadius: '50%', border: '4px solid var(--neutral-100)', borderTopColor: 'var(--purple-mid)', animation: 'rc-spin 0.9s linear infinite', marginBottom: '36px' }} />

      <p className="font-chillax font-semibold" style={{ fontSize: '22px', color: 'var(--black)', marginBottom: '8px', textAlign: 'center' }}>
        {t('verificando', { domain })}
      </p>
      <p className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', marginBottom: '40px', textAlign: 'center' }}>
        {stats.totalUrls === 0 ? t('buscandoUrls') : t('progressoUrls', { checked: stats.checked, total: stats.totalUrls })}
      </p>

      {stats.totalUrls > 0 && (
        <div style={{ width: '100%', maxWidth: '480px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-400)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('progresso')}</span>
            <span className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', color: 'var(--purple-mid)', fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '99px', background: 'var(--neutral-100)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '99px', background: 'var(--grad-site-01)', width: `${pct}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {stats.totalUrls > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', maxWidth: '480px', width: '100%' }}>
          {[
            { label: t('total'),     value: stats.totalUrls },
            { label: t('ok'),        value: stats.ok        },
            { label: t('redirects'), value: stats.redirects },
            { label: t('erros'),     value: stats.errors    },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-100)', borderRadius: '12px', padding: '14px 8px', textAlign: 'center' }}>
              <div className="font-chillax font-bold" style={{ fontSize: '22px', color: 'var(--black)', lineHeight: 1 }}>{value}</div>
              <div className="font-synonym" style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <p className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-300)', marginTop: '64px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        dup.agency
      </p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const BATCH_SIZE = 50

export default function RedirectCheckerApp() {
  const t = useTranslations('ferramentas.redirectChecker')
  const locale = useLocale()
  const [stage,        setStage]        = useState<Stage>('form')
  const [domain,       setDomain]       = useState('')
  const [email,        setEmail]        = useState('')
  const [hash,         setHash]         = useState('')
  const [results,      setResults]      = useState<UrlResult[]>([])
  const [stats,        setStats]        = useState<CheckingStats>({ totalUrls: 0, checked: 0, ok: 0, redirects: 0, errors: 0 })
  const [sitemapError, setSitemapError] = useState<string | null>(null)

  const startCheck = useCallback(async (d: string, e: string) => {
    const cleanDomain = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
    const runHash     = crypto.randomUUID().replace(/-/g, '')

    setDomain(cleanDomain)
    setEmail(e)
    setHash(runHash)
    setResults([])
    setSitemapError(null)
    setStats({ totalUrls: 0, checked: 0, ok: 0, redirects: 0, errors: 0 })
    setStage('checking')

    let urls: string[] = []
    try {
      const res  = await fetch(`/api/parse-sitemap?domain=${encodeURIComponent(cleanDomain)}`)
      const data = await res.json()
      if (!res.ok || data.error) {
        setSitemapError(data.error ?? t('checking.errorSitemap'))
        setStage('form')
        return
      }
      urls = data.urls as string[]
    } catch {
      setSitemapError(t('checking.errorRede'))
      setStage('form')
      return
    }

    if (urls.length === 0) {
      setSitemapError(t('checking.errorVazio'))
      setStage('form')
      return
    }

    setStats({ totalUrls: urls.length, checked: 0, ok: 0, redirects: 0, errors: 0 })

    const allResults: UrlResult[] = []
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.all(
        batch.map((url) =>
          fetch(`/api/check-url?url=${encodeURIComponent(url)}`)
            .then((r) => r.json() as Promise<UrlResult>)
            .catch((): UrlResult => ({ url, finalStatus: 0, chain: [], responseTime: 0, isLoop: false, isTimeout: true, hops: 0 })),
        ),
      )
      allResults.push(...batchResults)
      const ok        = allResults.filter((r) => categorize(r) === 'ok').length
      const redirects = allResults.filter((r) => categorize(r) === 'redirect').length
      const errors    = allResults.filter((r) => ['error', 'loop'].includes(categorize(r))).length
      setResults([...allResults])
      setStats({ totalUrls: urls.length, checked: allResults.length, ok, redirects, errors })
    }

    // Persiste resultado e atualiza URL do browser
    const finalOk        = allResults.filter((r) => categorize(r) === 'ok').length
    const finalRedirects = allResults.filter((r) => categorize(r) === 'redirect').length
    const finalErrors    = allResults.filter((r) => categorize(r) === 'error').length
    const finalLoops     = allResults.filter((r) => categorize(r) === 'loop').length

    saveResult({
      hash:      runHash,
      domain:    cleanDomain,
      email:     e,
      totalUrls: allResults.length,
      ok:        finalOk,
      redirects: finalRedirects,
      errors:    finalErrors,
      loops:     finalLoops,
      results:   allResults,
      locale,
    }).catch(console.error)

    window.history.replaceState(null, '', getPathname({ href: `/ferramentas/redirect-checker/resultado/${runHash}`, locale }))
    setStage('results')
  }, [t, locale])

  // Evento disparado pelo FinalCta
  useEffect(() => {
    function onRcStart(e: Event) {
      const { domain: d, email: em } = (e as CustomEvent<{ domain: string; email: string }>).detail
      window.scrollTo({ top: 0, behavior: 'smooth' })
      startCheck(d, em ?? '')
    }
    window.addEventListener('rc:start', onRcStart)
    return () => window.removeEventListener('rc:start', onRcStart)
  }, [startCheck])

  const showHero = stage === 'form'

  return (
    <>
      {showHero && (
        <section
          id="rc-hero"
          className="relative z-10"
          style={{ paddingTop: 'calc(64px + 72px)', paddingBottom: '80px', overflow: 'hidden' }}
        >
          <GridLines />

          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.04)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', marginBottom: '32px' }}>
              <span className="font-synonym" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--neutral-400)', textTransform: 'uppercase' }}>
                {t('hero.label')}
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-chillax font-bold uppercase text-black select-none" style={{ fontSize: 'clamp(30px, 5.1vw, 54px)', lineHeight: 'var(--leading-display)', marginBottom: '24px' }}>
              {t.rich('hero.headline', richTags)}
            </h1>

            {/* Subtitle */}
            <p className="font-synonym text-body-md md:text-body-lg text-neutral-600 max-w-lg text-center" style={{ lineHeight: 'var(--leading-body)', margin: '0 auto 40px' }}>
              {t('hero.subheadline')}
            </p>

            {sitemapError && (
              <div style={{ background: 'rgba(176,48,48,0.06)', border: '1px solid rgba(176,48,48,0.15)', borderRadius: '12px', padding: '10px 16px', maxWidth: '480px', margin: '0 auto 16px' }}>
                <p className="font-synonym" style={{ fontSize: '13px', color: '#B03030', margin: 0 }}>{sitemapError}</p>
              </div>
            )}

            <StageForm onStart={(d, e) => startCheck(d, e)} />

            <p className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-400)', letterSpacing: '0.03em' }}>
              {t('hero.trust')}
            </p>
          </div>
        </section>
      )}

      {stage === 'checking' && <StageChecking domain={domain} stats={stats} />}

      {stage === 'results' && (
        <ResultView
          domain={domain}
          results={results}
          onReset={() => {
            setSitemapError(null)
            setHash('')
            window.history.replaceState(null, '', getPathname({ href: '/ferramentas/redirect-checker', locale }))
            setStage('form')
          }}
        />
      )}
    </>
  )
}
