import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import RotatingWord from './RotatingWord'
import { ScribbleUnderlineShort } from './LabScribbles'

const CALENDLY_URL =
  'https://calendly.com/dupagency/novos-projetos-agenda-de-30-minutos?back=1'

const WORD_KEYS = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'] as const

// CTA final — seção ink com a palavra rotativa sublinhada. Mesmo Calendly do
// site principal.
export default function LabCTA() {
  const t = useTranslations('lab.cta')
  const words = WORD_KEYS.map((key) => t(`words.${key}`))

  return (
    <section
      id="lab-cta"
      className="relative z-1 overflow-hidden min-h-[92vh] flex flex-col items-center justify-center text-center px-[clamp(20px,4vw,56px)] py-[clamp(80px,14vh,140px)] text-paper"
    >
      <div className="lab-draft-grid lab-draft-grid--dark absolute inset-0 opacity-50" aria-hidden />

      <Reveal className="relative max-w-250">
        <div className="font-caveat text-[28px] text-neutral-600 mb-4.5 -rotate-2">
          {t('hand')}
        </div>
        <h2
          className="font-chillax font-bold uppercase m-0"
          style={{
            fontSize: 'calc(clamp(34px, 6.2vw, 84px) * var(--font-scale))',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {t('title1')}
          <br />
          {t('title2')}
          <br />
          {t('title3')}{' '}
          <span className="relative inline-block overflow-hidden align-bottom">
            <RotatingWord words={words} />
            <ScribbleUnderlineShort className="absolute left-0 bottom-[-0.06em] w-full h-[0.3em] overflow-visible text-paper" />
          </span>
        </h2>
        <p className="font-synonym text-[clamp(14px,1.4vw,17px)] leading-relaxed text-white/55 max-w-[48ch] mx-auto mt-7 mb-0">
          {t('text')}
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          id="lab-cta-button"
          className="lab-cta-btn inline-flex items-center gap-3 border border-paper rounded-pill px-8 py-3.75 mt-9.5 font-spline-mono text-[12px] tracking-[0.1em] uppercase text-paper no-underline"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            className="w-3.5 h-3.5"
            aria-hidden
          >
            <path d="M2 8 h12 M9 3 l5 5 -5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('button')}
        </a>
      </Reveal>
    </section>
  )
}
