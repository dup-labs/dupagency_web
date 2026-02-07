import gsap from "gsap"

type EntranceItem = {
  el: Element | string
  from: gsap.TweenVars
  to?: gsap.TweenVars
  at?: string | number
}

export function entrance(
  container: Element | string,
  items: EntranceItem[]
) {
  let tl: gsap.core.Timeline

  const ctx = gsap.context(() => {
    tl = gsap.timeline({ paused: true })

    items.forEach(({ el, from, at }) => {
      tl!.from(el, from, at)
    })
  }, container)

  return {
    tl: () => tl!,
    cleanup: () => ctx.revert(),
  }
}