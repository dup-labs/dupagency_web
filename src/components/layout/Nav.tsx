'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, getPathname } from '@/i18n/navigation'
import { routing, localeLabel } from '@/i18n/routing'
import { useBackgroundContext } from './BackgroundLayer'
import LabLogo from '@/components/ui/LabLogo'
import { useIntro } from '@/components/intro/IntroProvider'
import { INTRO, INTRO_BOUNCE } from '@/components/intro/timeline'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// Links de seção da home. `key` → home.nav.<key> (label); `hash` → âncora na
// home; `slug` → usado na lógica de hover. O href final recebe o prefixo do
// locale ativo em runtime (localePrefix: 'always').
const links = [
  { key: 'manifesto',   hash: '#manifesto',        slug: 'manifesto'   },
  { key: 'processo',    hash: '#como-trabalhamos', slug: 'processo'    },
  { key: 'servicos',    hash: '#servicos',         slug: 'servicos'    },
  { key: 'depoimentos', hash: '#depoimentos',      slug: 'depoimentos' },
  { key: 'faq',         hash: '#faq',              slug: 'faq'         },
  { key: 'contato',     hash: '#cta-final',        slug: 'contato'     },
]

const tools = [
  { key: 'geoAudit', path: '/ferramentas/geo-audit'        },
  { key: 'redirect', path: '/ferramentas/redirect-checker' },
]

// ícone fornecido pelo Bruno — download/save Phosphor
function ToolsChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity:    0.5,
        flexShrink: 0,
        marginLeft: '12px',
        transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
      }}
    >
      <path
        d="M28.9237 16.6175C28.8481 16.4348 28.72 16.2786 28.5555 16.1686C28.3911 16.0587 28.1978 16 28 16H23V9C23 8.73478 22.8946 8.48043 22.7071 8.29289C22.5196 8.10536 22.2652 8 22 8H9.99999C9.73478 8 9.48042 8.10536 9.29289 8.29289C9.10535 8.48043 8.99999 8.73478 8.99999 9V16H3.99999C3.8021 15.9998 3.60861 16.0584 3.44401 16.1683C3.27942 16.2782 3.15112 16.4344 3.07537 16.6172C2.99962 16.8 2.97981 17.0012 3.01846 17.1953C3.05712 17.3894 3.15248 17.5676 3.29249 17.7075L15.2925 29.7075C15.3854 29.8005 15.4957 29.8742 15.6171 29.9246C15.7385 29.9749 15.8686 30.0008 16 30.0008C16.1314 30.0008 16.2615 29.9749 16.3829 29.9246C16.5043 29.8742 16.6146 29.8005 16.7075 29.7075L28.7075 17.7075C28.8473 17.5676 28.9425 17.3893 28.981 17.1953C29.0195 17.0013 28.9995 16.8002 28.9237 16.6175ZM16 27.5863L6.41374 18H9.99999C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V10H21V17C21 17.2652 21.1054 17.5196 21.2929 17.7071C21.4804 17.8946 21.7348 18 22 18H25.5862L16 27.5863ZM8.99999 5C8.99999 4.73478 9.10535 4.48043 9.29289 4.29289C9.48042 4.10536 9.73478 4 9.99999 4H22C22.2652 4 22.5196 4.10536 22.7071 4.29289C22.8946 4.48043 23 4.73478 23 5C23 5.26522 22.8946 5.51957 22.7071 5.70711C22.5196 5.89464 22.2652 6 22 6H9.99999C9.73478 6 9.48042 5.89464 9.29289 5.70711C9.10535 5.51957 8.99999 5.26522 8.99999 5Z"
        fill="white"
      />
    </svg>
  )
}

// Troca de idioma preservando a página atual. usePathname (next-intl) já vem
// sem o prefixo de locale; getPathname reconstrói com o idioma escolhido.
//
// <a> e não <Link> de propósito: trocar de idioma muda o segmento [locale], e a
// navegação client-side re-renderizaria o root layout no cliente — onde o React
// encontra a <script> do gate da intro (que ele nunca executa nesse caminho) e
// joga um erro no console. Recarregar o documento é o comportamento correto de
// qualquer forma: o idioma troca html[lang], as mensagens e o gate da intro.
function LangSwitcher({ className = '', large = false }: { className?: string; large?: boolean }) {
  const pathname = usePathname()
  const active   = useLocale()
  const fontSize = large ? '20px' : '12px'
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span style={{ opacity: 0.3, fontSize }}>/</span>}
          <a
            href={getPathname({ href: pathname, locale: l })}
            hrefLang={l}
            className="font-synonym tracking-widest transition-opacity duration-200 hover:opacity-100"
            style={{
              fontSize,
              opacity:        l === active ? 1 : 0.45,
              textDecoration: 'none',
              color:          'inherit',
            }}
          >
            {localeLabel[l]}
          </a>
        </span>
      ))}
    </div>
  )
}

