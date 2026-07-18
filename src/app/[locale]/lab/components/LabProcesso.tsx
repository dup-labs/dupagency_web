import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { ScribbleWave, ScribbleWireframe, ScribbleCircleCheck, ScribbleCheck } from './LabScribbles'

const STEPS = [
  { key: 'step1', num: '01', Icon: ScribbleWave },
  { key: 'step2', num: '02', Icon: ScribbleWireframe },
  { key: 'step3', num: '03', Icon: ScribbleCircleCheck },
  { key: 'step4', num: '04', Icon: ScribbleCheck },
] as const

// 03 — do rabisco ao produto. Seção ink (fundo preto vem do BackgroundLayer
// via SECTION_CONFIGS); o grid claro é desenhado aqui dentro. Os cards têm
// fundo preto próprio pra "tapar" o grid e formar a malha de 1px entre eles.
export default function LabProcesso() {
  const t = useTranslations('lab.processo')

  return (
    <section
      id="lab-processo"
      className="relative z-1 overflow-hidden px-[clamp(20px,4vw,56px)] py-[clamp(80px,12vh,130px)] text-paper"
    >
      <div className="lab-draft-grid lab-draft-grid--dark absolute inset-0 opacity-50" aria-hidden />

      <div className="relative max-w-300 mx-auto">
        <Reveal>
          <div className="mb-14">
            <div className="flex items-center gap-3.5 mb-5 font-spline-mono text-[12px] tracking-[0.1em] uppercase text-neutral-600">
              <span className="w-8.5 h-px bg-neutral-600" />
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
              {t('title1')}
              <br />
              {t('title2')}
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-px bg-white/10 border border-white/10 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
          {STEPS.map(({ key, num, Icon }, i) => (
            <Reveal key={key} delay={i * 90} className="h-full">
              <div className="h-full bg-black px-6.5 py-8 min-h-65 flex flex-col justify-between">
                <div className="font-chillax font-bold text-[46px] leading-none text-neutral-800">
                  {num}
                </div>
                <Icon className="w-17.5 h-13 self-end text-neutral-600" />
                <div>
                  <h3 className="font-chillax font-bold uppercase text-[20px] m-0 mb-2">
                    {t(`${key}.title`)}{' '}
                    {key === 'step4' && (
                      <span className="text-neutral-600 text-[13px]">{t('step4.titleNote')}</span>
                    )}
                  </h3>
                  <p className="font-synonym text-[13.5px] leading-[1.55] text-white/60 m-0">
                    {t(`${key}.text`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
