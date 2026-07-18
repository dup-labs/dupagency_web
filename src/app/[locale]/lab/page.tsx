import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ogLocale, type Locale } from '@/i18n/routing'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import { caveat, splineSansMono } from '@/app/lab-fonts'
import { publicRobots } from '@/lib/robotsMeta'
import Footer from '@/components/sections/Footer'
import LabGrid from './components/LabGrid'
import LabHero from './components/LabHero'
import LabMarquee from './components/LabMarquee'
import LabManifesto from './components/LabManifesto'
import LabProdutos from './components/LabProdutos'
import LabProcesso from './components/LabProcesso'
import LabBastidores from './components/LabBastidores'
import LabCTA from './components/LabCTA'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'lab.meta' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('ogDescription'),
      url: localizedPath('/lab', locale as Locale),
      siteName: 'dup.agency',
      locale: ogLocale[locale as Locale],
      type: 'website',
    },
    alternates: localizedAlternates('/lab', locale as Locale),
    robots: publicRobots,
  }
}

// dup.lab — laboratório de experimentação criativa. Segue o DS anexo do lab:
// tudo é rascunho (blueprint, monocromático), cor só nos produtos. As fontes
// exclusivas (Caveat + Spline Sans Mono) entram pelo wrapper — só esta rota
// paga o preload delas (ver lab-fonts.ts).
export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className={`${caveat.variable} ${splineSansMono.variable}`}>
      <LabGrid />
      <LabHero />
      <LabMarquee />
      <LabManifesto />
      <LabProdutos />
      <LabProcesso />
      <LabBastidores />
      <LabCTA />
      <Footer />
    </div>
  )
}
