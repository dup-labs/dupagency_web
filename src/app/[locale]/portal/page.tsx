import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ogLocale, type Locale } from '@/i18n/routing'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import { publicRobots } from '@/lib/robotsMeta'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Recursos from './components/Recursos'
import ComoFunciona from './components/ComoFunciona'
import CtaFinal from './components/CtaFinal'
import Footer from '@/components/sections/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// /portal — landing pública do Portal do Cliente
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo portado fielmente da landing que vivia em portal.dup.agency
// (dashboard/src/app/page.tsx) pro site institucional. Mesmo texto, mesmas
// 6 imagens reais do produto — agora com o Nav/Footer nativos do site e a
// linguagem visual das outras páginas públicas (ex: /ferramentas/geo-audit),
// sem o motor de scroll bespoke que a landing original usava.
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portal.meta' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('ogDescription'),
      url: localizedPath('/portal', locale as Locale),
      siteName: 'dup.agency',
      locale: ogLocale[locale as Locale],
      type: 'website',
    },
    alternates: localizedAlternates('/portal', locale as Locale),
    robots: publicRobots,
  }
}

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <Manifesto />
      <Recursos />
      <ComoFunciona />
      <CtaFinal />
      <Footer />
    </>
  )
}
