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

interface DomMetrics {
  title: string
  description: string
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical: string | null
  h1s: string[]
  h2s: string[]
  images_total: number
  images_missing_alt: number
  schema_types: string[]
  has_organization_schema: boolean
  has_faq_schema: boolean
  word_count: number
  body_text: string
}

// ---------- browser ----------

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

// ---------- extração DOM ----------

async function extractDomMetrics(url: string): Promise<DomMetrics> {
  let browser
  try {
    browser = await getBrowser()
    const page = await browser.newPage()

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    )
    await page.setViewport({ width: 1280, height: 800 })

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 })

    // Aguarda a rede estabilizar E o React/Helmet setar o title
    // VTEX IO usa react-helmet que seta o title após hidratação
    await Promise.race([
      // Opção 1: networkidle (sem requests por 500ms)
      page.waitForNetworkIdle({ idleTime: 500, timeout: 15_000 }).catch(() => {}),
      // Opção 2: title preenchido com conteúdo real
      page.waitForFunction(
        () => document.title.length > 5 &&
              !['Loading', 'Carregando', '...'].some(s => document.title.includes(s)),
        { timeout: 15_000, polling: 200 },
      ).catch(() => {}),
    ])

    // Extra: aguarda H1 aparecer no DOM (confirma hidratação React)
    await page.waitForSelector('h1', { timeout: 5_000 }).catch(() => {})

    // Pausa mínima para scripts assíncronos finalizarem (ex: GTM, analytics que modificam DOM)
    await new Promise((r) => setTimeout(r, 1000))

    // Extrai diretamente do DOM renderizado
    const metrics: DomMetrics = await page.evaluate(() => {
      const getMeta = (sel: string) =>
        document.querySelector(sel)?.getAttribute('content') ?? null

      const schemas = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      )
        .map((s) => { try { return JSON.parse(s.textContent ?? '') } catch { return null } })
        .filter(Boolean)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schemaTypes: string[] = schemas.flatMap((s: any) =>
        s['@type']
          ? Array.isArray(s['@type']) ? s['@type'] : [s['@type']]
          : [],
      )

      const imgs = Array.from(document.querySelectorAll('img'))
      const bodyText = document.body.innerText ?? ''
      const words = bodyText.split(/\s+/).filter((w) => w.length > 2)

      return {
        title: document.title?.trim() ?? '',
        description: getMeta('meta[name="description"]') ?? '',
        og_title: getMeta('meta[property="og:title"]'),
        og_description: getMeta('meta[property="og:description"]'),
        og_image: getMeta('meta[property="og:image"]'),
        canonical:
          document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
        h1s: Array.from(document.querySelectorAll('h1'))
          .map((h) => h.textContent?.trim() ?? '')
          .filter(Boolean),
        h2s: Array.from(document.querySelectorAll('h2'))
          .map((h) => h.textContent?.trim() ?? '')
          .filter(Boolean),
        images_total: imgs.length,
        images_missing_alt: imgs.filter(
          (img) => !img.getAttribute('alt') || img.getAttribute('alt') === '',
        ).length,
        schema_types: schemaTypes,
        has_organization_schema: schemaTypes.some((t) =>
          ['Organization', 'LocalBusiness', 'Corporation', 'Store'].includes(t),
        ),
        has_faq_schema: schemaTypes.some((t) => t === 'FAQPage'),
        word_count: words.length,
        body_text: bodyText.slice(0, 6000),
      }
    })

    return metrics
  } finally {
    await browser?.close()
  }
}

