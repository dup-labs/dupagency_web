import type { Metadata } from 'next'

// `robots` das páginas públicas. Fora da produção (previews de branch da Vercel,
// builds locais) vira noindex/nofollow — uma URL de preview mandada pra alguém
// revisar não pode acabar no índice do Google. Em produção, indexa normal.
//
// Páginas que são noindex SEMPRE (ex: resultado de ferramenta com hash) não usam
// isto — elas declaram o próprio robots fixo. Ver também src/app/robots.ts.
const isProduction = process.env.VERCEL_ENV === 'production'

export const publicRobots: Metadata['robots'] = isProduction
  ? { index: true, follow: true }
  : { index: false, follow: false }
