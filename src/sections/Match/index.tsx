'use client'
import { useRef } from 'react' 

import { isMobile } from '@/utils/isMobile'

import gsap from 'gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { mouseParallax } from '@/animations/mouseParallax'
import { entrance } from '@/animations/entrance'

import data from './data/MatchData.json'
import Matchheadline from './Matchheadline';
import MatchItem from './MatchItem';

const Match = () => {
    const sectionRef = useRef<HTMLElement>(null)

  useSectionAnimations(sectionRef, (ctx) => {
    const section = sectionRef.current
    if (!section) return

    const scope = ctx.selector!

    // 🎬 timeline SEM play
    const tl = entrance(scope('.match'), [
      {
        el: scope('.headline_title'),
        from: {  x: -70, y: 40, opacity: 0 },
        to:   { x: 0, y: 0,  opacity: 1, ease: 'power3.out' },
        at: '-=0.5',
      },
      {
        el: scope('.headline_text'),
        from: {  x: -100, y: 20, opacity: 0 },
        to:   { x: 0, y: 0,  opacity: 1, ease: 'power3.out' },
        at: '-=0.4',
      }
      
    ]).tl()
    

    // 🔹 pega TODOS os cards (array real)
    const cards = gsap.utils.toArray<HTMLElement>(
        scope('.match-card')
    )

    console.log('cards',cards)

    const orderedCards = [
        cards[3],
        cards[2],
        cards[1],
        cards[0],
    ]
    

    tl.fromTo(
        orderedCards,
        { 
            x: 0, 
            y: 2000, 
            // opacity: 0 
        },
        {
            x: 0,
            y: 0,
            // opacity: 1,
            ease: 'power3.out',
            stagger:  0.12,
            
        },
        '-=0.7' // overlap com o texto
    )

    // 🎯 Scroll controla tudo
    ScrollTrigger.create({
      trigger: section,
      start: isMobile() ?  'top 0%' : 'top 0',
      end: isMobile() ?  '+=2500' : '+=3500',
      scrub: 1,
      pin: true,
      animation: tl
    })


    const title = section.querySelector<HTMLElement>('.headline_title')
    const text  = section.querySelector<HTMLElement>('.headline_text')

    if (!title || !text) return

    return mouseParallax(section, [
      { el: title, strength: 12 },
      { el: text, strength: 30 },
    ])

  })
    return(
       <section 
            ref={sectionRef}
            className="match relative lg:min-h-dvh bg-grid-lines py-24 lg:py-32 flex justify-center items-center overflow-hidden  m-auto px-6"
       >
            <div className=" max-w-[90%] m-auto lg:px-6  flex justify-center items-center flex-col-reverse lg:flex-row">
                <div className='match-cards w-full lg:w-4/6 lg:px-36 relative h-[520px] lg:h-[600px] top-36 lg:top-24'>
                    {
                        data?.map((item:any,i:number) => {
                            return(
                                <MatchItem 
                                    key={`match-${i}`}
                                    text={item?.text}
                                    index={i}
                                    className='match-card'
                                />
                            )
                        })
                    }
                </div>
                <div className='w-full lg:w-3/6'>
                    <Matchheadline />
                </div>
            </div>
            
        </section>

    )
}

export default Match