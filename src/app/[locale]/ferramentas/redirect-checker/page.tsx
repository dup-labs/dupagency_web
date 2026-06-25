import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ogLocale, type Locale } from '@/i18n/routing'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import Footer from '@/components/sections/Footer'
import RedirectCheckerApp from './components/RedirectCheckerApp'
import WhatIs from './components/WhatIs'
import DiagnosticoServices from './components/DiagnosticoServices'
import HowItWorks from './components/HowItWorks'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ferramentas.redirectChecker.meta' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('ogDescription'),
      url: localizedPath('/ferramentas/redirect-checker', locale),
      siteName: 'dup.agency',
      locale: ogLocale[locale],
      type: 'website',
    },
    alternates: localizedAlternates('/ferramentas/redirect-checker', locale),
    robots: { index: true, follow: true },
  }
}

export default async function RedirectCheckerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

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
