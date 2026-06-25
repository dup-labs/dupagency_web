import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Roda em tudo, menos: rotas de API, internos do Next/Vercel e qualquer
  // arquivo com extensão (og-image.png, sitemap.xml, robots.txt, fontes...).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
