import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Roda em tudo, menos: rotas de API, internos do Next/Vercel, o cartão de
  // visita digital (/card — fora do i18n, PT-BR fixo; ver src/app/card), os
  // decks de aula (/emcj — HTML estático em public/, fora do i18n e noindex;
  // ver next.config.ts) e qualquer arquivo com extensão (og-image.png,
  // sitemap.xml, robots.txt...).
  //
  // /emcj precisa constar aqui porque a URL limpa (/emcj/papo-01, sem extensão)
  // NÃO casa com a exclusão `.*\..*`. Sem isto o next-intl redirecionaria pro
  // locale e a rota viraria 404.
  matcher: ['/((?!api|card|emcj|_next|_vercel|.*\\..*).*)'],
}
