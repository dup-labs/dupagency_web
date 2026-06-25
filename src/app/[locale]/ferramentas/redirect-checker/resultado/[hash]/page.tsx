import { notFound } from 'next/navigation'
import { getPathname } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import ResultView from '../../components/ResultView'
import type { UrlResult } from '../../components/ResultView'
import Footer from '@/components/sections/Footer'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; hash: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ferramentas.redirectChecker.meta' })

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  }
}

export default async function ResultadoHashPage({
  params,
}: {
  params: Promise<{ locale: string; hash: string }>
}) {
  const { locale, hash } = await params
  setRequestLocale(locale)

  if (!hash || !/^[0-9a-f]{32}$/.test(hash)) notFound()

  const { data, error } = await supabase
    .from('redirect_checks')
    .select('status, domain, results')
    .eq('hash', hash)
    .single()

  if (error || !data) notFound()

  if (data.status !== 'done' || !data.results) {
    const t = await getTranslations({ locale, namespace: 'ferramentas.redirectChecker.resultado.indisponivel' })
    return (
      <>
        <div style={{ paddingTop: 'calc(64px + 80px)', paddingBottom: '80px', padding: 'calc(64px + 80px) 24px 80px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <p className="font-chillax font-bold" style={{ fontSize: '24px', color: 'var(--black)', marginBottom: '12px' }}>
              {t('title')}
            </p>
            <p className="font-synonym" style={{ fontSize: 'var(--text-body-md)', color: 'var(--neutral-600)', marginBottom: '32px' }}>
              {t('body')}
            </p>
            <a
              href={getPathname({ href: '/ferramentas/redirect-checker', locale })}
              className="font-synonym"
              style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 'var(--radius-pill)', background: 'var(--grad-site-01)', color: 'var(--white)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              {t('cta')}
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
