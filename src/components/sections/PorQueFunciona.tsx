'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const ITEMS = [
  {
    num: '01',
    titulo: 'Paz operacional\nde verdade',
    texto:
      'O sentimento de preocupação com quebras e bugs vai embora. A tecnologia da loja deixa de ocupar espaço na sua cabeça — e começa a ser o que deveria ser desde o início: algo que simplesmente funciona.',
  },
  {
    num: '02',
    titulo: 'Alinhamento, explicação e\ndecisão em equipe.',
    texto:
      'Tudo que vai pra loja passa por você antes. A gente apresenta o caminho, explica o raciocínio, e só avança quando você concorda. Você sabe o que vem por aí antes de acontecer.',
  },
  {
    num: '03',
    titulo: 'A qualidade de sempre, com\na tranquilidade de sempre.',
    texto:
      'Nossa operação sempre seremos nós — estejamos em Buenos Aires, João Pessoa ou na Tailândia. Os mesmos dois sêniores que você já conhece, já confia, e que conhecem cada detalhe do seu projeto.',
  },
]

export default function PorQueFunciona() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const els = [headerRef.current, ...itemsRef.current].filter(Boolean)

      gsap.set(els, { opacity: 0, y: 48 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      })

      tl.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
        stagger: 0.2,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="por-que-funciona"
      ref={sectionRef}
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 py-20"
    >
      <div ref={headerRef} className="flex flex-col md:flex-row items-start md:justify-between mb-16 gap-4 md:gap-8">
        <h2
          className="font-chillax font-bold text-white uppercase shrink-0"
          style={{ fontSize: 'clamp(40px, 6.5vw, 80px)', lineHeight: 'var(--leading-display)' }}
        >
          Porque
          <br />
          funciona
        </h2>
        <p
          className="font-synonym text-body-md text-white opacity-60 md:text-right max-w-xs md:self-center"
          style={{ lineHeight: 'var(--leading-body)' }}
        >
          A gente entra pra organizar, planejar e executar evoluções com
          clareza, explicando prós, contras, e riscos antes de qualquer decisão
        </p>
      </div>

      <div className="flex flex-col">
        {ITEMS.map((item, i) => (
          <div
            key={item.num}
            ref={(el) => { itemsRef.current[i] = el }}
            className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 py-6 md:py-9"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            <span className="font-synonym text-label-ui text-white opacity-40 shrink-0 w-8">
              {item.num}
            </span>
            <h3
              className="font-chillax font-bold text-white uppercase flex-1"
              style={{ fontSize: 'clamp(18px, 2.2vw, 28px)', lineHeight: 'var(--leading-heading)', whiteSpace: 'pre-line' }}
            >
              {item.titulo}
            </h3>
            <p
              className="font-synonym text-body-md text-white opacity-70 md:w-[38%] md:shrink-0"
              style={{ lineHeight: 'var(--leading-body)' }}
            >
              {item.texto}
            </p>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }} />
      </div>
    </section>
  )
}
