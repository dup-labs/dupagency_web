'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface GlitchPhoto {
  src: string
  key: string  // identifica o dono (ex: 'dup', 'lari')
}

interface Props {
  photos: GlitchPhoto[]              // pool de fotos
  texts: Record<string, string>      // texto do hover por key
  slotsCount?: number                // qtd de slots no grid (default 4)
  className?: string
}

interface SlotState {
  current: number                    // índice no array `photos`
  prev: number | null                // índice anterior (pra crossfade)
  glitching: boolean
}

const GLITCH_MS = 300
const FADE_MS = 350
// Hold aleatório por swap pra desincronizar os slots naturalmente
const HOLD_MIN = 2500
const HOLD_MAX = 3500
// Probabilidade de uma troca virar uma "rotation" — coordena com outro slot
// pra trocar OWNERS entre si. Mantém a contagem global (ex: 2+2) mas
// embaralha as posições no grid ao longo do tempo.
const TRADE_CHANCE = 0.35

function randHold() {
  return HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN)
}

/**
 * Atribuição inicial balanceada por owner — alterna slots entre os owners
 * distintos pra começar com 2+2 (no caso de 4 slots / 2 owners).
 */
function buildInitialAssignments(
  photos: GlitchPhoto[],
  slotsCount: number,
): number[] {
  const owners = Array.from(new Set(photos.map((p) => p.key)))
  const assignments: number[] = []
  const usedPerOwner: Record<string, number> = {}

  for (let i = 0; i < slotsCount; i++) {
    const owner = owners[i % owners.length]
    const ownerPhotos = photos
      .map((p, idx) => ({ p, idx }))
      .filter((x) => x.p.key === owner)
    const offset = usedPerOwner[owner] ?? 0
    if (offset < ownerPhotos.length) {
      assignments.push(ownerPhotos[offset].idx)
      usedPerOwner[owner] = offset + 1
    } else {
      const fallback = photos.findIndex((_, idx) => !assignments.includes(idx))
      if (fallback >= 0) assignments.push(fallback)
    }
  }
  return assignments
}

/**
 * Renderiza o hover text parseando **palavra** como nome em negrito numa
 * nova linha. Mesma convenção do renderLine() do Hero.tsx.
 */
