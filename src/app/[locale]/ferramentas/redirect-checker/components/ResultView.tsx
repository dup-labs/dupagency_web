'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getPathname } from '@/i18n/navigation'
import CtaPopup from '@/components/ui/CtaPopup'
import RedirectUpsell from './RedirectUpsell'

type ResultT = ReturnType<typeof useTranslations<'ferramentas.redirectChecker.resultado'>>

// ── Types ─────────────────────────────────────────────────────────────────────

export type FilterType = 'all' | 'ok' | 'redirect' | 'error' | 'loop'

export interface Hop { url: string; status: number }

export interface UrlResult {
  url: string
  finalStatus: number
  chain: Hop[]
  responseTime: number
  isLoop: boolean
  isTimeout: boolean
  hops: number
}

type SummaryKey = 'ok' | 'redirect' | 'error' | 'loop'

// ── Helpers ───────────────────────────────────────────────────────────────────

export function categorize(r: UrlResult): FilterType {
  if (r.isLoop) return 'loop'
  if (r.isTimeout || r.finalStatus === 0 || r.finalStatus >= 400) return 'error'
  if (r.hops > 0) return 'redirect'
  return 'ok'
}

function getProblem(r: UrlResult, t: ResultT): string {
  if (r.isLoop) return t('problemas.loop')
  if (r.isTimeout) return t('problemas.timeout')
  if (r.finalStatus === 0) return t('problemas.noResponse')
  if (r.finalStatus === 404) return t('problemas.notFound')
  if (r.finalStatus >= 500) return t('problemas.serverError', { status: r.finalStatus })
  if (r.finalStatus >= 400) return t('problemas.clientError', { status: r.finalStatus })
  if (r.hops > 3) return t('problemas.tooManyHops', { hops: r.hops })
  return ''
}

function chainLabel(r: UrlResult): string {
  if (r.chain.length === 0) return '-'
  return r.chain.map((h) => (h.status === 0 ? 'ERR' : h.status)).join(' → ')
}

function statusBadge(status: number, isLoop: boolean, isTimeout: boolean) {
  if (isLoop)             return { label: 'LOOP', bg: 'rgba(176,48,48,0.12)',   color: '#B03030' }
  if (isTimeout || status === 0) return { label: 'ERR',  bg: 'rgba(160,120,0,0.12)',  color: '#8A6800' }
  if (status >= 500)      return { label: `${status}`,   bg: 'rgba(176,48,48,0.12)',  color: '#B03030' }
  if (status >= 400)      return { label: `${status}`,   bg: 'rgba(160,120,0,0.12)',  color: '#8A6800' }
  if (status >= 300)      return { label: `${status}`,   bg: 'rgba(59,138,90,0.12)',  color: '#2A7A50' }
  return                         { label: `${status}`,   bg: 'rgba(59,138,90,0.12)',  color: '#2A7A50' }
}

/* exportCsv — desativado temporariamente (não lançar ainda)
function exportCsv(results: UrlResult[], domain: string) {
  const now       = new Date().toLocaleString('pt-BR')
  const ok        = results.filter((r) => categorize(r) === 'ok').length
  const redirects = results.filter((r) => categorize(r) === 'redirect').length
  const errors    = results.filter((r) => categorize(r) === 'error').length
  const loops     = results.filter((r) => categorize(r) === 'loop').length
  const cell      = (s: string) => `"${s.replace(/"/g, '""')}"`

  const rows = [
    ['Domínio', domain],
    ['Data/hora', now],
    ['Total URLs', results.length.toString()],
    ['OK', ok.toString()],
    ['Redirects', redirects.toString()],
    ['Erros', errors.toString()],
    ['Loops', loops.toString()],
    [],
    ['URL Original', 'Status Final', 'Chain', 'Hops', 'Tempo (ms)', 'Loop', 'Timeout', 'Problema'],
    ...results.map((r) => [
      r.url, r.finalStatus.toString(), chainLabel(r), r.hops.toString(),
      r.responseTime.toString(), r.isLoop ? 'sim' : 'não', r.isTimeout ? 'sim' : 'não', getProblem(r),
    ]),
  ]

  const csv  = rows.map((row) => row.map((c) => cell(c)).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a    = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'redirect-health-check.csv' })
  a.click()
  URL.revokeObjectURL(a.href)
}
*/

// ── Constants ─────────────────────────────────────────────────────────────────

// `cardKey` aponta pra cards.* nos message files; emoji fica hardcoded.
const SUMMARY_CARDS: { key: SummaryKey; emoji: string; cardKey: string }[] = [
  { key: 'ok',       emoji: '✅', cardKey: 'ok'       },
  { key: 'redirect', emoji: '🔀', cardKey: 'redirects' },
  { key: 'error',    emoji: '❌', cardKey: 'erros'    },
  { key: 'loop',     emoji: '🔁', cardKey: 'loops'    },
]

