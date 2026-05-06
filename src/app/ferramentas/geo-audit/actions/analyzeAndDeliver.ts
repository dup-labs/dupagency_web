'use server'

import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

// ---------- tipos ----------

export interface GeoAuditResult {
  url: string
  domain: string
  company_name: string
  overall_score: number
  seo_score: number
  geo_score: number
  seo: {
    title: string
    title_length: number
    description: string
    description_length: number
    og_image: string | null
    canonical: string | null
    h1_count: number
    h1_texts: string[]
    h2_count: number
    word_count: number
    images_total: number
    images_missing_alt: number
    schema_types: string[]
    has_organization_schema: boolean
    has_faq_schema: boolean
    score_breakdown: {
      meta_tags: number
      headings: number
      content: number
      images: number
      schema: number
    }
  }
  geo: {
    brand_clarity: { score: number; obs: string }
    citability: { score: number; obs: string }
    direct_answers: { score: number; obs: string }
    authority_signals: { score: number; obs: string }
    technical_structure: { score: number; obs: string }
  }
  action_plan: {
    priority: 'alta' | 'média' | 'baixa'
    category: string
    action: string
  }[]
}

// ---------- fetch HTML ----------

async function getBrowser() {
  if (process.env.NODE_ENV === 'development') {
    const puppeteer = await import('puppeteer-core')
    return puppeteer.default.launch({
      headless: true,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ??
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const chromium = require('@sparticuz/chromium') as {
    args: string[]
    executablePath: () => Promise<string>
  }
  const puppeteer = await import('puppeteer-core')
  return puppeteer.default.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  })
}

async function fetchHtmlPuppeteer(url: string): Promise<string> {
  let browser
  try {
    browser = await getBrowser()
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; DupGeoAudit/1.0; +https://dup.agency)',
    )
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20_000 })
    // Aguarda o body ter conteúdo real (JS renderizado)
    await page.waitForSelector('body', { timeout: 5_000 }).catch(() => {})
    const html = await page.content()
    return html.slice(0, 25_000)
  } finally {
    await browser?.close()
  }
}

