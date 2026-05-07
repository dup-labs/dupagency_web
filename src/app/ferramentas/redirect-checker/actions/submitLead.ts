'use server'

// Tabela Supabase necessária:
// Se você já criou com a coluna 'name', rode:
//   ALTER TABLE tool_leads RENAME COLUMN name TO domain;
//
// Se ainda não criou, execute:
// CREATE TABLE tool_leads (
//   id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
//   domain      text        NOT NULL,
//   email       text        NOT NULL,
//   source_tool text        NOT NULL,
//   ip          text,
//   created_at  timestamptz DEFAULT now()
// );

import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'

export type LeadResult = { ok: true } | { ok: false; error: string }

async function upsertAttio(domain: string, email: string): Promise<void> {
  const apiKey = process.env.ATTIO_API_KEY
  if (!apiKey) return

  const hdrs = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }

  let personId: string | null = null
  try {
    const res = await fetch('https://api.attio.com/v2/objects/people/records', {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify({
        data: { values: { email_addresses: [{ email_address: email }] } },
        matching_attribute: 'email_addresses',
      }),
    })
    personId = (await res.json())?.data?.id?.record_id ?? null
  } catch { /* ignora */ }

  if (personId) {
    try {
      await fetch('https://api.attio.com/v2/notes', {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({
          data: {
            parent_object: 'people',
            parent_record_id: personId,
            title: `Redirect & Health Checker — ${domain}`,
            format: 'plaintext',
            content: `Domínio: ${domain}\nE-mail: ${email}\nFerramenta: redirect-checker\nFonte: dup.agency/ferramentas/redirect-checker`,
          },
        }),
      })
    } catch { /* ignora */ }
  }
}

export async function submitLead(domain: string, email: string): Promise<LeadResult> {
  const rawDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  if (!rawDomain || !rawDomain.includes('.')) return { ok: false, error: 'Domínio inválido. Ex: meusite.com.br' }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) return { ok: false, error: 'E-mail inválido.' }

  const disposable = new Set([
    'mailinator.com', 'guerrillamail.com', 'temp-mail.org', 'yopmail.com',
    'trashmail.com', 'dispostable.com', 'spam4.me', 'throwam.com',
  ])
  if (disposable.has(email.split('@')[1].toLowerCase())) return { ok: false, error: 'Use um e-mail profissional.' }

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const { error } = await supabase.from('tool_leads').insert({
    domain: rawDomain,
    email: email.toLowerCase().trim(),
    source_tool: 'redirect-checker',
    ip,
  })

  if (error) console.error('[submitLead] Supabase error:', error.message)

  upsertAttio(rawDomain, email).catch(console.error)

  return { ok: true }
}
