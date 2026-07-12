import type { Locale } from '@/i18n/routing'
import type { CaseStudy, LocalizedString } from './types'
import { duxHumanHealth } from './dux-human-health'

// ─────────────────────────────────────────────────────────────────────────────
// CASES — registry
// ─────────────────────────────────────────────────────────────────────────────
// Case novo = criar src/content/cases/<slug>.ts e adicionar aqui. É só isso:
// rota, sitemap e JSON-LD saem daqui. Quando um dia entrar CMS, só este arquivo
// troca de fonte — o shape CaseStudy continua o mesmo.
// ─────────────────────────────────────────────────────────────────────────────

export const CASES: readonly CaseStudy[] = [duxHumanHealth]

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find((c) => c.slug === slug)
}

// TODOS os slugs — inclusive rascunhos. É o que a rota usa pra gerar as páginas
// estáticas: um case em rascunho precisa abrir por URL pra ser revisado.
export function getAllCaseSlugs(): string[] {
  return CASES.map((c) => c.slug)
}

// Só os publicados. É o que entra no sitemap — rascunho não se anuncia ao Google.
export function getPublishedCaseSlugs(): string[] {
  return CASES.filter((c) => !c.draft).map((c) => c.slug)
}

// Resolve um texto localizável no idioma ativo, caindo no pt quando o idioma
// ainda não foi traduzido. Roda no SERVER (page.tsx) — o client só vê string.
export function pick(text: LocalizedString, locale: Locale): string {
  return text[locale] ?? text.pt
}

export type { CaseStudy, LocalizedString } from './types'
