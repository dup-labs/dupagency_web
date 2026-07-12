'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { richTags } from '@/i18n/rich'

interface CaseGaleriaShot {
  src: string
  caption: string
}

interface CaseGaleriaProps {
  num: string
  shots: CaseGaleriaShot[]
}

// ─────────────────────────────────────────────────────────────────────────────
// CaseGaleria — telas reais do site do cliente
// ─────────────────────────────────────────────────────────────────────────────
// O grid se adapta à quantidade de shots (page.tsx só renderiza a seção com
// shots.length > 0, mas dentro dela o layout muda pra 1, 2 ou 3+ prints):
//   1 shot  → moldura única 16:9
//   2 shots → duas colunas iguais
//   3+ shots → hero grande à esquerda (row-span-2) + os demais empilhados à
//              direita, replicando o print do protótipo (que só previa 3).
// ─────────────────────────────────────────────────────────────────────────────

export default function CaseGaleria({ num, shots }: CaseGaleriaProps) {
  const t = useTranslations('cases.ui')

  const [hero, ...rest] = shots
  const sizes = '(max-width: 760px) 100vw, (max-width: 1180px) 60vw, 700px'

  return (
    <section
      id="case-galeria"
      className="relative z-10 border-t border-black/[.06]"
      style={{ padding: 'clamp(80px,10vw,130px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 md:px-8">
        <Reveal>
          <div className="mb-10">
            <span
              className="font-synonym uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--purple-vivid)' }}
            >
              {num} — {t('eyebrowGallery')}
            </span>
            <h2
              className="font-chillax font-bold uppercase mt-4"
              style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.05 }}
            >
              {t.rich('galleryTitle', richTags)}
            </h2>
          </div>
        </Reveal>

        {shots.length === 1 && (
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden bg-lilac-100 aspect-[16/9]">
              <Image src={shots[0].src} alt={shots[0].caption} fill sizes={sizes} className="object-cover" />
            </div>
          </Reveal>
        )}

        {shots.length === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            {shots.map((shot, i) => (
              <Reveal key={shot.src} delay={i * 80}>
                <div className="relative rounded-2xl overflow-hidden bg-lilac-100 min-h-[320px] h-full">
                  <Image src={shot.src} alt={shot.caption} fill sizes={sizes} className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {shots.length >= 3 && (
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] md:auto-rows-fr">
            <Reveal>
              <div className="relative rounded-2xl overflow-hidden bg-lilac-100 min-h-[300px] md:min-h-[420px] md:row-span-2 h-full">
                <Image src={hero.src} alt={hero.caption} fill sizes={sizes} className="object-cover" />
              </div>
            </Reveal>
            {rest.map((shot, i) => (
              <Reveal key={shot.src} delay={(i + 1) * 80}>
                <div className="relative rounded-2xl overflow-hidden bg-lilac-100 min-h-[200px] h-full">
                  <Image src={shot.src} alt={shot.caption} fill sizes={sizes} className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
