import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { buildEmailHtml } from '@/app/[locale]/ferramentas/redirect-checker/lib/emailTemplate'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params

  if (!hash || !/^[0-9a-f]{32}$/.test(hash)) {
    return new NextResponse('hash inválido', { status: 400 })
  }

  const { data, error } = await supabase
    .from('redirect_checks')
    .select('domain, total_urls, ok, redirects, errors, loops, status')
    .eq('hash', hash)
    .single()

  if (error || !data || data.status !== 'done') {
    return new NextResponse('resultado não encontrado ou ainda não está pronto', { status: 404 })
  }

  const base      = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dup.agency'
  const resultUrl = `${base}/ferramentas/redirect-checker/resultado/${hash}`

  const html = buildEmailHtml(
    {
      domain:    data.domain    as string,
      totalUrls: data.total_urls as number,
      ok:        data.ok         as number,
      redirects: data.redirects  as number,
      errors:    data.errors     as number,
      loops:     data.loops      as number,
    },
    resultUrl,
  )

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
