'use server'

import { randomBytes } from 'crypto'
import { after } from 'next/server'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { runSecurityChecks } from './security'
import { analyzeAndDeliver } from './analyzeAndDeliver'

export type SubmitResult =
  | { ok: true; hash: string }
  | { ok: false; error: string }

export async function submitAudit(url: string, email: string): Promise<SubmitResult> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const security = await runSecurityChecks(url, email, ip)

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
    return { ok: false, error: 'Erro ao iniciar análise. Tente novamente.' }
  }

  // Processa em background após resposta ser enviada
  after(async () => {
    await analyzeAndDeliver(hash, security.normalizedUrl, email)
  })

  return { ok: true, hash }
}
