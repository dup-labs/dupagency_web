'use client'

import { useEffect, RefObject } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SectionAnimationsFn = (ctx: gsap.Context) => void

export function useSectionAnimations(
  scopeRef: RefObject<HTMLElement | null>,
  fn: SectionAnimationsFn
) {
  useEffect(() => {
    const element = scopeRef.current
    if (!element) return

    const ctx = gsap.context((ctx) => {
      fn(ctx)
    }, element)

    return () => {
      ctx.revert()
    }
  }, [])
}