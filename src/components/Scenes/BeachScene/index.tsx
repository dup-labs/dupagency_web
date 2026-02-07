'use client'

import { useRef } from 'react'
import { isMobile } from '@/utils/isMobile'
import gsap from 'gsap'

import './beachScene.css'
import BeachVisual from './BeachVisual'

import { ScrollTrigger } from '@/lib/gsap'

import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { entrance } from '@/animations/entrance'

const BeachScene = ({ children }: any) => {
  const sectionRef = useRef<HTMLElement>(null)

  useSectionAnimations(sectionRef, (ctx) => {
    const section = sectionRef.current
    if (!section) return

    const scope = ctx.selector!

    // 🎬 timeline base (MANTIDA)
    const tl = entrance(scope('.beach-scene'), [
      {
        el: scope('.headline_title'),
        from: { x: 0, y: 60, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1, ease: 'power3.out' },
      },
      {
        el: scope('.headline_text'),
        from: { x: 0, y: 80, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1, ease: 'power3.out' },
        at: '-=0.4',
      },
    ]).tl()

    const headlineContainer = scope('.headerContainer')
    const cardContainer = scope('.cards_container')
    const partnerContainer = scope('.partners_container')

    const cards = gsap.utils.toArray<HTMLElement>(
      scope('.beach-card')
    )

    // 🔒 estado inicial REAL do partner
    gsap.set(partnerContainer, { y: '0' })

   

    isMobile() ?
        tl.fromTo(
          cardContainer,
          { 
            y: 400
          },
          {
            y: -100,
            duration: 10
          },
          'cardsStart+=0.5'
        )
    : ''
      
      
       

    // -----------------------
    // FASE 1 — cards entram
    // -----------------------
    tl.addLabel('cardsStart')

    tl.fromTo(
      cards,
      { opacity: 0 },
      {
        opacity: 1,
      },
      'cardsStart'
    )

    // 🟢 BACKGROUND RESET (reintroduzido)
    tl.set(
      cardContainer,
      {
        backgroundImage: 'none',
      },
      'cardsStart+=0.5'
    )

    isMobile() ?
        tl.fromTo(
          headlineContainer,
          { 
            y: 0
          },
          {
            y: -100,
            opacity: 0,
            duration: 3
          },
          'cardsStart+=0.5'
        )
    : ''

    // -----------------------
    // MIolo — cards vivem
    // -----------------------
    tl.to(cards, {
      borderRadius: 20,
      ease: 'none',
    })

    tl.to(cards[0], { x: -20, ease: 'none' }, '+=0.5')
    tl.to(cards[2], { x: 20, ease: 'none' }, '<')

    if(!isMobile()) {
      tl.to(cards[0], { rotateZ: -5, ease: 'none' }, '+=0.5')
      tl.to(cards[2], { rotateZ: 8, ease: 'none' }, '<')
    }


    // -----------------------
    // 3️⃣ FLIP (IDA) — MAIS LENTO
    // -----------------------
    tl.to(cards[0], {
      rotateY: 180,
      ease: 'none',
      transformOrigin: 'center center',
      duration: 2.5,
    }, '+=1')

    tl.to(cards[1], {
      rotateY: 180,
      ease: 'none',
      transformOrigin: 'center center',
      duration: 2.5,
    }, '+=1')

    tl.to(cards[2], {
      rotateY: 180,
      ease: 'none',
      transformOrigin: 'center center',
      duration: 2.5,
    }, '+=1')

    // 🧠 TEMPO DE LEITURA
    tl.to({}, { duration: 3.5 })

    // -----------------------
    // 4️⃣ FLIP (VOLTA)
    // -----------------------
    
    tl.to(cards[0], {
      rotateY: 0,
      ease: 'none',
      transformOrigin: 'center center',
      duration: 2.5,
    }, '+=1')

    tl.to(cards[1], {
      rotateY: 0,
      ease: 'none',
      transformOrigin: 'center center',
      duration: 2.5,
    }, '+=1')

    tl.to(cards[2], {
      rotateY: 0,
      ease: 'none',
      transformOrigin: 'center center',
      duration: 2.5,
    }, '+=1')
    

    tl.to({}, { duration: 5 })

    // -----------------------
    // 5️⃣ saída dos cards
    // -----------------------
   
    tl.to(cards[0], { x: 0, rotate: 0, ease: 'none'}, '+=0.5')
    tl.to(cards[1], { x: 0, rotate: 0, ease: 'none'}, '+=0.5')
    tl.to(cards[2], { x: 0, rotate: 0, ease: 'none'}, '+=0.5')

    if(isMobile()) {
      tl.to(cards[0], { x: 0, ease: 'none' }, '+=0.5')
      tl.to(cards[2], { x: 0, ease: 'none' }, '<')
    }

    // console.log('card 2',cards[2])
    // tl.to(cards, { opacity: 0, duration: 2 }, '+=0.5')

    // -----------------------
    // CLÍMAX
    // -----------------------
    const climaxTime = tl.duration() * 0.85

    tl.set(
      cardContainer,
      {
        backgroundImage: 'url(./assets/beachImage.jpg)',
      },
      climaxTime
    )

    tl.to(
      cardContainer,
      {
        scale: isMobile() ? 1.8 : 2.2,
        ease: 'none',
        duration: 9,
      },
      climaxTime
    )

    tl.to(
      cards,
      {
        autoAlpha: 0,
        ease: 'none',
      },
      climaxTime
    )

    tl.to(
      partnerContainer,
      {
        y: '-100vh',
        ease: 'none',
        duration: 6.5,
      },
      climaxTime
    )

    // -----------------------
    // SCROLLTRIGGER
    // -----------------------
    ScrollTrigger.create({
      trigger: section,
      start: isMobile() ? 'top 5%' : 'top 0%',
      end: isMobile() ? '+=4800' : '+=4200',
      scrub: true,
      animation: tl,
      pin: section,
      anticipatePin: 1,
    })

    ScrollTrigger.refresh()
  })

  return (
    <section
      ref={sectionRef}
      className="beach-scene relative bg-grid-lines"
    >
      <BeachVisual />
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}

export default BeachScene
