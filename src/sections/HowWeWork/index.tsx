'use client'

import { useRef } from 'react'
import { isMobile } from '@/utils/isMobile'

import gsap from 'gsap'

import HowWeWorkGridMobile from './components/HowWeWorkGridMobile'
import HowWeWorkGridDesktop from './components/HowWeWorkGridDesktop'

import { ScrollTrigger } from '@/lib/gsap'

import IconTravel from './assets/travel-dynamic-clay.png'
import IconTarget from './assets/target-dynamic-clay.png'
import IconMegaphone from './assets/megaphone-dynamic-clay.png'
import IconTrophy from './assets/trophy-dynamic-clay.png'
import IconLock from './assets/lock-dynamic-clay.png'
import IconGym from './assets/gym-dynamic-clay.png'

import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { mouseParallax } from '@/animations/mouseParallax'
import { entrance } from '@/animations/entrance'

const HowWeWork = () => {
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
        scope('.howwework-card')
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
      start: isMobile() ?  'top 10%' : 'top 0%',
      end: isMobile() ?  'bottom 90%' : '+=2500',
      scrub: 1,
      pin: true,
      animation: tl
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

  return (
    <section
      ref={sectionRef}
      className="howWeWork relative lg:min-h-dvh bg-grid-lines py-12 pb-32 overflow-hidden"
    >
      <div className="max-w-[98%] m-auto px-6">
        <HowWeWorkGridMobile
          IconGym={IconGym}
          IconLock={IconLock}
          IconMegaphone={IconMegaphone}
          IconTarget={IconTarget}
          IconTravel={IconTravel}
          IconTrophy={IconTrophy}
        />
        <HowWeWorkGridDesktop
          IconGym={IconGym}
          IconLock={IconLock}
          IconMegaphone={IconMegaphone}
          IconTarget={IconTarget}
          IconTravel={IconTravel}
          IconTrophy={IconTrophy}
        />
      </div>
    </section>
  )
}

export default HowWeWork
