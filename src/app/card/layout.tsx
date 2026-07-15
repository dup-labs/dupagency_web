import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { chillax, synonym } from '../fonts'
import { GTMScript, GTMNoScript } from '@/components/analytics/gtm'

// ─────────────────────────────────────────────────────────────────────────────
// Root layout do cartão de visita digital (/card/<pessoa> e /card/<pessoa>/qr).
// Vive FORA do [locale] de propósito: cartão é PT-BR fixo, mostrado em evento —
// nada de Nav, intro, cursor custom ou scrollspy. Só fontes, tokens e respiro.
// O /card também está excluído do matcher do proxy (ver src/proxy.ts).
// Os dados das pessoas ficam em src/content/cards.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { default: 'dup.agency', template: '%s | dup.agency' },
  // Cartão pessoal de networking — nunca indexa, nem em produção
  // (reforçado pelo Disallow: /card/ em src/app/robots.ts).
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
}

// Mesma linguagem do GridLines do site (linhas verticais sutis com fade),
// mas estático: aqui não existe BackgroundLayer/context — o fundo é sempre claro.
function CardGridLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
      }}
      aria-hidden
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`d-${i}`}
          className="hidden md:block absolute top-0 bottom-0 w-px"
          style={{ left: `${((i + 1) / 13) * 100}%`, background: 'rgba(0,0,0,0.05)' }}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`m-${i}`}
          className="block md:hidden absolute top-0 bottom-0 w-px"
          style={{ left: `${((i + 1) / 7) * 100}%`, background: 'rgba(0,0,0,0.05)' }}
        />
      ))}
    </div>
  )
}

export default function CardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${chillax.variable} ${synonym.variable}`}>
      <head>
        <GTMScript />
      </head>
      <body className="min-h-screen bg-white text-black">
        <GTMNoScript />
        <CardGridLines />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
