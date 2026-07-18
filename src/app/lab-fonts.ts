import localFont from 'next/font/local'

// Fontes exclusivas do dup.lab (/lab) — importadas SÓ pela página do lab, num
// módulo separado de fonts.ts de propósito: next/font injeta o preload das
// fontes em toda rota que importa o módulo, e Caveat/Spline não podem pesar
// nas outras páginas do site.

// Anotações à mão nas margens (nunca em bloco de texto — regra do DS do lab).
export const caveat = localFont({
  src: '../../public/fonts/Caveat-Variable.woff2',
  variable: '--font-caveat-loaded',
  display: 'swap',
  weight: '400 700',
  style: 'normal',
  // Caveat é caligráfica — métrica de Arial ajustada não aproxima nada útil.
  adjustFontFallback: false,
  fallback: ['cursive'],
})

// Labels técnicos, specs, IDs de experimento e status pills.
export const splineSansMono = localFont({
  src: '../../public/fonts/SplineSansMono-Variable.woff2',
  variable: '--font-spline-mono-loaded',
  display: 'swap',
  weight: '300 700',
  style: 'normal',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})
