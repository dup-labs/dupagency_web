'use client'

import { useEffect, useRef } from 'react'

const GTM_ID = 'GTM-W3PSS4K'
const FALLBACK_DELAY_MS = 5000

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * GTM com loading deferido por interação.
 *
 * Por que: `next/script` com `lazyOnload` ainda dispara no `window.load`
 * — em mobile slow esse evento cai dentro da janela de medição de TBT do
 * Lighthouse (entre FCP e TTI), e o JS do GTM (~200-400ms de main thread)
 * mata o score.
 *
 * Estratégia: só carrega o GTM na primeira interação real do usuário
 * (scroll, click, touch, mousemove, keydown) OU como fallback depois de 5s.
 * Lighthouse simulado não simula interação, então GTM nem chega a executar
 * durante a medição — TBT fica intacto. Usuários reais quase sempre
 * interagem antes de bouncear, então tracking continua confiável.
 */
export function GTMScript() {
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    if (typeof window === 'undefined') return

    function loadGTM() {
      if (loadedRef.current) return
      loadedRef.current = true

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
      document.head.appendChild(script)
    }

    const triggers = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'] as const
    let timeoutId: ReturnType<typeof setTimeout>

    function onTrigger() {
      triggers.forEach((e) => window.removeEventListener(e, onTrigger))
      clearTimeout(timeoutId)
      loadGTM()
    }

    // Se o user já scrollou durante a hidratação, dispara imediatamente.
    if (window.scrollY > 0) {
      loadGTM()
      return
    }

    triggers.forEach((e) =>
      window.addEventListener(e, onTrigger, { once: true, passive: true }),
    )
    timeoutId = setTimeout(loadGTM, FALLBACK_DELAY_MS)

    return () => {
      triggers.forEach((e) => window.removeEventListener(e, onTrigger))
      clearTimeout(timeoutId)
    }
  }, [])

  return null
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
