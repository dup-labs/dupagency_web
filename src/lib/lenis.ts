// lib/lenis.ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobile } from '@/utils/isMobile'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function initLenis() {
  // ⛔️ SSR guard (ESSENCIAL)
  if (typeof window === 'undefined') {
    return null
  }

  // ♻️ singleton
  if (lenis) return lenis

  const mobile = isMobile() // 👈 chama UMA vez

  lenis = new Lenis({
    duration: mobile ? 0 : 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: !mobile, // ❗ antes estava errado

    // 🔥 ignora scroll dentro do container interno
    prevent: (node) => {
      return !!node.closest('.partner_content')
    },
  })

  // 🔗 Lenis → ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  // 🔄 GSAP controla o RAF
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}
