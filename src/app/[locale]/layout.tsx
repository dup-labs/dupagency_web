import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import '../globals.css'
import { chillax, synonym } from '../fonts'
import { routing, htmlLang, ogLocale, type Locale } from '@/i18n/routing'
import { localizedPath } from '@/i18n/metadata'
import BackgroundLayer from '@/components/layout/BackgroundLayer'
import Nav from '@/components/layout/Nav'
import ScrollspyNav from '@/components/layout/ScrollspyNav'
import CustomCursor from '@/components/ui/CustomCursor'
import IntroProvider from '@/components/intro/IntroProvider'
import { GTMScript, GTMNoScript } from '@/components/analytics/gtm'

const BASE_URL = 'https://dup.agency'

// Decide ANTES da pintura se a intro do hero roda, setando html[data-intro].
// O CSS (globals) usa esse atributo pra esconder os alvos .intro-hide sem flash;
// o IntroProvider lê o atributo no client. Critérios:
//   · DEV: roda sempre na home (F5 basta — sem limpar sessão nem usar ?intro=1).
//   · PROD: só na home, respeita prefers-reduced-motion, 1×/sessão
//     (sessionStorage 'dup-hero-intro' — ver INTRO_SESSION_KEY).
//   · ?intro=1: override total, força em qualquer caso.
const introAlwaysInDev = process.env.NODE_ENV !== 'production'
const introDecisionScript = `(function(){try{
var p=location.pathname.replace(/\\/+$/,'');
var home=p===''||p==='/en'||p==='/es';
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var forced=location.search.indexOf('intro=1')!==-1;
var played=false;try{played=sessionStorage.getItem('dup-hero-intro')==='1'}catch(e){}
var play=forced||(home&&(${introAlwaysInDev}||(!reduce&&!played)));
document.documentElement.setAttribute('data-intro',play?'play':'done');
}catch(e){document.documentElement.setAttribute('data-intro','done')}})();`

