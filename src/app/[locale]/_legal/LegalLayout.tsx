import Link from 'next/link'
import type { ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Casca das páginas jurídicas (/privacidade, /exclusao-de-dados).
// ─────────────────────────────────────────────────────────────────────────────
// Prioridade aqui é legibilidade, não impacto visual: medida de leitura curta,
// tipografia do site, hierarquia clara. Pasta com _ pra não virar rota.
// ─────────────────────────────────────────────────────────────────────────────

export function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-chillax font-bold text-[1.375rem] leading-tight tracking-tight text-black">
        {titulo}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export default function LegalLayout({
  titulo,
  atualizado,
  children,
}: {
  titulo: string
  atualizado: string
  children: ReactNode
}) {
  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-[42rem] px-6 pt-32 pb-24 md:pt-40">
        <Link
          href="/"
          className="font-synonym text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline"
        >
          ← dup.agency
        </Link>

        <h1 className="mt-8 font-chillax font-bold uppercase text-[2.25rem] leading-[1.05] tracking-tight md:text-[3rem]">
          {titulo}
        </h1>

        <p className="mt-3 font-synonym text-sm text-neutral-500">
          Última atualização: {atualizado}
        </p>

        {/* Corpo: estilos aplicados por seletor pra não poluir cada parágrafo. */}
        <div
          className="
            mt-10 font-synonym text-[1.0625rem] leading-relaxed text-neutral-700
            [&_p]:text-neutral-700
            [&_strong]:font-semibold [&_strong]:text-black
            [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2
          "
        >
          {children}
        </div>
      </div>
    </main>
  )
}
