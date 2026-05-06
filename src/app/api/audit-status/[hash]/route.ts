import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params

  if (!hash || !/^[0-9a-f]{32}$/.test(hash)) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('geo_audits')
    .select('status')
    .eq('hash', hash)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(
    { status: data.status },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
