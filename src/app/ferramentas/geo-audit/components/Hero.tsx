import { Suspense } from 'react'
import GridLines from '@/components/ui/GridLines'
import AuditForm from './AuditForm'

export default function Hero() {
  return (
    <section
      id="geo-hero"
      className="relative z-10"
      style={{
        paddingTop: 'calc(64px + 72px)',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}
    >
      <GridLines />

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 12px',
            marginBottom: '32px',
          }}
        >
          <span
            className="font-synonym"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--neutral-400)',
              textTransform: 'uppercase',
            }}
          >
            GEO — Generative Engine Optimization
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-chillax font-bold uppercase text-black select-none"
          style={{
            fontSize: 'clamp(30px, 5.1vw, 54px)',
            lineHeight: 'var(--leading-display)',
            marginBottom: '24px',
          }}
        >
          Seu e-commerce aparece quando{' '}
          <span className="text-grad-01">alguém pergunta para uma IA?</span>
        </h1>

        {/* Subtítulo */}
        <p
          className="mt-6 md:mt-8 font-synonym text-body-md md:text-body-lg text-neutral-600 max-w-lg text-center"
          style={{ lineHeight: 'var(--leading-body)', margin: '0 auto 40px' }}
        >
          ChatGPT, Gemini e Perplexity já respondem perguntas de compra. Descubra
          se o seu site está estruturado para aparecer — e o que fazer quando não está.
        </p>

        <Suspense>
          <AuditForm variant="hero" />
        </Suspense>

        {/* Badges */}
        <p
          className="font-synonym"
          style={{
            fontSize: 'var(--text-label-ui)',
            color: 'var(--neutral-400)',
            letterSpacing: '0.03em',
          }}
        >
          Gratuito · Resultado em menos de 60s · Sem compromisso
        </p>
      </div>
    </section>
  )
}
