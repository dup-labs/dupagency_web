// ─────────────────────────────────────────────────────────────────────────────
// RELÓGIO DA INTRO DO HERO
// ─────────────────────────────────────────────────────────────────────────────
// Fonte única de verdade pro timing da animação de entrada (load-only, ~3,3s).
// Cada beat tem um tempo ABSOLUTO `at` (segundos desde o play) — os componentes
// (Nav, Hero) penduram seus tweens na master timeline nessas posições. Mexer no
// relógio aqui reorquestra a cena inteira sem caçar número no meio do código.
//
// Decupagem aprovada com o Bruno (~3,9s):
//   0.0─0.9  stroke-draw  Clareza · Segurança · Paz Operacional   (Fase 2, vetores)
//   0.3─1.2  grid lines descem  (scaleY top→bottom)               (Fase 4)
//   0.9─1.4  conectoras bounce  E · para quem precisa · de         (Fase 4)
//   1.3─1.6  subtexto fade-up                                      (Fase 4)
//   1.6─2.9  ⭐ 3 faixas descem cobrindo → palavras viram fill →   (Fase 3)
//            faixas saem por baixo (stagger 80ms) revelando pintado
//   2.9─3.3  logo + menu bounce (gap ~200ms)                       (Fase 4)
//   3.2─3.5  "alguns clientes…" fade                               (Fase 4)
//   3.4─3.9  logos dos clientes sobem em bounce (~180ms entre)     (Fase 4)
// ─────────────────────────────────────────────────────────────────────────────

export const INTRO = {
  stroke:       { at: 0.0, dur: 0.9, stagger: 0.12 },
  grid:         { at: 0.3, dur: 0.4, stagger: 0.06 },
  conectoras:   { at: 0.9, dur: 0.5, stagger: 0.10 },
  subtexto:     { at: 1.3, dur: 0.4 },
  // Faixas de tinta (poetic.com): entram cobrindo (enter), seguram (coverHold)
  // — é durante o hold que as palavras viram preenchido —, saem por baixo (exit)
  // com stagger de 80ms e o easing exato da referência.
  tinta: {
    at: 1.6,
    enter: 0.42,
    enterStagger: 0.06,
    coverHold: 0.12,
    exit: 0.6,
    stagger: 0.08,
    paintAt: 1.6 + 0.42 + 0.04, // pintura das palavras: logo após cobrir
  },
  navLogo:      { at: 2.9, dur: 0.4 },
  navMenu:      { at: 3.1, dur: 0.4 },
  clientsLabel: { at: 3.2, dur: 0.3 },
  clientsLogos: { at: 3.4, dur: 0.5, stagger: 0.18 },
} as const

// Cores das 3 faixas (referência poetic.com). z maior sai primeiro.
export const PAINT_BANDS = [
  { color: 'var(--purple-vivid)', z: 30 }, // #AD61C2
  { color: 'var(--purple-mid)',   z: 20 }, // #897BBC
  { color: 'var(--teal-mint)',    z: 10 }, // #AFD7D0
] as const

// Easing exato da referência: cubic-bezier(0.76, 0, 0.24, 1).
export const PAINT_EXIT_EASE = 'M0,0 C0.76,0 0.24,1 1,1'

// Chave do sessionStorage — marca que a intro já rodou nesta sessão (roda 1×).
export const INTRO_SESSION_KEY = 'dup-hero-intro'

// Easing padrão dos bounces da cena (back-out). Centralizado pra consistência.
export const INTRO_BOUNCE = 'back.out(1.7)'
