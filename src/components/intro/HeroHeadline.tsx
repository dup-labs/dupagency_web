import type { CSSProperties } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// HERO HEADLINE — flow "logo central" (branch feat/hero-intro-logo)
// ─────────────────────────────────────────────────────────────────────────────
// Texto vivo, renderizado VISÍVEL (sem gating de intro) — pinta no 1º frame, é o
// candidato a LCP. Quem esconde/revela o hero é a IntroCover + as paredes (a
// subida das faixas É a animação de revelação). As palavras-grad ganham o
// gradiente via CSS (.text-grad-01, a mesma classe do <g> no resto do site).
//
// Texto 100% i18n: vem das messages (home.hero.headline).
// ─────────────────────────────────────────────────────────────────────────────

type Token = { text: string; grad: boolean }
type Line = Token[]

// "<g>Clareza</g> e <g>segurança</g><br></br>para quem precisa<br></br>de <g>paz operacional</g>"
// → [[{Clareza,grad},{ e ,—},{segurança,grad}], [{para quem precisa,—}], …]
function parseHeadline(raw: string): Line[] {
  return raw
    .split(/<br\s*\/?>(?:<\/br>)?/i)
    .map((lineStr) => {
      const tokens: Token[] = []
      const re = /<g>(.*?)<\/g>/gi
      let last = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(lineStr))) {
        if (m.index > last) tokens.push({ text: lineStr.slice(last, m.index), grad: false })
        tokens.push({ text: m[1], grad: true })
        last = m.index + m[0].length
      }
      if (last < lineStr.length) tokens.push({ text: lineStr.slice(last), grad: false })
      return tokens
    })
    .filter((line) => line.length > 0)
}

export default function HeroHeadline({
  raw,
  className,
  style,
}: {
  raw: string
  className?: string
  style?: CSSProperties
}) {
  const lines = parseHeadline(raw)

  return (
    <h1 className={className} style={style}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((tok, ti) =>
            tok.grad ? (
              <span key={ti} className="text-grad-01">{tok.text}</span>
            ) : (
              <span key={ti}>{tok.text}</span>
            ),
          )}
        </span>
      ))}
    </h1>
  )
}
