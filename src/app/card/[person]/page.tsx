import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCard, getAllCardSlugs, whatsappUrl, instagramHandle } from '@/content/cards'
import CardActions from './CardActions'

// ─────────────────────────────────────────────────────────────────────────────
// O CARTÃO — é aqui que a pessoa cai depois de escanear o QR.
// Objetivo: próximo passo em ~15s. Hierarquia: foto/nome > salvar contato >
// WhatsApp > site/Instagram. Poucos elementos, muito respiro.
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
  return {
    title: card.nome,
    description: card.descricao,
  }
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ person: string }>
}) {
  const { person } = await params
  const card = getCard(person)
  if (!card) notFound()

  return (
    <div className="min-h-dvh flex flex-col items-center px-6 pt-10 pb-12">
      {/* Marca no topo — mesma grafia do logo do Nav (Chillax Light + Medium).
          Tamanhos em rem direto: os tokens text-* do @theme estão no namespace
          errado (--font-size-* em vez de --text-*) e não geram utilitário. */}
      <p className="font-chillax text-[1.2rem] text-neutral-600">
        <span className="font-light">dup</span>
        <span className="font-medium">.agency</span>
      </p>

      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center text-center">
        {/* Foto em círculo com anel fino no grad-01 */}
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

        {/* Nome + descrição */}
        <h1 className="m-0 font-chillax font-bold text-[2.5rem] leading-display text-grad-01">
          {card.nome}
        </h1>
        <p className="mt-4 font-synonym text-body-lg leading-body text-neutral-800 max-w-72">
          {card.descricao}
        </p>

        {/* Ações — salvar contato é O botão da página; site e Instagram
            entram como pills outline na mesma coluna */}
        <CardActions
          vcardHref={`/card/${card.slug}/vcard`}
          whatsappHref={whatsappUrl(card)}
          siteHref={card.site}
          instagramHref={card.instagram}
          instagramLabel={card.instagram ? instagramHandle(card.instagram) : undefined}
        />
      </div>
    </div>
  )
}
