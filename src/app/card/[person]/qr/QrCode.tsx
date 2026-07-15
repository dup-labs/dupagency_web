'use client'

import { QRCodeSVG } from 'qrcode.react'

// Client component mínimo: qrcode.react desenha o QR como <svg> no navegador.
// Zero rede, zero serviço externo — o QR é só a URL codificada em pixels.
export default function QrCode({ url }: { url: string }) {
  return (
    <QRCodeSVG
      value={url}
      size={512}
      bgColor="#ffffff"
      fgColor="#0d0d0d"
      level="M"
      marginSize={2}
      className="w-full h-auto"
      aria-label={`QR code para ${url}`}
    />
  )
}
