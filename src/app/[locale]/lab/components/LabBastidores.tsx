import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { ScribbleBrowser, ScribbleHub } from './LabScribbles'

const CARDS = [
  { key: 'card1', Icon: ScribbleBrowser },
  { key: 'card2', Icon: ScribbleHub },
] as const

// 04 — no forno. Cards de experimento em borda dashed (rascunho literal);
// hover cobre com o "segredo do lab" em Caveat.
export default function LabBastidores() {
  const t = useTranslations('lab.bastidores')

  return (
    <section
      id="lab-bastidores"
      className="relative z-1 px-[clamp(20px,4vw,56px)] py-[clamp(80px,12vh,130px)]"
    >
      <div className="max-w-300 mx-auto">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
              <div className="flex items-center gap-3.5 mb-5 font-spline-mono text-[12px] tracking-[0.1em] uppercase text-neutral-400">
                <span className="w-8.5 h-px bg-neutral-400" />
                {t('label')}
              </div>
              <h2
                className="font-chillax font-bold uppercase m-0"
                style={{
                  fontSize: 'calc(clamp(30px, 5vw, 64px) * var(--font-scale))',
                  lineHeight: 0.98,
                  letterSpacing: '-0.01em',
                }}
              >
                {t('title')}
              </h2>
            </div>
            <p className="font-caveat text-[22px] text-neutral-600 max-w-[26ch] rotate-[1.5deg] m-0">
              {t('hint')}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4.5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {CARDS.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 90} className="h-full">
              <div className="lab-wip-card relative h-full overflow-hidden rounded border-[1.5px] border-dashed border-neutral-200 p-5.5 min-h-55 flex flex-col justify-between">
                <div className="lab-draft-grid absolute inset-0 opacity-60" aria-hidden />
                <div className="relative flex justify-between font-spline-mono text-[11px] text-neutral-400">
                  <span>{t(`${key}.id`)}</span>
                  <span>{t(`${key}.rev`)}</span>
                </div>
                <div className="relative flex-1 flex items-center justify-center">
                  <Icon className="w-25 h-19 text-neutral-400" />
                </div>
                <div className="relative">
                  <h4 className="font-chillax font-semibold uppercase text-[16px] text-neutral-800 m-0 mb-1">
                    {t(`${key}.name`)}
                  </h4>
                  <p className="font-spline-mono text-[11px] text-neutral-400 m-0">
                    {t(`${key}.status`)}
                  </p>
                </div>
                <span className="lab-wip-hover absolute inset-0 flex items-center justify-center bg-black/90 text-paper font-caveat text-[24px] text-center p-5">
                  {t(`${key}.secret`)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
