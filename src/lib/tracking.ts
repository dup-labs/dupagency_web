'use client'

/**
 * ÚNICO ponto de contato do site com o dataLayer. Ver docs/medicao/plano.md.
 * Nenhum dado pessoal (e-mail, telefone, nome) entra aqui.
 */
import { ORIGIN_COOKIE, parseOriginCookie, type LeadOrigin } from './origin'

export type PageType = 'home' | 'case' | 'lp' | 'ferramenta' | 'outra'
export type CtaType = 'schedule' | 'whatsapp' | 'email'
export type LeadSource = 'lp' | 'geo_audit' | 'redirect_checker' | 'contato'
export type ToolName = 'geo_audit' | 'redirect_checker'

export type TrackingEvents = {
  cta_click: { cta_type: CtaType; cta_location: string; page_type: PageType; lp_slug?: string }
  generate_lead: { lead_source: LeadSource; lp_slug?: string; page_type?: PageType }
  schedule_call: { page_type: PageType; lp_slug?: string }
  tool_use: { tool: ToolName; page_type?: PageType }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    Calendly?: { initPopupWidget: (o: { url: string }) => void }
  }
}

/** Enfileira no dataLayer, mesmo antes do GTM carregar. */
export function track<E extends keyof TrackingEvents>(event: E, params: TrackingEvents[E]): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  const clean: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') clean[k] = v
  window.dataLayer.push({ event, ...clean })
}

/** Classifica o path (sem prefixo de locale). LPs ficam em /[locale]/lp/<slug>. */
export function getPageContext(pathname: string = window.location.pathname): {
  page_type: PageType
  lp_slug?: string
} {
  const path = pathname.replace(/^\/(en|es)(?=\/|$)/, '').replace(/\/+$/, '')
  if (path === '') return { page_type: 'home' }
  if (path.startsWith('/cases/')) return { page_type: 'case' }
  if (path.startsWith('/ferramentas')) return { page_type: 'ferramenta' }
  const lp = path.match(/^\/lp\/([^/]+)/)
  if (lp) return { page_type: 'lp', lp_slug: lp[1] }
  return { page_type: 'outra' }
}

/** Origem (primeira e última) gravada pelo script de bootstrap. */
export function getLeadOrigin(): LeadOrigin {
  if (typeof document === 'undefined') return {}
  const m = document.cookie.match(new RegExp(`(?:^|; )${ORIGIN_COOKIE}=([^;]*)`))
  return parseOriginCookie(m?.[1])
}

// ---------- Calendly ----------

const CALENDLY_JS = 'https://assets.calendly.com/assets/external/widget.js'
const CALENDLY_CSS = 'https://assets.calendly.com/assets/external/widget.css'
let calendlyLoading: Promise<void> | null = null

/** Carrega o widget oficial só quando necessário (não pesa no carregamento). */
export function loadCalendly(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject()
  if (window.Calendly) return Promise.resolve()
  if (calendlyLoading) return calendlyLoading
  calendlyLoading = new Promise<void>((resolve, reject) => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = CALENDLY_CSS
    document.head.appendChild(css)
    const s = document.createElement('script')
    s.src = CALENDLY_JS
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      calendlyLoading = null
      reject(new Error('calendly'))
    }
    document.head.appendChild(s)
  })
  return calendlyLoading
}

/** Acrescenta as UTMs da origem (última; se vazia, a primeira) à URL do Calendly. */
export function withOriginUtms(href: string): string {
  const o = getLeadOrigin()
  const t = o.last?.utm_source || o.last?.utm_medium ? o.last : o.first ?? o.last
  const url = new URL(href)
  if (t) {
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
      const v = t[k]
      if (v && !url.searchParams.has(k)) url.searchParams.set(k, v)
    }
  }
  return url.toString()
}

/** Abre o popup oficial. Se falhar, abre o link normal em nova aba. */
export async function openCalendly(href: string): Promise<void> {
  const url = withOriginUtms(href)
  try {
    await loadCalendly()
    if (!window.Calendly) throw new Error('calendly')
    window.Calendly.initPopupWidget({ url })
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export function isCalendlyHref(href: string): boolean {
  try {
    return new URL(href).hostname === 'calendly.com'
  } catch {
    return false
  }
}
