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
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { registrarLead } from '@/lib/monday'

export type LeadResult = { ok: true } | { ok: false; error: string }

export async function submitLead(domain: string, email: string, locale: string = 'pt'): Promise<LeadResult> {
  const t = await getTranslations({ locale, namespace: 'ferramentas.redirectChecker.form.errors' })

  const rawDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  if (!rawDomain || !rawDomain.includes('.')) return { ok: false, error: t('dominioInvalido') }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) return { ok: false, error: t('emailInvalido') }

  const disposable = new Set([
    'mailinator.com', 'guerrillamail.com', 'temp-mail.org', 'yopmail.com',
    'trashmail.com', 'dispostable.com', 'spam4.me', 'throwam.com',
  ])
  if (disposable.has(email.split('@')[1].toLowerCase())) return { ok: false, error: t('emailProfissional') }

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

  // Falha no Monday nunca quebra a ferramenta (registrarLead não lança).
  await registrarLead({
    email: email.toLowerCase().trim(),
    nome: rawDomain,
    leadSource: 'redirect_checker',
    detalhe: `Redirect & Health Checker de ${rawDomain}`,
  })

  return { ok: true }
}