// fallback sem JS para quando Puppeteer falhar
async function extractDomMetricsFallback(url: string): Promise<DomMetrics> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  let html = ''
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DupGeoAudit/1.0)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    })
    html = await res.text()
  } catch {
    // sem conteúdo
  } finally {
    clearTimeout(timeout)
  }

  // Parse manual mínimo com regex para o fallback
  const getTag = (re: RegExp) => re.exec(html)?.[1]?.trim() ?? ''
  const title = getTag(/<title[^>]*>([^<]*)<\/title>/i)
  const description = getTag(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || getTag(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)
  const og_image = getTag(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)
  const canonical = getTag(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
  const h1s = Array.from(html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi)).map((m) => m[1].trim()).filter(Boolean)
  const h2s = Array.from(html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi)).map((m) => m[1].trim()).filter(Boolean)
  const imgs = (html.match(/<img /gi) ?? []).length
  const imgsWithAlt = (html.match(/<img[^>]+alt=["'][^"']+["']/gi) ?? []).length

  return {
    title, description,
    og_title: null, og_description: null,
    og_image: og_image || null,
    canonical: canonical || null,
    h1s, h2s,
    images_total: imgs,
    images_missing_alt: imgs - imgsWithAlt,
    schema_types: [],
    has_organization_schema: false,
    has_faq_schema: false,
    word_count: 0,
    body_text: '',
  }
}

// ---------- SEO score (determinístico) ----------

function calcSeoScore(dom: DomMetrics) {
  // Meta tags — 0-100
  let meta = 0
  if (dom.title) meta += 25
  if (dom.title.length >= 10 && dom.title.length <= 60) meta += 15
  if (dom.description) meta += 20
  if (dom.description.length >= 50 && dom.description.length <= 160) meta += 10
  if (dom.og_image) meta += 15
  if (dom.canonical) meta += 15
  const meta_tags = Math.min(100, meta)

  // Headings — 0-100
  let headings = 0
  if (dom.h1s.length === 1) headings += 60
  else if (dom.h1s.length > 1) headings += 25
  if (dom.h2s.length >= 3) headings += 40
  else if (dom.h2s.length >= 1) headings += 20
  headings = Math.min(100, headings)

  // Conteúdo — 0-100
  const content =
    dom.word_count >= 800 ? 100 :
    dom.word_count >= 400 ? 70 :
    dom.word_count >= 150 ? 40 :
    dom.word_count >= 50  ? 20 : 5

  // Imagens — 0-100
  const images =
    dom.images_total === 0 ? 50 :
    Math.round(((dom.images_total - dom.images_missing_alt) / dom.images_total) * 100)

  // Schema — 0-100
  let schema = 0
  if (dom.schema_types.length > 0) schema += 30
  if (dom.has_organization_schema) schema += 40
  if (dom.has_faq_schema) schema += 30
  schema = Math.min(100, schema)

  const score = Math.round(
    meta_tags * 0.30 +
    headings  * 0.20 +
    content   * 0.20 +
    images    * 0.15 +
    schema    * 0.15,
  )

  return { score, score_breakdown: { meta_tags, headings, content, images, schema } }
}

// ---------- Claude — só análise qualitativa GEO ----------

