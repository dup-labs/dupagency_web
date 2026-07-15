// ─────────────────────────────────────────────────────────────────────────────
// CARTÃO DE VISITA DIGITAL — dados das pessoas
// ─────────────────────────────────────────────────────────────────────────────
// ✏️  ESTE é o arquivo pra editar telefone, e-mail, descrição, foto etc.
//     Pessoa nova = adicionar uma entrada em CARDS (sem criar arquivo/pasta).
//
// Rotas que consomem isto:
//   /card/<slug>        → o cartão (quem escaneia cai aqui)
//   /card/<slug>/qr     → tela do QR (o dono mostra no próprio celular)
//   /card/<slug>/vcard  → download do contato (.vcf)
// ─────────────────────────────────────────────────────────────────────────────

// Domínio de produção — o QR codifica CARD_BASE_URL + /card/<slug>.
// Sempre produção, mesmo em preview: QR impresso/mostrado tem que apontar
// pro site real.
export const CARD_BASE_URL = 'https://dup.agency'

export type PersonCard = {
  slug: string
  nome: string
  /** Uma linha, abaixo do nome — quem é a pessoa. Vira TITLE no .vcf também. */
  descricao: string
  empresa: string
  /** Telefone que entra no .vcf — formato internacional com +. */
  telefone: string
  /** Número do wa.me — só dígitos, formato internacional (ex: 5511999990000). */
  whatsapp: string
  /** Mensagem pré-preenchida que a pessoa que escaneou manda no WhatsApp. */
  whatsappMsg: string
  email: string
  site: string
  /** URL do Instagram PESSOAL — opcional; sem ele o link não aparece. */
  instagram?: string
  /** Path público da foto (círculo no topo do cartão) — opcional. */
  foto?: string
}

export const CARDS: Record<string, PersonCard> = {
  dup: {
    slug: 'dup',
    nome: 'Bruno Dup',
    descricao: 'Criativo, desenvolvedor e fundador da dup.agency',
    empresa: 'dup.agency',
    telefone: '+5511973558096',
    whatsapp: '5511973558096',
    whatsappMsg: 'Oi Bruno! Peguei seu contato pelo cartão digital da dup.agency :)',
    email: 'dup@dup.agency',
    site: 'https://dup.agency',
    instagram: 'https://instagram.com/obrunodup',
    foto: '/images/about-us/dup-front.webp',
  },
  lari: {
    slug: 'lari',
    nome: 'Lari Carvalho',
    descricao: 'Desenvolvedora e operações da dup.agency',
    empresa: 'dup.agency',
    telefone: '+5511959026332',
    whatsapp: '5511959026332',
    whatsappMsg: 'Oi Lari! Peguei seu contato pelo cartão digital da dup.agency :)',
    email: 'lari@dup.agency',
    site: 'https://dup.agency',
    foto: '/images/about-us/lari-front.webp',
  },
}

export function getCard(slug: string): PersonCard | undefined {
  return CARDS[slug]
}

export function getAllCardSlugs(): string[] {
  return Object.keys(CARDS)
}

/** URL absoluta do cartão — é isso que o QR codifica. */
export function cardUrl(slug: string): string {
  return `${CARD_BASE_URL}/card/${slug}`
}

/** Link do WhatsApp com a mensagem pré-preenchida. */
export function whatsappUrl(card: PersonCard): string {
  return `https://wa.me/${card.whatsapp}?text=${encodeURIComponent(card.whatsappMsg)}`
}

/** "@handle" a partir da URL do Instagram — pro rótulo do link. */
export function instagramHandle(url: string): string {
  return `@${new URL(url).pathname.replace(/\//g, '')}`
}
