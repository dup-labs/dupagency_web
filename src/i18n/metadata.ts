import { getPathname } from './navigation'
import { routing, htmlLang, type Locale } from './routing'

// Monta `alternates` (canonical + hreflang) de uma página respeitando o
// localePrefix. Com 'as-needed', o pt fica sem prefixo (ex: '/'), en/es com
// ('/en', '/es'). Paths relativos — o metadataBase do layout resolve o domínio.
export function localizedAlternates(href: string, locale: Locale) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[htmlLang[l]] = getPathname({ href, locale: l })
  }
  languages['x-default'] = getPathname({ href, locale: routing.defaultLocale })

  return {
    canonical: getPathname({ href, locale }),
    languages,
  }
}

// Path localizado de um href (ex: pro og:url). Mesmo helper, sem hreflang.
export function localizedPath(href: string, locale: Locale) {
  return getPathname({ href, locale })
}