// Pré-gera as 3 rotas de locale em build time (SSG por idioma).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// Metadata por idioma: title/description traduzidos + hreflang apontando pra
// cada versão. Mudar o default em routing.ts ajusta o x-default sozinho.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  return {
    metadataBase: new URL(`${BASE_URL}/`),
    title: { default: t('title'), template: '%s | dup.agency' },
    description: t('description'),
    keywords: [
      'agência VTEX',
      'parceiro técnico e-commerce',
      'Nuvemshop sênior',
      'consultoria e-commerce',
      'agência boutique e-commerce',
      'evolução contínua loja virtual',
      'implantação VTEX',
    ],
    authors: [
      { name: 'Bruno Dup', url: 'https://www.linkedin.com/in/brunodup/' },
      { name: 'Larissa Carvalho', url: 'https://www.linkedin.com/in/larissa-de-carvalho-silva-584382109/' },
    ],
    creator: 'dup.agency',
    openGraph: {
      type: 'website',
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      url: `${BASE_URL}${localizedPath('/', locale)}`,
      siteName: 'dup.agency',
      title: t('title'),
      description: t('ogDescription'),
      images: [
        { url: '/og-image.png', width: 1200, height: 630, alt: t('title') },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('twitterDescription'),
      images: ['/og-image.png'],
    },
    // alternates (canonical + hreflang) NÃO ficam aqui de propósito: o layout
    // é compartilhado por todas as páginas, e um canonical da home vazaria pras
    // ferramentas. Cada página define o seu próprio (ver page.tsx de cada rota).
    robots: { index: true, follow: true },
    // Ícones via convenção do App Router: src/app/icon.png (gera favicon) e
    // src/app/apple-icon.png (gera apple-touch-icon). Next.js injeta as <link>
    // tags automaticamente — sem precisar declarar aqui.
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Definido pra light + dark explicitamente. Safari iOS senão pode aplicar
  // tinting dinâmico baseado no conteúdo da página (puxa cores do gradiente
  // do hero pro URL bar inferior).
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d0d0d' },
    { media: '(prefers-color-scheme: dark)',  color: '#0d0d0d' },
  ],
  colorScheme: 'light',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://dup.agency/#organization',
      name: 'dup.agency',
      url: 'https://dup.agency/',
      logo: 'https://dup.agency/logo.svg',
      foundingDate: '2021',
      description:
        'Agência boutique de tecnologia para e-commerce. Especialistas em VTEX e Nuvemshop — assumindo a responsabilidade pela tech do cliente, sem turnover, com a mesma qualidade sempre.',
      sameAs: [
        'https://www.linkedin.com/company/dupagency/',
        'https://www.instagram.com/dup.agency',
      ],
      founder: [
        {
          '@type': 'Person',
          '@id': 'https://dup.agency/#bruno',
          name: 'Bruno Dup',
          jobTitle:
            'Fundador, criativo de formação e desenvolvedor sênior. Especialista em e-commerce',
          url: 'https://dup.agency/sobre',
          sameAs: ['https://www.linkedin.com/in/brunodup/'],
        },
        {
          '@type': 'Person',
          '@id': 'https://dup.agency/#larissa',
          name: 'Larissa Carvalho',
          jobTitle:
            'Co-fundadora, especialista VTEX e desenvolvedora front-end e responsável pela tecnologia e processos da operação',
          url: 'https://dup.agency/sobre',
          sameAs: ['https://www.linkedin.com/in/larissa-de-carvalho-silva-584382109/'],
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'dup@dup.agency',
        contactType: 'customer service',
        availableLanguage: 'Portuguese',
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://dup.agency/#service',
      name: 'dup.agency',
      provider: { '@id': 'https://dup.agency/#organization' },
      areaServed: 'BR',
      priceRange: '$$$$',
      serviceType: 'Desenvolvimento e consultoria para e-commerce',
      knowsAbout: ['VTEX', 'Nuvemshop', 'e-commerce', 'desenvolvimento web'],
    },
    {
      '@type': 'Service',
      name: 'Evolução Contínua',
      provider: { '@id': 'https://dup.agency/#organization' },
      description:
        'Parceria técnica mensal para lojas que querem crescer com consistência. A dup entra como time técnico da operação — priorizando, executando e mantendo a tech funcionando enquanto o cliente foca no negócio.',
      serviceType: 'Retainer de desenvolvimento e-commerce',
    },
    {
      '@type': 'Service',
      name: 'Projeto de Implantação',
      provider: { '@id': 'https://dup.agency/#organization' },
      description:
        'Para quem quer construir uma loja do zero, migrar de plataforma ou reestruturar com arquitetura pensada. Escopo fechado, prazo definido e um sênior tocando do início ao fim.',
      serviceType: 'Implementação de e-commerce',
    },
    {
      '@type': 'Service',
      name: 'Blueprint de Projeto',
      provider: { '@id': 'https://dup.agency/#organization' },
      description:
        'Imersão de 2 horas no projeto seguida de um documento completo: recursos nativos, customizações necessárias, regras de negócio mapeadas e riscos identificados. Visão sênior pra quem ainda não tem orçamento de implantação.',
      serviceType: 'Consultoria e escopo de e-commerce',
    },
    {
      '@type': 'Service',
      name: 'Consultoria Estratégica VTEX',
      provider: { '@id': 'https://dup.agency/#organization' },
      description:
        'Para quem já tem agência mas precisa de visão sênior pra decidir o que executar, em que ordem e com quais riscos. A dup organiza o backlog, valida escopo e garante que a tecnologia vai na direção certa — sem substituir o time atual.',
      serviceType: 'Consultoria VTEX',
    },
  ],
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Habilita render estático deste segmento e carrega as mensagens do idioma
  // ativo pro provider (client components leem via useTranslations).
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={htmlLang[locale]}
      className={`${chillax.variable} ${synonym.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Decisão da intro do hero — roda síncrono, antes da pintura, pra
            travar o estado inicial (data-intro) sem flash de conteúdo. */}
        <script dangerouslySetInnerHTML={{ __html: introDecisionScript }} />
        {/* Reforço do theme-color pra Safari iOS — explícito pelos dois
            schemes pra cobrir tinting dinâmico do URL bar. */}
        <meta name="theme-color" content="#0d0d0d" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* DNS prefetch pros origins de analytics — GTM carrega via
            lazyOnload, então isso adianta só a resolução DNS sem custo. */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GTMScript />
      </head>
      <body className="min-h-screen">
        <GTMNoScript />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BackgroundLayer>
            <CustomCursor />
            <IntroProvider>
              <Nav />
              <ScrollspyNav />
              <main className="relative z-10">{children}</main>
            </IntroProvider>
          </BackgroundLayer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
