'use client'

import SectionHeadline from '@/components/SectionHeadline'

const BeachHeadline = () => {
  return (
    <SectionHeadline
      title={
        <h2 className="text-4xl lg:text-7xl uppercase font-bold">Como
            <span className="text-brand-gradient inline-block pl-1 pr-1">Trabalhamos</span>
        </h2>
      }
      subtitle={<p className="text-xl lg:text-2xl mt-4 lg:mt-6 lg:max-w-[70%] lg:mx-auto">Ter um processo bem definido é o que faz do nosso trabalho uma garantia de sucesso</p>}
    />
  )
}

export default BeachHeadline