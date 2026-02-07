export function isMobile() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 1024px)').matches
}