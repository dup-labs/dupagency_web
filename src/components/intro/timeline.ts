// ─────────────────────────────────────────────────────────────────────────────
// RELÓGIO DA INTRO DO HERO — flow "logo central" (branch feat/hero-intro-logo)
// ─────────────────────────────────────────────────────────────────────────────
// Fonte única de verdade pro timing da animação de entrada (load-only).
// Cada beat tem um tempo ABSOLUTO `at` (segundos desde o play) — os componentes
// (LogoIntro, Nav, Hero) penduram seus tweens na master timeline nessas posições.
//
// Decupagem do flow LOGO — versão CINEMATOGRÁFICA (reveal do hero ~2,7s):
//   0.0       branco absoluto, SEM linhas, sem hero
//   0.2─2.05  stroke-draw do LOGO dup.agency no centro (dasharray) + ponto
//   2.2─2.6   ⭐ 3 faixas descem cobrindo o logo
//   ~2.68     swap SOB a cobertura: logo/cover saem, hero assume
//   2.8─3.6   faixas sobem revelando o HERO inteiro
//   3.6─4.0   logo + menu do header + scrollspy da direita em bounce/fade
//   3.9─4.9   "alguns clientes…" + logos dos clientes
//
// ⚡ PERF: o ganho de Lighthouse (LCP/TBT/CLS) veio do COVER-OVERLAY (IntroCover),
// NÃO do tempo da intro. Encurtar rende só ~2pts de Speed Index. Se um dia quiser
// a versão CURTA (reveal ~1,3s): logo { at:0.1, dur:0.9, stagger:0.045 } + PATH_DUR
// 0.45 no LogoIntro · tinta { at:0.95, enter:0.3, enterStagger:0.05, coverHold:0.06,
// exit:0.45, stagger:0.06, revealAt:0.95+0.3+0.04 } · navLogo 1.8 · navMenu 1.95 ·
// scrollspy 1.95 · clientsLabel 2.05 · clientsLogos { at:2.2, dur:0.45, stagger:0.14 }
// ─────────────────────────────────────────────────────────────────────────────

export const INTRO = {
  // Stroke-draw do logo dup.agency no centro (fundo branco). PATH_DUR no LogoIntro.
  logo: { at: 0.2, dur: 1.9, stagger: 0.13 },
  // Faixas de tinta: entram cobrindo (enter), seguram (coverHold), saem por baixo
  // (exit). No hold acontece o swap (logo/cover saem, hero entra sob a cobertura).
  tinta: {
    at: 2.2,
    enter: 0.42,
    enterStagger: 0.06,
    coverHold: 0.18,
    exit: 0.6,
    stagger: 0.08,
    revealAt: 2.2 + 0.42 + 0.06,
  },
  navLogo:      { at: 3.6, dur: 0.4 },
  navMenu:      { at: 3.8, dur: 0.4 },
  // Scrollspy fixa da direita: aparece junto com o menu do header (após o wipe).
  scrollspy:    { at: 3.8, dur: 0.5 },
  clientsLabel: { at: 3.9, dur: 0.3 },
  clientsLogos: { at: 4.1, dur: 0.5, stagger: 0.18 },
} as const

// As 3 faixas. Ordem/z (Bruno): roxo na frente, verde no meio, rosa no fundo.
// z maior sai primeiro. Sem rotação (wipe reto).
export const PAINT_BANDS = [
  { color: 'var(--purple-mid)', z: 30 }, // roxo (#897BBC) — frente
  { color: 'var(--teal-mint)',  z: 20 }, // verde (#AFD7D0) — meio
  // periwinkle: ponto médio teal↔roxo (meio do grad-01) — costura as 3, suave.
  { color: '#9CA9C6',           z: 10 }, // fundo
] as const

// Easing exato da referência: cubic-bezier(0.76, 0, 0.24, 1).
export const PAINT_EXIT_EASE = 'M0,0 C0.76,0 0.24,1 1,1'

// Chave do sessionStorage — marca que a intro já rodou nesta sessão (roda 1×).
export const INTRO_SESSION_KEY = 'dup-hero-intro'

// Easing padrão dos bounces da cena (back-out). Centralizado pra consistência.
export const INTRO_BOUNCE = 'back.out(1.7)'
