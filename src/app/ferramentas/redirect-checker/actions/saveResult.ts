'use server'

// SQL — rodar no Supabase (SQL Editor):
//
// CREATE TABLE redirect_checks (
//   id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
//   hash        text        UNIQUE NOT NULL,
//   domain      text        NOT NULL,
//   email       text        NOT NULL,
//   status      text        DEFAULT 'processing',
//   total_urls  int,
//   ok          int,
//   redirects   int,
//   errors      int,
//   loops       int,
//   results     jsonb,
//   created_at  timestamptz DEFAULT now()
// );

import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'
import type { UrlResult } from '../components/ResultView'
import { buildEmailHtml } from '../lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SaveResultParams {
  hash:      string
  domain:    string
  email:     string
  totalUrls: number
  ok:        number
  redirects: number
  errors:    number
  loops:     number
  results:   UrlResult[]
}

export async function saveResult(params: SaveResultParams): Promise<{ ok: boolean }> {
  const { error } = await supabase.from('redirect_checks').insert({
    hash:       params.hash,
    domain:     params.domain,
    email:      params.email,
    status:     'done',
    total_urls: params.totalUrls,
    ok:         params.ok,
    redirects:  params.redirects,
    errors:     params.errors,
    loops:      params.loops,
    results:    params.results,
  })

  if (error) {
    console.error('[saveResult]', error.message)
    return { ok: false }
  }

  const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dup.agency'
  const resultUrl = `${baseUrl}/ferramentas/redirect-checker/resultado/${params.hash}`

  resend.emails.send({
    from:    process.env.RESEND_FROM ?? 'Redirect Checker <audit@dup.agency>',
    to:      params.email,
    subject: `Seu relatório de URLs está pronto — ${params.domain}`,
    html:    buildEmailHtml(
      {
        domain:    params.domain,
        totalUrls: params.totalUrls,
        ok:        params.ok,
        redirects: params.redirects,
        errors:    params.errors,
        loops:     params.loops,
      },
      resultUrl,
    ),
  }).catch((err) => console.error('[saveResult] resend:', err))

  return { ok: true }
}
