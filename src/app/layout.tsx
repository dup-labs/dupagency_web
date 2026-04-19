import type { Metadata, Viewport } from 'next'
import './globals.css'
import BackgroundLayer from '@/components/layout/BackgroundLayer'
import Nav from '@/components/layout/Nav'
import CustomCursor from '@/components/ui/CustomCursor'

export const metadata: Metadata = {
  title: 'dup.agency',
  description: 'Clareza e segurança para quem precisa de paz operacional.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <BackgroundLayer>
          <CustomCursor />
          <Nav />
          <main className="relative z-10">{children}</main>
        </BackgroundLayer>
      </body>
    </html>
  )
}
