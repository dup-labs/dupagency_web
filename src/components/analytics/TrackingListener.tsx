'use client'

import { useEffect } from 'react'
import { track, getPageContext, openCalendly, isCalendlyHref, type CtaType } from '@/lib/tracking'

function ctaTypeOf(a: HTMLAnchorElement): CtaType | null {
  const declared = a.dataset.cta
  if (declared === 'schedule' || declared === 'whatsapp' || declared === 'email') return declared
  const href = a.href || ''
  if (isCalendlyHref(href)) return 'schedule'
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'whatsapp'
  if (href.startsWith('mailto:')) return 'email'
  return null
}

/**
 * Listener central: um só lugar liga CTAs ao dataLayer.
 * - Qualquer <a> com data-cta (ou link Calendly / wa.me / mailto:) dispara cta_click.
 * - data-cta-location="secao" nomeia o local; sem ele usa o id da <section> mais próxima.
 * - Link do Calendly abre o popup oficial (com UTMs) em vez de sair do site;
 *   o evento calendly.event_scheduled vira schedule_call.
 */
export default function TrackingListener() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a) return
      const type = ctaTypeOf(a)
      if (!type) return

      const ctx = getPageContext()
      const loc =
        a.dataset.ctaLocation ||
        a.closest('section[id]')?.id ||
        a.closest('footer') && 'footer' ||
        a.id ||
        'desconhecido'
      track('cta_click', { cta_type: type, cta_location: loc, ...ctx })

      // Calendly em popup. Respeita ctrl/cmd/shift/meio-clique (abrir em aba).
      if (type === 'schedule' && isCalendlyHref(a.href)) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        void openCalendly(a.href)
      }
    }

    function onMessage(e: MessageEvent) {
      if (e.origin !== 'https://calendly.com') return
      if (e.data?.event !== 'calendly.event_scheduled') return
      track('schedule_call', getPageContext())
    }

    document.addEventListener('click', onClick)
    window.addEventListener('message', onMessage)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return null
}
