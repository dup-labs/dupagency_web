'use client'

import data from './data/PartnerData.json';
import PartnerItem from './PartnerItem';
import Partnerheadline from './Partnerheadline';
// import { initLenis } from '@/lib/lenis'

const Partners = () => {

    return(
       <section 
            className="partners_container absolute bg-grid-lines py-18 lg:py-32 flex justify-center items-center overflow-hidden flex-col "
            style={{
                backgroundSize: 'cover'
            }}
       >
            <div className='max-w-[80%] mb-8'>
                <Partnerheadline />
            </div>
            <div className="
            partner_content max-w-[80%] w-full rounded-2xl py-4 px-2 lg:p-18 max-h-[500px] lg:max-h-[680px]
                            border border-white/20
                            bg-white/9
                            backdrop-blur-xl
                            overflow-scroll
                            shadow-lg
                            "
                            
            >
                 
                {
                    data?.map((partner:any,i:number) => {
                        return(
                            <PartnerItem
                                key={`partner-${i}`}
                                name={partner?.name}
                                tech={partner?.tech}
                                image={partner?.image}
                                clientAt={partner?.clientAt}
                                type={partner?.type}
                                link={partner?.link}
                                className='mt-20'
                            />
                        )
                    })
                }
            </div>
        </section>

    )
}

export default Partners