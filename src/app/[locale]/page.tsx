import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { setRequestLocale } from 'next-intl/server'
import { localizedAlternates } from '@/i18n/metadata'
import type { Locale } from '@/i18n/routing'
import { DEPOIMENTOS } from '@/content/depoimentos'
import Hero from '@/components/sections/Hero'
import Parceiros from '@/components/sections/Parceiros'
import PorQueFunciona from '@/components/sections/PorQueFunciona'
import ComoTrabalhamos from '@/components/sections/ComoTrabalhamos'
import Servicos from '@/components/sections/Servicos'
import Depoimentos from '@/components/sections/Depoimentos'
import CTAFinal from '@/components/sections/CTAFinal'

// Imports diretos pra todas as seções com ScrollTrigger pin/scrub. Lazy-load
// causava o ScrollTrigger registrar tarde — quando o user já tinha rolado
// pela seção, o progresso era calculado já avançado e a animação rodava no
// vácuo. Mantemos dynamic só em FAQ e Footer (sem pin, sem prejuízo).
const FAQ    = dynamic(() => import('@/components/sections/FAQ'))
const Footer = dynamic(() => import('@/components/sections/Footer'))

// Review JSON-LD dos depoimentos — emitido SÓ na home (onde os cards aparecem),
// pra o structured data refletir o conteúdo visível da página. Cada Review aponta
// pro nó Organization (#organization, definido no layout) via itemReviewed.@id.
//
// ⚠️ Sem reviewRating/AggregateRating de propósito: os depoimentos são texto puro,
// sem nota numérica — inventar estrela seria dado falso. E review da própria marca
// é "self-serving" → o Google não dá rich snippet de estrela mesmo. O valor aqui é
// GEO: structured data legível por LLMs/motores de IA. Fonte: @/content/depoimentos.
const ORG_ID = 'https://dup.agency/#organization'
const reviewsJsonLd = {
  '@context': 'https://schema.org',
  '@graph': DEPOIMENTOS.flatMap((d) =>
    d.content.type === 'text'
      ? [
          {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: d.nome,
              jobTitle: d.cargo,
              worksFor: { '@type': 'Organization', name: d.empresa },
            },
            reviewBody: d.content.message.replace(/\s+/g, ' ').trim(),
            itemReviewed: { '@type': 'Organization', '@id': ORG_ID, name: 'dup.agency' },
          },
        ]
      : [],
  ),
}

// Canonical + hreflang da HOME (auto-referência por locale, respeitando o
// localePrefix 'as-needed': pt = '/', en = '/en', es = '/es'). metadataBase
// (no layout) resolve os paths relativos pro domínio.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { alternates: localizedAlternates('/', locale) }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />
      <Hero />
      <Parceiros />
      <PorQueFunciona />
      <ComoTrabalhamos />
      <Servicos />
      <Depoimentos />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  )
}
