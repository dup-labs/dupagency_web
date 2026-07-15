import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCard, getAllCardSlugs, cardUrl } from '@/content/cards'
import QrCode from './QrCode'

// ─────────────────────────────────────────────────────────────────────────────
// TELA DO QR — o dono do cartão mostra esta tela no próprio celular.
// QR grande, centralizado, e quase nada além: logo no topo e foto + nome no
// MESMO tamanho/formatação do cartão (estética idêntica nas duas telas).
// Preto sobre branco de propósito: contraste máximo = a câmera lê no
// primeiro enquadramento.
// ─────────────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllCardSlugs().map((person) => ({ person }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ person: string }>
}): Promise<Metadata> {
  const { person } = await params
  const card = getCard(person)
  if (!card) return {}
  return { title: `QR · ${card.nome}` }
}

export default async function CardQrPage({
  params,
}: {
  params: Promise<{ person: string }>
}) {
  const { person } = await params
  const card = getCard(person)
  if (!card) notFound()

  return (
    <div className="min-h-dvh flex flex-col items-center px-8 pt-10 pb-12">
      {/* Marca no topo — igual à página do cartão */}
      <p className="font-chillax text-[1.2rem] text-neutral-600">
        <span className="font-light">dup</span>
        <span className="font-medium">.agency</span>
      </p>

      <div className="w-full flex-1 flex flex-col items-center justify-center gap-8">
        {/* Foto + nome no topo — mesmo arranjo e formatação do cartão */}
        <div className="flex flex-col items-center">
          {card.foto && (
            <div
              className="rounded-full p-0.75"
              style={{ background: 'var(--grad-site-01)' }}
            >
              <Image
                src={card.foto}
                alt={card.nome}
                width={128}
                height={128}
                priority
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
          )}
          <h1 className="m-0 font-chillax font-bold text-[2.5rem] leading-display text-grad-01 text-center">
            {card.nome}
          </h1>
        </div>

        <div className="w-full max-w-80 rounded-xl bg-white p-6 shadow-card">
          <QrCode url={cardUrl(card.slug)} />
        </div>
      </div>
    </div>
  )
}
