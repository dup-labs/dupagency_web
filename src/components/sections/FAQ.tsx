'use client'

import { useState } from 'react'
import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

interface FaqItem {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'Tem contrato mínimo?',
    a: 'O primeiro ciclo é de 6 meses. É o tempo que a gente precisa pra calibrar a parceria, entender o ritmo da sua operação e entregar valor de verdade. Depois disso, sem fidelidade — só precisamos de 30 dias de antecedência pra organizar a transição.',
  },
  {
    q: 'O que acontece com as horas não utilizadas no mês?',
    a: 'As horas não acumulam. Trabalhamos com capacidade limitada e controlada — se acumulasse, perderíamos o controle de qualidade que é exatamente o que você está contratando. Na última semana do mês recebemos no máximo 25% do total do pacote, justamente pra evitar a correria de fim de mês.',
  },
  {
    q: 'E se eu tiver uma urgência fora do horário?',
    a: 'Urgência é urgência — pode nos acionar a qualquer hora. Mas é bom saber que nosso processo já é pensado pra minimizar urgências: não fazemos alterações na loja depois das 15h em dias de semana e em nenhum horário na sexta, justamente pra proteger o fim de semana. Se acontecer algo fora disso, estaremos online assim que possível.',
  },
  {
    q: 'A agência anterior não me passou o código. Vocês conseguem assumir?',
    a: 'Pra Evolução Contínua, preferimos não entrar em projetos sem histórico de código — em alguns casos, como VTEX IO, nem é tecnicamente possível. Mas se for esse o seu cenário, podemos desenvolver um projeto novo do zero. Com uma vantagem: o código desenvolvido é seu, garantido em contrato. Se um dia decidir trocar de parceiro — embora a gente duvide que vá querer — você leva tudo.',
  },
  {
    q: 'Como eu solicito um trabalho?',
    a: 'Trabalhamos com Monday.com. Cada parceiro tem um board próprio, com acesso pra até 3 pessoas do seu time — pra gerar, priorizar e validar as atividades que serão executadas.',
  },
  {
    q: 'Como falo com vocês pra tirar uma dúvida rápida?',
    a: 'Cada parceiro tem um grupo no WhatsApp com a gente — canal pra assuntos urgentes e dúvidas pontuais. O que fizer sentido virar tarefa, a gente move pro Monday.',
  },
  {
    q: 'Vocês fazem cadastro de produto?',
    a: 'Não executamos o cadastro diretamente — os detalhes da operação ficam com você, e não queremos arriscar divergências nas informações dos seus produtos. Mas damos todo o suporte: orientação, documentação e quando precisar até um call pra fazer o cadastro assistido junto com seu time.',
  },
  {
    q: 'Se eu tiver mais de uma loja, preciso de dois contratos?',
    a: 'Não. Você fecha um contrato com a gente e podemos contemplar todas as suas lojas — desde que nas plataformas que atuamos. Você decide como distribuir melhor as horas entre elas.',
  },
  {
    q: 'SEO e performance entram no plano ou precisam de contrato separado?',
    a: 'SEO técnico e performance fazem parte do fluxo padrão — entram no plano normal. GEO é um produto à parte, por exigir análises, documentações e acompanhamento que vão além do dia a dia da loja.',
  },
  {
    q: 'Vocês fazem reunião presencial?',
    a: 'Somos nômades, então temos liberdade de estar em vários lugares. Se estivermos na sua cidade no momento certo, será um prazer. Se não, podemos alinhar os custos de deslocamento e agendar — liberdade não falta.',
  },
  {
    q: 'Vocês só executam ou também analisam e sugerem?',
    a: 'Preferimos fazer o trabalho completo — analisar, trazer ideias, pensar junto, apontar oportunidades. Mas respeitamos o ritmo de cada parceiro. Se seu time estratégico já pauta tudo, executamos com qualidade. Se quiser nos envolver nas decisões e ter o olhar técnico nas estratégias, melhor ainda.',
  },
  {
    q: 'Tem reunião de alinhamento todo mês?',
    a: 'Sim. Na primeira semana de cada mês temos uma reunião fixa com cada parceiro — definida já no kick off — pra falar sobre o momento da loja, ações previstas e brainstorm pro próximo ciclo.',
  },
  {
    q: 'Como acompanho o saldo de horas?',
    a: 'Dentro do Monday você tem acesso a um painel customizado com todas as atividades, horas e status de tudo que foi executado no ano — mês a mês, em tempo real.',
  },
  {
    q: 'Vocês trabalham com quais plataformas?',
    a: 'Trabalhamos com VTEX e Nuvemshop. A escolha da plataforma depende do momento, do volume e da estratégia da marca — e faz parte do que avaliamos junto com o cliente quando necessário.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

function FaqRow({ item, isDark }: { item: FaqItem; isDark: boolean }) {
  const [open, setOpen] = useState(false)

  const titleColor = isDark ? '#ffffff' : '#000000'
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
  const answerColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.75)'
  const borderColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'

  return (
    <div
      className="mb-3"
      style={{
        borderBottom: `0.5px solid ${borderColor}`,
        transition: 'border-color 600ms ease',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-3 text-left"
        aria-expanded={open}
        id={`faq-${item.q.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`}
        data-faq-pergunta={item.q}
      >
        <span
          className="font-synonym flex-1 uppercase"
          style={{
            fontSize: 'clamp(12px, 2.6vw, 14px)',
            lineHeight: '1.4',
            fontWeight: 500,
            color: titleColor,
            transition: 'color 600ms ease',
          }}
        >
          {item.q}
        </span>
        <span
          className="font-synonym shrink-0 select-none"
          style={{
            fontSize: 'clamp(12px, 2.6vw, 14px)',
            lineHeight: '1.4',
            color: mutedColor,
            transition: 'transform 250ms ease, color 600ms ease',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        aria-hidden={!open}
        style={{
          maxHeight: open ? '600px' : '0px',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 350ms ease, opacity 250ms ease',
        }}
      >
        <p
          className="font-synonym pb-4 pr-2 md:pr-6"
          style={{
            fontSize: 'clamp(11px, 2.4vw, 12px)',
            lineHeight: '1.55',
            color: answerColor,
            transition: 'color 600ms ease',
          }}
        >
          {item.a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { navTheme } = useBackgroundContext()
  const isDark = navTheme === 'light'
  const titleColor = isDark ? '#ffffff' : '#000000'

  return (
    <section
      id="faq"
      className="relative z-10 pt-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Sentinel `faq-dark` fixo na metade de baixo do FAQ. Quando essa
          metade cruza a linha de detecção do useActiveSection (15% do topo
          da viewport), o background vira preto e os textos do FAQ invertem
          — preparando a transição pro CTAFinal. Subindo, ao sair dessa
          metade, volta pra branco. Sem lógica de direção. */}
      <div
        id="faq-dark"
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ left: 0, right: 0, top: '50%', bottom: 0 }}
      />

      <div className="relative max-w-5xl mx-auto w-full px-5 md:px-12">
        <div className="mb-6">
          <h2
            className="font-synonym font-bold uppercase tracking-wider"
            style={{
              fontSize: 'clamp(12px, 2.4vw, 14px)',
              lineHeight: '1.4',
              color: titleColor,
              transition: 'color 600ms ease',
            }}
          >
            Perguntas frequentes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div>
            {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((item) => (
              <FaqRow key={item.q} item={item} isDark={isDark} />
            ))}
          </div>
          <div>
            {FAQS.slice(Math.ceil(FAQS.length / 2)).map((item) => (
              <FaqRow key={item.q} item={item} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
