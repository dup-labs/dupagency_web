import { Fragment, type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// caseRich — marcação leve nos textos do content file
// ─────────────────────────────────────────────────────────────────────────────
// Os textos dos cases vivem em arquivos TS (sem JSX), mas precisam de destaque
// visual em trechos específicos. Em vez de quebrar cada frase em fragmentos no
// content file, o autor marca inline e o render resolve:
//
//   **trecho** → gradiente da marca (grad-01)
//   *trecho*   → var(--purple-vivid) — acento pontual (ex: o "+" de "Projeto+Evolução")
//   \n         → <br />
//
// Escapes não são suportados de propósito: nenhum texto de case usa asterisco
// literal, e um parser completo seria complexidade sem demanda.
// ─────────────────────────────────────────────────────────────────────────────

// Captura **duplo** OU *simples* — nessa ordem, senão o simples come o duplo.
const ACCENT = /(\*\*[^*]+\*\*|\*[^*]+\*)/g

export function renderAccents(text: string): ReactNode {
  return text.split('\n').map((line, lineIdx, lines) => (
    <Fragment key={lineIdx}>
      {line.split(ACCENT).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="text-grad-01">
              {part.slice(2, -2)}
            </span>
          )
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <span key={i} style={{ color: 'var(--purple-vivid)' }}>
              {part.slice(1, -1)}
            </span>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
      {lineIdx < lines.length - 1 && <br />}
    </Fragment>
  ))
}
