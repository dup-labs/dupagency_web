import type { Locale } from '@/i18n/routing'

// ─────────────────────────────────────────────────────────────────────────────
// CASES — contratos do modelo de conteúdo
// ─────────────────────────────────────────────────────────────────────────────
// Um case = um arquivo TS em src/content/cases/<slug>.ts exportando um CaseStudy.
// É a fonte única de verdade: alimenta o render da página, o JSON-LD e o sitemap.
// Alimentar um case novo = criar o arquivo + registrar no index.ts. Sem CMS.
// ─────────────────────────────────────────────────────────────────────────────

// Texto localizável: pt obrigatório, en/es opcionais. Resolvido no SERVER via
// pick() — o client recebe string pronta e nunca embarca os 3 idiomas no bundle.
// Escrever só o pt já deixa /en e /es funcionando (caem no pt).
//
// Marcação aceita nos campos que passam por renderAccents() (ver lib/caseRich):
//   **trecho** → gradiente da marca (grad-01)
//   *trecho*   → var(--purple-vivid), pra acento pontual (ex: o "+" dos stats)
//   \n         → quebra de linha controlada
export type LocalizedString = { pt: string } & Partial<Record<Exclude<Locale, 'pt'>, string>>

export interface CaseStat {
  /** Valor de exibição — "VTEX", "2020", "Projeto*+*Evolução". */
  value: LocalizedString
  /** Rótulo pequeno — "Plataforma", "Início", "Escopo". */
  label: LocalizedString
  /** true → valor com gradiente da marca. */
  gradient?: boolean
}

export interface CaseMilestone {
  /** Rótulo de período, livre: "2020", "2025 · 26". */
  year: string
  /** Chip de escopo: "Projeto", "Evolução", "Consultoria + Evolução"... */
  tag: LocalizedString
  title: LocalizedString
  description: LocalizedString
  /** Frase que segue o prefixo "Resultado." no rodapé do card. */
  result: LocalizedString
  /** Override do print. Sem isso vale a convenção timeline-<n>.* na pasta de assets. */
  image?: string
}

export interface CaseGalleryShot {
  /** Legenda curta — vira o alt da imagem. */
  caption: LocalizedString
  /** Override do print. Sem isso vale a convenção gallery-<n>.* na pasta de assets. */
  image?: string
}

export interface CaseTestimonial {
  /** Citação sem aspas — o componente adiciona. Aceita **gradiente**. */
  quote: LocalizedString
  author: string
  /** Linha de apoio — "6 anos de parceria · e-commerce VTEX". */
  role: LocalizedString
}

export interface CaseNextStep {
  title: LocalizedString
  body: LocalizedString
}

export interface CaseStudy {
  slug: string
  /**
   * Rascunho: a página existe e abre por URL (dá pra mandar o link pra alguém
   * revisar), mas vai com noindex/nofollow e FICA DE FORA do sitemap — inclusive
   * em produção. Tirar esta linha = publicar o case pro Google.
   */
  draft?: boolean
  client: {
    name: string
    /** Domínio exibido na barra do browser do hero. */
    domain: string
    logo?: string
  }
  since: number
  /** ISO date — vira datePublished no JSON-LD. */
  publishedAt: string
  meta: {
    /** Sem sufixo: o template do layout já anexa "| dup.agency". */
    title: LocalizedString
    description: LocalizedString
  }
  hero: {
    eyebrow: LocalizedString
    /** Headline em 2 partes: a primeira sai com gradiente, a segunda sólida. */
    titleGradient: string
    title: string
    description: LocalizedString
    stats: CaseStat[]
    /** Override de mídia real. Sem isso vale a convenção hero.* na pasta de assets. */
    media?: { type: 'video' | 'image'; src: string }
  }
  resumo: {
    title: LocalizedString
    lead: LocalizedString
    body: LocalizedString
    chips: LocalizedString[]
  }
  inicio: {
    statement: LocalizedString
    body: LocalizedString
  }
  milestones: CaseMilestone[]
  /** [] é válido — a seção some se nenhum shot tiver asset resolvido. */
  gallery: CaseGalleryShot[]
  testimonial?: CaseTestimonial
  nextSteps: CaseNextStep[]
}
