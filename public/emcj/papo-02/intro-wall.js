// ─────────────────────────────────────────────────────────────────────────────
// <intro-wall> — as faixas de tinta do dup.agency como TRANSIÇÃO entre slides.
// ─────────────────────────────────────────────────────────────────────────────
// Porte do beat da tinta do site (src/components/intro/PaintPanels.tsx) para um
// web component autônomo, sem React e sem GSAP — Web Animations API pura, pra
// não pendurar dependência nenhuma no deck.
//
// A ideia central é a mesma do loader do site: a troca acontece SOB a cobertura.
//   0.0 ─ 0.54  as 3 faixas DESCEM cobrindo o slide ANTERIOR (trás→frente)
//   0.48        swap invisível: o deck avança pro slide deste <intro-wall>
//   0.6 ─ 1.36  as faixas SAEM por baixo (frente→trás), revelando o slide novo
//
// Quem vê: as barras entram por cima do slide 2 e, quando saem, já é o slide 3.
// Ninguém vê o corte — ele acontece no escuro, atrás da tinta.
//
// ⚠️ POR QUE UM OVERLAY EM document.body, e não dentro do <section>:
// o deck-stage mantém os slides não-ativos com `visibility:hidden`. Um elemento
// que more dentro do slide 3 só existe visualmente DEPOIS que o slide 3 já é o
// ativo — ou seja, ele jamais conseguiria cobrir o slide 2. Por isso o host aqui
// é só uma ÂNCORA (display:none) que diz "eu pertenço a este slide", e a tinta
// de verdade vive num overlay `position:fixed` pendurado no <body>.
//
// Como dispara: interceptando a navegação PRA FRENTE quando o slide ativo é o
// anterior ao nosso. O deck-stage escuta keydown na window em bubble; nós
// escutamos em CAPTURE, que roda antes — daí dá pra segurar o avanço, rodar a
// entrada da tinta, e só então deixar o deck trocar de slide.
//
// Timings e cores vêm de timeline.ts do site (INTRO.tinta / PAINT_BANDS); os
// easings do GSAP viraram os cubic-bezier equivalentes (ver EASE abaixo).
//
// Uso: <intro-wall> como último filho do <section> que deve ser REVELADO.
//   <section data-label="Contato"> … <intro-wall></intro-wall> </section>
// Opcional: `data-with-logo` toca o stroke-draw do logo sobre fundo branco antes
// da tinta (o loader completo do site). Sem ele, só a wall — que é o padrão,
// porque o fundo branco do logo apagaria o slide anterior antes da hora.
// ─────────────────────────────────────────────────────────────────────────────

