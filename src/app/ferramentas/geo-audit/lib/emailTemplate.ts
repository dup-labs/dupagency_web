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

export function buildEmailHtml(result: GeoAuditResult, resultUrl: string): string {
  const scoreColor =
    result.overall_score >= 70 ? '#51A899' :
    result.overall_score >= 50 ? '#897BBC' : '#D4A017'

  const circ   = 2 * Math.PI * 50
  const offset = circ * (1 - result.overall_score / 100)

  const topActions = result.action_plan.filter((a) => a.priority === 'alta').slice(0, 3)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8">

        <!-- cabeçalho com gradiente -->
        <tr><td style="background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);padding:32px 40px 47px">
          <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.90);letter-spacing:0.04em">dup<span style="font-weight:700">.agency</span> &nbsp;*&nbsp; GEO AUDIT</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">Seu resultado está pronto.</h1>
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
              <p style="margin:0 0 4px;font-size:11px;color:#bbb;text-transform:uppercase;letter-spacing:0.08em">Score geral</p>
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
                <td><p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">SEO Técnico</p></td>
                <td align="right"><p style="margin:0;font-size:13px;font-weight:700;color:#897BBC">${result.seo_score}<span style="font-size:11px;font-weight:400;color:#bbb">/100</span></p></td>
              </tr></table>
              <div style="margin-top:8px;background:#e8e8e8;border-radius:4px;height:6px;overflow:hidden">
                <div style="background:#897BBC;height:6px;width:${result.seo_score}%;border-radius:4px;max-width:100%"></div>
              </div>
            </td></tr>
            <tr><td>
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td><p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">GEO Readiness</p></td>
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
          <p style="margin:24px 0 16px;font-size:11px;font-weight:700;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.10em">Prioridades altas</p>
          ${topActions.map((a) => `<div style="margin-bottom:10px;padding:12px 16px;background:#fafafa;border-radius:8px;border-left:3px solid #C04040">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#A83333;text-transform:uppercase;letter-spacing:0.08em">${a.category}</p>
            <p style="margin:0;font-size:13px;color:#3d3d3d;line-height:1.5">${a.action}</p>
          </div>`).join('')}
        </td></tr>` : ''}

        <!-- botão -->
        <tr><td style="padding:4px 40px 36px;text-align:center">
          <a href="${resultUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);color:#ffffff;font-size:11px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border-radius:100px">Ver resultado completo →</a>
        </td></tr>

        <!-- rodapé -->
        <tr><td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="margin:0;font-size:11px;color:#bbb">dup.agency · boutique de tecnologia para e-commerce</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}
