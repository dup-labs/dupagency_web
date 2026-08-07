// ─────────────────────────────────────────────────────────────────────────────
// PAPOS EMCJ — os encontros quinzenais
// ─────────────────────────────────────────────────────────────────────────────
// ✏️  ESTE é o arquivo pra editar quando tiver papo novo. Papo novo = uma
//     entrada nova em PAPOS (sem criar arquivo/pasta, sem tocar na página).
//
// Rotas que consomem isto:
//   /emcj              → o índice com os cards (src/app/emcj/page.tsx)
//   /emcj/<slug>       → o deck em si, HTML estático em public/emcj/<slug>/
//
// ⚠️ O DECK NÃO NASCE DAQUI. Adicionar uma entrada com status 'publicado' só
// cria o card e o link — o deck tem que estar em public/emcj/<slug>/ e ter o
// rewrite da URL limpa em next.config.ts. O fluxo completo está documentado
// em publicar.sh, no projeto do deck (/Users/dup/dup.agency/emcj/<slug>).
//
// Enquanto o deck não existe, deixe status: 'em-breve' — o card aparece na
// lista sem link, o que serve pra já anunciar o calendário da turma.
// ─────────────────────────────────────────────────────────────────────────────

export type Papo = {
  /** Casa com a pasta em public/emcj/ e com o rewrite em next.config.ts. */
  slug: string
  /** Número do encontro, dois dígitos — é o que aparece grande no card. */
  numero: string
  titulo: string
  /** Uma ou duas linhas: o que a pessoa leva desse encontro. */
  descricao: string
  /** ISO (YYYY-MM-DD) — usado pra ordenar e pra mostrar a data no card. */
  data: string
  /** 'publicado' = card clicável. 'em-breve' = card apagado, sem link. */
  status: 'publicado' | 'em-breve'
}

export const PAPOS: Papo[] = [
  {
    slug: 'papo-01',
    numero: '01',
    titulo: 'Abertura',
    descricao:
      'Quem somos nós e por que vocês estão aqui. O que a gente aprendeu sendo só dois na estrada — e o que vamos co-criar nos próximos encontros.',
    data: '2026-07-24',
    status: 'publicado',
  },
  {
    slug: 'papo-02',
    numero: '02',
    titulo: 'Design System',
    descricao:
      'Um design system que o Figma entende e a IA também. Como a gente organiza o sistema, como ele vira código legível pra IA, e o fluxo de trabalho que nasce disso.',
    data: '2026-08-07',
    status: 'publicado',
  },
]

/** URL do deck de um papo. */
export function papoUrl(papo: Papo): string {
  return `/emcj/${papo.slug}`
}

/** Mais recente primeiro — é a ordem em que a lista aparece. */
export function paposOrdenados(): Papo[] {
  return [...PAPOS].sort((a, b) => b.data.localeCompare(a.data))
}

/** Data no formato do card: "24 de julho de 2026". */
export function formatarData(iso: string): string {
  // Meio-dia UTC evita o clássico off-by-one de fuso ao formatar data pura.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
