import type { MetadataRoute } from 'next'

// Só a produção (dup.agency) é indexável. Qualquer deploy de preview/branch da
// Vercel bloqueia robôs por completo — assim uma URL de preview compartilhada
// pra revisão nunca vaza pro índice do Google, mesmo que alguém a linke.
// (A Vercel já manda X-Robots-Tag: noindex em preview; isto é o cinto além do
// suspensório, e vale também pra qualquer outro host que não seja produção.)
const isProduction = process.env.VERCEL_ENV === 'production'

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    // /card = cartão de visita digital (networking pessoal) — nunca indexa.
    // As páginas também mandam meta noindex (ver src/app/card/layout.tsx).
    // /emcj = decks das aulas (material de turma) — nunca indexa. Os HTMLs
    // mandam <meta robots> e o next.config manda X-Robots-Tag no path todo.
    rules: { userAgent: '*', allow: '/', disallow: ['/card/', '/emcj/'] },
    sitemap: 'https://dup.agency/sitemap.xml',
  }
}
