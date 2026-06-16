import { Metadata } from 'next'
import Footer from '@/components/sections/Footer'
import RedirectCheckerApp from './components/RedirectCheckerApp'
import WhatIs from './components/WhatIs'
import DiagnosticoServices from './components/DiagnosticoServices'
import HowItWorks from './components/HowItWorks'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'

export const metadata: Metadata = {
  title: 'Redirect & Health Checker Gratuito — Analise o sitemap do seu e-commerce',
  description:
    'Verifique todas as URLs do seu sitemap.xml de graça. Detecta redirects, erros 404, loops e páginas lentas. Ideal para e-commerces VTEX e Nuvemshop.',
  openGraph: {
    title: 'Redirect & Health Checker — Analise o sitemap do seu e-commerce',
    description:
      'Analisa todas as URLs do sitemap.xml e detecta redirects desnecessários, erros 404, loops e muito mais.',
    url: 'https://dup.agency/ferramentas/redirect-checker',
    siteName: 'dup.agency',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RedirectCheckerPage() {
  return (
    <>
      <RedirectCheckerApp />
      <WhatIs />
      <DiagnosticoServices />
      <HowItWorks />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  )
}