async function analyzeGeo(url: string, domain: string, dom: DomMetrics): Promise<{
  company_name: string
  geo: GeoAuditResult['geo']
  action_plan: GeoAuditResult['action_plan']
}> {
  const context = `URL: ${url}
Title: ${dom.title || '(ausente)'}
Meta Description: ${dom.description || '(ausente)'}
OG Image: ${dom.og_image ? 'presente' : '(ausente)'}
Canonical: ${dom.canonical || '(ausente)'}
H1s (${dom.h1s.length}): ${dom.h1s.slice(0, 5).join(' | ') || '(nenhum)'}
H2s (${dom.h2s.length}): ${dom.h2s.slice(0, 10).join(' | ') || '(nenhum)'}
Schema types: ${dom.schema_types.join(', ') || '(nenhum)'}
Imagens: ${dom.images_total} total, ${dom.images_missing_alt} sem alt text
Palavras estimadas: ${dom.word_count}

Texto visível da página:
${dom.body_text || '(não disponível)'}`

  const prompt = `Você é um especialista em GEO (Generative Engine Optimization).
Com base nos dados extraídos do DOM renderizado do site abaixo, faça a análise qualitativa.
Retorne APENAS JSON válido, sem markdown.

${context}

Retorne exatamente este JSON:
{
  "company_name": string (nome real da empresa, não o domínio),
  "geo": {
    "brand_clarity":      { "score": 0-10, "obs": "frase específica em pt-BR sobre o problema" },
    "citability":         { "score": 0-10, "obs": "frase específica em pt-BR" },
    "direct_answers":     { "score": 0-10, "obs": "frase específica em pt-BR" },
    "authority_signals":  { "score": 0-10, "obs": "frase específica em pt-BR" },
    "technical_structure":{ "score": 0-10, "obs": "frase específica em pt-BR" }
  },
  "action_plan": [
    { "priority": "alta"|"média"|"baixa", "category": "...", "action": "ação concreta e específica em pt-BR" }
  ]
}

Regras:
- action_plan: 8-12 itens ordenados por impacto, ações concretas e específicas (não genéricas)
- obs: descreva o problema real encontrado nos dados, não apenas o que está faltando
- company_name: use o nome real da empresa (ex: "OneUp", "FOM", "Bennemann")`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude não retornou JSON válido')

  return JSON.parse(jsonMatch[0])
}

// ---------- email ----------

function buildEmailHtml(result: GeoAuditResult, resultUrl: string): string {
  const scoreColor =
    result.overall_score >= 70 ? '#51A899' :
    result.overall_score >= 50 ? '#897BBC' : '#D4A017'

  const topActions = result.action_plan.filter((a) => a.priority === 'alta').slice(0, 3)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <tr><td style="background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);padding:32px 40px">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.80)">GEO AUDIT · DUP.AGENCY</p>
          <h1 style="margin:12px 0 0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">Seu resultado está pronto!</h1>
        </td></tr>
        <tr><td style="padding:32px 40px 24px">
          <p style="margin:0 0 8px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Score geral de</p>
          <p style="margin:0 0 4px;font-size:14px;color:#666">${result.domain}</p>
          <p style="margin:0 0 24px;font-size:64px;font-weight:700;line-height:1;color:${scoreColor}">${result.overall_score}<span style="font-size:24px;color:#ccc">/100</span></p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
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
          </tr></table>
        </td></tr>
        ${topActions.length > 0 ? `
        <tr><td style="padding:0 40px 24px">
          <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.08em">Prioridades altas</p>
          ${topActions.map((a) => `<div style="margin-bottom:12px;padding:12px 14px;background:#fff5f5;border-radius:8px;border-left:3px solid #C04040">
            <span style="font-size:11px;font-weight:600;color:#A83333;text-transform:uppercase;letter-spacing:0.06em">${a.category}</span>
            <p style="margin:4px 0 0;font-size:13px;color:#3d3d3d;line-height:1.5">${a.action}</p>
          </div>`).join('')}
        </td></tr>` : ''}
        <tr><td style="padding:0 40px 32px;text-align:center">
          <a href="${resultUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:100px">Ver resultado completo →</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="margin:0;font-size:12px;color:#999">dup.agency · boutique de tecnologia para e-commerce</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

// ---------- Attio ----------

