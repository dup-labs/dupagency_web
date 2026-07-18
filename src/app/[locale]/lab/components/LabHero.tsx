import { useTranslations } from 'next-intl'
import { ScribbleUnderline, ScribbleArrow } from './LabScribbles'

// Hero do lab — "toda ideia boa começa como um rabisco". Sem estado: o traço
// do sublinhado desenha no load via .lab-draw-now (CSS), o ponto pisca e a
// anotação flutua com keyframes puros. Server component de propósito.
export default function LabHero() {
  const t = useTranslations('lab.hero')

  return (
    <header
      id="lab-hero"
      className="lab-draw-now relative z-1 min-h-screen flex flex-col justify-between px-[clamp(20px,4vw,56px)] pt-33 pb-10"
    >
      {/* tagline técnica */}
      <div className="flex items-center gap-3.5 font-spline-mono text-[12px] tracking-[0.08em] text-neutral-600">
        <span
          className="lab-blink-dot inline-block w-2 h-2 rounded-full bg-black"
          style={{ animation: 'lab-blink 1.6s steps(1) infinite' }}
        />
        {t('tagline')}
      </div>

      {/* título central */}
      <div className="relative w-full max-w-300 mx-auto text-center">
        {/* anotação à mão */}
        <div
          className="lab-floaty absolute -top-19.5 right-[3%] hidden md:block font-caveat text-[25px] text-neutral-600"
          style={{ ['--lab-r' as string]: '4deg', animation: 'lab-floaty 6s ease-in-out infinite' }}
        >
          {t('annotation')}
        </div>

        <h1
          className="relative inline-block font-chillax font-bold uppercase m-0"
          style={{
            fontSize: 'calc(clamp(46px, 9vw, 132px) * var(--font-scale))',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
          }}
        >
          {t('title1')}
          <br />
          {t('title2')}{' '}
          <span className="relative inline-block">
            {t('titleWord')}
            <ScribbleUnderline
              className="absolute left-[-3%] bottom-[-0.18em] w-[106%] h-[0.42em] overflow-visible text-black"
            />
          </span>
        </h1>

        {/* seta rabiscada apontando pro lead */}
        <ScribbleArrow className="absolute right-[-2%] -bottom-[70px] hidden md:block w-24 h-18 overflow-visible text-neutral-400" />
      </div>

      {/* lead + scroll cue */}
      <div className="flex items-end justify-between gap-6 flex-wrap w-full max-w-300 mx-auto">
        <p className="font-synonym text-left text-[clamp(15px,1.4vw,18px)] leading-relaxed text-neutral-800 max-w-[46ch] m-0">
          {t.rich('lead', { b: (chunks) => <b>{chunks}</b> })}
        </p>
        <div className="font-spline-mono text-right text-[11px] tracking-[0.06em] text-neutral-400 whitespace-nowrap">
          {t('scroll')}
          <br />
          <span className="text-neutral-200">{t('rev')}</span>
        </div>
      </div>
    </header>
  )
}
