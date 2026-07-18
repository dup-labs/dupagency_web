import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'

// 01 — o que é o lab. Título grande com a segunda metade "apagada" (pencil) e
// três colunas de texto curto. Reveal one-shot, sem GSAP.
export default function LabManifesto() {
  const t = useTranslations('lab.manifesto')

  return (
    <section
      id="lab-manifesto"
      className="relative z-1 px-[clamp(20px,4vw,56px)] py-[clamp(80px,12vh,140px)]"
    >
      <div className="max-w-275 mx-auto grid grid-cols-1 gap-10">
        <Reveal>
          <div className="flex items-center gap-3.5 font-spline-mono text-[12px] tracking-[0.1em] uppercase text-neutral-400">
            <span className="w-8.5 h-px bg-neutral-400" />
            {t('label')}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2
            className="font-chillax font-bold uppercase m-0 max-w-[22ch]"
            style={{
              fontSize: 'calc(clamp(28px, 4.3vw, 56px) * var(--font-scale))',
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
            }}
          >
            {/* <nb> segura "e-commerce" inteiro na mesma linha (sem quebra no hífen) */}
            {t.rich('title', {
              nb: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
            })}{' '}
            <span className="text-neutral-400">{t('titleMuted')}</span>
          </h2>
        </Reveal>

        <div className="grid gap-8 mt-2 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {(['p1', 'p2'] as const).map((key, i) => (
            <Reveal key={key} delay={140 + i * 80}>
              <p className="font-synonym text-[15px] leading-[1.65] text-neutral-800 m-0">
                {t.rich(key, { b: (chunks) => <b>{chunks}</b> })}
              </p>
            </Reveal>
          ))}
          <Reveal delay={300}>
            <p className="font-synonym text-[15px] leading-[1.65] text-neutral-800 m-0">
              {t('p3')} <span className="font-caveat text-[20px]">{t('p3Hand')}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
