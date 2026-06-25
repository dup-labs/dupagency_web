'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
// Custom service icons
function IconBlueprint() {
  return (
    <svg width="40" height="40" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32.6095" cy="32.6095" r="30.6095" stroke="white" strokeWidth="4"/>
    </svg>
  )
}
function IconConsultoria() {
  return (
    <svg width="66" height="40" viewBox="0 0 110 67" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="33.5" cy="33.5" r="31.5" stroke="white" strokeWidth="4"/>
      <path d="M76 2C93.7011 2 108 16.1309 108 33.5C108 50.8691 93.7011 65 76 65C58.2989 65 44 50.8691 44 33.5C44 16.1309 58.2989 2 76 2Z" stroke="white" strokeWidth="4"/>
    </svg>
  )
}
function IconProjeto() {
  return (
    <svg width="48" height="40" viewBox="0 0 92 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M45.528 22.0757C59.6442 22.0757 71.1323 33.6748 71.1325 48.0376C71.1325 62.4006 59.6443 74.0005 45.528 74.0005C31.4118 74.0003 19.9245 62.4005 19.9245 48.0376C19.9247 33.6749 31.4119 22.0758 45.528 22.0757Z" stroke="white" strokeWidth="4"/>
      <circle cx="27.9623" cy="27.9623" r="25.9623" stroke="white" strokeWidth="4"/>
      <circle cx="63.0943" cy="27.9623" r="25.9623" stroke="white" strokeWidth="4"/>
    </svg>
  )
}
function IconEvolucao() {
  return (
    <svg width="40" height="40" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.6998 75.1505C22.6998 58.1382 36.6875 44.3001 53.9996 44.2999C71.3119 44.2999 85.2994 58.1381 85.2994 75.1505C85.2992 92.1628 71.3118 106 53.9996 106C36.6876 106 22.7 92.1627 22.6998 75.1505Z" stroke="white" strokeWidth="4"/>
      <circle cx="53.9998" cy="33.3002" r="31.3" transform="rotate(-90 53.9998 33.3002)" stroke="white" strokeWidth="4"/>
      <path d="M33.2998 23.6002C50.6119 23.6002 64.5994 37.4376 64.5996 54.4498C64.5996 71.4623 50.6121 85.3004 33.2998 85.3004C15.9876 85.3003 2 71.4622 2 54.4498C2.00021 37.4377 15.9878 23.6003 33.2998 23.6002Z" stroke="white" strokeWidth="4"/>
      <path d="M74.6999 23.6002C92.0121 23.6002 106 37.4376 106 54.4498C106 71.4623 92.0122 85.3004 74.6999 85.3004C57.3878 85.3003 43.4001 71.4622 43.4001 54.4498C43.4004 37.4377 57.3879 23.6003 74.6999 23.6002Z" stroke="white" strokeWidth="4"/>
    </svg>
  )
}
import { gsap } from '@/lib/gsap'

// ─── Dados ────────────────────────────────────────────────────────────────────

// `tkey` mapeia pro namespace home.servicos.<tkey>.title/body. O id 'projeto'
// usa a chave 'implantacao' (nome do serviço no conteúdo).
const SERVICES = [
  { id: 'blueprint',   Icon: IconBlueprint,   tkey: 'blueprint'   },
  { id: 'consultoria', Icon: IconConsultoria, tkey: 'consultoria' },
  { id: 'projeto',     Icon: IconProjeto,     tkey: 'implantacao' },
  { id: 'evolucao',    Icon: IconEvolucao,    tkey: 'evolucao'    },
]

// ─── Layout ───────────────────────────────────────────────────────────────────

const VISIBLE  = 5
const GAP      = 5
const REPEATS  = 3
// Mobile: ~1.3 cards visíveis (mín 260px); desktop: 5 cards
const CARD_W   = `max(260px, calc((100vw - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE}))`

