'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useBackgroundContext } from '@/components/layout/BackgroundLayer'

interface FaqItem {
  q: string
  a: string
}

// 14 perguntas — conteúdo vem dos message files (home.faq.qN.question/answer).
const FAQ_KEYS = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7',
  'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14',
] as const

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

  const t = useTranslations('home.faq')
  const faqs: FaqItem[] = FAQ_KEYS.map((k) => ({
    q: t(`${k}.question`),
    a: t(`${k}.answer`),
  }))

  // JSON-LD reflete o idioma ativo — bom pro rich result da busca por locale.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

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
            {t('sectionLabel')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div>
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((item) => (
              <FaqRow key={item.q} item={item} isDark={isDark} />
            ))}
          </div>
          <div>
            {faqs.slice(Math.ceil(faqs.length / 2)).map((item) => (
              <FaqRow key={item.q} item={item} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
