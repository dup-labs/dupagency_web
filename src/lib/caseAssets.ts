import fs from 'fs'
import path from 'path'
import type { CaseStudy } from '@/content/cases/types'

// ─────────────────────────────────────────────────────────────────────────────
// CASE ASSETS — convenção sobre configuração
// ─────────────────────────────────────────────────────────────────────────────
// O dono solta os arquivos em public/images/cases/<slug>/ e a página se ajusta
// sozinha no build. Sem arquivo nenhum a página continua de pé: o hero mostra um
// poster com o logo do cliente, os cards da timeline ficam sem moldura e a
// galeria some inteira.
//
//   hero.mp4 | hero.webm | hero.png | hero.jpg | hero.webp   → mídia do hero
//   gallery-1.png … gallery-N.png                            → galeria (ordem)
//   timeline-1.png … timeline-N.png                          → print do marco N
//
// Um `image` explícito no content file sempre vence a convenção.
//
// ⚠️ Usa `fs` → importar SÓ de server components (page.tsx, sitemap.ts). Tudo é
// SSG, então isso roda em build time e nunca no browser.
// ─────────────────────────────────────────────────────────────────────────────

const VIDEO_EXT = ['mp4', 'webm']
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'webp', 'avif']

export interface CaseAssets {
  heroMedia?: { type: 'video' | 'image'; src: string }
  /** hero.png quando o hero já é vídeo — vira poster (1º frame) em vez de sobrar. */
  heroPoster?: string
  /** Índice alinhado a `gallery` do content file — undefined onde não há print. */
  gallery: (string | undefined)[]
  /** Índice alinhado a `milestones` — undefined onde não há print. */
  timeline: (string | undefined)[]
}

function publicDir(slug: string): string {
  return path.join(process.cwd(), 'public', 'images', 'cases', slug)
}

// Procura <base>.<ext> pra cada extensão candidata; devolve a URL pública da
// primeira que existir.
function findFile(dir: string, slug: string, base: string, exts: string[]): string | undefined {
  for (const ext of exts) {
    const file = `${base}.${ext}`
    if (fs.existsSync(path.join(dir, file))) {
      return `/images/cases/${slug}/${file}`
    }
  }
  return undefined
}

export function resolveCaseAssets(cs: CaseStudy): CaseAssets {
  const dir = publicDir(cs.slug)
  const hasDir = fs.existsSync(dir)

  // Hero: override do content file > vídeo na pasta > imagem na pasta > nada.
  let heroMedia = cs.hero.media
  let heroPoster: string | undefined
  if (hasDir) {
    const video = findFile(dir, cs.slug, 'hero', VIDEO_EXT)
    const image = findFile(dir, cs.slug, 'hero', IMAGE_EXT)
    if (!heroMedia) {
      if (video) heroMedia = { type: 'video', src: video }
      else if (image) heroMedia = { type: 'image', src: image }
    }
    // Tendo os dois, a imagem não compete com o vídeo — ela vira o poster.
    if (heroMedia?.type === 'video' && image) heroPoster = image
  }

  // Alinhado por índice às legendas do content file — o page.tsx pareia e
  // descarta os slots sem print (é o que faz a galeria sumir quando vazia).
  const gallery = cs.gallery.map(
    (shot, i) => shot.image ?? (hasDir ? findFile(dir, cs.slug, `gallery-${i + 1}`, IMAGE_EXT) : undefined),
  )

  const timeline = cs.milestones.map(
    (m, i) => m.image ?? (hasDir ? findFile(dir, cs.slug, `timeline-${i + 1}`, IMAGE_EXT) : undefined),
  )

  return { heroMedia, heroPoster, gallery, timeline }
}
