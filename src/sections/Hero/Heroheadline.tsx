'use client'

import SectionHeadline from '@/components/SectionHeadline'

const HeroHeadline = () => {
  return (
    <SectionHeadline
      title={
        <h1 className="text-4xl lg:text-7xl uppercase font-bold">
            <span className="text-brand-gradient inline-block pl-1 pr-1">Clareza</span>
                e 
            <span className="text-brand-gradient inline-block pl-1 pr-1">segurança</span> 
                para quem precisa de 
            <span className="text-brand-gradient inline-block pl-1 pr-1">paz operacional</span>
        </h1>
      }
      subtitle={<p className="text-xl lg:text-3xl pl-12 pr-12 mt-6">Ajudamos e-commerces VTEX a evoluir sem tensão ou ruido. De forma previsivel, clara e consciente.</p>}
    />
  )
}

export default HeroHeadline