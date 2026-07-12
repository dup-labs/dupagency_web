import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { getPathname } from '@/i18n/navigation'
import { routing, htmlLang } from '@/i18n/routing'
import { getPublishedCaseSlugs } from '@/content/cases'

const baseUrl = 'https://dup.agency'

// hreflang alternates de um href em todos os idiomas. getPathname respeita o
// localePrefix 'as-needed' (pt sem prefixo, en/es com).
function languageAlternates(href: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((l) => [htmlLang[l], `${baseUrl}${getPathname({ href, locale: l })}`]),
    ),
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const ferramentasDir = path.join(process.cwd(), 'src/app/[locale]/ferramentas')
  const ferramentas = fs
    .readdirSync(ferramentasDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name)

  const entries: MetadataRoute.Sitemap = []

  // Uma entrada por idioma × página, cada uma carregando os alternates de
  // todos os idiomas. Mantém os 3 locales indexáveis separadamente.
  for (const locale of routing.locales) {
    entries.push({
      url: `${baseUrl}${getPathname({ href: '/', locale })}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: languageAlternates('/'),
    })

    for (const tool of ferramentas) {
      const href = `/ferramentas/${tool}`
      entries.push({
        url: `${baseUrl}${getPathname({ href, locale })}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: languageAlternates(href),
      })
    }

    // Cases saem do registry (src/content/cases) — case novo entra no sitemap
    // sozinho, sem tocar aqui. Rascunhos (draft: true) ficam de fora.
    for (const slug of getPublishedCaseSlugs()) {
      const href = `/cases/${slug}`
      entries.push({
        url: `${baseUrl}${getPathname({ href, locale })}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: languageAlternates(href),
      })
    }
  }

  return entries
}
