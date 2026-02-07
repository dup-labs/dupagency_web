'use client'

import { StaticImageData } from "next/image"

type Props = {
    className?: string,
    name: string,
    company: string,
    role: string,
    text: string
    audio?: string
  
}


const TestimonialCard = ({name,company,text,audio,role,className}:Props) => {
  return (
      <article
        className={`
            ${className}
            absolute w-48 lg:w-96 rounded-2xl
            border border-white/20
            bg-white/1
            backdrop-blur-[10px]
            overflow-scroll
            shadow-lg
            px-6 lg:px-18
            py-8 lg:py-12
            text-xs lg:text-lg
        `}
        
        
      >
        {
            audio? 
                <audio className="w-full h-12 mb-4" src={audio} controls />
            :
                text
        }
          <strong>{name} <small>{role} - {company}</small></strong>
      </article>
    // <article className={`w-full h-full relative bg-[#161616] rounded-xl ${className}`}>
    //     {title}
    // </article>
  )
}

export default TestimonialCard