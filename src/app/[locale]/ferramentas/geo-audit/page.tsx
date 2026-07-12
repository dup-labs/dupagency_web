import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ogLocale, type Locale } from '@/i18n/routing'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import Hero from './components/Hero'
import LogoStrip from './components/LogoStrip'
import WhatIsGeo from './components/WhatIsGeo'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import CheckerUpsell from './components/CheckerUpsell'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from '@/components/sections/Footer'
import { publicRobots } from '@/lib/robotsMeta'

export const maxDuration = 300

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
    openGraph: {
      title: t('title'),
      description: t('ogDescription'),
      url: localizedPath('/ferramentas/geo-audit', locale as Locale),
      siteName: 'dup.agency',
      locale: ogLocale[locale as Locale],
      type: 'website',
    },
    alternates: localizedAlternates('/ferramentas/geo-audit', locale as Locale),
    robots: publicRobots,
  }
}

export default async function GeoAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

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
