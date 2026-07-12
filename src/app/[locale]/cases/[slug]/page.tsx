import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { htmlLang, ogLocale, type Locale } from '@/i18n/routing'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import { getCase, getAllCaseSlugs, pick } from '@/content/cases'
import { resolveCaseAssets } from '@/lib/caseAssets'
import CaseHero from './components/CaseHero'
import CaseResumo from './components/CaseResumo'
import CaseInicio from './components/CaseInicio'
import CaseTimeline from './components/CaseTimeline'
import CaseGaleria from './components/CaseGaleria'
import CaseDepoimento from './components/CaseDepoimento'
import CaseNextSteps from './components/CaseNextSteps'
import CTAFinal from '@/components/sections/CTAFinal'
import Footer from '@/components/sections/Footer'
import { publicRobots } from '@/lib/robotsMeta'

const BASE_URL = 'https://dup.agency'
const ORG_ID = `${BASE_URL}/#organization`

// SSG: o Next cruza estes slugs com os locales do generateStaticParams do layout
// pai → 3 idiomas × N cases, todos estáticos. Slug fora da lista = 404.
export function generateStaticParams() {
  return getAllCaseSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const cs = getCase(slug)
  if (!cs) return {}

  const href = `/cases/${slug}`
  const title = pick(cs.meta.title, locale)
  const description = pick(cs.meta.description, locale)

  // Print do hero (quando houver) vira o OG image — cai no genérico do site senão.
  const { heroMedia } = resolveCaseAssets(cs)
  const ogImage = heroMedia?.type === 'image' ? heroMedia.src : '/og-image.png'

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: localizedPath(href, locale),
      siteName: 'dup.agency',
      locale: ogLocale[locale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: localizedAlternates(href, locale),
    // Rascunho não indexa NEM em produção — a página existe só pra quem tem o link.
    robots: cs.draft ? { index: false, follow: false } : publicRobots,
  }
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const cs = getCase(slug)
  if (!cs) notFound()

  setRequestLocale(locale)

  const assets = resolveCaseAssets(cs)
  const t = (text: Parameters<typeof pick>[0]) => pick(text, locale)

  // Galeria só existe se algum slot tiver print de fato. Sem imagem nenhuma a
  // seção some da página (e a numeração dos eyebrows se ajusta sozinha).
  const shots = cs.gallery
    .map((shot, i) => ({ src: assets.gallery[i], caption: t(shot.caption) }))
    .filter((s): s is { src: string; caption: string } => Boolean(s.src))

  // Eyebrows numerados na ordem REAL das seções renderizadas — se a galeria não
  // entra, o depoimento vira 04 em vez de 05.
  let step = 0
  const num = () => String(++step).padStart(2, '0')

  const title = t(cs.meta.title)
  const description = t(cs.meta.description)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        datePublished: cs.publishedAt,
        inLanguage: htmlLang[locale],
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: `${BASE_URL}${localizedPath(`/cases/${slug}`, locale)}`,
        about: {
          '@type': 'Organization',
          name: cs.client.name,
          url: `https://${cs.client.domain}`,
        },
      },
      // Mesma decisão da home: Review sem rating numérico — os depoimentos são
      // texto puro, e inventar estrela seria dado falso. O valor aqui é GEO.
      ...(cs.testimonial
        ? [
            {
              '@type': 'Review',
              author: { '@type': 'Organization', name: cs.client.name },
              reviewBody: t(cs.testimonial.quote).replace(/\*/g, '').replace(/\s+/g, ' ').trim(),
              itemReviewed: { '@type': 'Organization', '@id': ORG_ID, name: 'dup.agency' },
            },
          ]
        : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CaseHero
        eyebrow={t(cs.hero.eyebrow)}
        titleGradient={cs.hero.titleGradient}
        title={cs.hero.title}
        description={t(cs.hero.description)}
        stats={cs.hero.stats.map((s) => ({
          value: t(s.value),
          label: t(s.label),
          gradient: s.gradient,
        }))}
        domain={cs.client.domain}
        media={assets.heroMedia}
        poster={assets.heroPoster}
        logo={cs.client.logo}
      />

      <CaseResumo
        num={num()}
        title={t(cs.resumo.title)}
        lead={t(cs.resumo.lead)}
        body={t(cs.resumo.body)}
        chips={cs.resumo.chips.map(t)}
      />

      <CaseInicio num={num()} statement={t(cs.inicio.statement)} body={t(cs.inicio.body)} />

      <CaseTimeline
        num={num()}
        milestones={cs.milestones.map((m, i) => ({
          year: m.year,
          tag: t(m.tag),
          title: t(m.title),
          description: t(m.description),
          result: t(m.result),
          image: assets.timeline[i],
        }))}
      />

      {shots.length > 0 && <CaseGaleria num={num()} shots={shots} />}

      {cs.testimonial && (
        <CaseDepoimento
          num={num()}
          quote={t(cs.testimonial.quote)}
          author={cs.testimonial.author}
          role={t(cs.testimonial.role)}
          logo={cs.client.logo}
        />
      )}

      <CaseNextSteps
        num={num()}
        steps={cs.nextSteps.map((s) => ({ title: t(s.title), body: t(s.body) }))}
      />

      <CTAFinal />
      <Footer />
    </>
  )
}
