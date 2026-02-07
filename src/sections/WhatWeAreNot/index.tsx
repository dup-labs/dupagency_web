'use client'

import { useRef } from 'react' 

import WhatWeAreNotheadline from "./WhatWeAreNotheadline"
import WhatWeAreNotCard from "./WhatWeAreNotCard"

import { isMobile } from '@/utils/isMobile'
import gsap from 'gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { mouseParallax } from '@/animations/mouseParallax'
import { entrance } from '@/animations/entrance'


const WhatWeAreNot = () => {
    const sectionRef = useRef<HTMLElement>(null)

    useSectionAnimations(sectionRef, (ctx) => {
        const section = sectionRef.current
        if (!section) return

        const scope = ctx.selector!

        // 🎬 timeline SEM play
        const tl = entrance(scope('.howWeWork'), 
                [{
                    el: scope('.headline_title'),
                    from: {  x: -30, y: 20, opacity: 0 },
                    to:   { x: 0, y: 0,  opacity: 1, ease: 'power3.out' },
                },
                {
                    el: scope('.headline_text'),
                    from: {  x: -70, y: 10, opacity: 0 },
                    to:   { x: 0, y: 0,  opacity: 1, ease: 'power3.out' },
                    at: '-=0.4',
                }]
        ).tl()

        // 🔹 pega TODOS os cards (array real)
        const cards = gsap.utils.toArray<HTMLElement>(
            scope('.whatwearenot-card')
        )

        // 🔹 anima cards com stagger
        tl.fromTo(
            cards,
            { 
                x: 0, 
                y: 200, 
                opacity: 0 
            },
            {
                x: 0,
                y: 0,
                opacity: 1,
                ease: 'power3.out',
                stagger: {
                    each: 0.12,
                    from: 'random', // start | center | end | random
                },
            },
            '-=0.2' // overlap com o texto
        )


        ScrollTrigger.create({
            trigger: section,
            start: isMobile() ? 'top 10%' : 'top 10%',
            end: '+=2500',
            scrub: 1,
            pin: true,
            animation: tl,
        })

        ScrollTrigger.create({
            trigger: section,
            start: isMobile() ? 'top 10%' : 'top 10%',
            end: '+=3500 top',
            
            onEnter: () => {
                document.documentElement.style.setProperty('--background', '#1A1A1A')
                document.documentElement.style.setProperty('--foreground', '#ffffff')
            },
            onEnterBack: () => {
                document.documentElement.style.setProperty('--background', '#1A1A1A')
                document.documentElement.style.setProperty('--foreground', '#ffffff')
            },
            onLeave: () => {
                document.documentElement.style.setProperty('--background', '#ffffff')
                document.documentElement.style.setProperty('--foreground', '#1A1A1A')
            },
            onLeaveBack: () => {
                document.documentElement.style.setProperty('--background', '#ffffff')
                document.documentElement.style.setProperty('--foreground', '#1A1A1A')
            },
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
       <section ref={sectionRef} className="relative lg:min-h-dvh bg-grid-lines overflow-hidden">
            <div className="lg:max-w-[70%] m-auto px-6">
                <WhatWeAreNotheadline />
                <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 mt-24">
                    <WhatWeAreNotCard
                        title={
                                <h4 className="text-brand-gradient-negative text-2xl font-bold">Não somos agência de promessa</h4>
                        }
                        text={
                            <p className="text-gray-400 mt-2 text-lg">Não prometemos se não vamos cumprir, e não aceitamos prazos irreais</p>
                        }
                    />
                    <WhatWeAreNotCard
                        title={
                                <h4 className="text-brand-gradient-negative text-2xl font-bold">Não vendemos pacotes de horas inflado</h4>
                        }
                        text={
                            <p className="text-gray-400 mt-2 text-lg">Vamos conversar e entender quanto você precisa, e temos liberdade de ajustar no processo, o importante é que seja útil de verdade</p>
                        }
                    />
                    <WhatWeAreNotCard
                        title={
                                <h4 className="text-brand-gradient-negative text-2xl font-bold">Não fazemos tudo no automático</h4>
                        }
                        text={
                            <p className="text-gray-400 mt-2 text-lg">Entender é a parte mais importante para fazer o ideal, então alinhamentos são frequentes para garantir o sucesso.</p>
                        }
                    />
                    <WhatWeAreNotCard
                        title={
                                <h4 className="text-brand-gradient-negative text-2xl font-bold">Não trabalhamos no escuro</h4>
                        }
                        text={
                            <p className="text-gray-400 mt-2 text-lg">Entender o objetivo e a utilidade de cada solicitação é peça fundamental para uma contribuição mais alinhada</p>
                        }
                    />
                </div>
            </div>
        </section>

    )
}

export default WhatWeAreNot