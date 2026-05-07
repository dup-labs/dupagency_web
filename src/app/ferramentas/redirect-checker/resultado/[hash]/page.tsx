import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ResultView from '../../components/ResultView'
import type { UrlResult } from '../../components/ResultView'
import Footer from '@/components/sections/Footer'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>
}): Promise<Metadata> {
  const { hash } = await params
  const { data } = await supabase
    .from('redirect_checks')
    .select('domain, total_urls')
    .eq('hash', hash)
    .single()

  return {
    title: data
      ? `Redirect Checker — ${data.domain} — ${data.total_urls} URLs | dup.agency`
      : 'Redirect Checker | dup.agency',
    robots: { index: false, follow: false },
  }
}

export default async function ResultadoHashPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await params

  if (!hash || !/^[0-9a-f]{32}$/.test(hash)) notFound()

  const { data, error } = await supabase
    .from('redirect_checks')
    .select('status, domain, results')
    .eq('hash', hash)
    .single()

  if (error || !data) notFound()

  if (data.status !== 'done' || !data.results) {
    return (
      <>
        <div style={{ paddingTop: 'calc(64px + 80px)', paddingBottom: '80px', padding: 'calc(64px + 80px) 24px 80px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <p className="font-chillax font-bold" style={{ fontSize: '24px', color: 'var(--black)', marginBottom: '12px' }}>
              Resultado não disponível
            </p>
            <p className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', marginBottom: '32px' }}>
              Este link pode ter expirado ou o processamento não foi concluído.
            </p>
            <a
              href="/ferramentas/redirect-checker"
              className="font-synonym"
              style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 'var(--radius-pill)', background: 'var(--grad-site-01)', color: 'var(--white)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              Rodar nova análise
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const results = (data.results as unknown as UrlResult[]) ?? []

  return (
    <>
      <ResultView domain={data.domain as string} results={results} />
      <Footer />
    </>
  )
}
