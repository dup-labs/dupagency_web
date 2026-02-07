'use client'

// import { StaticImageData } from "next/image"
// import Image from "next/image"

type Props = {
  className?: string
  title: React.ReactNode
  text: React.ReactNode
  iconClassName?:string
  
}


const WhatWeAreNotCard = ({className,title,text}:Props) => {
  return (
    <div
      className={`
        whatwearenot-card relative rounded-2xl p-[1px] bg-gradient-to-b from-[#343434] to-black w-full
        ${className}
      `}
      
    >
      <article
        className="
          relative h-full w-full rounded-2xl
          bg-[#161616]
          px-8
          py-6
          lg:px-18
          lg:py-12
        "
      >
          {title}
          {text}
      </article>
    </div>
    // <article className={`w-full h-full relative bg-[#161616] rounded-xl ${className}`}>
    //     {title}
    // </article>
  )
}

export default WhatWeAreNotCard