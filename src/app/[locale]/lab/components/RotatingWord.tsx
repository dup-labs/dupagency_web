'use client'

import { useEffect, useState } from 'react'

// Palavra rotativa do CTA — troca a cada 2,1s com slide-up. Server e client
// renderizam o índice 0, então não há mismatch de hidratação; o interval só
// começa depois do mount.
export default function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2100)
    return () => clearInterval(id)
  }, [words.length])

  return (
    <span
      key={index}
      className="inline-block"
      style={{ animation: 'lab-word-up 0.55s cubic-bezier(0.32, 0.72, 0, 1) both' }}
    >
      {words[index]}
    </span>
  )
}
