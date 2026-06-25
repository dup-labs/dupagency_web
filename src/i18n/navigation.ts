import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Wrappers locale-aware do Next. Usar SEMPRE estes no lugar de `next/link` e
// `next/navigation` — eles preservam o locale ativo na URL automaticamente.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
