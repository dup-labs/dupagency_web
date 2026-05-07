import { NextRequest, NextResponse } from 'next/server'

interface Hop {
  url: string
  status: number
}

export interface CheckResult {
  url: string
  finalStatus: number
  chain: Hop[]
  responseTime: number
  isLoop: boolean
  isTimeout: boolean
  hops: number
}

const MAX_HOPS = 6
const TIMEOUT_MS = 5000

async function fetchManual(url: string): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; dup.agency/redirect-checker 1.0)' },
    })
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Parâmetro url obrigatório.' }, { status: 400 })
  }

  const start = Date.now()
  const chain: Hop[] = []
  const seen = new Set<string>()

  let current = url
  let isLoop = false
  let isTimeout = false
  let finalStatus = 0

  while (chain.length < MAX_HOPS) {
    if (seen.has(current)) {
      isLoop = true
      break
    }
    seen.add(current)

    let res: Response
    try {
      res = await fetchManual(current)
    } catch (err) {
      isTimeout = (err as Error).name === 'AbortError'
      finalStatus = 0
      chain.push({ url: current, status: 0 })
      break
    }

    finalStatus = res.status
    chain.push({ url: current, status: res.status })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      if (!location) break
      try {
        current = new URL(location, current).href
      } catch {
        break
      }
    } else {
      break
    }
  }

  const result: CheckResult = {
    url,
    finalStatus,
    chain,
    responseTime: Date.now() - start,
    isLoop,
    isTimeout,
    hops: Math.max(0, chain.length - 1),
  }

  return NextResponse.json(result)
}