export default function Nav() {
  const { navTheme } = useBackgroundContext()
  const t            = useTranslations('home.nav')
  const locale       = useLocale()
  const pathname     = usePathname()

  const [open, setOpen]               = useState(false)
  const [hovered, setHovered]         = useState<string | null>(null)
  const [imageY, setImageY]           = useState(0)
  const [toolsOpen, setToolsOpen]     = useState(false)
  const [toolsDropdown, setToolsDropdown] = useState(false)
  const [portalDropdown, setPortalDropdown] = useState(false)
  const listRef                       = useRef<HTMLDivElement>(null)

  // Intro do hero — logo e menu caem do topo em bounce (beat ~2,3s). shouldPlay
  // só é true na home; fora dela o CSS não esconde e este effect não roda.
  const { shouldPlay, tl }  = useIntro()
  const logoRef             = useRef<HTMLAnchorElement>(null)
  const desktopMenuRef      = useRef<HTMLDivElement>(null)
  const mobileMenuRef       = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!shouldPlay || !tl || !logoRef.current) return
    const menu = [desktopMenuRef.current, mobileMenuRef.current].filter(Boolean) as HTMLElement[]
    tl.fromTo(
      logoRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: INTRO.navLogo.dur, ease: INTRO_BOUNCE },
      INTRO.navLogo.at,
    )
    if (menu.length) {
      tl.fromTo(
        menu,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: INTRO.navMenu.dur, ease: INTRO_BOUNCE },
        INTRO.navMenu.at,
      )
    }
    // Sem cleanup que reverta: a master timeline é dona dos tweens e é morta no
    // unmount do IntroProvider. Reverter aqui (re-render) reesconderia o Nav.
  }, [shouldPlay, tl])

  // pathname (next-intl) já vem sem o prefixo de idioma — '/' é a home.
  const isHome = pathname === '/'
  // No dup.lab o Nav é o mesmo do site, mas com o wordmark do lab no lugar do
  // logo e o item de menu invertido: aqui entra DUP.AGENCY, lá entra DUP.LAB.
  const isLab  = pathname === '/lab'
  const [scrolled, setScrolled] = useState(false)

  // Helpers de href com o prefixo do locale ativo.
  // getPathname respeita o localePrefix: pt sem prefixo, en/es com.
  const homeHref = getPathname({ href: '/', locale })
  const labHref  = getPathname({ href: '/lab', locale })
  const sectionHref = (hash: string) => `${homeHref}${hash}`
  const toolHref = (path: string) => getPathname({ href: path, locale })
  // "Quero conhecer" do dropdown PORTAL — landing pública em /portal, no
  // próprio site (deixou de apontar pro domínio externo portal.dup.agency).
  const portalHref = getPathname({ href: '/portal', locale })

  // Link cruzado dup.agency ↔ dup.lab (desktop e mobile).
  const crossLink = isLab
    ? { key: 'agency' as const, href: homeHref }
    : { key: 'lab' as const,    href: labHref  }

  useEffect(() => {
    if (isHome) return
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    if (!open) setToolsOpen(false)
  }, [open])

  const isDark    = navTheme === 'dark'
  const textColor = open || !isDark ? 'text-white' : 'text-black'

  // Glass da barra em páginas internas. Precisa acompanhar o tema da seção: as
  // ferramentas são sempre claras, mas a página de case alterna claro/escuro —
  // e um glass branco fixo deixaria o texto branco (tema escuro) ilegível.
  const glassStyle: React.CSSProperties = (!isHome && scrolled)
    ? isDark
      ? {
          background:           'rgba(255,255,255,0.85)',
          backdropFilter:       'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom:         '1px solid rgba(0,0,0,0.06)',
        }
      : {
          background:           'rgba(13,13,13,0.75)',
          backdropFilter:       'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom:         '1px solid rgba(255,255,255,0.08)',
        }
    : {}

  function handleMouseEnter(slug: string, e: React.MouseEvent<HTMLAnchorElement>) {
    setHovered(slug)
    const listTop = listRef.current?.getBoundingClientRect().top ?? 0
    const itemTop = e.currentTarget.getBoundingClientRect().top
    setImageY(itemTop - listTop)
  }

  // links sem o último (CONTATO) — FERRAMENTAS entra antes dele
  const mainLinks   = links.slice(0, -1)
  const contatoLink = links[links.length - 1]

  function handleDepoimentosClick(e: React.MouseEvent) {
    e.preventDefault()
    setOpen(false)
    if (!isHome) {
      window.location.href = `${homeHref}#depoimentos`
      return
    }
    const dep = ScrollTrigger.getAll().find(
      (st) => (st.trigger as HTMLElement | null)?.id === 'depoimentos',
    )
    window.scrollTo({ top: dep ? dep.end : 0, behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 transition-colors duration-300 ${textColor}`}
        style={glassStyle}
      >
        <a
          ref={logoRef}
          href={isLab ? labHref : homeHref}
          className="intro-hide flex items-center font-chillax"
          style={{ fontSize: '24px', lineHeight: 1 }}
        >
          {isLab ? (
            <LabLogo height={24} />
          ) : (
            <>
              <span className="font-light tracking-tight">dup</span>
              <span className="font-medium tracking-tight">.agency</span>
            </>
          )}
        </a>

        {/* Desktop: links + dropdown — visíveis só em lg+ */}
        <div ref={desktopMenuRef} className="intro-hide hidden lg:flex items-center gap-8">
          {(['servicos', 'depoimentos'] as const).map((slug) => {
            const link = links.find((l) => l.slug === slug)!
            return (
              <a
                key={slug}
                href={sectionHref(link.hash)}
                onClick={slug === 'depoimentos' ? handleDepoimentosClick : undefined}
                className="font-synonym font-normal tracking-widest transition-opacity duration-200 opacity-70 hover:opacity-100"
                style={{ fontSize: '12px', textDecoration: 'none', color: 'inherit' }}
              >
                {t(link.key)}
              </a>
            )
          })}

          {/* Link cruzado dup.agency ↔ dup.lab */}
          <a
            href={crossLink.href}
            className="font-synonym font-normal tracking-widest transition-opacity duration-200 opacity-70 hover:opacity-100"
            style={{ fontSize: '12px', textDecoration: 'none', color: 'inherit' }}
          >
            {t(crossLink.key)}
          </a>

          {/* Ferramentas dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdown(true)}
            onMouseLeave={() => setToolsDropdown(false)}
          >
          <button
            className="font-synonym font-normal tracking-widest transition-opacity duration-200 opacity-70 hover:opacity-100"
            style={{ fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '4px 0' }}
          >
            {t('ferramentas')}
          </button>

          {/* wrapper transparente — preenche o gap pra não perder o hover */}
          <div
            style={{
              position:      'absolute',
              top:           '100%',
              right:         0,
              paddingTop:    '10px',
              minWidth:      '220px',
              opacity:       toolsDropdown ? 1 : 0,
              transform:     toolsDropdown ? 'translateY(0)' : 'translateY(-6px)',
              pointerEvents: toolsDropdown ? 'auto' : 'none',
              transition:    'opacity 0.18s ease, transform 0.18s ease',
            }}
          >
          <div
            style={{
              background:           'rgba(255,255,255,0.96)',
              backdropFilter:       'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius:         '12px',
              border:               '1px solid rgba(0,0,0,0.08)',
              boxShadow:            '0 8px 32px rgba(0,0,0,0.12)',
              overflow:             'hidden',
            }}
          >
            {tools.map((tool, i) => (
              <a
                key={tool.path}
                href={toolHref(tool.path)}
                className="font-synonym"
                style={{
                  display:        'block',
                  padding:        '13px 18px',
                  fontSize:       '13px',
                  color:          '#0d0d0d',
                  textDecoration: 'none',
                  letterSpacing:  '0.02em',
                  borderBottom:   i < tools.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {t(`tools.${tool.key}`)}
              </a>
            ))}
          </div>
          </div>
        </div>

          {/* CONTATO */}
          <a
            href={sectionHref(contatoLink.hash)}
            className="font-synonym font-normal tracking-widest transition-opacity duration-200 opacity-70 hover:opacity-100"
            style={{ fontSize: '12px', textDecoration: 'none', color: 'inherit' }}
          >
            {t(contatoLink.key)}
          </a>

          {/* PORTAL — pill com dropdown: parceiro entra, curioso conhece */}
          <div
            className="relative"
            onMouseEnter={() => setPortalDropdown(true)}
            onMouseLeave={() => setPortalDropdown(false)}
          >
            <button
              className="font-synonym font-normal tracking-widest text-white transition-opacity duration-200 hover:opacity-85"
              style={{
                fontSize:     '12px',
                background:   'var(--grad-01)',
                border:       'none',
                cursor:       'pointer',
                borderRadius: 'var(--radius-pill)',
                padding:      '8px 18px',
              }}
            >
              {t('portal')}
            </button>

            {/* wrapper transparente — preenche o gap pra não perder o hover */}
            <div
              style={{
                position:      'absolute',
                top:           '100%',
                right:         0,
                paddingTop:    '10px',
                minWidth:      '200px',
                opacity:       portalDropdown ? 1 : 0,
                transform:     portalDropdown ? 'translateY(0)' : 'translateY(-6px)',
                pointerEvents: portalDropdown ? 'auto' : 'none',
                transition:    'opacity 0.18s ease, transform 0.18s ease',
              }}
            >
              <div
                style={{
                  background:           'rgba(255,255,255,0.96)',
                  backdropFilter:       'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius:         '12px',
                  border:               '1px solid rgba(0,0,0,0.08)',
                  boxShadow:            '0 8px 32px rgba(0,0,0,0.12)',
                  overflow:             'hidden',
                }}
              >
                {[
                  { href: 'https://portal.dup.agency/login', label: t('portalParceiro'), border: true },
                  { href: portalHref,                        label: t('portalConhecer'), border: false },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="font-synonym"
                    style={{
                      display:        'block',
                      padding:        '13px 18px',
                      fontSize:       '13px',
                      letterSpacing:  '0.02em',
                      color:          '#0d0d0d',
                      textDecoration: 'none',
                      borderBottom:   item.border ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      transition:     'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Separador + seletor de idioma */}
          <span style={{ width: 1, height: 14, background: 'currentColor', opacity: 0.25 }} />
          <LangSwitcher />
        </div>

        {/* Mobile: só o botão [ menu ] — o seletor de idioma vive dentro do
            menu (overlay), com bom alvo de toque e sem espremer a barra. */}
        <button
          ref={mobileMenuRef}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('close') : t('menu')}
          className="intro-hide lg:hidden font-synonym font-normal tracking-widest transition-opacity duration-200 opacity-70 hover:opacity-100"
          style={{ fontSize: '12px' }}
        >
          {open ? t('close') : t('menu')}
        </button>
      </nav>

      {/* Overlay full-screen — mobile/tablet */}
      <div
        className="lg:hidden fixed inset-0 z-40 flex flex-col justify-start transition-all duration-400 ease-out"
        style={{
          ...(open ? {
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          } : {}),
          background:    open ? 'rgba(13,13,13,0.7)' : 'rgba(13,13,13,0)',
          pointerEvents: open ? 'auto' : 'none',
          opacity:       open ? 1 : 0,
        }}
      >
        <div
          ref={listRef}
          className="relative flex flex-col px-4 md:px-12"
          style={{ paddingTop: 80 }}
        >
          {/* Links principais (sem CONTATO) */}
          {mainLinks.map((link, i) => (
            <a
              key={link.key}
              href={sectionHref(link.hash)}
              onClick={link.slug === 'depoimentos' ? handleDepoimentosClick : () => setOpen(false)}
              onMouseEnter={(e) => handleMouseEnter(link.slug, e)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center font-chillax font-bold text-white uppercase py-2"
              style={{
                fontSize:       'clamp(28px, 5vw, 56px)',
                borderBottom:   '1px solid rgba(255,255,255,0.10)',
                opacity:        open ? 1 : 0,
                transform:      open ? 'translateY(0)' : 'translateY(20px)',
                transition:     `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s, letter-spacing 0.3s ease`,
                textDecoration: 'none',
                letterSpacing:  hovered === link.slug ? '0.05em' : '0em',
              }}
            >
              {t(link.key)}
            </a>
          ))}

          {/* Link cruzado dup.agency ↔ dup.lab */}
          <a
            href={crossLink.href}
            onClick={() => setOpen(false)}
            className="flex items-center font-chillax font-bold text-white uppercase py-2"
            style={{
              fontSize:       'clamp(28px, 5vw, 56px)',
              borderBottom:   '1px solid rgba(255,255,255,0.10)',
              opacity:        open ? 1 : 0,
              transform:      open ? 'translateY(0)' : 'translateY(20px)',
              transition:     `opacity 0.35s ease ${mainLinks.length * 0.06}s, transform 0.35s ease ${mainLinks.length * 0.06}s`,
              textDecoration: 'none',
            }}
          >
            {t(crossLink.key)}
          </a>

          {/* Ferramentas — accordion (antes do CONTATO) */}
          <div
            style={{
              opacity:      open ? 1 : 0,
              transform:    open ? 'translateY(0)' : 'translateY(20px)',
              transition:   `opacity 0.35s ease ${(mainLinks.length + 1) * 0.06}s, transform 0.35s ease ${(mainLinks.length + 1) * 0.06}s`,
              borderBottom: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <button
              onClick={() => setToolsOpen((v) => !v)}
              className="font-chillax font-bold text-white uppercase"
              style={{
                fontSize:       'clamp(28px, 5vw, 56px)',
                letterSpacing:  '0em',
                background:     'none',
                border:         'none',
                cursor:         'pointer',
                width:          '100%',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '8px 0',
                textAlign:      'left',
              }}
            >
              {t('ferramentas')}
              <ToolsChevron open={toolsOpen} />
            </button>

            <div
              style={{
                overflow:   'hidden',
                maxHeight:  toolsOpen ? '160px' : '0',
                transition: 'max-height 0.3s ease',
              }}
            >
              {tools.map((tool) => (
                <a
                  key={tool.path}
                  href={toolHref(tool.path)}
                  onClick={() => setOpen(false)}
                  className="font-synonym text-white"
                  style={{
                    display:        'block',
                    padding:        '10px 0 10px 16px',
                    fontSize:       '16px',
                    letterSpacing:  '0.04em',
                    textDecoration: 'none',
                    opacity:        0.75,
                    borderTop:      '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {t(`tools.${tool.key}`)}
                </a>
              ))}
            </div>
          </div>

          {/* CONTATO — último item */}
          <a
            href={sectionHref(contatoLink.hash)}
            onClick={() => setOpen(false)}
            onMouseEnter={(e) => handleMouseEnter(contatoLink.slug, e)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center font-chillax font-bold text-white uppercase py-2"
            style={{
              fontSize:       'clamp(28px, 5vw, 56px)',
              borderBottom:   '1px solid rgba(255,255,255,0.10)',
              opacity:        open ? 1 : 0,
              transform:      open ? 'translateY(0)' : 'translateY(20px)',
              transition:     `opacity 0.35s ease ${(mainLinks.length + 2) * 0.06}s, transform 0.35s ease ${(mainLinks.length + 2) * 0.06}s, letter-spacing 0.3s ease`,
              textDecoration: 'none',
              letterSpacing:  hovered === contatoLink.slug ? '0.05em' : '0em',
            }}
          >
            {t(contatoLink.key)}
          </a>

          {/* PORTAL — botão pill com o gradiente principal */}
          <div
            style={{
              paddingTop: '28px',
              opacity:    open ? 1 : 0,
              transform:  open ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.35s ease ${(mainLinks.length + 3) * 0.06}s, transform 0.35s ease ${(mainLinks.length + 3) * 0.06}s`,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href="https://portal.dup.agency/login"
                onClick={() => setOpen(false)}
                className="inline-flex font-synonym tracking-widest text-white"
                style={{
                  fontSize:       '14px',
                  textDecoration: 'none',
                  background:     'var(--grad-01)',
                  borderRadius:   'var(--radius-pill)',
                  padding:        '14px 32px',
                }}
              >
                {t('portalParceiro')}
              </a>
              <a
                href={portalHref}
                onClick={() => setOpen(false)}
                className="inline-flex font-synonym tracking-widest text-white"
                style={{
                  fontSize:       '14px',
                  textDecoration: 'none',
                  border:         '1px solid rgba(255,255,255,0.4)',
                  borderRadius:   'var(--radius-pill)',
                  padding:        '14px 32px',
                }}
              >
                {t('portalConhecer')}
              </a>
            </div>
          </div>

          {/* Seletor de idioma — dentro do menu mobile, grande e tocável */}
          <div
            className="text-white"
            style={{
              paddingTop: '32px',
              opacity:    open ? 1 : 0,
              transform:  open ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.35s ease ${(mainLinks.length + 4) * 0.06}s, transform 0.35s ease ${(mainLinks.length + 4) * 0.06}s`,
            }}
          >
            <LangSwitcher large />
          </div>

          {/* Imagem hover */}
          <div
            className="absolute pointer-events-none"
            style={{
              right:      '8%',
              top:        imageY,
              width:      240,
              height:     160,
              opacity:    hovered ? 1 : 0,
              transform:  'translateY(-30%) rotate(-4deg)',
              transition: 'opacity 0.25s ease, top 0.15s ease',
              zIndex:     20,
            }}
          >
            {links.map((link) => (
              <div
                key={link.slug}
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  opacity:    hovered === link.slug ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  background: 'rgba(255,255,255,0.06)',
                  border:     '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-chillax text-white opacity-20 uppercase" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>
                    {t(link.key)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
