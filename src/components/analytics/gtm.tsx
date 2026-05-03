'use client'

import Script from 'next/script'

const GTM_ID = 'GTM-W3PSS4K'

export function GTMScript() {
  return (
    <Script
      id="gtm-script"
      // lazyOnload: GTM só carrega depois do `window.load`, sem afetar
      // LCP/TBT/Speed Index. Trade-off: usuários que bouncearem em <2s
      // não são tracked — aceitável já que provavelmente não converteriam.
      // Mantém compatibilidade total com Clarity / GA4 / Meta Pixel
      // quando você empilhar essas tags dentro do GTM (Partytown teria
      // problema com session replay do Clarity).
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  )
}

export function GTMNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}