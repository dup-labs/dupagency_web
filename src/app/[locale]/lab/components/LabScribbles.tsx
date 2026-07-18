// Rabiscos à mão do DS anexo do lab — SVGs de traço único que se "desenham"
// via stroke-dashoffset (ver .lab-scribble em globals.css). Server-safe: o
// draw dispara por CSS quando o <Reveal> pai ganha .is-visible (ou imediato
// dentro de .lab-draw-now). pathLength=1 normaliza o dash pra qualquer path.

interface ScribbleProps {
  className?: string
  style?: React.CSSProperties
}

// Sublinhado do hero — passa por baixo da palavra "rabisco".
export function ScribbleUnderline({ className = '', style }: ScribbleProps) {
  return (
    <svg
      className={`lab-scribble ${className}`}
      style={style}
      viewBox="0 0 460 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        pathLength={1}
        d="M6 24 C 90 8, 150 34, 240 18 S 400 30, 454 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  )
}

// Sublinhado do CTA — versão mais curta, sobre fundo ink.
export function ScribbleUnderlineShort({ className = '', style }: ScribbleProps) {
  return (
    <svg
      className={`lab-scribble ${className}`}
      style={style}
      viewBox="0 0 300 30"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        pathLength={1}
        d="M4 18 C 80 6, 150 24, 296 10"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  )
}

// Seta curva do hero — aponta do título pro conteúdo abaixo.
export function ScribbleArrow({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 120 90" aria-hidden>
      <path
        pathLength={1}
        d="M10 6 C 60 2, 104 26, 96 74"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        pathLength={1}
        d="M96 74 L 78 58 M96 74 L 108 52"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Ícones do processo (01–04) ───────────────────────────────────────────────

export function ScribbleWave({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 80 60" aria-hidden>
      <path
        pathLength={1}
        d="M8 40 C 20 12, 40 12, 44 30 C 48 46, 66 44, 72 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ScribbleWireframe({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 80 60" aria-hidden>
      <rect pathLength={1} x="10" y="14" width="44" height="30" rx="2" fill="none" stroke="currentColor" strokeWidth={2} />
      <path pathLength={1} d="M10 14 L 54 44 M54 14 L 10 44" fill="none" stroke="currentColor" strokeWidth={1.2} />
    </svg>
  )
}

export function ScribbleCircleCheck({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 80 60" aria-hidden>
      <circle pathLength={1} cx="40" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth={2} />
      <polyline pathLength={1} points="30,30 37,38 52,20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

export function ScribbleCheck({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 80 60" aria-hidden>
      <path pathLength={1} d="M14 30 L 30 44 L 66 12" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

// ── Wireframes dos bastidores (exp_*) ────────────────────────────────────────

export function ScribbleBrowser({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 120 90" aria-hidden>
      <rect pathLength={1} x="14" y="14" width="92" height="62" rx="3" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <line pathLength={1} x1="14" y1="34" x2="106" y2="34" stroke="currentColor" strokeWidth={1.6} />
      <circle pathLength={1} cx="26" cy="24" r="4" fill="none" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  )
}

// Hub: nó central conectado a satélites — o "creative hub" dos bastidores.
export function ScribbleHub({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 120 90" aria-hidden>
      <circle pathLength={1} cx="60" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path
        pathLength={1}
        d="M50 38 L 30 24 M70 38 L 90 24 M50 52 L 30 66 M70 52 L 90 66"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <circle pathLength={1} cx="24" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <circle pathLength={1} cx="96" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <circle pathLength={1} cx="24" cy="70" r="6" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <circle pathLength={1} cx="96" cy="70" r="6" fill="none" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  )
}

// Placeholder de imagem (slot dos produtos, enquanto os shots reais não chegam).
export function ScribblePlaceholder({ className = '', style }: ScribbleProps) {
  return (
    <svg className={`lab-scribble ${className}`} style={style} viewBox="0 0 160 100" aria-hidden>
      <rect pathLength={1} x="10" y="10" width="140" height="80" rx="2" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path pathLength={1} d="M10 10 L 150 90 M150 10 L 10 90" fill="none" stroke="currentColor" strokeWidth={1} />
    </svg>
  )
}
