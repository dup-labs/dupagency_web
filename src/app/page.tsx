import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import Parceiros from '@/components/sections/Parceiros'

// Acima do fold: import direto (Hero + Parceiros vão pro chunk principal).
// Abaixo do fold: code-split via next/dynamic com SSR ativo (preserva SEO,
// reduz JS inicial). Sem `loading` placeholder porque o BackgroundLayer já
// cobre o viewport com a cor da seção — não há flash visível.
const PorQueFunciona  = dynamic(() => import('@/components/sections/PorQueFunciona'))
const ComoTrabalhamos = dynamic(() => import('@/components/sections/ComoTrabalhamos'))
const Servicos        = dynamic(() => import('@/components/sections/Servicos'))
const Depoimentos     = dynamic(() => import('@/components/sections/Depoimentos'))
const FAQ             = dynamic(() => import('@/components/sections/FAQ'))
const CTAFinal        = dynamic(() => import('@/components/sections/CTAFinal'))
const Footer          = dynamic(() => import('@/components/sections/Footer'))

export default function Home() {
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
