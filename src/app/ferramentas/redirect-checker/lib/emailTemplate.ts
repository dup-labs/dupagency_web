export interface RedirectCheckSummary {
  domain:    string
  totalUrls: number
  ok:        number
  redirects: number
  errors:    number
  loops:     number
}

function crawlBudgetPct(s: RedirectCheckSummary): number {
  if (s.totalUrls === 0) return 0
  return Math.round(((s.redirects + s.errors + s.loops) / s.totalUrls) * 100)
}

function crawlColor(pct: number): string {
  if (pct < 10) return '#3D9688'
  if (pct < 30) return '#D4A017'
  return '#C04040'
}

interface ActionItem { color: string; category: string; action: string }

function topActions(s: RedirectCheckSummary): ActionItem[] {
  const items: ActionItem[] = []
  if (s.loops > 0)
    items.push({ color: '#C04040', category: 'Loop', action: `${s.loops} loop${s.loops > 1 ? 's' : ''} detectado${s.loops > 1 ? 's' : ''}. Revise as regras de redirecionamento — loops bloqueiam o Googlebot completamente.` })
  if (s.errors > 0)
    items.push({ color: '#D4A017', category: 'Erros', action: `${s.errors} URL${s.errors > 1 ? 's' : ''} com erro (4xx/5xx/timeout). Corrija ou remova do sitemap para não desperdiçar crawl budget.` })
  if (s.redirects > 0)
    items.push({ color: '#51A899', category: 'Redirects', action: `${s.redirects} URL${s.redirects > 1 ? 's' : ''} com redirect. Encurte as cadeias para economizar crawl budget e melhorar a velocidade de indexação.` })
  return items.slice(0, 3)
}

export function buildEmailHtml(summary: RedirectCheckSummary, resultUrl: string): string {
  const pct    = crawlBudgetPct(summary)
  const col    = crawlColor(pct)
  const items  = topActions(summary)
  const total  = summary.totalUrls

  // SVG circle — mesmo tamanho e padrão do geo-audit dial
  const r      = 50
  const circ   = 2 * Math.PI * r
  // mostra % de URLs problemáticas (redirect + error + loop)
  const filled = circ * ((summary.redirects + summary.errors + summary.loops) / Math.max(total, 1))

  // barras de progresso — mesmo estilo do geo-audit (SEO/GEO bars)
  const bar = (label: string, value: number, color: string) => {
    const pctBar = total > 0 ? Math.round((value / total) * 100) : 0
    return `<tr><td style="padding-bottom:16px">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">${label}</p></td>
        <td align="right"><p style="margin:0;font-size:13px;font-weight:700;color:${color}">${value}<span style="font-size:11px;font-weight:400;color:#bbb"> URLs</span></p></td>
      </tr></table>
      <div style="margin-top:8px;background:#e8e8e8;border-radius:4px;height:6px;overflow:hidden">
        <div style="background:${color};height:6px;width:${pctBar}%;border-radius:4px;max-width:100%"></div>
      </div>
    </td></tr>`
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8">

        <!-- cabeçalho com gradiente — mesmo padding do geo-audit -->
        <tr><td style="background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);padding:32px 40px 47px">
          <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.90);letter-spacing:0.04em">dup<span style="font-weight:700">.agency</span> &nbsp;·&nbsp; REDIRECT CHECKER</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">Seu relatório de URLs está pronto.</h1>
        </td></tr>

        <!-- stat hero — mesmo layout do score hero do geo-audit -->
        <tr><td style="padding:0 40px 28px">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:24px;vertical-align:middle">
              <svg width="120" height="120" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <!-- trilha cinza (total) -->
                <circle cx="64" cy="64" r="${r}" fill="none" stroke="#e1e1e1" stroke-width="10"/>
                <!-- arco colorido (problemáticas) -->
                <circle cx="64" cy="64" r="${r}" fill="none" stroke="${col}" stroke-width="10"
                  stroke-linecap="round"
                  stroke-dasharray="${filled.toFixed(2)} ${circ.toFixed(2)}"
                  stroke-dashoffset="${(circ * 0.25).toFixed(2)}"
                  transform="rotate(-90 64 64)"/>
                <!-- arco verde (ok) -->
                <circle cx="64" cy="64" r="${r}" fill="none" stroke="#3D9688" stroke-width="10"
                  stroke-linecap="round"
                  stroke-dasharray="${(circ * (summary.ok / Math.max(total, 1))).toFixed(2)} ${circ.toFixed(2)}"
                  stroke-dashoffset="${(circ * (1 - summary.ok / Math.max(total, 1))).toFixed(2)}"
                  transform="rotate(-90 64 64)"/>
                <text x="64" y="58" text-anchor="middle" font-size="26" font-weight="700" fill="${col}">${pct}%</text>
                <text x="64" y="76" text-anchor="middle" font-size="11" fill="#bbb">afetado</text>
              </svg>
            </td>
            <td style="vertical-align:middle">
              <p style="margin:0 0 4px;font-size:11px;color:#bbb;text-transform:uppercase;letter-spacing:0.08em">Crawl budget afetado</p>
              <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.05em">${summary.domain}</p>
              <p style="margin:0;font-size:12px;color:#676767">${summary.totalUrls.toLocaleString('pt-BR')} URLs verificadas</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- barras de breakdown — mesmo estilo das barras SEO/GEO -->
        <tr><td style="padding:0 40px 28px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${bar('OK — sem redirect', summary.ok, '#3D9688')}
            ${bar('Redirects', summary.redirects, '#897BBC')}
            ${bar('Erros (4xx / 5xx / timeout)', summary.errors, '#D4A017')}
            ${bar('Loops de redirecionamento', summary.loops, '#C04040')}
          </table>
        </td></tr>

        <!-- ações prioritárias — mesmo estilo do geo-audit -->
        ${items.length > 0 ? `
        <tr><td style="padding:0 40px 28px;border-top:1px solid #f0f0f0">
          <p style="margin:24px 0 16px;font-size:11px;font-weight:700;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.10em">Ações prioritárias</p>
          ${items.map((a) => `
          <div style="margin-bottom:10px;padding:12px 16px;background:#fafafa;border-radius:8px;border-left:3px solid ${a.color}">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${a.color};text-transform:uppercase;letter-spacing:0.08em">${a.category}</p>
            <p style="margin:0;font-size:13px;color:#3d3d3d;line-height:1.5">${a.action}</p>
          </div>`).join('')}
        </td></tr>` : `
        <tr><td style="padding:0 40px 28px;border-top:1px solid #f0f0f0">
          <p style="margin:24px 0 0;font-size:13px;color:#3d3d3d;text-align:center">🎉 Nenhum problema crítico detectado. Seu sitemap está saudável!</p>
        </td></tr>`}

        <!-- botão — idêntico ao geo-audit -->
        <tr><td style="padding:4px 40px 36px;text-align:center">
          <a href="${resultUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);color:#ffffff;font-size:11px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border-radius:100px">Ver relatório completo →</a>
        </td></tr>

        <!-- rodapé — idêntico ao geo-audit -->
        <tr><td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="margin:0;font-size:11px;color:#bbb">dup.agency · boutique de tecnologia para e-commerce</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}
