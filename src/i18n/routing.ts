import { defineRouting } from 'next-intl/routing'

// ─────────────────────────────────────────────────────────────────────────────
// Fonte única de verdade da i18n. Mudar o idioma padrão do site = trocar
// `defaultLocale` aqui (e só aqui).
//
// `localePrefix: 'as-needed'` → o idioma PADRÃO (pt) fica SEM prefixo
// (dup.agency = home em português) e só os demais ganham prefixo (/en, /es).
// Por isso os links internos usam o helper `getPathname` do next-intl, que
// sabe quando colocar o prefixo ou não — nunca prefixe o locale na mão.
// ─────────────────────────────────────────────────────────────────────────────

export const routing = defineRouting({
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'pt',
  localePrefix: 'as-needed',
  // Sem detecção por Accept-Language: entrar em dup.agency (/) SEMPRE serve o
  // defaultLocale (pt), independente do idioma do navegador. O usuário troca de
  // idioma só pelo seletor do Nav.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

// Mapas auxiliares: o code do locale na URL é curto (`pt`), mas html lang e
// Open Graph precisam da forma completa.
export const htmlLang: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
}

export const ogLocale: Record<Locale, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
}

// Rótulos pro seletor de idioma.
export const localeLabel: Record<Locale, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
}
