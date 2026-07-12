'use client'

import { useRef } from 'react'
import Reveal from '@/components/ui/Reveal'
import GridLinesInteractive from '@/components/ui/GridLinesInteractive'
import { renderAccents } from '@/lib/caseRich'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import CaseHeroMedia from './CaseHeroMedia'

// ─────────────────────────────────────────────────────────────────────────────
// CaseHero — abertura da página de case
// ─────────────────────────────────────────────────────────────────────────────
// Única seção sem eyebrow numerado ("01 —" só começa em CaseResumo): aqui o
// texto pequeno acima do título é livre, tipo "parceria desde 2020 · 6 anos".
// À direita, CaseHeroMedia cuida do vídeo (ou do poster, enquanto ele não vem)
// — este componente só cuida do layout e dos blobs.
// ─────────────────────────────────────────────────────────────────────────────

interface CaseHeroStat {
  value: string
  label: string
  gradient?: boolean
}

interface CaseHeroProps {
  eyebrow: string
  titleGradient: string
  title: string
  description: string
  stats: CaseHeroStat[]
  domain: string
  media?: { type: 'video' | 'image'; src: string }
  logo?: string
  poster?: string
}

export default function CaseHero({
  eyebrow,
  titleGradient,
  title,
  description,
  stats,
  domain,
  media,
  logo,
  poster,
}: CaseHeroProps) {
  // Blobs decorativos do visual à direita — forças diferentes = desencontro
  // (mesmo hook usado no Hero da home).
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)
  useMouseParallax([
    { ref: blob1Ref, strength: 18 },
    { ref: blob2Ref, strength: 30 },
  ])

  return (
    <section
      id="case-hero"
      className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1.02fr_1.1fr] items-center overflow-hidden px-6 md:px-8 pt-[104px] lg:pt-[120px] pb-[60px] gap-11 lg:gap-[clamp(24px,4vw,64px)]"
    >
      {/* Mesmo grid do hero da home: as linhas encurvam perto do cursor. A máscara
          é daqui: as linhas chegam inteiras no topo e se dissolvem antes da faixa
          de stats — que tem linhas próprias e, sem isso, brigava com o grid. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 78%)',
        }}
      >
        <GridLinesInteractive />
      </div>

      {/* Coluna de texto */}
      <div className="relative max-w-[600px]">
        <Reveal>
          <div className="inline-flex items-center gap-3 mb-[26px]">
            <span className="w-[30px] h-px bg-black opacity-35" />
            <span
              className="font-synonym uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'var(--neutral-600)' }}
            >
              {eyebrow}
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="font-chillax font-bold uppercase"
            style={{ fontSize: 'clamp(44px,6.4vw,92px)', lineHeight: 1.02, letterSpacing: '-0.01em' }}
          >
            <span className="text-grad-01">{titleGradient}</span>
            <br />
            {title}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p
            className="font-synonym mt-[26px] max-w-[44ch]"
            style={{ fontSize: 'clamp(15px,1.2vw,18px)', lineHeight: 1.6, color: 'var(--neutral-600)' }}
          >
            {description}
          </p>
        </Reveal>

        <Reveal delay={240}>
          {/* Sem divisórias verticais: elas cruzavam as linhas do grid do fundo em
              posições diferentes e o conjunto lia como falha de alinhamento. O
              respiro entre as colunas basta pra separar — a única régua é a linha
              horizontal de cima, que não compete com nada. */}
          <div className="flex flex-wrap gap-x-14 gap-y-7 mt-10 pt-6 border-t border-black/[.08] max-[560px]:flex-col max-[560px]:gap-y-5">
            {stats.map((stat, i) => (
              <div key={i}>
                <div
                  className={`font-chillax font-semibold text-[30px] leading-none ${
                    stat.gradient ? 'text-grad-01' : 'text-black'
                  }`}
                >
                  {renderAccents(stat.value)}
                </div>
                <div
                  className="font-synonym uppercase tracking-micro mt-1.5"
                  style={{ fontSize: '11px', color: 'var(--neutral-400)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Coluna de mídia — vídeo do case via CaseHeroMedia + blobs atmosféricos */}
      <div className="relative w-full max-w-[560px] mx-auto lg:max-w-none lg:mx-0">
        <div
          ref={blob1Ref}
          aria-hidden
          className="case-float absolute -top-[6%] -right-[4%] w-[150px] h-[150px] rounded-pill pointer-events-none opacity-50 blur-[2px]"
          style={{ background: 'var(--grad-site-01)', animation: 'case-float 7s ease-in-out infinite' }}
        />
        <div
          ref={blob2Ref}
          aria-hidden
          className="case-float absolute -bottom-[8%] -left-[6%] w-24 h-24 rounded-pill pointer-events-none opacity-60"
          style={{ border: '1.5px solid var(--purple-vivid)', animation: 'case-float 9s ease-in-out infinite reverse' }}
        />

        <CaseHeroMedia domain={domain} media={media} logo={logo} poster={poster} />
      </div>
    </section>
  )
}
