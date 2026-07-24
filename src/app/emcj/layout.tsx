import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { chillax, synonym } from '../fonts'

// ─────────────────────────────────────────────────────────────────────────────
// Root layout dos papos EMCJ (/emcj e /emcj/<slug>).
// ─────────────────────────────────────────────────────────────────────────────
// Vive FORA do [locale], igual ao /card: material de turma, PT-BR fixo, sem
// Nav, intro, cursor custom ou scrollspy. O /emcj também está excluído do
// matcher do proxy (ver src/proxy.ts) — sem isso a URL limpa /emcj/papo-01
// seria redirecionada pro locale e viraria 404.
//
// Os decks em si NÃO passam por aqui: são HTML estático em public/emcj/<slug>/,
// servidos direto. Este layout vale só pro índice em /emcj.
// A lista de encontros fica em src/content/papos.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { default: 'Papos EMCJ | dup.agency', template: '%s | dup.agency' },
  // Material de turma — nunca indexa, nem em produção. Reforçado pelo
  // Disallow: /emcj/ em src/app/robots.ts e pelo X-Robots-Tag do next.config.ts
  // (que cobre também os arquivos estáticos dos decks).
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function EmcjLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${chillax.variable} ${synonym.variable}`}>
      <body className="min-h-screen bg-white text-black">
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
