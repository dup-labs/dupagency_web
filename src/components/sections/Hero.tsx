'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { PlayPauseIcon } from '@phosphor-icons/react'
import { PhosphorIcon } from '@/components/ui/PhosphorIcon'

// GlitchGrid é só usado dentro do manifesto (abaixo do fold). Lazy-load
// pra não pesar o chunk principal e atrasar a pintura do hero headline (LCP).
const GlitchGrid = dynamic(() => import('@/components/ui/GlitchGrid'), {
  ssr: false,
})

// 8 fotos (4 Dup + 4 Lari) circulam pelos 4 slots do GlitchGrid sem repetir
// simultaneamente. Cada foto carrega uma `key` que identifica o dono
// (dup/lari) — o hover-text correspondente é puxado de ABOUT_TEXTS.
const ABOUT_PHOTOS = [
  { src: '/images/about-us/dup-front.webp',  key: 'dup'  },
  { src: '/images/about-us/dup-mid.webp',    key: 'dup'  },
  { src: '/images/about-us/dup-size.webp',   key: 'dup'  },
  { src: '/images/about-us/dup-floor.webp',  key: 'dup'  },
  { src: '/images/about-us/lari-front.webp', key: 'lari' },
  { src: '/images/about-us/lari-mid.webp',   key: 'lari' },
  { src: '/images/about-us/lari-side.webp',  key: 'lari' },
  { src: '/images/about-us/lari-floor.webp', key: 'lari' },
]

const ABOUT_TEXTS: Record<string, string> = {
  dup: 'Regras e disciplina — horário de treino, de dormir, de acordar — são o que libera a cabeça pra criar. Designer de formação, entrou na tecnologia pra expandir o leque e encontrou no e-commerce um mercado de aprendizado infinito. Conhece o ecossistema de ponta a ponta. É ele quem garante que o combinado é cumprido, sempre. **Dup**',
  lari: 'Entrou no e-commerce aos 17 anos e nunca mais saiu. Nas horas vagas é leitora voraz — livros, booktube, tudo que alimenta a curiosidade. Esse prazer de aprender transborda pro trabalho: estuda tecnologia como hobby. Dev sênior e responsável por toda a estrutura técnica da dup. Se tá funcionando, tem a mão dela. **Lari**',
}

// GridLines local — versão estática (sem context) pra usar antes do
// BackgroundLayer hidratar. Só desenha linhas com cor escura (Hero usa
// fundo branco). 1 div com gradient — leve no DOM.
function GridLines() {
  const gradient =
    'linear-gradient(to right, transparent calc(100% - 1px), rgba(0,0,0,0.05) calc(100% - 1px), rgba(0,0,0,0.05) 100%)'
  return (
    <div
      className="grid-lines absolute inset-0 pointer-events-none"
      aria-hidden
      style={{ backgroundImage: gradient }}
    />
  )
}

const CLIENT_LOGOS = [
  { name: 'DUX Human Health', src: '/images/clients/dux.png' },
  { name: 'LEGO',             src: '/images/clients/lego.png' },
  { name: 'ONE|UP',           src: '/images/clients/oneup.png' },
  { name: 'Vitafor',       src: '/images/clients/vitafor.png' },
  { name: 'SharkNinja',       src: '/images/clients/sharkninja.png' },
]

// Use **texto** para palavras com gradiente colorido
const MANIFESTO_LINES = [
  '**parceiro técnico** para\ne-commerces que levam a **sério.**',
  'suporte contínuo, sênior executando,\n**qualidade** que não depende de escala.',
  '**sem turnover**. **sem surpresa.**',
]

function renderLine(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="text-grad-01">{part}</span>
      : part
  )
}

