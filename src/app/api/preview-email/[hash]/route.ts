import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { buildEmailHtml, type GeoAuditResult } from '@/app/ferramentas/geo-audit/lib/emailTemplate'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params

  if (!hash || !/^[0-9a-f]{32}$/.test(hash)) {
    return new NextResponse('hash inválido', { status: 400 })
  }

  const { data, error } = await supabase
    .from('geo_audits')
    .select('result_data, status')
    .eq('hash', hash)
    .single()

  if (error || !data || data.status !== 'ready' || !data.result_data) {
    return new NextResponse('audit não encontrado ou ainda não está pronto', { status: 404 })
  }

  const result   = data.result_data as GeoAuditResult
  const base     = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dup.agency'
  const resultUrl = `${base}/ferramentas/geo-audit/resultado/${hash}`

  const html = buildEmailHtml(result, resultUrl)

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
