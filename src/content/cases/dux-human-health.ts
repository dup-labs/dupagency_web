import type { CaseStudy } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// CASE — DUX Human Health
// ─────────────────────────────────────────────────────────────────────────────
// Só o `pt` está preenchido: /en e /es caem no pt automaticamente (ver pick()).
// Pra traduzir depois, é só adicionar `en:` / `es:` ao lado de cada `pt:`.
//
// Marcação nos textos: **gradiente**, *roxo vivid*, \n = quebra de linha.
// Imagens: soltar em public/images/cases/dux-human-health/ seguindo a convenção
// (hero.mp4|png, gallery-1.png…, timeline-1.png…) — a página se ajusta sozinha.
// ─────────────────────────────────────────────────────────────────────────────

export const duxHumanHealth: CaseStudy = {
  slug: 'dux-human-health',
  // Em revisão: os números e a história ainda são de rascunho, e o vídeo do hero
  // não chegou. Abre por URL, mas não indexa e não entra no sitemap. Pra publicar
  // de verdade, apagar esta linha.
  draft: true,
  client: {
    name: 'DUX Human Health',
    domain: 'duxhumanhealth.com.br',
    logo: '/images/partners/duxhumanhealth.svg',
  },
  since: 2020,
  publishedAt: '2026-07-12',

  meta: {
    title: { pt: 'Case DUX Human Health — 6 anos de parceria VTEX' },
    description: {
      pt: 'Como a dup.agency assumiu a operação técnica da DUX Human Health em VTEX e evoluiu a loja por seis anos — sem turnover, com um sênior fixo executando.',
    },
  },

  hero: {
    eyebrow: { pt: 'parceria desde 2020 · 6 anos' },
    titleGradient: 'DUX',
    title: 'Human Health',
    description: {
      pt: 'Nutracêuticos de alta performance rodando em VTEX. Seis anos operando lado a lado — do primeiro deploy à evolução contínua, sem turnover e sem surpresa no meio do caminho.',
    },
    stats: [
      { value: { pt: 'VTEX' }, label: { pt: 'Plataforma' }, gradient: true },
      { value: { pt: '2020' }, label: { pt: 'Início' } },
      { value: { pt: 'Projeto*+*Evolução' }, label: { pt: 'Escopo' } },
    ],
    // Sem `media`: o hero mostra o poster (logo do cliente) até o vídeo chegar.
    // Soltar hero.mp4 em public/images/cases/dux-human-health/ já basta.
  },

  resumo: {
    title: { pt: 'Uma marca de\nsuplementos que\n**leva a sério**' },
    lead: {
      pt: 'A DUX Human Health é uma marca brasileira de nutracêuticos de alta performance — proteínas, pré-treinos, vitaminas e linhas de assinatura. Um catálogo grande, giro alto e um público exigente com a experiência de compra.',
    },
    body: {
      pt: 'A operação roda em VTEX e não pode parar: campanha o ano inteiro, lançamentos frequentes e uma régua de recorrência que exige estabilidade. É aí que a gente entra — como parceiro técnico fixo, sênior executando, sem depender de escala.',
    },
    chips: [
      { pt: 'Nutracêuticos' },
      { pt: 'VTEX' },
      { pt: 'Assinatura recorrente' },
      { pt: 'Alto giro' },
    ],
  },

  inicio: {
    statement: {
      pt: 'Em 2020 a DUX precisava de um parceiro que **assumisse a operação técnica** sem drama — e evoluísse a loja no ritmo do negócio.',
    },
    body: {
      pt: 'A gente mergulhou fundo no que estava acontecendo: entendeu o catálogo, os gargalos de performance e a régua de recorrência. Mapeamos prós, contras e riscos antes de qualquer decisão — e começamos a construir uma relação que já dura seis anos.',
    },
  },

  milestones: [
    {
      year: '2020',
      tag: { pt: 'Projeto' },
      title: { pt: 'Assumimos a operação VTEX' },
      description: {
        pt: 'Onboarding técnico da loja, organização do código e do backlog. A operação passou a andar com um sênior fixo executando.',
      },
      result: { pt: 'Base estável e um único ponto de responsabilidade técnica.' },
    },
    {
      year: '2021',
      tag: { pt: 'Evolução' },
      title: { pt: 'Reestruturação de catálogo & performance' },
      description: {
        pt: 'Limpeza de catálogo, correção de gargalos e primeira leva de otimizações de carregamento nas páginas de maior tráfego.',
      },
      result: { pt: 'Páginas mais rápidas e catálogo pronto pra escalar campanhas.' },
    },
    {
      year: '2022',
      tag: { pt: 'Projeto + Evolução' },
      title: { pt: 'Nova home e componentização' },
      description: {
        pt: 'Reconstrução da home e de templates com componentes reaproveitáveis — mais fácil rodar campanha sem retrabalho.',
      },
      result: {
        pt: 'Time de marketing publicando campanhas sem depender de dev pra cada ajuste.',
      },
    },
    {
      year: '2023',
      tag: { pt: 'Evolução' },
      title: { pt: 'Assinatura recorrente & checkout' },
      description: {
        pt: 'Evolução da jornada de recorrência e ajustes finos no checkout pra reduzir atrito na conversão.',
      },
      result: { pt: 'Recompra mais fluida e menos abandono no fim do funil.' },
    },
    {
      year: '2024',
      tag: { pt: 'Consultoria + Evolução' },
      title: { pt: 'SEO técnico & Core Web Vitals' },
      description: {
        pt: 'Trabalho contínuo de SEO técnico e performance, mantendo os Web Vitals no verde mesmo em pico de tráfego.',
      },
      result: { pt: 'Loja segura pra crescer tráfego orgânico sem perder velocidade.' },
    },
    {
      year: '2025 · 26',
      tag: { pt: 'Evolução contínua' },
      title: { pt: 'Ritmo constante, mês a mês' },
      description: {
        pt: 'Agenda garantida, entregas no combinado e brainstorm todo início de mês pensando os próximos passos da loja.',
      },
      result: { pt: 'Seis anos depois, ainda evoluindo — sem turnover, sem surpresa.' },
    },
  ],

  // Sem prints reais ainda: a seção inteira some da página até o primeiro
  // gallery-1.* aparecer na pasta de assets. As legendas já ficam prontas.
  gallery: [
    { caption: { pt: 'Home DUX Human Health' } },
    { caption: { pt: 'Página de produto' } },
    { caption: { pt: 'Checkout e assinatura' } },
  ],

  testimonial: {
    quote: {
      pt: 'Desenvolvimento, acompanhamento, evolução e suporte da loja. Atendimento rápido e qualificado, sempre trazendo a visão técnica e de performance com dicas que trazem **segurança para a tomada de decisão.**',
    },
    author: 'Time DUX Human Health',
    role: { pt: '6 anos de parceria · e-commerce VTEX' },
  },

  nextSteps: [
    {
      title: { pt: 'GEO & busca' },
      body: {
        pt: 'Preparar o catálogo para respostas de IA e otimizar a descoberta de produto.',
      },
    },
    {
      title: { pt: 'Recorrência 2.0' },
      body: {
        pt: 'Evoluir a jornada de assinatura para reduzir churn e aumentar recompra.',
      },
    },
    {
      title: { pt: 'Performance contínua' },
      body: {
        pt: 'Manter Core Web Vitals no verde a cada campanha e pico de tráfego.',
      },
    },
  ],
}
