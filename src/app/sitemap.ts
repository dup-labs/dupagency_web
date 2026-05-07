import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dup.agency'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/#parceiros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/#servicos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/#como-trabalhamos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const ferramentasDir = path.join(process.cwd(), 'src/app/ferramentas')
  const ferramentas = fs.readdirSync(ferramentasDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => ({
      url: `${baseUrl}/ferramentas/${d.name}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  return [...staticPages, ...ferramentas]
}
