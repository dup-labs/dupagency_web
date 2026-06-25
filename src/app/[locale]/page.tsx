import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { setRequestLocale } from 'next-intl/server'
import { localizedAlternates } from '@/i18n/metadata'
import type { Locale } from '@/i18n/routing'
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
