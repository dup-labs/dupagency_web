export interface RedirectCheckSummary {
  domain: string
  totalUrls: number
  ok: number
  redirects: number
  errors: number
  loops: number
}

function crawlBudgetPct(s: RedirectCheckSummary): number {
  if (s.totalUrls === 0) return 0
  return Math.round(((s.redirects + s.errors + s.loops) / s.totalUrls) * 100)
}

function crawlColor(pct: number): string {
  if (pct < 10) return '#3D9688'
  if (pct < 30) return '#9A7A00'
  return '#A83333'
}

interface ActionItem {
  color: string
  category: string
  action: string
}

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
  const pct   = crawlBudgetPct(summary)
  const col   = crawlColor(pct)
  const items = topActions(summary)

  const card = (emoji: string, value: number | string, label: string, color = '#0d0d0d') =>
    `<td align="center" style="padding:0 8px">
       <div style="background:#fafafa;border:1px solid #e8e8e8;border-radius:12px;padding:16px 12px;min-width:80px">
         <p style="margin:0 0 6px;font-size:18px">${emoji}</p>
         <p style="margin:0 0 2px;font-size:20px;font-weight:700;color:${color};line-height:1">${value}</p>
         <p style="margin:0;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.08em">${label}</p>
       </div>
     </td>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8">

        <!-- header gradiente -->
        <tr><td style="background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);padding:32px 40px 40px">
          <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.90);letter-spacing:0.04em">dup<span style="font-weight:700">.agency</span> &nbsp;·&nbsp; REDIRECT CHECKER</p>
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">Seu relatório de URLs está pronto.</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.80)">${summary.domain.toUpperCase()}</p>
        </td></tr>

        <!-- cards de resumo -->
        <tr><td style="padding:32px 40px 8px">
          <table cellpadding="0" cellspacing="0" style="width:100%"><tr>
            ${card('✅', summary.ok,        'OK')}
            ${card('🔀', summary.redirects, 'Redirects')}
            ${card('❌', summary.errors,    'Erros')}
            ${card('🔁', summary.loops,     'Loops')}
            ${card('🕷️', `${pct}%`,        'Crawl budget', col)}
          </tr></table>
          <p style="margin:16px 0 0;font-size:12px;color:#999;text-align:center">${summary.totalUrls} URLs verificadas no total</p>
        </td></tr>

        <!-- ações prioritárias -->
        ${items.length > 0 ? `
        <tr><td style="padding:24px 40px 8px;border-top:1px solid #f0f0f0">
          <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#0d0d0d;text-transform:uppercase;letter-spacing:0.10em">Ações prioritárias</p>
          ${items.map((a) => `
          <div style="margin-bottom:10px;padding:12px 16px;background:#fafafa;border-radius:8px;border-left:3px solid ${a.color}">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${a.color}">${a.category}</p>
            <p style="margin:0;font-size:13px;color:#3d3d3d;line-height:1.5">${a.action}</p>
          </div>`).join('')}
        </td></tr>` : `
        <tr><td style="padding:24px 40px 8px;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:13px;color:#3d3d3d;text-align:center">🎉 Nenhum problema crítico detectado. Seu sitemap está saudável!</p>
        </td></tr>`}

        <!-- botão CTA -->
        <tr><td style="padding:28px 40px 36px;text-align:center">
          <a href="${resultUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#AFD7D0 0%,#897BBC 100%);color:#ffffff;font-size:11px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border-radius:100px">Ver relatório completo →</a>
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
