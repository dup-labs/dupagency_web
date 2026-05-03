import localFont from 'next/font/local'

// Variable fonts — usadas via CSS var (--font-chillax-loaded / --font-synonym-loaded)
// e referenciadas pelos tokens em @theme inline (globals.css).

export const chillax = localFont({
  src: '../../public/fonts/Chillax-Variable.woff2',
  variable: '--font-chillax-loaded',
  // 'optional' permite que o browser não bloqueie nem faça swap se a fonte
  // não chegar em ~100ms — combinado com adjustFontFallback (Arial ajustada
  // pras métricas da Chillax), o LCP renderiza imediato com fallback
  // visualmente próximo. Conexões rápidas pegam Chillax na primeira pintura.
  display: 'optional',
  weight: '200 700',
  style: 'normal',
  adjustFontFallback: 'Arial',
})

export const synonym = localFont({
  src: '../../public/fonts/Synonym-Variable.woff2',
  variable: '--font-synonym-loaded',
  display: 'swap',
  weight: '100 700',
  style: 'normal',
  adjustFontFallback: 'Arial',
})
