import { cookies } from 'next/headers'
import { ORIGIN_COOKIE, parseOriginCookie, formatDetalheOrigem, type LeadOrigin } from './origin'

/**
 * Board "Leads" do Monday: fonte oficial de leads do estudo (docs/medicao/plano.md).
 * Rótulos de status conferidos em 23/10/2026 no board real (leitura).
 */
const BOARD_ID = '18435549873'
const COL = {
  comoChegou: 'color_mm844vcx',
  etapa: 'color_mm84128s',
  whatsapp: 'phone_mm84vjgs',
  email: 'email_mm84j7gv',
  detalhe: 'text_mm84s4ss',
  dataEntrada: 'date_mm84bvkv',
  pre: 'boolean_mm84ke9y',
} as const

export type DadosLead = {
  email: string
  nome?: string // nome ou empresa; se vazio, usa o domínio/e-mail
  whatsapp?: string
  leadSource: 'lp' | 'geo_audit' | 'redirect_checker' | 'contato'
  lpSlug?: string
  detalhe?: string // ex.: "GEO Audit de exemplo.com"
}

export type ComoChegou =
  | 'Instagram' | 'LinkedIn' | 'Google (pesquisa)' | 'Anúncio'
  | 'Já fui cliente' | 'Indicação' | 'Outros'

/** Deduz o rótulo de "Como chegou" a partir da última origem (ou da primeira). */
export function inferirComoChegou(origem: LeadOrigin | null | undefined): ComoChegou {
  const t = origem?.last?.utm_source || origem?.last?.referrer ? origem.last : origem?.first ?? origem?.last
  const src = (t?.utm_source || t?.referrer || '').toLowerCase()
  const med = (t?.utm_medium || '').toLowerCase()
  if (med === 'cpc' || med === 'paid-social') return 'Anúncio'
  if (/instagram/.test(src)) return 'Instagram'
  if (/linkedin|lnkd/.test(src)) return 'LinkedIn'
  if (/google/.test(src)) return 'Google (pesquisa)'
  return 'Outros'
}

/** Lê a origem do cookie da requisição atual (só em server actions / route handlers). */
export async function lerOrigemDaRequisicao(): Promise<LeadOrigin> {
  try {
    const jar = await cookies()
    return parseOriginCookie(jar.get(ORIGIN_COOKIE)?.value)
  } catch {
    return {}
  }
}

function hojeSP(): string {
  // YYYY-MM-DD no fuso de São Paulo
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

export function montarColumnValues(dados: DadosLead, origem: LeadOrigin | null) {
  const detalhe = formatDetalheOrigem(
    origem,
    [`fonte: ${dados.leadSource}`, dados.lpSlug && `lp: ${dados.lpSlug}`, dados.detalhe]
      .filter(Boolean)
      .join(' | '),
  )
  const values: Record<string, unknown> = {
    [COL.comoChegou]: { label: inferirComoChegou(origem) },
    [COL.etapa]: { label: 'Novo' },
    [COL.email]: { email: dados.email, text: dados.email },
    [COL.detalhe]: detalhe,
    [COL.dataEntrada]: { date: hojeSP() },
    [COL.pre]: { checked: 'false' },
  }
  if (dados.whatsapp) values[COL.whatsapp] = { phone: dados.whatsapp, countryShortName: 'BR' }
  return values
}

/**
 * Cria o item no board Leads. NUNCA lança: falha no Monday não pode quebrar
 * a ferramenta. Retorna true se criou.
 */
export async function registrarLead(dados: DadosLead, origem?: LeadOrigin | null): Promise<boolean> {
  try {
    const token = process.env.MONDAY_API_TOKEN
    if (!token) {
      console.error('[monday] MONDAY_API_TOKEN ausente; lead não registrado')
      return false
    }
    const origemFinal = origem ?? (await lerOrigemDaRequisicao())
    const itemName = (dados.nome || dados.email).slice(0, 255)
    const res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token, 'API-Version': '2025-04' },
      body: JSON.stringify({
        query: `mutation ($board: ID!, $name: String!, $values: JSON!) {
          create_item(board_id: $board, item_name: $name, column_values: $values) { id }
        }`,
        variables: {
          board: BOARD_ID,
          name: itemName,
          values: JSON.stringify(montarColumnValues(dados, origemFinal)),
        },
      }),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || json?.errors || !json?.data?.create_item?.id) {
      console.error('[monday] erro ao criar lead:', res.status, JSON.stringify(json?.errors ?? json))
      return false
    }
    return true
  } catch (err) {
    console.error('[monday] falha ao registrar lead:', err instanceof Error ? err.message : err)
    return false
  }
}
