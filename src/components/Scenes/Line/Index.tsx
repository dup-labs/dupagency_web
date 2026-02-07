

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis } from '@/lib/lenis'
import LineIcon from "./SvgLine"

gsap.registerPlugin(ScrollTrigger)

const Line = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const path = document.querySelector<SVGPathElement>('#stroke-path')
    if (!path) return

    const length = path.getTotalLength()

    gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
    })

    ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        scrub: true,
        onUpdate: (self) => {
        path.style.strokeDashoffset = `${length * (1 - self.progress)}`
        },
    })
    }, [])


  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-dvg">
      <LineIcon className="w-full h-auto opacity-30" />
    </div>
  )
}

export default Line
