import { getCard } from '@/content/cards'

// ─────────────────────────────────────────────────────────────────────────────
// Download do contato (.vcf, vCard 3.0) — o botão "Salvar contato" aponta aqui.
// Server-side de propósito: URL direta funciona sem JS, dá pra compartilhar,
// e iOS/Android abrem a ficha de contato direto do download.
// ─────────────────────────────────────────────────────────────────────────────

// Vírgula, ponto-e-vírgula e barra invertida são separadores na spec do vCard —
// escapados pra não quebrar campo no meio.
function esc(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => `\\${m}`)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ person: string }> },
) {
  const { person } = await params
  const card = getCard(person)
  if (!card) {
    return new Response('Not found', { status: 404 })
  }

  // N = sobrenome;nome — primeira palavra vira nome, o resto sobrenome.
  const [given, ...rest] = card.nome.split(' ')
  const family = rest.join(' ')

  const vcf = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(card.nome)}`,
    `ORG:${esc(card.empresa)}`,
    `TITLE:${esc(card.descricao)}`,
    `TEL;TYPE=CELL:${card.telefone}`,
    `EMAIL;TYPE=INTERNET:${card.email}`,
    `URL:${card.site}`,
    'END:VCARD',
  ].join('\r\n')

  return new Response(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.slug}.vcf"`,
    },
  })
}
