'use client'

import SectionHeadline from '@/components/SectionHeadline'

const Footerheadline = () => {
  return (
    <SectionHeadline
      title={
        <h2 className="text-5xl lg:text-[180px] uppercase font-bold text-center lg:leading-0">
          <span className=' text-brand-gradient'>Fez sentido?</span>
          <small className='text-2xl lg:text-7xl leading-normal block lg:mt-24 text-white'>
            Então vamos conversar
          </small>
        </h2>
      }
      subtitle={<p className="text-md lg:text-2xl mt-6 text-white text-center lg:max-w-1/3 m-auto">Uma conversa curta e leve, para entender sua operação e onde podemos ajudar.</p>}
    />
  )
}

export default Footerheadline