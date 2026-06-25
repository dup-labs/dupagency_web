import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ResultHero from './components/ResultHero'
import SeoMetrics from './components/SeoMetrics'
import GeoReadiness from './components/GeoReadiness'
import ActionPlan from './components/ActionPlan'
import TabNav from './components/TabNav'
import CheckerUpsell from '../components/CheckerUpsell'
import Footer from '@/components/sections/Footer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ferramentas.geoAudit.meta' })

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  }
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        .tab-strip::-webkit-scrollbar { display: none; }
        nav:has(a[href="#hero"]) {
          background: rgba(255,255,255,0.80) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border-bottom: 1px solid rgba(0,0,0,0.06) !important;
        }
      `}</style>

      <ResultHero />
      <TabNav />
      <SeoMetrics />
      <GeoReadiness />
      <ActionPlan />
      <CheckerUpsell />
      <Footer />
    </>
  )
}
