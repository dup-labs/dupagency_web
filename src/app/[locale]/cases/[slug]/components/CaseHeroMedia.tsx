'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

// ─────────────────────────────────────────────────────────────────────────────
// CaseHeroMedia — janela de browser do hero
// ─────────────────────────────────────────────────────────────────────────────
// Prioridade: vídeo real > print real > poster (logo do cliente sobre o fundo
// da marca). O vídeo é o estado normal desta seção — o poster é só o intervalo
// entre publicar o case e ter o arquivo, e por isso é sóbrio em vez de chamativo.
// Basta soltar hero.mp4 em public/images/cases/<slug>/ (ver lib/caseAssets).
//
// O badge "no ar" é label fixo do template — vem de cases.ui, nunca do content file.
// ─────────────────────────────────────────────────────────────────────────────

interface CaseHeroMediaProps {
  domain: string
  media?: { type: 'video' | 'image'; src: string }
  /** Logo do cliente — usado no poster enquanto não há vídeo/print. */
  logo?: string
  /** Print estático mostrado no 1º frame do vídeo (evita retângulo preto). */
  poster?: string
}

export default function CaseHeroMedia({ domain, media, logo, poster }: CaseHeroMediaProps) {
  const t = useTranslations('cases.ui')

  return (
    <div className="relative">
      <div
        className="relative rounded-2xl overflow-hidden bg-black"
        style={{ boxShadow: '0 30px 80px rgba(13,13,13,.28), 0 8px 24px rgba(137,123,188,.2)' }}
      >
        {/* cromo do browser */}
        <div className="flex items-center gap-2 px-4 py-[13px] bg-[#161616] border-b border-white/[.06]">
          <span className="w-[11px] h-[11px] rounded-pill" style={{ background: '#ff5f57' }} />
          <span className="w-[11px] h-[11px] rounded-pill" style={{ background: '#febc2e' }} />
          <span className="w-[11px] h-[11px] rounded-pill" style={{ background: '#28c840' }} />
          <div className="flex-1 ml-3 h-6 rounded-pill bg-white/[.07] px-3.5 flex items-center gap-2">
            <span className="w-[9px] h-[9px] rounded-pill border-[1.5px] border-white/35" />
            <span className="font-synonym text-white/50" style={{ fontSize: '11px', letterSpacing: '0.02em' }}>
              {domain}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-black" style={{ height: 'clamp(360px,52vh,520px)' }}>
          {media?.type === 'video' ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={poster}
              className="w-full h-full object-cover"
              src={media.src}
            />
          ) : media?.type === 'image' ? (
            <Image
              src={media.src}
              alt={domain}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(155deg, var(--purple-mid-900), var(--purple-mid-800))' }}
            >
              {logo && (
                <Image
                  src={logo}
                  alt=""
                  width={140}
                  height={40}
                  className="opacity-25"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              )}
            </div>
          )}

          {/* badge "no ar" — a loja está no ar de verdade, com vídeo ou sem */}
          <div className="absolute top-3.5 left-3.5 z-[3] inline-flex items-center gap-[7px] px-3 py-1.5 rounded-pill bg-black/55 backdrop-blur-[8px]">
            <span
              className="case-live-dot w-[7px] h-[7px] rounded-pill"
              style={{ background: '#28c840', animation: 'case-live-pulse 1.8s infinite' }}
            />
            <span
              className="font-synonym uppercase text-white"
              style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            >
              {t('liveBadge')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
