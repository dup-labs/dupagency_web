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

import { supabase } from '@/lib/supabase'
import type { UrlResult } from '../components/ResultView'

interface SaveResultParams {
  hash: string
  domain: string
  email: string
  totalUrls: number
  ok: number
  redirects: number
  errors: number
  loops: number
  results: UrlResult[]
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
  return { ok: true }
}
