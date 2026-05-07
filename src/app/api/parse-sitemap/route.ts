import { NextRequest, NextResponse } from 'next/server'

function extractLocs(xml: string): string[] {
  const matches = [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/g)]
  return matches.map((m) => m[1].trim()).filter(Boolean)
}

function isSitemapIndex(xml: string): boolean {
  return xml.includes('<sitemapindex')
}

async function fetchXml(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; dup.agency/redirect-checker 1.0)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain')?.trim()
  if (!domain) {
    return NextResponse.json({ error: 'Parâmetro domain obrigatório.' }, { status: 400 })
  }

  const sitemapUrl = `https://${domain}/sitemap.xml`

  let rootXml: string
  try {
    rootXml = await fetchXml(sitemapUrl)
  } catch {
    return NextResponse.json(
      { error: `Sitemap não encontrado em ${sitemapUrl}. Verifique se o domínio está correto e possui /sitemap.xml.` },
      { status: 404 },
    )
  }

  if (!isSitemapIndex(rootXml)) {
    const urls = extractLocs(rootXml)
    return NextResponse.json({ urls, totalSitemaps: 1, totalUrls: urls.length })
  }

  // Sitemap index — busca todos os sub-sitemaps em paralelo
  const subUrls = extractLocs(rootXml)
  const results = await Promise.allSettled(subUrls.map(fetchXml))

  const allUrls: string[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      allUrls.push(...extractLocs(r.value))
    }
  }

  return NextResponse.json({
    urls: allUrls,
    totalSitemaps: subUrls.length,
    totalUrls: allUrls.length,
  })
}
