'use client'

import { useId } from 'react'
import { type Icon } from '@phosphor-icons/react'

type Weight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

export function PhosphorIcon({
  icon: IconComponent,
  size = 24,
  weight = 'regular',
}: {
  icon: Icon
  size?: number
  weight?: Weight
}) {
  const uid     = useId().replace(/:/g, '')
  const gradId  = `pg-${uid}`
  const maskId  = `pm-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
          <stop offset="14.645%" stopColor="#AFD7D0" />
          <stop offset="85.355%" stopColor="#897BBC" />
        </linearGradient>
        <mask id={maskId}>
          <IconComponent size={256} weight={weight} color="white" />
        </mask>
      </defs>
      <rect width="256" height="256" fill={`url(#${gradId})`} mask={`url(#${maskId})`} />
    </svg>
  )
}
