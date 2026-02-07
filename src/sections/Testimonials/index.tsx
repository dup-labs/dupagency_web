'use client'

import { useRef } from 'react'
import { isMobile } from '@/utils/isMobile'

import gsap from 'gsap'

import data from './data/TestimonialsData.json'
import TestimonialCard from './TestimonialsCard';
import Testimonialsheadline from './Testimonialsheadline';

import { ScrollTrigger } from '@/lib/gsap'


import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { mouseParallax } from '@/animations/mouseParallax'
import { entrance } from '@/animations/entrance'

import './testimonial.css';

const Testimonials = () => {

    const sectionRef = useRef<HTMLElement>(null)

  useSectionAnimations(sectionRef, (ctx) => {
    const section = sectionRef.current
    if (!section) return

    const scope = ctx.selector!

    // 🎬 timeline SEM play
    const tl = entrance(scope('.testimonials'), [
      {
        el: scope('.headline_title'),
        from: {  x: -70, y: 40, opacity: 0 },
        to:   { x: 0, y: 0,  opacity: 1, ease: 'power3.out' },
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
        scope('.testimonial-card')
    )

    // 🔹 anima cards com stagger
    tl.fromTo(
        cards,
        { 
            x: 0, 
            y: isMobile() ? 1000 : 1400, 
            // opacity: 0 
        },
        {
            x: 0,
            y: isMobile() ? -80 : -0,
            // opacity: 1,
            ease: 'power3.out',
            stagger: {
                each: 0.12,
                from: 'random', // start | center | end | random
            },
        },
        '-=0.2' // overlap com o texto
    )

    // 🎯 Scroll controla tudo
    ScrollTrigger.create({
      trigger: section,
      start: isMobile() ?  'top 5%' : 'top top',
      end: isMobile() ?  '+=2500' : '+=10500',
      scrub: 1,
      animation: tl,
      pin: true    
    })

    // icons
    const icons = Array.from(
        section.querySelectorAll<HTMLElement>('.howwework-card-icon')
    )

    icons.forEach((icon, i) => {
        const amplitude = 26 + Math.random() * 3      // quanto flutua
        const duration  = 1.2 + Math.random() * 2     // velocidade
        const delay     = Math.random() * 0.5        

        gsap.to(icon, {
            y: `+=${amplitude}`,
            duration,
            delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        })
    })

    // 🖱️ parallax (continua igual)
    const activeLayout = Array.from(
      section.querySelectorAll<HTMLElement>('[data-layout]')
    ).find(el => el.offsetWidth || el.offsetHeight)

    if (!activeLayout) return

    const title = activeLayout.querySelector<HTMLElement>('.headline_title')
    const text  = activeLayout.querySelector<HTMLElement>('.headline_text')

    if (!title || !text) return

    return mouseParallax(section, [
      { el: title, strength: 12 },
      { el: text, strength: 30 },
    ])
  })

    return(
       <section 
            ref={sectionRef}
            className="testimonials relative min-h-dvh bg-grid-lines py-12 lg:py-32 flex justify-center items-center overflow-hidden"
       >
            <div className=" max-w-[98%] lg:m-auto px-2 lg:px-6  flex justify-center items-center ">
                <div className='lg:absolute w-full h-full flex justify-center lg:items-center'>
                    <div className='lg:w-2/4'>
                        <Testimonialsheadline />
                    </div>
                </div>
                <div className=' absolute w-full h-full flex justify-center items-end'>
                    {
                        data?.map((item:any,index:number) => {
                            if(index >= 8) return false
                            return(
                                <TestimonialCard 
                                    key={`testimonial-${index}`}
                                    className={`testimonial-card testimonial-card-${index}`}
                                    name={item?.name}
                                    company={item?.company}
                                    role={item?.role}
                                    text={item?.text}
                                    audio={item?.audio}
                                />

                            )
                        })
                    }
                </div>
            </div>
            
        </section>

    )
}

export default Testimonials