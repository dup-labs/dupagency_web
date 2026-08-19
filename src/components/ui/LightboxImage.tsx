'use client'

/**
 * Imagem com lightbox: clica, abre em tela cheia pra ver no detalhe (fecha no
 * X, no ESC ou clicando fora). Porte do componente da landing do portal
 * (dashboard/src/components/landing/LightboxImage.tsx) — o overlay vai via
 * portal pro <body> porque os blocos da página usam Reveal (transform), que
 * quebraria um position: fixed aninhado dentro deles.
 */

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { MagnifyingGlassPlusIcon, XIcon } from '@phosphor-icons/react'

export default function LightboxImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar: ${alt}`}
        className="group relative block w-full cursor-zoom-in border-0 bg-transparent p-0"
      >
        <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} />
        <span className="pointer-events-none absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 opacity-0 shadow-[0_2px_10px_rgba(13,13,13,0.18)] transition-opacity duration-200 group-hover:opacity-100">
          <MagnifyingGlassPlusIcon size={17} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
            className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(13,13,13,0.82)] p-5 backdrop-blur-sm max-[640px]:p-3"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute top-5 right-5 flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white/12 text-white transition-colors hover:bg-white/25"
            >
              <XIcon size={20} />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-[min(1480px,96vw)] overflow-auto rounded-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
            >
              <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
