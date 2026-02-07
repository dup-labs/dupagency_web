'use client'

import { useRef } from 'react'

import HeroHeadline from './Heroheadline'
import { useSectionAnimations } from '@/hooks/useSectionAnimations'
import { mouseParallax } from '@/animations/mouseParallax'
import { entrance } from '@/animations/entrance'

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  useSectionAnimations(heroRef, (ctx) => {
    const scope = ctx.selector!

    const { tl } = entrance(scope('.hero'), [
      {
        el: scope('.headline_title'),
        from: { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' },
      },
      {
        el: scope('.headline_text'),
        from: { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' },
        at: '-=0.4',
      },
    ])

    tl().play()

    if (!heroRef.current || !headlineRef.current) return

    const title = headlineRef.current.querySelector<HTMLElement>('.headline_title')
    const text  = headlineRef.current.querySelector<HTMLElement>('.headline_text')

    if (!title || !text) return

    const cleanup = mouseParallax(heroRef.current, [
      { el: title, strength: 8 },
      { el: text, strength: 16 },
    ])

    return cleanup
  })

  return (
    <section
      ref={heroRef}
      className="hero h-screen w-full flex justify-center items-center text-center bg-grid-lines"
    >
      <div
        ref={headlineRef}
        className="max-w-full lg:max-w-1/2"
      >
        <HeroHeadline />
      </div>
    </section>
  )
}

export default Hero
