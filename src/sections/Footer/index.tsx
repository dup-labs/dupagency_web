'use client'


import Footerheadline from "./Footerheadline"

import { useRef } from 'react' 
import { isMobile } from '@/utils/isMobile'
import gsap from 'gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { mouseParallax } from '@/animations/mouseParallax'
import { entrance } from '@/animations/entrance'




const Footer = () => {
    const sectionRef = useRef<HTMLElement>(null)

    useSectionAnimations(sectionRef, (ctx) => {
        const section = sectionRef.current
        if (!section) return

        const scope = ctx.selector!

        // 🎬 timeline SEM play
        const tl = entrance(scope('.howWeWork'), [
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

        // 🎯 Scroll controla tudo
        ScrollTrigger.create({
            trigger: section,
            start: isMobile() ?  'center 80%' : 'center 80%',
            end: isMobile() ?  'bottom 50%' : 'bottom 50%',
            scrub: 1,
            animation: tl,
            onEnter: () => {
                document.documentElement.style.setProperty(
                '--background',
                '#1A1A1A'
                )
                document.documentElement.style.setProperty(
                '--foreground',
                '#ffffff'
                )
            },
            onEnterBack: () => {
                document.documentElement.style.setProperty(
                '--background',
                '#1A1A1A'
                )
                document.documentElement.style.setProperty(
                '--foreground',
                '#ffffff'
                )
            },
            onLeave: () => {
                document.documentElement.style.setProperty(
                '--background',
                '#ffffff'
                )
                document.documentElement.style.setProperty(
                '--foreground',
                '#1A1A1A'
                )
            },
            onLeaveBack: () => {
                document.documentElement.style.setProperty(
                '--background',
                '#ffffff'
                )
                document.documentElement.style.setProperty(
                '--foreground',
                '#1A1A1A'
                )
            },
        })

        // icons
        const icons = Array.from(
            section.querySelectorAll<HTMLElement>('.footer-button')
        )

        icons.forEach((icon, i) => {
            const amplitude = 6 + Math.random() * 3      // quanto flutua
            const duration  = 1.2 + Math.random() * 2     // velocidade
            const delay     = Math.random() * 5      

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
       <footer 
            ref={sectionRef}
            className="relative lg:min-h-dvh bg-grid-lines py-32 flex justify-center items-center overflow-hidden flex-col"
       >
            <Footerheadline />
            <div className="flex gap-8 mt-12 w-full justify-center items-center flex-col lg:flex-row">
                <a href="" className="footer-button flex px-12 py-4 rounded-full w-[300px] justify-center bg-button-gradient-2 font-medium text-lg">Agendar 30 minutos</a>
                <a href="" className="footer-button flex px-12 py-4 rounded-full w-[300px] justify-center bg-button-gradient-1 font-medium text-lg">Falar via Whatsapp</a>
            </div>
            <p className="w-1/2 text-center lg:w-full text-gray-300 mt-10">Por este link você agenda direto quando encaixar na sua agenda.</p>
        </footer>

    )
}

export default Footer