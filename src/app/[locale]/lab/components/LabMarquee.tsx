import { useTranslations } from 'next-intl'

const WORD_KEYS = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'] as const

// Faixa de marquee — Chillax outline (stroke) sobre ink, loop linear infinito.
// É uma banda fina, não uma seção: tem fundo próprio e fica fora do mapa do
// BackgroundLayer de propósito.
export default function LabMarquee() {
  const t = useTranslations('lab.marquee')

  const strip = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex font-chillax font-bold uppercase whitespace-nowrap text-[26px]"
      style={{ WebkitTextStroke: '1px #494949', color: 'transparent' }}
    >
      {WORD_KEYS.map((key) => (
        <span key={key} className="flex">
          <span className="px-6.5">{t(key)}</span>
          <span className="px-6.5" style={{ color: '#494949', WebkitTextStroke: '0' }}>
            ✳
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative z-1 overflow-hidden bg-black border-y border-black py-3.5">
      <div
        className="lab-marq-track flex w-max"
        style={{ animation: 'lab-marq 26s linear infinite' }}
      >
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  )
}
