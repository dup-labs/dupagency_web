'use client'

import {
  InstagramLogoIcon,
  SpotifyLogoIcon,
  YoutubeLogoIcon,
  WhatsappLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react'
import { PhosphorIcon } from '@/components/ui/PhosphorIcon'
import { type Icon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

const SOCIAL: { icon: Icon; href: string; label: string }[] = [
  { icon: InstagramLogoIcon, href: 'https://www.instagram.com/dup.agency', label: 'Instagram' },
  { icon: SpotifyLogoIcon,   href: 'https://open.spotify.com/playlist/6QH8ouatvWzVQUp52uCZQL?si=fA6XtpCfQ_CMLkLt2QedQg&pi=dNgsB0zUQYizS', label: 'Spotify' },
  // { icon: YoutubeLogoIcon,   href: '#', label: 'YouTube' },
  { icon: WhatsappLogoIcon,  href: 'https://wa.me/5511973558096', label: 'WhatsApp' },
  { icon: LinkedinLogoIcon,  href: 'https://www.linkedin.com/company/dupagency/', label: 'LinkedIn' },
]

export default function Footer() {
  const t = useTranslations('home.footer')
  return (
    <footer
      className="relative z-10 flex flex-col items-center justify-center gap-5 py-6 bg-black"
      style={{ borderTop: '1px solid #1a1a1a', minHeight: 80 }}
    >
      <div className="flex items-center gap-6">
        {SOCIAL.map(({ icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            id={`footer-social-${label.toLowerCase()}`}
            data-social={label}
            className="opacity-40 hover:opacity-100 transition-opacity duration-200"
          >
            <PhosphorIcon icon={icon} size={20} weight="regular" />
          </a>
        ))}
      </div>
      <p className="font-synonym text-label-ui text-neutral-400">
        {t('copyright')}
      </p>
    </footer>
  )
}
