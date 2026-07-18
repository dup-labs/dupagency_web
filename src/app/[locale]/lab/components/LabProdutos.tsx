import { useTranslations } from 'next-intl'
import Reveal from '@/components/ui/Reveal'
import { ScribblePlaceholder } from './LabScribbles'

// 02 — vitrine. "O rascunho colore": o mock nasce em grayscale e ganha cor no
// hover (.lab-prod-card / .lab-prod-mock em globals.css). Cor SÓ aqui — regra
// de ouro do DS do lab — e sempre via gradiente-assinatura de cada produto.

type ProductSlug = 'swtchr' | 'nutrk' | 'polr'

interface Product {
  slug: ProductSlug
  order: string
  status: 'live' | 'beta' | 'soon'
  url: string
  urlLabel: string
  /** shot composto (produto + fundo da assinatura) — cobre o painel inteiro */
  image: string | null
  /** gradiente-assinatura do produto (fallback do slot sem imagem) */
  gradient: string
  /** imagem à esquerda no desktop (alterna o zigue-zague) */
  flip?: boolean
}

const PRODUCTS: Product[] = [
  {
    slug: 'swtchr',
    order: 'produto_01',
    status: 'live',
    url: 'https://swtchr.io',
    urlLabel: 'swtchr.io',
    image: '/images/lab/swtchr-site.png',
    gradient: 'linear-gradient(150deg, #897BBC, #AD61C2)',
  },
  {
    slug: 'nutrk',
    order: 'produto_02',
    status: 'beta',
    url: 'https://www.nutrk.io',
    urlLabel: 'nutrk.io',
    image: '/images/lab/nutrk-site.png',
    gradient: 'linear-gradient(150deg, #AFD7D0, #86C8D4)',
    flip: true,
  },
  {
    slug: 'polr',
    order: 'produto_03',
    status: 'soon',
    url: 'https://polrfy.co',
    urlLabel: 'polrfy.co',
    image: '/images/lab/polr-site.png',
    gradient: 'linear-gradient(150deg, #7FABED, #B792A8)',
  },
]

export default function LabProdutos() {
  const t = useTranslations('lab.produtos')

  return (
    <section
      id="lab-produtos"
      className="relative z-1 px-[clamp(20px,4vw,56px)] pt-[clamp(40px,6vh,80px)] pb-[clamp(80px,12vh,120px)]"
    >
      <div className="max-w-300 mx-auto">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
            <div>
              <div className="flex items-center gap-3.5 mb-5 font-spline-mono text-[12px] tracking-[0.1em] uppercase text-neutral-400">
                <span className="w-8.5 h-px bg-neutral-400" />
                {t('label')}
              </div>
              <h2
                className="font-chillax font-bold uppercase m-0"
                style={{
                  fontSize: 'calc(clamp(30px, 5vw, 64px) * var(--font-scale))',
                  lineHeight: 0.98,
                  letterSpacing: '-0.01em',
                }}
              >
                {t('title1')}
                <br />
                {t('title2')}
              </h2>
            </div>
            <p className="font-caveat text-[22px] text-neutral-600 max-w-[24ch] -rotate-2 m-0">
              {t('hint')}
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-5">
          {PRODUCTS.map((p) => {
            const textPanel = (
              <div
                className={`flex flex-col justify-between gap-8 p-[clamp(24px,3vw,44px)] ${
                  p.flip ? 'md:order-2' : 'md:border-r md:border-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-spline-mono text-[12px] text-neutral-400">{p.order}</span>
                  <span className="font-spline-mono text-[10.5px] tracking-[0.1em] uppercase border border-black rounded-pill px-2.5 py-1">
                    {t(`status.${p.status}`)}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-chillax font-bold lowercase m-0 mb-2.5"
                    style={{ fontSize: 'clamp(40px, 5.5vw, 74px)', lineHeight: 0.9 }}
                  >
                    {p.slug}
                  </h3>
                  <p className="font-spline-mono text-[13px] tracking-[0.02em] text-neutral-600 m-0 mb-4.5">
                    {t(`${p.slug}.tagline`)}
                  </p>
                  <p className="font-synonym text-[15px] leading-relaxed text-neutral-800 max-w-[42ch] m-0">
                    {t(`${p.slug}.desc`)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 font-spline-mono text-[12px] tracking-[0.04em]">
                  <span className="border-b border-black pb-0.5">{p.urlLabel}</span>
                  <span aria-hidden>→</span>
                </div>
              </div>
            )

            const imagePanel = (
              <div
                className={`relative min-h-70 md:min-h-75 flex items-center justify-center p-7 overflow-hidden bg-paper-2 ${
                  p.flip ? 'md:order-1 md:border-r md:border-black' : ''
                } max-md:order-2 max-md:border-t max-md:border-black`}
              >
                <span className="lab-prod-hint absolute top-3.5 left-4 z-[3] font-caveat text-[18px] text-neutral-600">
                  {t('hoverHint')}
                </span>
                {p.image ? (
                  // shot já vem composto (produto + fundo da assinatura) e
                  // preenche o painel inteiro do card
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.slug}
                    loading="lazy"
                    className="lab-prod-mock absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  // slot aguardando o shot real — gradiente-assinatura + wireframe
                  <div
                    className="lab-prod-mock absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ background: p.gradient }}
                  >
                    <ScribblePlaceholder className="w-32.5 text-black/35" />
                    <span className="font-spline-mono text-[11px] tracking-[0.08em] uppercase text-black/45">
                      {t('placeholder')}
                    </span>
                  </div>
                )}
              </div>
            )

            return (
              <Reveal key={p.slug}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`lab-prod-card grid overflow-hidden border border-black bg-paper no-underline text-black ${
                    p.flip
                      ? 'md:grid-cols-[1fr_1.05fr]'
                      : 'md:grid-cols-[1.05fr_1fr]'
                  }`}
                >
                  {textPanel}
                  {imagePanel}
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
