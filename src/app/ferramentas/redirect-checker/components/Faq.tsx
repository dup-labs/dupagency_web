'use client'

import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'O que é crawl budget e por que importa?',
    a: 'Crawl budget é a quantidade de páginas que o Googlebot está disposto a rastrear no seu site em um determinado período. Sites com muitos redirects, 404s ou URLs duplicadas desperdiçam esse orçamento — e páginas importantes podem ficar sem ser rastreadas.',
  },
  {
    q: 'Preciso instalar alguma coisa?',
    a: 'Não. A ferramenta acessa o seu sitemap.xml publicamente, da mesma forma que o Google faz. Nenhum acesso, plugin ou credencial é necessário.',
  },
  {
    q: 'Para quais plataformas funciona?',
    a: 'Funciona para qualquer plataforma — VTEX, Nuvemshop, WooCommerce ou qualquer outro CMS que gere um sitemap.xml público.',
  },
  {
    q: 'O que faço depois de receber o relatório?',
    a: 'O relatório já vem com as ações recomendadas por prioridade. Se quiser que a dup.agency execute as correções, é só entrar em contato — a maioria dos problemas identificados é resolvida em uma sprint.',
  },
  {
    q: 'Com que frequência devo rodar o audit?',
    a: 'Recomendamos rodar após qualquer mudança grande de URLs (migração, reestruturação de categorias, novo sitemap) e pelo menos uma vez por trimestre como checagem de rotina.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-3" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.12)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-3 text-left"
        aria-expanded={open}
      >
        <span
          className="font-synonym flex-1 uppercase"
          style={{ fontSize: 'clamp(12px, 2.6vw, 14px)', lineHeight: '1.4', fontWeight: 500, color: '#000000' }}
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
          style={{ fontSize: 'clamp(11px, 2.4vw, 12px)', lineHeight: '1.55', color: 'rgba(0,0,0,0.75)' }}
        >
          {item.a}
        </p>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <section id="rc-faq" className="relative z-10 pt-12" style={{ paddingBottom: '180px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="relative max-w-5xl mx-auto w-full px-5 md:px-12">
        <div className="mb-6">
          <h2
            className="font-synonym font-bold uppercase tracking-wider"
            style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', lineHeight: '1.4', color: '#000000' }}
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
