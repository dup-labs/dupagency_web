import type { Metadata, Viewport } from 'next'
import './globals.css'
import { chillax, synonym } from './fonts'
import BackgroundLayer from '@/components/layout/BackgroundLayer'
import Nav from '@/components/layout/Nav'
import ScrollspyNav from '@/components/layout/ScrollspyNav'
import CustomCursor from '@/components/ui/CustomCursor'

export const metadata: Metadata = {
  metadataBase: new URL('https://dup.agency'),
  title: {
    default: 'dup.agency — tech para e-commerce, evolução sem sustos',
    template: '%s | dup.agency',
  },
  description:
    'A dup.agency cuida da tecnologia do seu e-commerce para você pensar no crescimento do negócio. Sem turnover e sem queda de qualidade.',
  keywords: [
    'agência VTEX',
    'parceiro técnico e-commerce',
    'desenvolvimento Shopify',
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
    locale: 'pt_BR',
    url: 'https://dup.agency',
    siteName: 'dup.agency',
    title: 'dup.agency — tech para e-commerce, evolução sem sustos',
    description: 'A estratégia é sua. A tech do seu e-commerce é com a gente.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'dup.agency — tech para e-commerce, evolução sem sustos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dup.agency — tech para e-commerce, evolução sem sustos',
    description: 'A estratégia é sua. A tech do seu e-commerce é com a gente.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://dup.agency' },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/images/apple-touch-icon.png', sizes: '180x180' },
    other: [
      { rel: 'icon', url: '/images/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/images/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0d0d',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://dup.agency/#organization',
      name: 'dup.agency',
      url: 'https://dup.agency',
      logo: 'https://dup.agency/logo.svg',
      foundingDate: '2021',
      description:
        'Agência boutique de tecnologia para e-commerce. Especialistas em VTEX, Shopify e Nuvemshop — assumindo a responsabilidade pela tech do cliente, sem turnover, com a mesma qualidade sempre.',
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
      knowsAbout: ['VTEX', 'Shopify', 'Nuvemshop', 'e-commerce', 'desenvolvimento web'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${chillax.variable} ${synonym.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        <BackgroundLayer>
          <CustomCursor />
          <Nav />
          <ScrollspyNav />
          <main className="relative z-10">{children}</main>
        </BackgroundLayer>
      </body>
    </html>
  )
}
