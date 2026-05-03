import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://dup.agency', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://dup.agency/#parceiros', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://dup.agency/#servicos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://dup.agency/#como-trabalhamos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
