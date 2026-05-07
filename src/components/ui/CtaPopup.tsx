'use client'

import { useState, useEffect } from 'react'
import { Checks } from '@phosphor-icons/react'

export default function CtaPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes cta-slide-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position:       'fixed',
          bottom:         '28px',
          right:          '28px',
          zIndex:         200,
          width:          '209px',
          borderRadius:   '20px',
          background:     'rgba(255,255,255,0.38)',
          overflow:       'hidden',
          boxShadow:      '0 12px 40px rgba(0,0,0,0.22)',
          backdropFilter: 'blur(21px)',
          animation:      'cta-slide-in 0.35s ease forwards',
        }}
      >
        {/* texto */}
        <div style={{ padding: '24px 15px' }}>
          <p
            className="font-chillax"
            style={{
              margin:     0,
              fontSize:   '12px',
              lineHeight: 1.3,
              color:      '#0d0d0d',
              fontWeight: 400,
              textAlign:  'center',
            }}
          >
            Quer que a dup<strong>.agency</strong>,{' '}
            resolva isso pra você?
          </p>
        </div>

        {/* botão WhatsApp */}
        <a
          href="https://wa.me/5511973558096"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '10px',
            padding:         '11px 24px 15px',
            background:      '#0d0d0d',
            color:           '#ffffff',
            textDecoration:  'none',
            borderRadius:    '0 0 20px 20px',
          }}
        >
          <Checks size={18} color="#ffffff" weight="bold" />
          <span
            className="font-synonym"
            style={{
              fontSize:      '11px',
              fontWeight:    500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            Fale com a gente
          </span>
        </a>
      </div>
    </>
  )
}
