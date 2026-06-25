'use server'

import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'

const BLOCKED_DOMAINS = new Set([
  'localhost', '127.0.0.1', '0.0.0.0', '::1',
])

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'temp-mail.org', 'throwam.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.info',
  'spam4.me', 'trashmail.com', 'yopmail.com', 'dispostable.com',
])

const MAX_PER_IP_PER_HOUR = 5
const URL_DEDUP_WINDOW_MIN = 60

export type SecurityResult =
  | { ok: true; normalizedUrl: string; domain: string }
  | { ok: false; error: string }

export async function runSecurityChecks(
  rawUrl: string,
  email: string,
  ip: string,
  locale: string = 'pt',
): Promise<SecurityResult> {
  const t = await getTranslations({ locale, namespace: 'ferramentas.geoAudit.form.errors' })

  // 1. Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) {
    return { ok: false, error: t('emailInvalido') }
  }

  // 2. Disposable email
  const emailDomain = email.split('@')[1].toLowerCase()
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    return { ok: false, error: t('emailProfissional') }
  }

  // 3. URL format — add https:// if missing
  let normalizedUrl = rawUrl.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  let parsed: URL
  try {
    parsed = new URL(normalizedUrl)
  } catch {
    return { ok: false, error: t('urlInvalida') }
  }

  // 4. Protocol check
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: t('urlProtocolo') }
  }

  // 5. Hostname check (no IPs, no localhost)
  const hostname = parsed.hostname.toLowerCase()
  if (BLOCKED_DOMAINS.has(hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return { ok: false, error: t('urlPublica') }
  }

  // Must have at least one dot (e.g., meusite.com)
  if (!hostname.includes('.')) {
    return { ok: false, error: t('urlCompleta') }
  }

  const domain = hostname.replace(/^www\./, '')

  // 6. Rate limit by IP
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('geo_audit_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', oneHourAgo)

  if ((count ?? 0) >= MAX_PER_IP_PER_HOUR) {
    return { ok: false, error: t('rateLimit') }
  }

  // 7. URL dedup — mesmo URL nos últimos N minutos
  const dedupWindow = new Date(Date.now() - URL_DEDUP_WINDOW_MIN * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('geo_audits')
    .select('hash, status')
    .eq('url', normalizedUrl)
    .gte('created_at', dedupWindow)
    .in('status', ['pending', 'analyzing', 'ready'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    // Retorna o hash existente para não reprocessar
    return { ok: false, error: `DEDUP:${existing.hash}` }
  }

  // Registra o hit de rate limit
  await supabase.from('geo_audit_rate_limits').insert({ ip })

  return { ok: true, normalizedUrl, domain }
}