// `filterKey` aponta pra tabela.filtros.*; emoji fica hardcoded ao lado.
const FILTERS: { key: FilterType; emoji: string; filterKey: string }[] = [
  { key: 'all',      emoji: '',   filterKey: 'todos'     },
  { key: 'ok',       emoji: '✅', filterKey: 'ok'        },
  { key: 'redirect', emoji: '🔀', filterKey: 'redirects' },
  { key: 'error',    emoji: '❌', filterKey: 'erros'     },
  { key: 'loop',     emoji: '🔁', filterKey: 'loops'     },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface ResultViewProps {
  domain: string
  results: UrlResult[]
  /** Se undefined, o botão vira link de volta à ferramenta */
  onReset?: () => void
}

export default function ResultView({ domain, results, onReset }: ResultViewProps) {
  const t = useTranslations('ferramentas.redirectChecker.resultado')
  const locale = useLocale()
  const [filter, setFilter] = useState<FilterType>('all')

  const counts: Record<SummaryKey, number> = {
    ok:       results.filter((r) => categorize(r) === 'ok').length,
    redirect: results.filter((r) => categorize(r) === 'redirect').length,
    error:    results.filter((r) => categorize(r) === 'error').length,
    loop:     results.filter((r) => categorize(r) === 'loop').length,
  }

  const crawlBudgetPct = results.length > 0
    ? Math.round(((counts.redirect + counts.error + counts.loop) / results.length) * 100)
    : 0
  const crawlColor = crawlBudgetPct < 10 ? '#3D9688' : crawlBudgetPct < 30 ? '#9A7A00' : '#A83333'
  const crawlBg    = crawlBudgetPct < 10 ? 'rgba(61,150,136,0.08)' : crawlBudgetPct < 30 ? 'rgba(154,122,0,0.08)' : 'rgba(168,51,51,0.08)'

  const filtered = filter === 'all' ? results : results.filter((r) => categorize(r) === filter)

  type Severity = 'crítica' | 'alta' | 'média'
  interface ActionItem { severity: Severity; color: string; bgColor: string; category: string; action: string }

  const severityLabel: Record<Severity, string> = {
    'crítica': t('acoesPrioritarias.critica'),
    'alta':    t('acoesPrioritarias.alta'),
    'média':   t('acoesPrioritarias.media'),
  }

  const loopCount     = counts.loop
  const notFoundCount = results.filter((r) => r.finalStatus === 404).length
  const manyHopsCount = results.filter((r) => r.hops > 3).length
  const slowCount     = results.filter((r) => r.responseTime > 3000 && r.responseTime > 0).length

  const actions: ActionItem[] = []
  if (loopCount > 0)     actions.push({ severity: 'crítica', color: '#C04040', bgColor: 'rgba(192,64,64,0.05)',  category: t('acoes.loop.category'),     action: t('acoes.loop.action', { n: loopCount }) })
  if (notFoundCount > 0) actions.push({ severity: 'alta',    color: '#D4A017', bgColor: 'rgba(212,160,23,0.05)', category: t('acoes.notFound.category'), action: t('acoes.notFound.action', { n: notFoundCount }) })
  if (manyHopsCount > 0) actions.push({ severity: 'média',   color: '#51A899', bgColor: 'rgba(81,168,153,0.05)', category: t('acoes.manyHops.category'), action: t('acoes.manyHops.action', { n: manyHopsCount }) })
  if (slowCount > 0)     actions.push({ severity: 'média',   color: '#51A899', bgColor: 'rgba(81,168,153,0.05)', category: t('acoes.slow.category'),     action: t('acoes.slow.action', { n: slowCount }) })

  return (
    <div style={{
      paddingTop:    'calc(64px + 48px)',
      paddingBottom: '80px',
      paddingLeft:   '16px',
      paddingRight:  '16px',
      background:    'var(--white)',
      minHeight:     '100vh',
    }}>
      <style>{`
        @media (max-width: 640px) {
          .rv-header        { flex-direction: column !important; }
          .rv-header-btns   { width: 100% !important; }
          .rv-header-btns button, .rv-header-btns a { flex: 1 !important; text-align: center !important; }
          .rv-cards         { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
          .rv-card          { padding: 14px 8px !important; }
          .rv-card-value    { font-size: 22px !important; }
          .rv-card-sub      { display: none !important; }
          .rv-action-row    { grid-template-columns: 1fr !important; gap: 6px !important; }
          .rv-action-sev    { padding-top: 0 !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div className="rv-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <p className="font-synonym" style={{ fontSize: 'var(--text-label-ui)', color: 'var(--neutral-400)', marginBottom: '8px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {(() => {
                // Chave única "X › Y" → split pra manter o link só na primeira parte.
                const [crumbRoot, crumbCurrent] = t('breadcrumb').split('›').map((s) => s.trim())
                return (
                  <>
                    <a href={getPathname({ href: '/ferramentas/redirect-checker', locale })} style={{ color: 'var(--neutral-400)', textDecoration: 'none' }}>{crumbRoot}</a>
                    <span>›</span>
                    <span style={{ color: 'var(--neutral-600)' }}>{crumbCurrent}</span>
                  </>
                )
              })()}
            </p>
            <h2 className="font-chillax font-bold uppercase" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: 'var(--black)', marginBottom: '4px', lineHeight: 1.2 }}>
              {domain}
            </h2>
            <p className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)' }}>
              {t('urlsVerificadas', { n: results.length })}
            </p>
          </div>
          <div className="rv-header-btns" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* <button
              onClick={() => exportCsv(results, domain)}
              className="font-synonym"
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--neutral-200)', background: 'var(--white)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--neutral-600)' }}
            >
              Exportar CSV
            </button> */}
            {onReset ? (
              <button
                onClick={onReset}
                className="font-synonym"
                style={{ padding: '10px 20px', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--grad-site-01)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--white)', boxShadow: 'var(--shadow-brand)' }}
              >
                {t('novoDominio')}
              </button>
            ) : (
              <a
                href={getPathname({ href: '/ferramentas/redirect-checker', locale })}
                className="font-synonym"
                style={{ display: 'inline-block', padding: '10px 20px', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--grad-site-01)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--white)', boxShadow: 'var(--shadow-brand)', textDecoration: 'none' }}
              >
                {t('analisarOutro')}
              </a>
            )}
          </div>
        </div>

        {/* Summary cards — 5 cols desktop / 3 cols mobile */}
        <div className="rv-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '24px' }}>
          {SUMMARY_CARDS.map(({ key, emoji, cardKey }) => {
            const active = filter === key
            return (
              <div
                key={key}
                className="rv-card"
                onClick={() => setFilter((prev) => (prev === key ? 'all' : key))}
                style={{
                  background:   active ? 'rgba(137,123,188,0.06)' : 'var(--neutral-50)',
                  border:       `1px solid ${active ? 'var(--purple-mid)' : 'var(--neutral-100)'}`,
                  borderRadius: 'var(--radius-xl)',
                  padding:      '20px 12px',
                  textAlign:    'center',
                  cursor:       'pointer',
                  transition:   'border-color 0.2s, background 0.2s',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{emoji}</div>
                <div className="rv-card-value font-chillax font-bold" style={{ fontSize: '28px', color: 'var(--black)', lineHeight: 1 }}>{counts[key]}</div>
                <div className="font-synonym" style={{ fontSize: '11px', color: 'var(--neutral-800)', marginTop: '5px', fontWeight: 600 }}>{t(`cards.${cardKey}.label`)}</div>
                <div className="rv-card-sub font-synonym" style={{ fontSize: '10px', color: 'var(--neutral-400)', marginTop: '3px' }}>{t(`cards.${cardKey}.sublabel`)}</div>
              </div>
            )
          })}

          {/* Crawl Budget card */}
          <div className="rv-card" style={{ background: crawlBg, border: `1px solid ${crawlColor}33`, borderRadius: 'var(--radius-xl)', padding: '20px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>🕷️</div>
            <div className="rv-card-value font-chillax font-bold" style={{ fontSize: '28px', color: crawlColor, lineHeight: 1 }}>{crawlBudgetPct}%</div>
            <div className="font-synonym" style={{ fontSize: '11px', color: 'var(--neutral-800)', marginTop: '5px', fontWeight: 600 }}>{t('cards.crawlBudget.label')}</div>
            <div className="rv-card-sub font-synonym" style={{ fontSize: '10px', color: 'var(--neutral-400)', marginTop: '3px' }}>{t('cards.crawlBudget.sublabel')}</div>
          </div>
        </div>

        {/* Priority actions */}
        <div style={{ marginBottom: '24px', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--grad-site-01)', padding: '11px 20px' }}>
            <span className="font-synonym" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--white)' }}>
              {t('acoesPrioritarias.title')}
            </span>
          </div>
          {actions.length === 0 ? (
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>🎉</span>
              <p className="font-synonym" style={{ fontSize: '13px', color: 'var(--neutral-600)', margin: 0 }}>
                {t('semProblemas')}
              </p>
            </div>
          ) : (
            <div>
              {actions.map((item, i) => (
                <div
                  key={item.category}
                  className="rv-action-row"
                  style={{
                    display:             'grid',
                    gridTemplateColumns: '100px 1fr',
                    alignItems:          'start',
                    gap:                 '12px',
                    padding:             '14px 16px',
                    background:          item.bgColor,
                    borderBottom:        i < actions.length - 1 ? '1px solid var(--neutral-100)' : 'none',
                  }}
                >
                  <div className="rv-action-sev" style={{ display: 'flex', alignItems: 'center', gap: '7px', paddingTop: '2px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color, flexShrink: 0, display: 'inline-block' }} />
                    <span className="font-synonym" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: item.color }}>
                      {severityLabel[item.severity]}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="font-synonym" style={{ display: 'inline-block', flexShrink: 0, padding: '2px 10px', borderRadius: '99px', background: 'var(--neutral-100)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--neutral-600)', marginTop: '2px' }}>
                      {item.category}
                    </span>
                    <p className="font-synonym" style={{ fontSize: '13px', color: 'var(--neutral-800)', margin: 0, lineHeight: 1.5, minWidth: 0 }}>
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {FILTERS.map(({ key, emoji, filterKey }) => {
            const count = key !== 'all' ? counts[key as SummaryKey] : null
            const label = `${emoji ? emoji + ' ' : ''}${t(`tabela.filtros.${filterKey}`)}`
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="font-synonym"
                style={{
                  padding:     '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border:      '1px solid',
                  borderColor: filter === key ? 'var(--purple-mid)' : 'var(--neutral-200)',
                  background:  filter === key ? 'rgba(137,123,188,0.08)' : 'var(--white)',
                  color:       filter === key ? 'var(--purple-mid)' : 'var(--neutral-600)',
                  fontSize:    '12px',
                  cursor:      'pointer',
                  fontWeight:  filter === key ? 600 : 400,
                  letterSpacing: '0.03em',
                  transition:  'all 0.15s',
                }}
              >
                {label}{count !== null && <span style={{ marginLeft: '5px', opacity: 0.6 }}>({count})</span>}
              </button>
            )
          })}
        </div>

        {filter !== 'all' && (
          <p className="font-synonym" style={{ fontSize: '12px', color: 'var(--neutral-400)', marginBottom: '16px', letterSpacing: '0.03em' }}>
            {t('exibindo', { n: filtered.length, filter: (() => {
              const f = FILTERS.find((f) => f.key === filter)
              return f ? `${f.emoji ? f.emoji + ' ' : ''}${t(`tabela.filtros.${f.filterKey}`)}` : ''
            })() })}
          </p>
        )}

        {/* Table */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', marginTop: filter !== 'all' ? 0 : '16px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-100)' }}>
                  {(['urlOriginal', 'status', 'chain', 'hops', 'tempo', 'problema'] as const).map((colKey) => (
                    <th key={colKey} className="font-synonym" style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--neutral-400)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {t(`tabela.colunas.${colKey}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-md)', color: 'var(--neutral-400)' }}>
                      {t(`emptyTable.${filter}`)}
                    </td>
                  </tr>
                )}
                {filtered.map((r, i) => {
                  const badge   = statusBadge(r.finalStatus, r.isLoop, r.isTimeout)
                  const problem = getProblem(r, t)
                  return (
                    <tr key={r.url + i} style={{ borderBottom: '1px solid var(--neutral-100)', background: i % 2 === 0 ? 'var(--white)' : 'var(--neutral-50)' }}>
                      <td style={{ padding: '12px 16px', maxWidth: '360px' }}>
                        <span className="font-synonym" style={{ fontSize: '12px', color: 'var(--neutral-800)', wordBreak: 'break-all', display: 'block', lineHeight: 1.5 }} title={r.url}>
                          {r.url.length > 65 ? r.url.slice(0, 65) + '…' : r.url}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span className="font-synonym" style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span className="font-synonym" style={{ fontSize: '12px', color: 'var(--neutral-600)', letterSpacing: '0.02em' }}>{chainLabel(r)}</span>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span className="font-synonym" style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>{r.hops}</span>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span className="font-synonym" style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>
                          {r.responseTime > 0 ? `${r.responseTime}ms` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {problem
                          ? <span className="font-synonym" style={{ fontSize: '12px', color: '#B03030', fontWeight: 500 }}>{problem}</span>
                          : <span style={{ fontSize: '12px', color: 'var(--neutral-300)' }}>{t('tabela.semProblema')}</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <RedirectUpsell />

      </div>

      <CtaPopup />
    </div>
  )
}
