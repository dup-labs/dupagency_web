'use client'

import SectionHeadline from '@/components/SectionHeadline'

const Matchheadline = () => {
  return (
    <SectionHeadline
      title={
        <h2 className="text-4xl lg:text-7xl uppercase font-bold text-center lg:text-right leading-none ">OS 
        <span className="text-brand-gradient inline-block pl-1 pr-1">PARCEIROS</span> COM QUEM <span className="text-brand-gradient inline-block pl-1 pr-1">GOSTAMOS</span> DE <span className="text-brand-gradient inline-block pl-1 pr-1">TRABALHAR</span></h2>
      }
      subtitle={<p className="text-md lg:text-2xl mt-6 text-center lg:text-right lg:pl-[20%]">Com o tempo fomos identificando quais são as características de nossos parceiros que fazem a parceria funcionar cada vez melhor, veja se você é ou busca alguma dessas características. </p>}
    />
  )
}

export default Matchheadline