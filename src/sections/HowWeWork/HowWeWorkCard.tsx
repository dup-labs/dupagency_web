'use client'

import { StaticImageData } from "next/image"
import Image from "next/image"

type Props = {
  className?: string
  title: React.ReactNode
  icon?: StaticImageData
  iconSize?: number
  iconClassName?:string
  
}


const HowWeWorkCard = ({className,title,icon,iconSize,iconClassName}:Props) => {
  return (
    <article className={`howwework-card w-full h-full relative bg-[#F9F8F7] rounded-xl ${className}`}>
        {title}
        {
            icon && <Image 
                        alt="" 
                        src={icon} 
                        width={iconSize}
                        height={iconSize}
                        className={`howwework-card-icon select-none pointer-events-none ${iconClassName}`}
                        priority={false}
                    />
        }
        
    </article>
  )
}

export default HowWeWorkCard