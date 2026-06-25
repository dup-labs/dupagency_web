'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface FaqItem {
  q: string
  a: string
}

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

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
  const t = useTranslations('ferramentas.geoAudit')
  const FAQS: FaqItem[] = FAQ_KEYS.map((k) => ({
    q: t(`faq.${k}.question`),
    a: t(`faq.${k}.answer`),
  }))

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
            {t('faq.sectionLabel')}
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
