import gsap from "gsap"

type ParallaxTarget = {
  el: HTMLElement
  strength: number
}

export function mouseParallax(
  container: HTMLElement,
  targets: ParallaxTarget[]
) {
  const isDesktop = window.matchMedia("(pointer: fine)").matches
  if (!isDesktop) return

  const onMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    targets.forEach(({ el, strength }) => {
      const moveX = (-1 * (x / rect.width - 0.5)) * strength
      const moveY = (-1 * (y / rect.height - 0.5)) * strength

      gsap.to(el, {
        x: moveX,
        y: moveY,
        duration: 0.6,
        ease: "power3.out",
      })
    })
  }

  container.addEventListener("mousemove", onMove)

  return () => {
    container.removeEventListener("mousemove", onMove)
  }
}
