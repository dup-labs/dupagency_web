import Image from "next/image"
import { StaticImageData } from "next/image"

type Props = {
  position?: string
  title: string
  text: string
  image?: StaticImageData
}

const BeachCard = ({title,text,image,position}:Props) => {
  return (
    <div className={`beach-card w-full h-1/3 lg:h-full lg:w-1/3 card ${position}`}>
        <div className="front relative overflow-hidden backface-hidden flex justify-start items-end w-full h-full">
            <h3 className="
                leading-[0.5]
                text-white font-bold
                text-[clamp(4rem,2vw,28rem)]
                lg:text-[clamp(5rem,2vw,28rem)]
                pointer-events-none
                select-none uppercase
            ">{title}</h3>
        </div>
        <div className="back absolute top-0 left-0 bg-[#1a1a1a] backface-hidden text-white h-full w-full p-4 lg:p-12 flex justify-between lg:flex-col items-center rounded-[20px] rotate-y-180">
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
            <div>
                <h4 className="text-xl lg:text-5xl font-bold mb-4 uppercase">{title}</h4>
                <p className="text-sm lg:text-xl">{text}</p>
            </div>
        </div>
      </div>
  )
}
export default BeachCard