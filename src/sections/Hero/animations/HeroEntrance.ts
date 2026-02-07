import gsap from "gsap"

export function heroEntrance() {
  const tl = gsap.timeline()

  tl.from(".hero .headline_title", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })
  .from(
    ".hero .headline_text",
    {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=0.4"
  )
}
