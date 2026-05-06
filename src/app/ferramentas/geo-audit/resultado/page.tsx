import { Metadata } from 'next'
import ResultHero from './components/ResultHero'
import SeoMetrics from './components/SeoMetrics'
import GeoReadiness from './components/GeoReadiness'
import ActionPlan from './components/ActionPlan'
import TabNav from './components/TabNav'
import CheckerUpsell from '../components/CheckerUpsell'
import Footer from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'Resultado do GEO Audit — minhaloja.com.br | dup.agency',
  description:
    'Veja o score de GEO Readiness e SEO técnico da sua loja virtual, os gaps críticos identificados e o plano de ação priorizado.',
  robots: { index: false, follow: false },
}

export default function ResultadoPage() {
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
