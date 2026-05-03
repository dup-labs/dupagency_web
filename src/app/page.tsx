import dynamic from 'next/dynamic'
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
