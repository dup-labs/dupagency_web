'use client'

import SectionHeadline from '@/components/SectionHeadline'

const Testimonialsheadline = () => {
  return (
    <SectionHeadline
      title={
        <h2 className="text-4xl lg:text-7xl uppercase font-bold text-center leading-none">O QUE DIZ QUEM 
            <span className="text-brand-gradient-negative inline-block pl-1 pr-1">CONFIA</span>
            EM NÓS
        </h2>
      }
      subtitle={<p className="text-md lg:text-2xl mt-6  text-center">Perguntamos a nossos parceiros o que os faz continuar confiando em nosso trabalho, aqui estão algumas das respostas</p>}
    />
  )
}

export default Testimonialsheadline