function renderHoverText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <span key={i}>
          <br />
          <strong className="glitch-hover__name">{part}</strong>
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function GlitchGrid({
  photos,
  texts,
  slotsCount = 4,
  className = '',
}: Props) {
  const initialAssignments = useMemo(
    () => buildInitialAssignments(photos, slotsCount),
    [photos, slotsCount],
  )

  const [slots, setSlots] = useState<SlotState[]>(() =>
    initialAssignments.map((idx) => ({
      current: idx,
      prev: null,
      glitching: false,
    })),
  )

  // Pool global de fotos em uso, e flags de hover por slot — refs pra ler
  // dentro dos timers sem sofrer com stale closures.
  const inUseRef = useRef<Set<number>>(new Set(initialAssignments))
  const hoveredRef = useRef<boolean[]>(new Array(slotsCount).fill(false))
  const slotsRef = useRef(slots)
  useEffect(() => {
    slotsRef.current = slots
  }, [slots])

  useEffect(() => {
    if (photos.length === 0 || slotsCount === 0) return

    const timers: ReturnType<typeof setTimeout>[] = []

    /**
     * Pool de fotos disponíveis pra um owner — inclui as que estão sendo
     * "liberadas" agora pelo swap (necessário pro trade onde dois slots
     * trocam fotos atomicamente).
     */
    function availableForOwner(ownerKey: string, beingFreed: number[]): number[] {
      const avail: number[] = []
      for (let i = 0; i < photos.length; i++) {
        if (photos[i].key !== ownerKey) continue
        if (!inUseRef.current.has(i) || beingFreed.includes(i)) {
          avail.push(i)
        }
      }
      return avail
    }

    function pickRandom<T>(arr: T[]): T | null {
      if (arr.length === 0) return null
      return arr[Math.floor(Math.random() * arr.length)]
    }

    function applyGlitchTimers(...indexes: number[]) {
      // Encerra o glitch
      const stopGlitch = setTimeout(() => {
        setSlots((prev) => {
          const u = [...prev]
          indexes.forEach((idx) => {
            u[idx] = { ...u[idx], glitching: false }
          })
          return u
        })
      }, GLITCH_MS)
      timers.push(stopGlitch)

      // Limpa o `prev` (libera memória do layer anterior)
      const cleanupPrev = setTimeout(() => {
        setSlots((prev) => {
          const u = [...prev]
          indexes.forEach((idx) => {
            u[idx] = { ...u[idx], prev: null }
          })
          return u
        })
      }, GLITCH_MS + FADE_MS)
      timers.push(cleanupPrev)
    }

    function doSwap(slotIdx: number) {
      if (hoveredRef.current[slotIdx]) {
        // Pausa enquanto hover — só reagenda
        scheduleNext(slotIdx)
        return
      }

      const currentSlots = slotsRef.current
      const slot = currentSlots[slotIdx]
      const currentOwner = photos[slot.current].key

      // Tenta trade (rotation) com chance TRADE_CHANCE
      const tryTrade = Math.random() < TRADE_CHANCE
      if (tryTrade) {
        // Procura outro slot de owner DIFERENTE (e não em hover)
        const candidates: number[] = []
        for (let i = 0; i < currentSlots.length; i++) {
          if (i === slotIdx) continue
          if (hoveredRef.current[i]) continue
          if (photos[currentSlots[i].current].key !== currentOwner) {
            candidates.push(i)
          }
        }

        const targetIdx = pickRandom(candidates)
        if (targetIdx !== null) {
          const targetSlot = currentSlots[targetIdx]
          const targetOwner = photos[targetSlot.current].key
          const beingFreed = [slot.current, targetSlot.current]

          // S vai virar `targetOwner`, S' vai virar `currentOwner`
          const newForS = pickRandom(availableForOwner(targetOwner, beingFreed))
          const newForS2 = pickRandom(availableForOwner(currentOwner, beingFreed))

          if (newForS !== null && newForS2 !== null && newForS !== newForS2) {
            inUseRef.current.delete(slot.current)
            inUseRef.current.delete(targetSlot.current)
            inUseRef.current.add(newForS)
            inUseRef.current.add(newForS2)

            setSlots((prev) => {
              const u = [...prev]
              u[slotIdx] = { current: newForS, prev: slot.current, glitching: true }
              u[targetIdx] = { current: newForS2, prev: targetSlot.current, glitching: true }
              return u
            })

            applyGlitchTimers(slotIdx, targetIdx)
            scheduleNext(slotIdx)
            return
          }
          // Trade falhou (sem fotos disponíveis ou colisão) — cai no same-owner
        }
      }

      // Same-owner swap (default ou fallback do trade)
      const next = pickRandom(availableForOwner(currentOwner, []))
      if (next !== null && next !== slot.current) {
        const old = slot.current
        inUseRef.current.delete(old)
        inUseRef.current.add(next)

        setSlots((prev) => {
          const u = [...prev]
          u[slotIdx] = { current: next, prev: old, glitching: true }
          return u
        })

        applyGlitchTimers(slotIdx)
      }

      scheduleNext(slotIdx)
    }

    function scheduleNext(slotIdx: number) {
      const t = setTimeout(() => doSwap(slotIdx), randHold())
      timers.push(t)
    }

    // Mount inicial: cada slot tem offset aleatório pra desincronizar logo
    // de cara (sem isso os 4 disparariam o primeiro swap junto).
    for (let i = 0; i < slotsCount; i++) {
      const initial = setTimeout(() => doSwap(i), Math.random() * HOLD_MAX)
      timers.push(initial)
    }

    return () => {
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, slotsCount])

  // Mobile: bottom-sheet com texto + close + drag-to-dismiss.
  // Desktop usa hover overlay (CSS), mobile usa click → sheet.
  const [openSheetIdx, setOpenSheetIdx] = useState<number | null>(null)

  // Pausa o swap do slot que está com sheet aberto pra texto não mudar
  // enquanto o usuário está lendo. O flag também é setado SINCRONAMENTE
  // em handleSlotClick — sem isso, há um gap de ~1-5ms entre o click e
  // o useEffect commit, durante o qual um swap timer pode disparar e
  // trocar a foto/texto do slot bem na hora que o sheet abre.
  useEffect(() => {
    if (openSheetIdx !== null) {
      hoveredRef.current[openSheetIdx] = true
      return () => {
        hoveredRef.current[openSheetIdx] = false
      }
    }
  }, [openSheetIdx])

  function handleSlotClick(i: number) {
    if (typeof window === 'undefined') return
    // Só abre sheet em touch devices (sem hover real)
    if (window.matchMedia('(hover: none)').matches) {
      // Trava o swap IMEDIATAMENTE, antes de qualquer re-render. Cobre
      // a race com timers de swap que possam disparar entre o click e
      // o useEffect que sincroniza o flag.
      hoveredRef.current[i] = true
      setOpenSheetIdx(i)
    }
  }

  if (photos.length === 0) return null

  const openSheetText =
    openSheetIdx !== null
      ? texts[photos[slots[openSheetIdx].current].key] ?? ''
      : null

  return (
    <>
      <div className={`glitch-grid ${className}`}>
        {slots.map((slot, i) => {
          const photo = photos[slot.current]
          const prevPhoto = slot.prev !== null ? photos[slot.prev] : null
          const hoverText = texts[photo.key] ?? ''

          return (
            <div
              key={i}
              className={`glitch-slot ${slot.glitching ? 'is-glitching' : ''}`}
              style={
                {
                  ['--bg' as string]: `url("${photo.src}")`,
                } as React.CSSProperties
              }
              onMouseEnter={() => {
                hoveredRef.current[i] = true
              }}
              onMouseLeave={() => {
                hoveredRef.current[i] = false
              }}
              onClick={() => handleSlotClick(i)}
            >
              {prevPhoto && (
                <div
                  className="glitch-layer glitch-layer--prev"
                  style={{ backgroundImage: `url("${prevPhoto.src}")` }}
                />
              )}
              <div
                className="glitch-layer glitch-layer--current"
                style={{ backgroundImage: `url("${photo.src}")` }}
              />

              <div
                className="glitch-hover"
                style={{
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                }}
              >
                <p className="glitch-hover__text">{renderHoverText(hoverText)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {openSheetText !== null && (
        <BottomSheet
          text={openSheetText}
          onClose={() => setOpenSheetIdx(null)}
        />
      )}
    </>
  )
}

/**
 * Bottom sheet mobile — backdrop com blur, drag-down-to-dismiss e botão
 * de fechar. Aparece quando o user toca num card no mobile.
 */
function BottomSheet({
  text,
  onClose,
}: {
  text: string
  onClose: () => void
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentDelta = useRef(0)
  const dragging = useRef(false)
  // SSR-safe: só renderiza o portal quando o DOM existe (client-side).
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY
    currentDelta.current = 0
    dragging.current = true
    if (sheetRef.current) sheetRef.current.style.transition = 'none'
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return
    const dy = e.touches[0].clientY - startY.current
    if (dy > 0) {
      currentDelta.current = dy
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${dy}px)`
      }
    }
  }

  function onTouchEnd() {
    dragging.current = false
    if (currentDelta.current > 100) {
      onClose()
    } else if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 250ms ease'
      sheetRef.current.style.transform = ''
    }
  }

  if (!mounted) return null

  // Portal pra document.body — escapa do stacking context do Hero (que tem
  // ancestrais com `transform` do GSAP, fazendo `position: fixed` ficar
  // escopado dentro do Hero ao invés do viewport).
  return createPortal(
    <>
      <div
        className="glitch-sheet__backdrop"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className="glitch-sheet"
        role="dialog"
        aria-modal="true"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          // Inline pra garantir o blur (mesmo workaround dos testimonials/
          // hover overlay — Tailwind v4 às vezes ignora a regra na classe).
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        }}
      >
        <div className="glitch-sheet__handle" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="glitch-sheet__close"
        >
          ×
        </button>
        <p className="glitch-sheet__text">{renderHoverText(text)}</p>
      </div>
    </>,
    document.body,
  )
}