function isEdge(index: number) {
  return (index + 1) % VISIBLE === 0
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ServiceCard({
  Icon,
  tkey,
  blurred,
  ariaHidden,
}: (typeof SERVICES)[number] & { blurred?: boolean; ariaHidden?: boolean }) {
  const t = useTranslations('home.servicos')
  return (
    <div
      className="flex flex-col bg-neutral-900 rounded-xl"
      aria-hidden={ariaHidden ? 'true' : undefined}
      style={{
        width: CARD_W,
        minHeight: '320px',
        flexShrink: 0,
        padding: '40px',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        filter: blurred ? 'blur(5px)' : 'none',
      }}
    >
      <div style={{ opacity: 0.7, flexShrink: 0 }}>
        <Icon />
      </div>
      <h3
        className="font-chillax font-bold text-white uppercase"
        style={{ fontSize: '28px', lineHeight: 'var(--leading-heading)', whiteSpace: 'pre-line', marginTop: '32px' }}
      >
        {t(`${tkey}.title`)}
      </h3>
      <p
        className="font-synonym text-white"
        style={{ fontSize: '15px', lineHeight: 1.6, opacity: 0.75, marginTop: '16px' }}
      >
        {t(`${tkey}.body`)}
      </p>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────

const ALL_CARDS     = Array.from({ length: REPEATS }, () => SERVICES).flat()
const MOBILE_ROW1   = Array.from({ length: REPEATS }, () => [SERVICES[2], SERVICES[3]]).flat() // Projeto + Evolução
const MOBILE_ROW2   = Array.from({ length: REPEATS }, () => [SERVICES[0], SERVICES[1]]).flat() // Blueprint + Consultoria

function Row({
  rowRef,
  cards = ALL_CARDS,
  allBlurred,
  edgeBlur,
  className = '',
}: {
  rowRef: React.RefObject<HTMLDivElement | null>
  cards?: typeof ALL_CARDS
  allBlurred?: boolean
  edgeBlur?: boolean
  className?: string
}) {
  // Cada serviço aparece REPEATS vezes (carrossel infinito visual). Só a
  // primeira cópia é exposta pra screen readers / SEO; as demais ficam
  // aria-hidden pra não duplicar conteúdo.
  const uniqueCount = cards.length / REPEATS

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ width: '100%', flexShrink: 0 }}
      // Linha inteiramente borrada é puramente decorativa — esconde tudo
      // dentro de uma vez via ancestry.
      aria-hidden={allBlurred ? 'true' : undefined}
      role={allBlurred ? 'presentation' : undefined}
    >
      <div
        ref={rowRef}
        className="flex will-change-transform"
        style={{
          gap: `${GAP}px`,
          filter:  allBlurred ? 'blur(5px)' : 'none',
          opacity: allBlurred ? 0.7 : 1,
        }}
      >
        {cards.map((s, i) => {
          const isClone = i >= uniqueCount
          const cardBlurred = edgeBlur ? isEdge(i) : false
          // Em rows não-allBlurred (legíveis): esconde clones e cards
          // individuais com blur. Quando allBlurred, o wrapper já cuida.
          const cardAriaHidden = !allBlurred && (isClone || cardBlurred)
          return (
            <ServiceCard
              key={`${s.id}-${i}`}
              {...s}
              blurred={cardBlurred}
              ariaHidden={cardAriaHidden}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Servicos() {
  const sectionRef        = useRef<HTMLElement>(null)
  const row1Ref           = useRef<HTMLDivElement>(null)
  const row2Ref           = useRef<HTMLDivElement>(null)
  const row3Ref           = useRef<HTMLDivElement>(null)
  const mobileWrapperRef  = useRef<HTMLDivElement>(null)
  const row1MobileRef     = useRef<HTMLDivElement>(null)
  const row2MobileRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const vw     = window.innerWidth
    const mobile = vw < 768

    const ctx = gsap.context(() => {
      if (mobile) {
        const cardW = Math.max(260, (vw - (VISIBLE - 1) * GAP) / VISIBLE)
        const pairW = cardW + GAP

        gsap.set(row1MobileRef.current, { x: -vw })
        gsap.set(row2MobileRef.current, { x: 0 })

        // Trigger no wrapper alto — sem pin, conteúdo sticky no CSS
        const st = {
          trigger: mobileWrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }

        gsap.to(row1MobileRef.current, { x: -(vw - cardW), ease: 'none', scrollTrigger: st })
        gsap.to(row2MobileRef.current, { x: -pairW,        ease: 'none', scrollTrigger: st })
      } else {
        gsap.set(row1Ref.current, { x: -vw })
        gsap.set(row2Ref.current, { x: 0 })
        gsap.set(row3Ref.current, { x: -vw })

        const st = {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        }

        gsap.to(row1Ref.current, { x:   0, ease: 'none', scrollTrigger: st })
        gsap.to(row2Ref.current, { x: -vw, ease: 'none', scrollTrigger: st })
        gsap.to(row3Ref.current, { x:   0, ease: 'none', scrollTrigger: st })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="relative z-10"
    >
      {/* Desktop: 3 rows */}
      <div className="hidden md:flex flex-col overflow-hidden bg-neutral-950" style={{ gap: `${GAP}px` }}>
        <Row rowRef={row1Ref} allBlurred />
        <Row rowRef={row2Ref} />
        <Row rowRef={row3Ref} allBlurred />
      </div>

      {/* Mobile: wrapper alto → conteúdo sticky simula pin sem conflito */}
      <div
        ref={mobileWrapperRef}
        className="md:hidden bg-neutral-950"
        style={{ height: '300vh' }}
      >
        <div
          className="sticky top-0 flex flex-col overflow-hidden"
          style={{ gap: `${GAP}px`, paddingTop: '24px', paddingBottom: '24px' }}
        >
          <Row rowRef={row1MobileRef} cards={MOBILE_ROW1} />
          <Row rowRef={row2MobileRef} cards={MOBILE_ROW2} />
        </div>
      </div>
    </section>
  )
}
