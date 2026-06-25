'use server'

import { randomBytes } from 'crypto'
import { after } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { runSecurityChecks } from './security'
import { analyzeAndDeliver } from './analyzeAndDeliver'

export type SubmitResult =
  | { ok: true; hash: string }
  | { ok: false; error: string }

export async function submitAudit(url: string, email: string, locale: string = 'pt'): Promise<SubmitResult> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const security = await runSecurityChecks(url, email, ip, locale)

  if (!security.ok) {
    // Caso de dedup — redireciona para o resultado já existente
    if (security.error.startsWith('DEDUP:')) {
      return { ok: true, hash: security.error.replace('DEDUP:', '') }
    }
    return { ok: false, error: security.error }
  }

  const hash = randomBytes(16).toString('hex')

  const { error: dbError } = await supabase.from('geo_audits').insert({
    hash,
    url: security.normalizedUrl,
    email: email.toLowerCase().trim(),
    ip,
    status: 'pending',
  })

  if (dbError) {
    const t = await getTranslations({ locale, namespace: 'ferramentas.geoAudit.form.errors' })
    return { ok: false, error: t('iniciar') }
  }

  // Processa em background após resposta ser enviada. O locale vem da página
  // onde o form foi submetido — define o idioma em que a IA gera o resultado.
  after(async () => {
    await analyzeAndDeliver(hash, security.normalizedUrl, email, locale)
  })

  return { ok: true, hash }
}