(() => {
  'use strict'

  if (customElements.get('intro-wall')) return

  // ── Vetor do logo — cópia de src/components/intro/logoVector.ts (v2) ────────
  // Monoline: cada traço é um path ABERTO desenhado via dasharray. O único
  // elemento preenchido é o "." de dup.agency, que entra com fade no fim.
  const LOGO = {
    viewBox: '0 0 216 36',
    strokes: [
      // "dup" (espessura 1)
      { w: 1, d: 'M18.4362 0V17.5971M18.4362 17.5971V17.7663C18.267 20.7555 16.2366 26.734 9.46848 26.734C2.70037 26.734 0.669935 20.7555 0.500732 17.7663C0.669935 14.7206 2.70037 8.62934 9.46848 8.62934C16.2366 8.62934 18.267 14.6078 18.4362 17.5971Z' },
      { w: 1, d: 'M41.6171 8.46014L41.7863 17.7663C41.7863 20.7555 40.1958 26.734 33.8338 26.734C27.4718 26.734 26.1069 20.7555 26.2197 17.7663V8.46014' },
      { w: 1, d: 'M49.4002 35.3634L49.4002 17.7663M49.4002 17.7663L49.4002 17.5971C49.5694 14.6078 51.5998 8.62935 58.368 8.62935C65.1361 8.62935 67.1665 14.6078 67.3357 17.5971C67.1665 20.6427 65.1361 26.734 58.3679 26.734C51.5998 26.734 49.5694 20.7555 49.4002 17.7663Z' },
      // "agency" (espessura 2)
      { w: 2, d: 'M99.4842 26.9032L99.4842 17.2951M99.4842 17.2951L99.4842 17.1408C99.3309 14.4165 97.4921 8.9677 91.3625 8.9677C85.2328 8.96771 83.394 14.4165 83.2407 17.1409C83.394 19.9166 85.2328 25.4682 91.3625 25.4682C97.4921 25.4682 99.3309 20.0194 99.4842 17.2951Z' },
      { w: 2, d: 'M123.85 17.295C123.85 17.295 124.357 24.8728 123.85 27.58C123.342 30.2873 121.312 34.5174 116.066 34.5174C110.821 34.5174 108.791 31.9793 107.775 30.2873M123.85 17.295L123.85 17.1408C123.696 14.4164 121.858 8.96768 115.728 8.96768C109.598 8.96768 107.759 14.4164 107.606 17.1408C107.759 19.9166 109.598 25.4682 115.728 25.4682C121.858 25.4682 123.696 20.0194 123.85 17.295Z' },
      { w: 2, d: 'M146.626 21.6045C145.205 23.9684 142.655 25.5891 139.694 25.6953C135.038 25.8623 131.129 22.2236 130.962 17.568C130.954 17.3649 130.954 17.1633 130.961 16.9633M130.961 16.9633C131.114 12.5785 134.636 8.99566 139.089 8.83596C143.744 8.66897 147.654 12.3077 147.821 16.9633L130.961 16.9633Z' },
      { w: 2, d: 'M154.814 26.734L154.644 17.4279C154.644 14.4386 156.235 8.46014 162.597 8.46014C168.959 8.46014 170.324 14.4386 170.211 17.4279L170.211 26.734' },
      { w: 2, d: 'M193.284 21.6045C191.864 23.9684 189.314 25.5891 186.352 25.6953C181.696 25.8623 177.787 22.2236 177.62 17.568C177.613 17.3649 177.613 17.1633 177.62 16.9633C177.772 12.5785 181.295 8.99566 185.747 8.83596C189.001 8.71927 191.89 10.4611 193.392 13.1097M214.881 17.2587C214.881 17.2587 214.881 23.35 214.881 27.0724C214.881 30.7949 212.173 34.8558 206.759 34.8558C201.344 34.8558 199.483 30.2873 199.483 30.2873' },
      { w: 2, d: 'M214.881 7.95253V16.1547C214.881 19.1735 213.36 25.2112 207.277 25.2112C201.194 25.2112 199.889 19.1735 199.997 16.1547L199.997 7.95253' },
    ],
    // o "." de dup.agency
    fills: ['M72.75026 24.7036a2.53804 2.53804 0 1 0 5.07608 0a2.53804 2.53804 0 1 0 -5.07608 0Z'],
  }

  // ── Relógio — INTRO.tinta de src/components/intro/timeline.ts (em ms) ───────
  const T = {
    enter: 420,
    enterStagger: 60,
    coverHold: 180,
    exit: 600,
    stagger: 80,
    // Beat do logo, só no modo `data-with-logo`.
    logoAt: 200,
    logoStagger: 130,
    pathDur: 800,   // PATH_DUR do LogoIntro
  }

  // As 3 faixas — PAINT_BANDS do site. Roxo na frente, verde no meio,
  // periwinkle (ponto médio do grad-01) no fundo, costurando as duas.
  const BANDS = [
    { color: '#897BBC', z: 30 }, // --purple-mid
    { color: '#AFD7D0', z: 20 }, // --teal-mint
    { color: '#9CA9C6', z: 10 },
  ]

  // Easings do GSAP traduzidos: power1.inOut ≈ easeInOutQuad, power3.inOut ≈
  // easeInOutCubic, e a saída é o cubic-bezier exato da referência (PAINT_EXIT_EASE).
  const EASE = {
    draw: 'cubic-bezier(0.45, 0, 0.55, 1)',
    enter: 'cubic-bezier(0.65, 0, 0.35, 1)',
    exit: 'cubic-bezier(0.76, 0, 0.24, 1)',
  }

  const LOGO_COLOR = '#1A1A1A'
  const FORWARD_KEYS = new Set(['ArrowRight', 'PageDown', ' ', 'Spacebar', 'ArrowDown'])

  /**
   * Marcos derivados. `swapAt` é o instante em que o deck troca de slide: tem
   * que cair depois da primeira faixa aterrissar (t = enter), porque uma faixa
   * opaca de viewport inteira já esconde tudo, e antes da saída começar.
   */
  function clock(startAt) {
    const enterEnd = startAt + T.enter + (BANDS.length - 1) * T.enterStagger
    return {
      startAt,
      swapAt: startAt + T.enter + T.enterStagger,
      exitAt: startAt + T.enter + T.coverHold,
      total: startAt + T.enter + T.coverHold + T.exit + (BANDS.length - 1) * T.stagger,
      enterEnd,
    }
  }

  const OVERLAY_CSS = `
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    overflow: hidden;
    pointer-events: none;
    visibility: hidden;
  `

  class IntroWall extends HTMLElement {
    connectedCallback() {
      if (this._built) return
      this._built = true

      // O host é só âncora — quem pinta é o overlay no <body>.
      this.style.display = 'none'

      this._withLogo = this.hasAttribute('data-with-logo')

      const ov = document.createElement('div')
      ov.setAttribute('data-intro-wall-overlay', '')
      ov.style.cssText = OVERLAY_CSS
      this._overlay = ov

      this._panels = BANDS.map((band) => {
        const el = document.createElement('div')
        el.style.cssText = 'position:absolute;inset:0;will-change:transform;transform:translateY(-100%);'
        el.style.background = band.color
        el.style.zIndex = String(band.z)
        ov.appendChild(el)
        return el
      })

      if (this._withLogo) {
        const cover = document.createElement('div')
        cover.style.cssText =
          'position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:#FFFFFF;'
        cover.innerHTML = this._logoSvg()
        ov.appendChild(cover)
        this._cover = cover
        this._strokes = Array.from(cover.querySelectorAll('[data-logo-stroke]'))
        this._dot = cover.querySelector('[data-logo-fill]')
      } else {
        this._cover = null
        this._strokes = []
        this._dot = null
      }

      document.body.appendChild(ov)

      // CAPTURE: roda antes do listener de nav do deck-stage (que é bubble na
      // window). É isso que deixa a gente segurar o avanço até a tinta cobrir.
      this._onKeyCapture = this._onKeyCapture.bind(this)
      this._onClickCapture = this._onClickCapture.bind(this)
      window.addEventListener('keydown', this._onKeyCapture, true)
      window.addEventListener('click', this._onClickCapture, true)
    }

    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKeyCapture, true)
      window.removeEventListener('click', this._onClickCapture, true)
      this._cancel()
      if (this._overlay && this._overlay.parentNode) this._overlay.remove()
    }

    _logoSvg() {
      const strokes = LOGO.strokes
        .map((s) => `<path data-logo-stroke d="${s.d}" fill="none" stroke="${LOGO_COLOR}" stroke-width="${s.w}" stroke-linecap="round" stroke-linejoin="round" />`)
        .join('')
      const fills = LOGO.fills
        .map((d) => `<path data-logo-fill d="${d}" fill="${LOGO_COLOR}" stroke="none" />`)
        .join('')
      return `<svg viewBox="${LOGO.viewBox}" style="width:42%;height:auto;overflow:visible;" aria-hidden="true">${strokes}${fills}</svg>`
    }

    /**
     * A transição só vale saindo do slide IMEDIATAMENTE anterior ao nosso.
     * Pular direto pelo rail ou por tecla numérica entra sem tinta — de
     * propósito: transição só faz sentido no fluxo linear da apresentação.
     */
    _shouldIntercept() {
      const section = this.closest('section')
      const prev = section && section.previousElementSibling
      if (!prev) return false
      // O slide anterior estar VISÍVEL é o que prova que ele é o ativo — o
      // deck-stage esconde todos os outros com visibility:hidden.
      return getComputedStyle(prev).visibility === 'visible'
    }

    _onKeyCapture(e) {
      if (this._passthrough) return // é o nosso próprio evento sintético
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (!FORWARD_KEYS.has(e.key)) return
      // Durante a transição, engole o avanço: sem isso um segundo toque
      // adiantaria o deck e o swap cairia um slide adiante.
      if (this._busy) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      if (!this._shouldIntercept()) return
      e.preventDefault()
      e.stopImmediatePropagation()
      this.run(() => this._synthesize(e.key))
    }

    _onClickCapture(e) {
      // Só em touch: no desktop o deck navega por teclado / botões do overlay,
      // e o clique não avança slide (o deck-stage ignora ponteiro fino).
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) return
      if (e.defaultPrevented) return
      // Metade direita = avançar, igual ao _onTap do deck-stage.
      if (e.clientX < window.innerWidth / 2) return
      if (this._busy) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      if (!this._shouldIntercept()) return
      e.preventDefault()
      e.stopImmediatePropagation()
      this.run(() => this._synthesize('ArrowRight'))
    }

    /**
     * Reemite a tecla pro deck navegar pelo caminho normal dele. Despacha no
     * <html> (não na window) pra window ficar de fato na fase de CAPTURE — e o
     * flag _passthrough faz nosso listener deixar passar em vez de engolir.
     */
    _synthesize(key) {
      this._passthrough = true
      try {
        document.documentElement.dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
        )
      } finally {
        this._passthrough = false
      }
    }

    /**
     * Roda a transição. `advance` é chamado SOB a cobertura, no swapAt.
     * Público — dá pra chamar do console pra testar: $('intro-wall').run()
     */
    run(advance) {
      const go = typeof advance === 'function' ? advance : () => {}
      this._cancel()
      this._busy = true

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        go()
        this._busy = false
        return
      }

      const c = clock(this._withLogo ? T.logoAt + this._drawTotal() : 0)
      this._anims = []
      this._overlay.style.visibility = 'visible'

      if (this._withLogo) this._playLogo()

      // ── faixas descem cobrindo (trás→frente) ──────────────────────────────
      // z maior fecha por cima, então o stagger vai do fundo pra frente.
      ;[...this._panels].reverse().forEach((panel, i) => {
        this._anims.push(
          panel.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0%)' }], {
            duration: T.enter,
            delay: c.startAt + i * T.enterStagger,
            easing: EASE.enter,
            fill: 'forwards',
          }),
        )
      })

      // ── o swap: o deck troca de slide escondido atrás da tinta ────────────
      this._swap = setTimeout(() => {
        if (this._cover) this._cover.style.visibility = 'hidden'
        go()
      }, c.swapAt)

      // ── faixas saem por baixo revelando o slide novo (frente→trás) ────────
      this._panels.forEach((panel, i) => {
        this._anims.push(
          panel.animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(100%)' }], {
            duration: T.exit,
            delay: c.exitAt + i * T.stagger,
            easing: EASE.exit,
            // ⚠️ 'forwards', NUNCA 'both'. O backwards fill do WAAPI aplica o
            // PRIMEIRO keyframe já durante o delay — e o primeiro keyframe daqui
            // é translateY(0%), ou seja, a faixa apareceria plantada cobrindo a
            // tela desde t=0 e a entrada nunca seria vista. É a mesma armadilha
            // que o LogoIntro do site resolve com immediateRender:false no GSAP.
            fill: 'forwards',
          }),
        )
      })

      this._end = setTimeout(() => this._finish(), c.total + 60)
    }

    _drawTotal() {
      return (LOGO.strokes.length - 1) * T.logoStagger + T.pathDur
    }

    _playLogo() {
      this._cover.style.visibility = 'visible'
      // Ordem esquerda→direita pelo x do bounding box, igual ao LogoIntro.
      const ordered = this._strokes
        .map((el) => ({ el, x: el.getBBox().x }))
        .sort((a, b) => a.x - b.x)
        .map((o) => o.el)

      ordered.forEach((path, i) => {
        const len = path.getTotalLength()
        path.style.strokeDasharray = String(len)
        // Cada traço nasce invisível: com linecap round, um path zerado ainda
        // pinta um pontinho na origem — 9 traços = 9 pontos parados na tela.
        this._anims.push(
          path.animate(
            [
              { strokeDashoffset: len, visibility: 'hidden', offset: 0 },
              { strokeDashoffset: len, visibility: 'visible', offset: 0.001 },
              { strokeDashoffset: 0, visibility: 'visible', offset: 1 },
            ],
            { duration: T.pathDur, delay: T.logoAt + i * T.logoStagger, easing: EASE.draw, fill: 'both' },
          ),
        )
      })

      // O "." entra com fade assim que os traços fecham.
      this._anims.push(
        this._dot.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 200,
          delay: T.logoAt + this._drawTotal() - 100,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        }),
      )
    }

    /** Estado final: overlay fora do caminho. */
    _finish() {
      this._cancel()
      this._overlay.style.visibility = 'hidden'
      this._panels.forEach((p) => { p.style.transform = 'translateY(-100%)' })
      this.dispatchEvent(new CustomEvent('introwallend', { bubbles: true, composed: true }))
    }

    _cancel() {
      clearTimeout(this._swap)
      clearTimeout(this._end)
      if (this._anims) this._anims.forEach((a) => a.cancel())
      this._anims = null
      this._busy = false
    }
  }

  customElements.define('intro-wall', IntroWall)
})()
