'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

const LOGOS = [
  { name: 'DUX Human Health', src: '/images/clients/dux.png' },
  { name: 'LEGO',             src: '/images/clients/lego.png' },
  { name: 'ONE|UP',           src: '/images/clients/oneup.png' },
  { name: 'Vitafor',          src: '/images/clients/vitafor.png' },
  { name: 'SharkNinja',       src: '/images/clients/sharkninja.png' },
]

export default function LogoStrip() {
  const t = useTranslations('ferramentas.geoAudit')
  return (
    <section className="relative z-10" style={{ paddingBottom: '48px' }}>
      <p className="relative text-center font-synonym text-label-ui text-neutral-600 tracking-caption mb-8">
        {t('hero.clientsLabel')}
      </p>
      <div className="relative flex flex-nowrap items-center justify-center gap-x-4 md:gap-x-8">
        {LOGOS.map(({ name, src }) => (
          <div
            key={name}
            className="relative h-5 w-16 md:h-6 md:w-20 flex items-center justify-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            title={name}
          >
            <Image src={src} alt={name} fill className="object-contain" />
          </div>
        ))}
      </div>
    </section>
  )
}
