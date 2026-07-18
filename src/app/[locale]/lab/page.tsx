import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ogLocale, htmlLang, type Locale } from '@/i18n/routing'
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
// Produtos do lab no schema: dados fixos aqui (url/categoria), descrição vem
// da tradução — mesma fonte que a vitrine renderiza na tela.
const SCHEMA_PRODUCTS = [
  { slug: 'swtchr', url: 'https://swtchr.io',    category: 'BusinessApplication' },
  { slug: 'nutrk',  url: 'https://www.nutrk.io', category: 'HealthApplication' },
  { slug: 'polr',   url: 'https://polrfy.co',    category: 'ShoppingApplication' },
] as const

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'lab' })

  // JSON-LD da página: WebPage + os produtos como SoftwareApplication, cada um
  // com creator apontando pro @id da Organization (definida no layout) — amarra
  // swtchr/nutrk/polr à dup.agency no grafo. O schema institucional
  // (Organization/Service) já vem herdado do layout de [locale].
  const pagePath = localizedPath('/lab', locale as Locale)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://dup.agency${pagePath}#webpage`,
        url: `https://dup.agency${pagePath}`,
        name: t('meta.title'),
        description: t('meta.description'),
        inLanguage: htmlLang[locale as Locale],
        publisher: { '@id': 'https://dup.agency/#organization' },
      },
      {
        '@type': 'ItemList',
        name: t('produtos.title1'),
        itemListElement: SCHEMA_PRODUCTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'SoftwareApplication',
            '@id': `${p.url}/#app`,
            name: p.slug,
            url: p.url,
            description: t(`produtos.${p.slug}.desc`),
            applicationCategory: p.category,
            creator: { '@id': 'https://dup.agency/#organization' },
          },
        })),
      },
    ],
  }

  return (
    <div className={`${caveat.variable} ${splineSansMono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
