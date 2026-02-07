'use client'

import SectionHeadline from '@/components/SectionHeadline'

const HowWeWorkHeadline = () => {
  return (
    <SectionHeadline
      title={
        <h2 className="text-4xl lg:text-7xl uppercase font-bold">NOSSO PAPEL É
            <span className="text-brand-gradient inline-block pl-1 pr-1">Simplificar</span>
        </h2>
      }
      subtitle={<p className="text-xl lg:text-2xl mt-4 lg:mt-6">Entramos pra organizar, planejar e executar evoluções com clareza, explicando prós, contras, e riscos antes de qualquer decisão</p>}
    />
  )
}

export default HowWeWorkHeadline