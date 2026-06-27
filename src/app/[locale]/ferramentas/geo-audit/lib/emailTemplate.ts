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
    has_hreflang: boolean
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

type Locale = 'pt' | 'en' | 'es'

interface EmailCopy {
  htmlLang:       string
  kicker:         string
  headline:       string
  scoreLabel:     string
  seoLabel:       string
  geoLabel:       string
  prioritiesLabel: string
  ctaButton:      string
  footerLine:     string
}

const COPY: Record<Locale, EmailCopy> = {
  pt: {
    htmlLang:        'pt-BR',
    kicker:          'GEO AUDIT',
    headline:        'Seu resultado está pronto.',
    scoreLabel:      'Score geral',
    seoLabel:        'SEO Técnico',
    geoLabel:        'GEO Readiness',
    prioritiesLabel: 'Prioridades altas',
    ctaButton:       'Ver resultado completo →',
    footerLine:      'dup.agency — 2026',
  },
  en: {
    htmlLang:        'en',
    kicker:          'GEO AUDIT',
    headline:        'Your results are ready.',
    scoreLabel:      'Overall score',
    seoLabel:        'Technical SEO',
    geoLabel:        'GEO Readiness',
    prioritiesLabel: 'High priorities',
    ctaButton:       'See full results →',
    footerLine:      'dup.agency — 2026',
  },
  es: {
    htmlLang:        'es',
    kicker:          'GEO AUDIT',
    headline:        'Tu resultado está listo.',
    scoreLabel:      'Score general',
    seoLabel:        'SEO Técnico',
    geoLabel:        'GEO Readiness',
    prioritiesLabel: 'Prioridades altas',
    ctaButton:       'Ver resultado completo →',
    footerLine:      'dup.agency — 2026',
  },
}

function dict(locale: string): EmailCopy {
  return COPY[(locale as Locale)] ?? COPY.pt
}

export function buildEmailHtml(result: GeoAuditResult, resultUrl: string, locale: string = 'pt'): string {
  const c = dict(locale)

  const scoreColor =
    result.overall_score >= 70 ? '#51A899' :
    result.overall_score >= 50 ? '#897BBC' : '#D4A017'

  const circ   = 2 * Math.PI * 50
  const offset = circ * (1 - result.overall_score / 100)

  const topActions = result.action_plan.filter((a) => a.priority === 'alta').slice(0, 3)

  return `<!DOCTYPE html>
<html lang="${c.htmlLang}" style="color-scheme:light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <style>:root,body{color-scheme:light}</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color-scheme:light">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8">

        <!-- cabeçalho com gradiente -->
        <tr><td style="background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);padding:32px 40px 47px">
          <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.90);letter-spacing:0.04em">dup<span style="font-weight:700">.agency</span> &nbsp;*&nbsp; ${c.kicker}</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">${c.headline}</h1>
        </td></tr>

        <!-- score hero -->
        <tr><td style="padding:0 40px 28px">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:24px;vertical-align:middle">
              <svg width="120" height="120" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="50" fill="none" stroke="#e1e1e1" stroke-width="10"/>
                <circle cx="64" cy="64" r="50" fill="none" stroke="${scoreColor}" stroke-width="10"
                  stroke-linecap="round" stroke-dasharray="${circ.toFixed(2)}"
                  stroke-dashoffset="${offset.toFixed(2)}" transform="rotate(-90 64 64)"/>
                <text x="64" y="58" text-anchor="middle" font-size="26" font-weight="700" fill="${scoreColor}">${result.overall_score}</text>
                <text x="64" y="76" text-anchor="middle" font-size="11" fill="#bbb">/100</text>
              </svg>
            </td>
            <td style="vertical-align:middle">
              <p style="margin:0 0 4px;font-size:11px;color:#bbb;text-transform:uppercase;letter-spacing:0.08em">${c.scoreLabel}</p>
              <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.05em">${result.domain}</p>
              <p style="margin:0;font-size:12px;color:#676767">${result.company_name}</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- barras SEO / GEO -->
        <tr><td style="padding:0 40px 28px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:16px">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td><p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">${c.seoLabel}</p></td>
                <td align="right"><p style="margin:0;font-size:13px;font-weight:700;color:#897BBC">${result.seo_score}<span style="font-size:11px;font-weight:400;color:#bbb">/100</span></p></td>
              </tr></table>
              <div style="margin-top:8px;background:#e8e8e8;border-radius:4px;height:6px;overflow:hidden">
                <div style="background:#897BBC;height:6px;width:${result.seo_score}%;border-radius:4px;max-width:100%"></div>
              </div>
            </td></tr>
            <tr><td>
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td><p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">${c.geoLabel}</p></td>
                <td align="right"><p style="margin:0;font-size:13px;font-weight:700;color:#51A899">${result.geo_score}<span style="font-size:11px;font-weight:400;color:#bbb">/100</span></p></td>
              </tr></table>
              <div style="margin-top:8px;background:#e8e8e8;border-radius:4px;height:6px;overflow:hidden">
                <div style="background:#51A899;height:6px;width:${result.geo_score}%;border-radius:4px;max-width:100%"></div>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- prioridades altas -->
        ${topActions.length > 0 ? `
        <tr><td style="padding:0 40px 28px;border-top:1px solid #f0f0f0">
          <p style="margin:24px 0 16px;font-size:11px;font-weight:700;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.10em">${c.prioritiesLabel}</p>
          ${topActions.map((a) => `<div style="margin-bottom:10px;padding:12px 16px;background:#fafafa;border-radius:8px;border-left:3px solid #C04040">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#A83333;text-transform:uppercase;letter-spacing:0.08em">${a.category}</p>
            <p style="margin:0;font-size:13px;color:#3d3d3d;line-height:1.5">${a.action}</p>
          </div>`).join('')}
        </td></tr>` : ''}

        <!-- botão -->
        <tr><td style="padding:4px 40px 36px;text-align:center">
          <a href="${resultUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);color:#ffffff;font-size:11px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border-radius:100px">${c.ctaButton}</a>
        </td></tr>

        <!-- rodapé preto -->
        <tr><td style="background:#0d0d0d;padding:28px 40px 32px;border-top:1px solid #1a1a1a;text-align:center">
          <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 16px"><tr>
            <td style="padding:0 12px"><a href="https://www.instagram.com/dup.agency" target="_blank" rel="noopener noreferrer" style="display:inline-block"><svg width="20" height="20" viewBox="0 0 24 24" fill="#555555" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a></td>
            <td style="padding:0 12px"><a href="https://open.spotify.com/playlist/6QH8ouatvWzVQUp52uCZQL?si=fA6XtpCfQ_CMLkLt2QedQg&pi=dNgsB0zUQYizS" target="_blank" rel="noopener noreferrer" style="display:inline-block"><svg width="20" height="20" viewBox="0 0 24 24" fill="#555555" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg></a></td>
            <td style="padding:0 12px"><a href="https://wa.me/5511973558096" target="_blank" rel="noopener noreferrer" style="display:inline-block"><svg width="20" height="20" viewBox="0 0 24 24" fill="#555555" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a></td>
            <td style="padding:0 12px"><a href="https://www.linkedin.com/company/dupagency/" target="_blank" rel="noopener noreferrer" style="display:inline-block"><svg width="20" height="20" viewBox="0 0 24 24" fill="#555555" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a></td>
          </tr></table>
          <p style="margin:0;font-size:11px;color:#3d3d3d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">${c.footerLine}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}
