import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase)

  ScrollTrigger.config({ ignoreMobileResize: true })
}

export { gsap, ScrollTrigger, CustomEase }
