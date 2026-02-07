import Image from "next/image"
import { StaticImageData } from "next/image"

type Props = {
  className?: string
  name: React.ReactNode
  tech: string
  image?: StaticImageData
  clientAt?:string
  type?:string
  link?:string
  
}

const PartnerItem = ({name, type, tech, clientAt, image,link}:Props) => {

    const normalize = (value?: string | string[]) => Array.isArray(value) ? value : value ? [value] : []

    return(
       <article className="relative group p-4 border-b-2 border-white mb-4">
            <a href={link} target="_blank">
                <div className="flex justify-between">
                    <div className="h-6 lg:h-12 overflow-hidden mb-4 lg:mb-0">
                        <h2 className="hidden lg:block text-white font-medium text-md whitespace-nowrap lg:text-5xl uppercase transition-all duration-300  group-hover:-translate-y-12">{name}</h2>
                        <h2 className="text-brand-gradient font-medium text-md whitespace-nowrap lg:text-5xl transition-all  duration-300 uppercase [text-shadow:0_2px_0_rgba(0,0,0,0.35)] text-shadow-zinc-950 group-hover:-translate-y-12">{name}</h2>
                    </div>
                    <div><span className="lg:p-2 text-white text-xs lg:text-lg">Desde {clientAt}</span></div>
                    {/* <button className="font-white border-2 border-white py-0.5 px-4 transition-all duration-300 rounded-full font-medium"><span className="text-white">ver detalhes</span></button> */}
                </div>
                <div className="flex gap-4 lg:gap-8 text-sm">
                    <div>{normalize(type).map((item, i) => (
                            <span className="mr-2 lg:mr-0 lg:p-2 text-white" key={`type-${i}`}>{item}</span>
                        ))}</div>

                    <div>{normalize(tech).map((item, i) => (
                        <span className="lg:p-2 text-white" key={`tech-${i}`}>{item}</span>
                    ))}</div>
                    
                </div>
                <div 
                    className="hidden lg:block absolute right-4 -top-2 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                >
                    {
                        image &&
                        <Image 
                            alt="" 
                            src={image} 
                            width={280}
                            height={280}
                            className={`select-none pointer-events-none`}
                            priority={false}
                        />
                    }
                </div>
            </a>
       </article>
    )
}

export default PartnerItem