async function fetchHtmlSimple(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DupGeoAudit/1.0; +https://dup.agency)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    })
    const text = await res.text()
    return text.slice(0, 25_000)
  } catch {
    return ''
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchHtml(url: string): Promise<string> {
  try {
    return await fetchHtmlPuppeteer(url)
  } catch {
    // fallback para fetch simples se Puppeteer falhar
    return await fetchHtmlSimple(url)
  }
}

// ---------- Claude analysis ----------

const ANALYSIS_SCHEMA = `{
  "url": string,
  "domain": string,
  "company_name": string,
  "overall_score": number (0-100),
  "seo_score": number (0-100),
  "geo_score": number (0-100),
  "seo": {
    "title": string,
    "title_length": number,
    "description": string,
    "description_length": number,
    "og_image": string | null,
    "canonical": string | null,
    "h1_count": number,
    "h1_texts": string[],
    "h2_count": number,
    "word_count": number (estimate from visible text),
    "images_total": number,
    "images_missing_alt": number (images with empty or missing alt),
    "schema_types": string[] (list of @type values found in ld+json),
    "has_organization_schema": boolean,
    "has_faq_schema": boolean,
    "score_breakdown": {
      "meta_tags": number (0-100),
      "headings": number (0-100),
      "content": number (0-100),
      "images": number (0-100),
      "schema": number (0-100)
    }
  },
  "geo": {
    "brand_clarity": { "score": number (0-10), "obs": string in pt-BR },
    "citability": { "score": number (0-10), "obs": string in pt-BR },
    "direct_answers": { "score": number (0-10), "obs": string in pt-BR },
    "authority_signals": { "score": number (0-10), "obs": string in pt-BR },
    "technical_structure": { "score": number (0-10), "obs": string in pt-BR }
  },
  "action_plan": [
    { "priority": "alta"|"média"|"baixa", "category": string in pt-BR, "action": string in pt-BR }
  ] (8-12 items, ordered by impact, all text in pt-BR)
}`

async function analyzeWithClaude(url: string, html: string): Promise<GeoAuditResult> {
  const prompt = `Você é um especialista em SEO técnico e GEO (Generative Engine Optimization).
Analise o HTML abaixo e retorne APENAS JSON válido, sem markdown, sem explicações.

URL: ${url}
HTML (truncado):
${html || '(não foi possível acessar o HTML — faça estimativas baseadas no domínio)'}

Retorne exatamente este schema JSON:
${ANALYSIS_SCHEMA}

Regras:
- Scores SEO: calcule com base nos dados reais do HTML
- Scores GEO (0-10): avalie a qualidade estrutural para ser citado por IAs
- overall_score = (seo_score * 0.6 + geo_score_normalized * 0.4) onde geo_score_normalized = (soma das 5 categorias geo / 50) * 100
- obs nos campos GEO: frases curtas e específicas em português, descrevendo o problema real
- action_plan: ações concretas e específicas em português, não genéricas
- company_name: extraia do title, og:site_name, ou do domínio`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extrai JSON da resposta (remove possíveis blocos markdown)
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude não retornou JSON válido')

  return JSON.parse(jsonMatch[0]) as GeoAuditResult
}

// ---------- email ----------

function buildEmailHtml(result: GeoAuditResult, resultUrl: string): string {
  const scoreColor =
    result.overall_score >= 70 ? '#51A899' :
    result.overall_score >= 50 ? '#897BBC' : '#D4A017'

  const topActions = result.action_plan
    .filter((a) => a.priority === 'alta')
    .slice(0, 3)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);padding:32px 40px">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.80)">GEO AUDIT · DUP.AGENCY</p>
          <h1 style="margin:12px 0 0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">
            Seu resultado está pronto!
          </h1>
        </td></tr>

        <!-- Score card -->
        <tr><td style="padding:32px 40px 24px">
          <p style="margin:0 0 8px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Score geral de</p>
          <p style="margin:0 0 4px;font-size:14px;color:#666">${result.domain}</p>
          <p style="margin:0 0 24px;font-size:64px;font-weight:700;line-height:1;color:${scoreColor}">${result.overall_score}<span style="font-size:24px;color:#ccc">/100</span></p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-right:8px">
                <div style="background:#f8f8f8;border-radius:10px;padding:16px;text-align:center">
                  <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.06em">SEO Técnico</p>
                  <p style="margin:0;font-size:28px;font-weight:700;color:#897BBC">${result.seo_score}</p>
                </div>
              </td>
              <td width="50%" style="padding-left:8px">
                <div style="background:#f8f8f8;border-radius:10px;padding:16px;text-align:center">
                  <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.06em">GEO Readiness</p>
                  <p style="margin:0;font-size:28px;font-weight:700;color:#51A899">${result.geo_score}</p>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Top prioridades -->
        ${topActions.length > 0 ? `
        <tr><td style="padding:0 40px 24px">
          <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.08em">Prioridades altas</p>
          ${topActions.map((a) => `
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;padding:12px 14px;background:#fff5f5;border-radius:8px;border-left:3px solid #C04040">
            <span style="font-size:11px;font-weight:600;color:#A83333;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;margin-top:1px">${a.category}</span>
            <span style="font-size:13px;color:#3d3d3d;line-height:1.5">${a.action}</span>
          </div>`).join('')}
        </td></tr>` : ''}

        <!-- CTA -->
        <tr><td style="padding:0 40px 32px;text-align:center">
          <a href="${resultUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:100px;letter-spacing:0.02em">
            Ver resultado completo →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="margin:0;font-size:12px;color:#999">dup.agency · boutique de tecnologia para e-commerce</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ---------- Attio ----------

async function upsertAttio(result: GeoAuditResult, email: string): Promise<void> {
  const apiKey = process.env.ATTIO_API_KEY
  if (!apiKey) return

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  // Upsert empresa pelo domínio
  let companyId: string | null = null
  try {
    const companyRes = await fetch('https://api.attio.com/v2/objects/companies/records', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        data: {
          values: {
            domains: [{ domain: result.domain }],
            name: [{ value: result.company_name }],
          },
        },
        matching_attribute: 'domains',
      }),
    })
    const companyData = await companyRes.json()
    companyId = companyData?.data?.id?.record_id ?? null
  } catch { /* ignora falhas do CRM */ }

  // Upsert pessoa pelo e-mail
  let personId: string | null = null
  try {
    const personRes = await fetch('https://api.attio.com/v2/objects/people/records', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        data: {
          values: {
            email_addresses: [{ email_address: email }],
          },
        },
        matching_attribute: 'email_addresses',
      }),
    })
    const personData = await personRes.json()
    personId = personData?.data?.id?.record_id ?? null
  } catch { /* ignora */ }

  // Vincula pessoa à empresa
  if (personId && companyId) {
    try {
      await fetch(`https://api.attio.com/v2/objects/people/records/${personId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          data: {
            values: {
              company: [{ target_object: 'companies', target_record_id: companyId }],
            },
          },
        }),
      })
    } catch { /* ignora */ }
  }

  // Adiciona nota com o resultado
  if (personId) {
    try {
      await fetch('https://api.attio.com/v2/notes', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            parent_object: 'people',
            parent_record_id: personId,
            title: `GEO Audit — ${result.domain} — Score ${result.overall_score}/100`,
            format: 'plaintext',
            content: `URL: ${result.url}\nScore geral: ${result.overall_score}/100\nSEO: ${result.seo_score} | GEO: ${result.geo_score}\n\nPrioridades altas:\n${result.action_plan.filter((a) => a.priority === 'alta').map((a) => `• [${a.category}] ${a.action}`).join('\n')}`,
          },
        }),
      })
    } catch { /* ignora */ }
  }
}

// ---------- entry point ----------

export async function analyzeAndDeliver(
  hash: string,
  url: string,
  email: string,
): Promise<void> {
  try {
    // Marca como "analisando"
    await supabase
      .from('geo_audits')
      .update({ status: 'analyzing' })
      .eq('hash', hash)

    const html = await fetchHtml(url)
    const result = await analyzeWithClaude(url, html)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dup.agency'
    const resultUrl = `${baseUrl}/ferramentas/geo-audit/resultado/${hash}`

    // Salva resultado
    await supabase
      .from('geo_audits')
      .update({
        status: 'ready',
        seo_score: result.seo_score,
        geo_score: result.geo_score,
        overall_score: result.overall_score,
        result_data: result,
        processed_at: new Date().toISOString(),
      })
      .eq('hash', hash)

    // Envia e-mail (não bloqueia se falhar)
    resend.emails.send({
      from: process.env.RESEND_FROM ?? 'GEO Audit <audit@dup.agency>',
      to: email,
      subject: `Seu GEO Audit está pronto — Score ${result.overall_score}/100`,
      html: buildEmailHtml(result, resultUrl),
    }).catch(() => {})

    // CRM Attio
    upsertAttio(result, email).catch(() => {})
  } catch (err) {
    await supabase
      .from('geo_audits')
      .update({
        status: 'error',
        error_message: err instanceof Error ? err.message : String(err),
        processed_at: new Date().toISOString(),
      })
      .eq('hash', hash)
  }
}
