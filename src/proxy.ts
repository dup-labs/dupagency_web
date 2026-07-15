import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Roda em tudo, menos: rotas de API, internos do Next/Vercel, o cartão de
  // visita digital (/card — fora do i18n, PT-BR fixo; ver src/app/card) e
  // qualquer arquivo com extensão (og-image.png, sitemap.xml, robots.txt...).
  matcher: ['/((?!api|card|_next|_vercel|.*\\..*).*)'],
}
