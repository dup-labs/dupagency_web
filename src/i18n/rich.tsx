import { type ReactNode } from 'react'

// Tags compartilhadas pro `t.rich()` dos message files:
//   <g>palavra</g>  → palavra com gradiente do brand (grad-01)
//   <br></br>       → quebra de linha controlada por idioma
// Cada idioma decide quais palavras destacar e onde quebrar — ver pt/en/es.json.
export const richTags = {
  g: (chunks: ReactNode) => <span className="text-grad-01">{chunks}</span>,
  b: (chunks: ReactNode) => <strong>{chunks}</strong>,
  br: () => <br />,
}
