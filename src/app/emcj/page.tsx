import Link from 'next/link'
import { paposOrdenados, papoUrl, formatarData, type Papo } from '@/content/papos'

// ─────────────────────────────────────────────────────────────────────────────
// ÍNDICE DOS PAPOS EMCJ — a lista de encontros quinzenais.
// ─────────────────────────────────────────────────────────────────────────────
// Objetivo: a pessoa da turma abre e acha o deck do encontro em ~5s. Card
// grande, número em destaque, data legível. Encontro sem deck ainda entra como
// 'em-breve' — aparece apagado e sem link, servindo de calendário.
//
// Pra adicionar papo novo, editar src/content/papos.ts. Esta página não muda.
// ─────────────────────────────────────────────────────────────────────────────

function CardPapo({ papo }: { papo: Papo }) {
  const disponivel = papo.status === 'publicado'

  const conteudo = (
    <>
      {/* Número do encontro — no grad-01 quando disponível, cinza quando não. */}
      <span
        className={`font-chillax font-bold text-[3.5rem] leading-none tabular-nums ${
          disponivel ? 'text-grad-01' : 'text-neutral-200'
        }`}
      >
        {papo.numero}
      </span>

      <span className="flex-1">
        <span className="block font-chillax font-bold uppercase text-[1.5rem] leading-tight tracking-tight">
          {papo.titulo}
        </span>
        <span className="mt-1 block font-synonym text-[0.95rem] uppercase tracking-[0.14em] text-neutral-400">
          {disponivel ? formatarData(papo.data) : 'em breve'}
        </span>
        <span className="mt-3 block font-synonym text-[1.05rem] leading-relaxed text-neutral-600">
          {papo.descricao}
        </span>
      </span>

      {/* Seta só nos disponíveis: sinaliza que o card leva a algum lugar. */}
      {disponivel && (
        <span
          aria-hidden
          className="self-center font-synonym text-[1.5rem] text-neutral-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-black"
        >
          →
        </span>
      )}
    </>
  )

  const base =
    'flex gap-6 rounded-3xl border p-7 sm:p-8 transition-colors duration-200'

  if (!disponivel) {
    return (
      <li>
        <div className={`${base} border-neutral-100 bg-neutral-50/50`} aria-disabled>
          {conteudo}
        </div>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={papoUrl(papo)}
        className={`group ${base} border-neutral-200 hover:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}
      >
        {conteudo}
      </Link>
    </li>
  )
}

export default function EmcjPage() {
  const papos = paposOrdenados()

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-12 sm:py-16">
      {/* Marca no topo — mesma grafia do logo do Nav (Chillax Light + Medium). */}
      <p className="font-chillax text-[1.2rem] text-neutral-600">
        <span className="font-light">dup</span>
        <span className="font-medium">.agency</span>
      </p>

      <header className="mt-14 sm:mt-20">
        <p className="font-synonym text-[0.95rem] uppercase tracking-[0.16em] text-neutral-400">
          Encontros quinzenais
        </p>
        <h1 className="mt-5 font-chillax text-[2.75rem] font-bold uppercase leading-[0.98] tracking-tight sm:text-[3.5rem]">
          Os <span className="text-grad-01">papos</span>
        </h1>
        <p className="mt-6 max-w-xl font-synonym text-[1.1rem] leading-relaxed text-neutral-600">
          Design, tecnologia e IA sem tirar o humano do centro. Cada encontro
          vira um deck que fica aqui — pra rever, ou pra ver o que você perdeu.
        </p>
      </header>

      <ul className="mt-14 flex flex-col gap-4 sm:mt-16">
        {papos.map((papo) => (
          <CardPapo key={papo.slug} papo={papo} />
        ))}
      </ul>

      <footer className="mt-auto pt-20">
        <p className="font-synonym text-[0.95rem] leading-relaxed text-neutral-400">
          Dúvida, ideia ou projeto:{' '}
          <a
            href="mailto:dup@dup.agency"
            className="text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
          >
            dup@dup.agency
          </a>
        </p>
      </footer>
    </div>
  )
}