async function upsertAttio(result: GeoAuditResult, email: string): Promise<void> {
  const apiKey = process.env.ATTIO_API_KEY
  if (!apiKey) return

  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }

  let companyId: string | null = null
  try {
    const res = await fetch('https://api.attio.com/v2/objects/companies/records', {
      method: 'PUT', headers,
      body: JSON.stringify({ data: { values: { domains: [{ domain: result.domain }], name: [{ value: result.company_name }] } }, matching_attribute: 'domains' }),
    })
    companyId = (await res.json())?.data?.id?.record_id ?? null
  } catch { /* ignora */ }

  let personId: string | null = null
  try {
    const res = await fetch('https://api.attio.com/v2/objects/people/records', {
      method: 'PUT', headers,
      body: JSON.stringify({ data: { values: { email_addresses: [{ email_address: email }] } }, matching_attribute: 'email_addresses' }),
    })
    personId = (await res.json())?.data?.id?.record_id ?? null
  } catch { /* ignora */ }

  if (personId && companyId) {
    try {
      await fetch(`https://api.attio.com/v2/objects/people/records/${personId}`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ data: { values: { company: [{ target_object: 'companies', target_record_id: companyId }] } } }),
      })
    } catch { /* ignora */ }
  }

  if (personId) {
    try {
      await fetch('https://api.attio.com/v2/notes', {
        method: 'POST', headers,
        body: JSON.stringify({ data: {
          parent_object: 'people', parent_record_id: personId,
          title: `GEO Audit — ${result.domain} — Score ${result.overall_score}/100`,
          format: 'plaintext',
          content: `URL: ${result.url}\nScore: ${result.overall_score}/100 | SEO: ${result.seo_score} | GEO: ${result.geo_score}\n\nPrioridades altas:\n${result.action_plan.filter((a) => a.priority === 'alta').map((a) => `• [${a.category}] ${a.action}`).join('\n')}`,
        } }),
      })
    } catch { /* ignora */ }
  }
}

// ---------- entry point ----------

export async function analyzeAndDeliver(hash: string, url: string, email: string): Promise<void> {
  try {
    await supabase.from('geo_audits').update({ status: 'analyzing' }).eq('hash', hash)

    const domain = new URL(url).hostname.replace(/^www\./, '')

    // 1. Extrai métricas do DOM renderizado (com fallback)
    let dom: DomMetrics
    try {
      dom = await extractDomMetrics(url)
    } catch {
      dom = await extractDomMetricsFallback(url)
    }

    // 2. Calcula SEO score de forma determinística
    const { score: seo_score, score_breakdown } = calcSeoScore(dom)

    // 3. Claude faz apenas a análise qualitativa GEO
    const { company_name, geo, action_plan } = await analyzeGeo(url, domain, dom)

    // 4. Calcula GEO score e overall
    const geo_sum = geo.brand_clarity.score + geo.citability.score + geo.direct_answers.score + geo.authority_signals.score + geo.technical_structure.score
    const geo_score = Math.round((geo_sum / 50) * 100)
    const overall_score = Math.round(seo_score * 0.6 + geo_score * 0.4)

    const result: GeoAuditResult = {
      url, domain, company_name,
      overall_score, seo_score, geo_score,
      seo: {
        title: dom.title,
        title_length: dom.title.length,
        description: dom.description,
        description_length: dom.description.length,
        og_image: dom.og_image,
        canonical: dom.canonical,
        h1_count: dom.h1s.length,
        h1_texts: dom.h1s.slice(0, 5),
        h2_count: dom.h2s.length,
        word_count: dom.word_count,
        images_total: dom.images_total,
        images_missing_alt: dom.images_missing_alt,
        schema_types: dom.schema_types,
        has_organization_schema: dom.has_organization_schema,
        has_faq_schema: dom.has_faq_schema,
        score_breakdown,
      },
      geo,
      action_plan,
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dup.agency'
    const resultUrl = `${baseUrl}/ferramentas/geo-audit/resultado/${hash}`

    await supabase.from('geo_audits').update({
      status: 'ready',
      seo_score, geo_score, overall_score,
      result_data: result,
      processed_at: new Date().toISOString(),
    }).eq('hash', hash)

    resend.emails.send({
      from: process.env.RESEND_FROM ?? 'GEO Audit <audit@dup.agency>',
      to: email,
      subject: `Seu GEO Audit está pronto — Score ${overall_score}/100`,
      html: buildEmailHtml(result, resultUrl),
    }).catch(() => {})

    upsertAttio(result, email).catch(() => {})
  } catch (err) {
    await supabase.from('geo_audits').update({
      status: 'error',
      error_message: err instanceof Error ? err.message : String(err),
      processed_at: new Date().toISOString(),
    }).eq('hash', hash)
  }
}