function ManifestoMobile() {
  const lineRefs   = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = lineRefs.current.indexOf(entry.target as HTMLDivElement)
            if (i !== -1) setActive(i)
          }
        })
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    )
    lineRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="relative px-6 py-8 flex flex-col gap-7.5">
      <GridLines />
      <div
        className="relative flex flex-col justify-center gap-7.5"
        style={{ height: '20vh', marginTop: '10vh', marginBottom: '5vh' }}
      >
        {MANIFESTO_LINES.map((line, i) => (
          <div
            key={i}
            ref={(el) => { lineRefs.current[i] = el }}
          >
            <p
              className="font-chillax font-bold text-black uppercase"
              style={{
                fontSize: 'clamp(14px, 4vw, 22px)',
                lineHeight: 'var(--leading-heading)',
                opacity: active === i ? 1 : 0.08,
                transition: 'opacity 0.45s ease',
              }}
            >
              {line.split('\n').map((l, j, arr) => (
                <span key={j}>
                  {renderLine(l)}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-4" style={{ aspectRatio: '1/1' }}>
        <GlitchGrid photos={ABOUT_PHOTOS} texts={ABOUT_TEXTS} />
      </div>
    </div>
  )
}

function ManifestoDesktop() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const textBoxRef    = useRef<HTMLDivElement>(null)
  const wrapperRef    = useRef<HTMLDivElement>(null)
  const lineRefs      = useRef<(HTMLParagraphElement | null)[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const scrollProxy = useRef({ y: 0 })

  function togglePlay() {
    if (isPlaying) {
      gsap.killTweensOf(scrollProxy.current)
      setIsPlaying(false)
      return
    }
    if (!containerRef.current) return
    const end       = containerRef.current.offsetTop + containerRef.current.offsetHeight - window.innerHeight
    const remaining = Math.max(0, end - window.scrollY)
    if (remaining <= 0) return
    scrollProxy.current.y = window.scrollY
    setIsPlaying(true)
    gsap.to(scrollProxy.current, {
      y:          end,
      duration:   remaining / 1000,
      ease:       'none',
      onUpdate()  { window.scrollTo(0, scrollProxy.current.y) },
      onComplete: () => setIsPlaying(false),
    })
  }

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(lineRefs.current, { opacity: 0.08 })
      gsap.set(lineRefs.current[0], { opacity: 1 })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress   = self.progress
          const floatIndex = progress * (MANIFESTO_LINES.length - 1)
          const wrapper    = wrapperRef.current
          const textBox    = textBoxRef.current
          const firstEl    = lineRefs.current[0]
          const lastEl     = lineRefs.current[MANIFESTO_LINES.length - 1]

          // Y linear: progress=0 → primeira linha no topo, progress=1 → última linha no fundo
          if (wrapper && textBox && firstEl && lastEl) {
            const boxH      = textBox.clientHeight
            const maxTravel = lastEl.offsetTop + lastEl.offsetHeight - boxH
            gsap.to(wrapper, { y: -progress * Math.max(0, maxTravel), duration: 0.4, overwrite: 'auto', ease: 'power2.out' })
          }

          // Opacidade contínua baseada em distância float — sem snap
          lineRefs.current.forEach((el, i) => {
            if (!el) return
            const dist    = Math.abs(i - floatIndex)
            const opacity = Math.max(0.06, Math.min(1, 1 - dist * 0.65))
            gsap.to(el, { opacity, duration: 0.35, overwrite: 'auto' })
          })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => () => { gsap.killTweensOf(scrollProxy.current) }, [])

  function handleSkip() {
    if (!containerRef.current) return
    const end = containerRef.current.offsetTop + containerRef.current.offsetHeight
    window.scrollTo({ top: end, behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${MANIFESTO_LINES.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center px-8 gap-4 md:gap-0">
        <GridLines />

        {/* Coluna esquerda: texto + botões */}
        <div className="relative w-full md:w-[55%] pr-0 md:pr-12 flex flex-col shrink-0">
          <div
            ref={textBoxRef}
            className="relative overflow-hidden flex items-center"
            style={{ height: 'clamp(200px, 60vh, 72vh)' }}
          >
            <div ref={wrapperRef} className="w-full">
              {MANIFESTO_LINES.map((line, i) => (
                <p
                  key={i}
                  ref={(el) => { lineRefs.current[i] = el }}
                  className="font-chillax font-bold text-black uppercase"
                  style={{
                    fontSize: 'clamp(16px, 2.2vw, 30px)',
                    lineHeight: 'var(--leading-heading)',
                    marginBottom: 'clamp(10px, 1.2vw, 16px)',
                  }}
                >
                  {line.split('\n').map((l, j, arr) => (
                    <span key={j}>
                      {renderLine(l)}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* Botões logo abaixo do texto */}
          {/* <div className="flex items-center gap-5" style={{ marginTop: '10px' }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar manifesto' : 'Reproduzir manifesto'}
              className={`transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
              <PhosphorIcon icon={PlayPauseIcon} size={20} weight="regular" />
            </button>
            <button
              onClick={handleSkip}
              className="font-synonym text-black opacity-40 hover:opacity-100 transition-opacity duration-200 text-sm tracking-widest"
              aria-label="Pular manifesto"
            >
              SKIP →
            </button>
          </div> */}
        </div>

        {/* Imagens — desktop: coluna direita; mobile: abaixo do texto */}
        <div
          className="relative w-full md:w-[45%]"
          style={{ height: 'clamp(300px, 72vh, 80vh)' }}
        >
          <GlitchGrid photos={ABOUT_PHOTOS} texts={ABOUT_TEXTS} />
        </div>
      </div>
    </div>
  )
}

function ManifestoScroll() {
  const [isMobile, setIsMobile] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setReady(true)
  }, [])

  if (!ready) return null
  return isMobile ? <ManifestoMobile /> : <ManifestoDesktop />
}

export default function Hero() {
  return (
    <section id="hero" className="relative z-10">
      <div className="relative min-h-screen flex flex-col items-center justify-start px-8 pt-72">
        <GridLines />

        <div className="relative flex flex-col items-center text-center">
          <h1
            className="font-chillax font-bold uppercase select-none text-black"
            style={{ fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 'var(--leading-display)' }}
          >
            <span className="text-grad-01">Clareza</span>
            {' e '}
            <span className="text-grad-01">segurança</span>
            <br />
            para quem precisa
            <br />
            de <span className="text-grad-01">paz operacional</span>
          </h1>

          <p
            className="mt-8 font-synonym text-body-lg text-neutral-600 max-w-lg text-center"
            style={{ lineHeight: 'var(--leading-body)' }}
          >
            Para quem quer evoluir o e-commerce vtex, shopify ou nuvemshop sem se sobrecarregar com ruídos
            na tecnologia. A operação fica com a gente, você cuida do negócio.
          </p>
        </div>

        <div className="absolute bottom-15 left-0 right-0 flex flex-col items-center px-8">
          <p className="text-center font-synonym text-label-ui text-neutral-600 tracking-caption mb-8">
            Alguns clientes que confiam em nosso trabalho
          </p>
          <div className="flex flex-nowrap items-center justify-center gap-x-4 md:gap-x-8">
            {CLIENT_LOGOS.map(({ name, src }) => (
              <div
                key={name}
                className="relative h-5 w-16 md:h-6 md:w-20 flex items-center justify-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                title={name}
              >
                <Image
                  src={src}
                  alt={name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement
                    img.style.display = 'none'
                    const parent = img.parentElement
                    if (parent) {
                      parent.style.fontFamily = 'var(--font-display)'
                      parent.style.fontSize = 'var(--text-caption)'
                      parent.style.color = 'var(--black)'
                      parent.textContent = name
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="manifesto">
        <ManifestoScroll />
      </div>
    </section>
  )
}
