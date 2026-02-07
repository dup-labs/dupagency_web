'use client'

import SectionHeadline from '@/components/SectionHeadline'

const WhatWeAreNotheadline = () => {
  return (
    <SectionHeadline
      title={
        <h2 className="text-4xl lg:text-7xl uppercase font-bold text-white text-center leading-normal">O QUE
            <span className="text-brand-gradient-negative inline-block pl-1 pr-1">NÃO</span>
            SOMOS
        </h2>
      }
      subtitle={<p className="textlg lg:text-2xl mt-6 text-white text-center">a transparência começa em saber dizer não</p>}
    />
  )
}

export default WhatWeAreNotheadline