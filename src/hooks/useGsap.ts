"use client"

import { useLayoutEffect } from "react"
import gsap from "gsap"

export function useGSAP(
  fn: () => void,
  deps: any[] = []
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(fn)
    return () => ctx.revert()
  }, deps)
}