'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { richTags } from '@/i18n/rich'
import { gsap } from '@/lib/gsap'

// Número + chave de tradução (home.processo.stepN.title/body).
const CARDS = [
  { num: '01', key: 'step1' },
  { num: '02', key: 'step2' },
  { num: '03', key: 'step3' },
  { num: '04', key: 'step4' },
]

const INITIAL = [
  { z: -1800, x:  420, y:  220 },
  { z: -1900, x: -280, y:  160 },
  { z: -2000, x:  160, y:  -60 },
  { z: -2100, x: -240, y: -170 },
]

const FINAL = [
  { z:  600, x:  380, y: -200 },
  { z:  660, x: -280, y: -250 },
  { z:  720, x:  320, y:  180 },
  { z:  760, x: -450, y:  120 },
]

const FINAL_MOBILE = [
  { z:  500, x:   -200, y: -320 },
  { z:  540, x:  180, y: -80 },
  { z:  580, x:   -120, y:  280 },
  { z:  620, x:  140, y:  -40 },
]

const STARTS = [0.15, 0.25, 0.35, 0.45]

const N_CIRCLES = 7

// Knobs de performance do blur.
// STEP maior + MAX menor = mais barato. Calibra MAX antes de mexer no STEP.
const BLUR_STEP = 2   // degraus de 2px — o pulo some no transform contínuo
const MAX_BLUR  = 6   // teto do desfoque (era 8) — perspectiva carrega o "longe"

export default function ComoTrabalhamos() {
  const t = useTranslations('home.processo')
  const outerRef  = useRef<HTMLElement>(null)   // trigger do ScrollTrigger
  const innerRef  = useRef<HTMLDivElement>(null) // sticky div, scope do GSAP context
  const circleEls = useRef<(HTMLDivElement | null)[]>([])
  const titleRef  = useRef<HTMLDivElement>(null)
  const cardEls   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return

    const finals = window.innerWidth < 768 ? FINAL_MOBILE : FINAL
    const snapBlur = gsap.utils.snap(BLUR_STEP)

    const ctx = gsap.context(() => {
      gsap.set(circleEls.current, { opacity: 0, scale: 0.8 })
      gsap.set(titleRef.current,  { opacity: 0, y: 24 })

      cardEls.current.forEach((el, i) => {
        if (!el) return
        const init = INITIAL[i]
        // filter blur começa no teto (longe = embaçado) e zera quando chega na frente.
        gsap.set(el, { xPercent: -50, yPercent: -50, z: init.z, x: init.x, y: init.y, opacity: 0, filter: `blur(${MAX_BLUR}px)` })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,  // elemento alto — calcula posições corretamente
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(circleEls.current, {
        opacity: (i: number) => 1 - i * 0.13,
        scale: 1,
        duration: 0.85,
        stagger: { each: 0.04, from: 'start' },
        ease: 'power1.out',
      }, 0)

      tl.to(circleEls.current, {
        opacity: 0,
        duration: 0.30,
        stagger: { each: 0.03, from: 'start' },
        ease: 'power1.in',
      }, 0.60)

      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.08)

      cardEls.current.forEach((el, i) => {
        if (!el) return
        const f = finals[i]
        const s = STARTS[i]
        const dur = 0.44

        // Movimento contínuo do longe pro perto — transform, de graça no compositor.
        tl.to(el, { z: f.z, x: f.x, y: f.y, duration: dur, ease: 'none' }, s)

        // Opacity contínuo — também de graça no compositor.
        tl.to(el, {
          keyframes: [
            { opacity: 1, duration: dur * 0.35, ease: 'power1.out' },
            { opacity: 1, duration: dur * 0.50, ease: 'none'       },
            { opacity: 0, duration: dur * 0.15, ease: 'power1.in'  },
          ],
        }, s)

        // Blur QUANTIZADO — anima um proxy numérico e só escreve no DOM quando
        // o degrau muda. onUpdate dispara todo frame, mas el.style.filter só é
        // tocado nas trocas de degrau → re-rasterização despenca.
        const blurState = { v: MAX_BLUR }
        let lastBlur = -1
        const applyBlur = () => {
          const b = Math.min(snapBlur(blurState.v), MAX_BLUR)
          if (b === lastBlur) return        // não escreve = não re-rasteriza
          lastBlur = b
          el.style.filter = b <= 0 ? 'none' : `blur(${b}px)`
        }
        tl.to(blurState, {
          keyframes: [
            { v: 0,        duration: dur * 0.50, ease: 'power2.out' }, // foca em 50%
            { v: 0,        duration: dur * 0.40, ease: 'none'       }, // mantém legível 50→90%
            { v: MAX_BLUR, duration: dur * 0.10, ease: 'power2.in'  }, // embaça de novo no fim
          ],
          onUpdate: applyBlur,
        }, s)
      })
    }, innerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="como-trabalhamos"
      ref={outerRef}
      className="relative z-10"
      style={{ height: '480vh' }}
    >
      <div
        ref={innerRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Círculos concêntricos */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          {Array.from({ length: N_CIRCLES }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { circleEls.current[i] = el }}
              className="absolute rounded-full"
              style={{
                width:  `max(${(i + 1) * 13}vw, ${(i + 1) * 14}vh)`,
                height: `max(${(i + 1) * 13}vw, ${(i + 1) * 14}vh)`,
                border: '1px solid var(--neutral-200)',
                filter: `blur(${Math.max(0.3, (N_CIRCLES - i - 1) * 0.6)}px)`,
              }}
            />
          ))}
        </div>

        {/* Título */}
        <div
          ref={titleRef}
          className="absolute top-0 left-0 right-0 flex flex-col items-center pt-20 md:pt-27 pointer-events-none px-6 md:px-8"
          style={{ zIndex: 0 }}
        >
          <h2
            className="font-chillax font-bold text-center uppercase text-black"
            style={{ fontSize: 'clamp(24px, 3.2vw, 44px)', lineHeight: 'var(--leading-display)' }}
          >
            {t.rich('headline', richTags)}
          </h2>
          <p
            className="mt-2 font-synonym text-neutral-600 text-center max-w-sm"
            style={{ fontSize: '13px', lineHeight: 'var(--leading-body)' }}
          >
            {t('subheadline')}
          </p>
        </div>

        {/* Cards — perspectiva 3D */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.num}
              ref={(el) => { cardEls.current[i] = el }}
              style={{
                position:   'absolute',
                top:        '50%',
                left:       '50%',
                zIndex:     i + 1,
                willChange: 'transform, opacity',
              }}
            >
              <div className="card-work-frame">
                <div className="card-work">
                  <h3 className="card-work__title">
                    <small className='text-sm text-white'>{card.num}.</small> {t(`${card.key}.title`)}
                  </h3>
                  <p className="card-work__body">
                    {t(`${card.key}.body`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}