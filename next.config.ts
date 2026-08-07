import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 828, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Decks de aula (/emcj) — material de turma, nunca indexa. Cinto além
        // do suspensório junto com o <meta robots> nos HTMLs e o Disallow em
        // src/app/robots.ts. O header vale mesmo se alguém linkar direto um
        // arquivo interno do deck (deck.html, support.js...).
        source: '/emcj/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
  async rewrites() {
    return [
      // URL limpa pro deck: /emcj/papo-01 serve o index.html estático que vive
      // em public/emcj/papo-01/. O Next não faz directory-index sozinho em
      // public/, daí o rewrite explícito.
      //
      // ⚠️ Papo novo = uma linha nova aqui. Só adicionar a entrada em
      // src/content/papos.ts cria o card, mas o link cai em 404.
      { source: '/emcj/papo-01', destination: '/emcj/papo-01/index.html' },
      { source: '/emcj/papo-02', destination: '/emcj/papo-02/index.html' },
    ]
  },
}

export default withNextIntl(nextConfig)
