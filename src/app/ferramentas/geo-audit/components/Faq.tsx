'use client'

import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'O que é GEO (Generative Engine Optimization)?',
    a: 'GEO é a prática de otimizar seu site e conteúdo para aparecer nas respostas geradas por inteligências artificiais como ChatGPT, Gemini e Perplexity. Diferente do SEO tradicional, que foca em ranquear páginas em buscadores, o GEO foca em garantir que as IAs conheçam, entendam e citem sua marca nas respostas que elas geram.',
  },
  {
    q: 'Qual a diferença entre SEO e GEO?',
    a: 'SEO (Search Engine Optimization) é a otimização para motores de busca tradicionais como o Google, que retornam uma lista de links. GEO é a otimização para motores de busca generativos — IAs que retornam respostas diretamente. Um bom SEO técnico é a fundação do GEO, mas GEO vai além: exige conteúdo estruturado, afirmações citáveis, autoridade de marca e dados estruturados que os modelos de linguagem consigam processar.',
  },
  {
    q: 'O audit gratuito é realmente gratuito?',
    a: 'Sim, 100% gratuito e sem compromisso. Você informa a URL do seu site e seu e-mail, e recebe um relatório completo com score GEO Readiness, score de SEO técnico, gaps identificados e plano de ação priorizado. Não pedimos cartão de crédito nem dados sensíveis.',
  },
  {
    q: 'Para quais plataformas o audit funciona?',
    a: 'O GEO Audit funciona para qualquer site ou e-commerce, independente da plataforma — VTEX, Shopify, Nuvemshop, WooCommerce, Magento ou qualquer outra. A análise é feita na URL pública do seu site, verificando os sinais técnicos e de conteúdo que os crawlers das IAs utilizam.',
  },
  {
    q: 'Em quanto tempo recebo o resultado?',
    a: 'O relatório é gerado em menos de 60 segundos e enviado para o e-mail que você informar. Você também poderá acessar o resultado diretamente na página após a análise.',
  },
  {
    q: 'O que é o GEO Checker e como funciona?',
    a: 'O GEO Checker é o produto completo da dup.agency para monitoramento de presença nas IAs. Diferente do Audit (que analisa o potencial técnico do seu site), o Checker verifica na prática se o seu site já está sendo mencionado nas respostas do ChatGPT, Gemini e Perplexity para as perguntas do seu nicho. É um serviço contínuo de monitoramento e relatório.',
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

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="mb-3"
      style={{ borderBottom: '0.5px solid rgba(0,0,0,0.12)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-3 text-left"
        aria-expanded={open}
      >
        <span
          className="font-synonym flex-1 uppercase"
          style={{
            fontSize: 'clamp(12px, 2.6vw, 14px)',
            lineHeight: '1.4',
            fontWeight: 500,
            color: '#000000',
          }}
        >
          {item.q}
        </span>
        <span
          className="font-synonym shrink-0 select-none"
          style={{
            fontSize: 'clamp(12px, 2.6vw, 14px)',
            lineHeight: '1.4',
            color: 'rgba(0,0,0,0.6)',
            transition: 'transform 250ms ease',
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
            color: 'rgba(0,0,0,0.75)',
          }}
        >
          {item.a}
        </p>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <section id="geo-faq" className="relative z-10 pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="relative max-w-5xl mx-auto w-full px-5 md:px-12">
        <div className="mb-6">
          <h2
            className="font-synonym font-bold uppercase tracking-wider"
            style={{
              fontSize: 'clamp(12px, 2.4vw, 14px)',
              lineHeight: '1.4',
              color: '#000000',
            }}
          >
            Perguntas frequentes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div>
            {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((item) => (
              <FaqRow key={item.q} item={item} />
            ))}
          </div>
          <div>
            {FAQS.slice(Math.ceil(FAQS.length / 2)).map((item) => (
              <FaqRow key={item.q} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
