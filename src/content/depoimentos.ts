// ─────────────────────────────────────────────────────────────────────────────
// DEPOIMENTOS — fonte única de verdade
// ─────────────────────────────────────────────────────────────────────────────
// Consumido por:
//   · Depoimentos.tsx       → render dos cards (client)
//   · [locale]/page.tsx     → Review JSON-LD server-side (GEO/structured data)
// Os dois leem o MESMO dado (nome/cargo/empresa/texto), então o markup de Review
// nunca diverge do que aparece na tela. Editar depoimento = editar só aqui.
// ─────────────────────────────────────────────────────────────────────────────

export type CardContent =
  | { type: 'text'; message: string }
  | { type: 'audio'; src: string }
  | { type: 'video'; src: string }

export interface Depoimento {
  slug: string
  content: CardContent
  nome: string
  cargo: string
  empresa: string
  tempo: string
  // Posições absolutas do card desktop (pin-scene). Cobre top/bottom +
  // left/right do parent. Inspirado no projeto dupagency_new/Testimonials.
  posClasses: string
}

export const DEPOIMENTOS: Depoimento[] = [
  {
    slug: 'card-0',
    content: {
      type: 'text',
      message:
        'Ótimos parceiros. Desenvolvimento, acompanhamento, evolução e suporte da loja online. Atendimento rápido e qualificado, sempre trazendo a visão técnica e de performance com dicas e orientações que trazem segurança para a tomada de decisões. Pontos fundamentais na parceria e para o bom desempenho do e-commerce.',
    },
    nome: 'Eduardo Bennemann',
    cargo: 'Diretor E-commerce',
    empresa: 'Bennemann',
    tempo: '5 anos de parceria',
    posClasses: 'top-[50px] left-[10px]',
  },
  {
    slug: 'card-1',
    content: {
      type: 'text',
      message:
        'O trabalho é de excelência. São extremamente ágeis, entendem rapidamente a criticidade de cada demanda e, acima de tudo, pensam sempre na experiência do cliente final. \n É uma parceria de alto nível, baseada em confiança e entrega consistente.',
    },
    nome: 'Rodrigo Schenkman',
    cargo: 'CEO',
    empresa: 'One Up',
    tempo: '4 anos de parceria',
    posClasses: 'top-[150px] right-[40px]',
  },
  {
    slug: 'card-2',
    content: {
      type: 'text',
      message:
        'Minha experiência com a Dup Agency é de parceria total. Cada entrega, projeto e melhorias foram sempre entregues com agilidade e excelência. Quando entrei na FOM, fiz questão de trazê-los  para me apoiar no novo projeto, para trazer inovação e crescimento da performance. \n Muito obrigada por toda a dedicação de vocês!',
    },
    nome: 'Vivian',
    cargo: 'Especialista de e-commerce',
    empresa: 'Positive Market / FOM',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[170px] left-[80px]',
  },
  {
    slug: 'card-3',
    content: {
      type: 'text',
      message:
        'Quase todo mundo fala de parceria, mas com vocês isso realmente acontece no dia a dia! Eu amo trabalhar com o time.. São ágeis, prestativos e sempre disponíveis quando a gente precisa. Dá uma tranquilidade enorme saber que posso confiar 100% no que vocês entregam. Isso faz muita diferença na rotina e no crescimento do nosso e-commerce.',
    },
    nome: 'Helena Guimarães',
    cargo: 'Coordenadora de E-commerce',
    empresa: 'Authen',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[670px] left-[350px]',
  },
  {
    slug: 'card-4',
    content: {
      type: 'text',
      message:
        'Ter uma equipe parceira faz toda a diferença no e-commerce, e foi exatamente isso que encontramos com a Dup. Sempre muito ágeis e comprometidos em buscar soluções que realmente impactam a performance da loja. O suporte próximo, a visão estratégica e a qualidade das entregas nos trazem muita confiança para evoluir continuamente nosso projeto online.',
    },
    nome: 'Camila Bertozzi',
    cargo: 'Proprietária',
    empresa: 'MaxFesta',
    tempo: '5 anos de parceria',
    posClasses: 'bottom-[720px] left-[1050px]',
  },
  {
    slug: 'card-5',
    content: {
      type: 'text',
      message:
        'Sempre muito disponíveis e parceiros no dia a dia, trazendo recomendações técnicas que sustentam as melhores decisões para os projetos desenvolvidos. Além disso, conduz todo o processo com muita transparência e comprometimentos, sendo um fornecedor que buscamos manter sempre próximo do nosso pool de parceiros.',
    },
    nome: 'Daniela Aiko',
    cargo: 'Diretora de Atendimento',
    empresa: 'Agência Íonz',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[270px] left-[750px]',
  },
  {
    slug: 'card-6',
    content: {
      type: 'text',
      message:
        'A Dup Agency é uma parceira indispensável para a evolução de todos os sites que operamos. Sempre atenta às novas tendências do mercado, se atualizando para trazer sugestões de melhorias, dispostos para discutir ideias que também sejam um desafio. \n A parceria de mais ou menos 8 anos com os responsáveis pela agência vem bem antes da sua criação. É um alívio encontrar profissionais assim, que entregam excelência no trabalho e honestidade nas tratativas, deixando nossa preocupação nos resultados, como deve ser. Por esse motivo a indico de olhos fechados!',
    },
    nome: 'Renan Lima',
    cargo: 'Coordenador de Ecommerce',
    empresa: 'Lego.com.br',
    tempo: '6 anos de parceria',
    posClasses: 'bottom-[209px] left-[1190px]',
  },
  {
    slug: 'card-7',
    content: {
      type: 'text',
      message:
        'A relação de confiança construída ao longo do tempo é um dos grandes valores da parceria e flui de forma muito positiva e natural. Desde as demandas mais simples até grandes projetos, a troca constante de ideias nos ajuda a tomar decisões e nos deixa seguros sobre a entrega e a execução..',
    },
    nome: 'Gian Pedrosa',
    cargo: 'Analista de Projetos E-commerce',
    empresa: 'Spicy',
    tempo: '4 anos de parceria',
    posClasses: 'bottom-[70px] left-[320px]',
  },
]
