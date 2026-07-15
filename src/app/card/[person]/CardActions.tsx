'use client'

import { Globe, InstagramLogo, UserPlus, WhatsappLogo } from '@phosphor-icons/react'
import { PhosphorIcon } from '@/components/ui/PhosphorIcon'

// Client component só por causa dos ícones Phosphor (precisam de boundary
// client, como nas seções do site). Recebe as URLs prontas do server.

const pillBase =
  'inline-flex items-center justify-center gap-3 rounded-pill px-8 py-4 font-synonym text-label-ui tracking-micro uppercase transition-colors duration-300'
const pillOutline = `${pillBase} border border-black text-black hover:bg-black hover:text-white`

export default function CardActions({
  vcardHref,
  whatsappHref,
  siteHref,
  instagramHref,
  instagramLabel,
}: {
  vcardHref: string
  whatsappHref: string
  siteHref: string
  instagramHref?: string
  instagramLabel?: string
}) {
  return (
    <div className="mt-12 w-full flex flex-col gap-3">
      <a
        href={vcardHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${pillBase} bg-black text-white hover:bg-neutral-800`}
      >
        <PhosphorIcon icon={UserPlus} size={20} />
        Salvar contato
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={pillOutline}
      >
        <PhosphorIcon icon={WhatsappLogo} size={20} />
        Chamar no WhatsApp
      </a>
      <a
        href={siteHref}
        target="_blank"
        rel="noopener noreferrer"
        className={pillOutline}
      >
        <PhosphorIcon icon={Globe} size={20} />
        dup.agency
      </a>
      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className={pillOutline}
        >
          <PhosphorIcon icon={InstagramLogo} size={20} />
          {instagramLabel ?? 'Instagram'}
        </a>
      )}
    </div>
  )
}
