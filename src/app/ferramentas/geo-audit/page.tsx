import { Metadata } from 'next'
import Hero from './components/Hero'
import LogoStrip from './components/LogoStrip'
import WhatIsGeo from './components/WhatIsGeo'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import CheckerUpsell from './components/CheckerUpsell'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'GEO Audit Gratuito — Seu site está preparado para as IAs?',
  description:
    'Descubra se seu e-commerce está otimizado para aparecer no ChatGPT, Gemini e Perplexity. Audit gratuito de GEO e SEO técnico em segundos.',
  openGraph: {
    title: 'GEO Audit — Seu site está preparado para as IAs?',
    description:
      'Audit gratuito de GEO e SEO. Veja se seu e-commerce aparece no ChatGPT, Gemini e Perplexity.',
    url: 'https://dup.agency/ferramentas/geo-audit',
    siteName: 'dup.agency',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function GeoAuditPage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <WhatIsGeo />
      <Services />
      <HowItWorks />
      <CheckerUpsell />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  )
}
