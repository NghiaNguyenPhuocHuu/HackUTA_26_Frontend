// Smooth scrolling can stop a fraction of a pixel short, so a snap is armed for
// the end of the animation. Only the most recent navigation may snap: a stale
// listener would drag the page back to the section the user just left.
let pendingSnap: AbortController | null = null

function sectionScrollTop(target: HTMLElement): number {
  return window.scrollY + target.getBoundingClientRect().top
}

function snapSectionToViewportTop(target: HTMLElement) {
  const drift = target.getBoundingClientRect().top
  if (Math.abs(drift) > 0.5) {
    window.scrollTo({ top: window.scrollY + drift, left: 0, behavior: 'auto' })
  }
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return false

  pendingSnap?.abort()
  pendingSnap = null

  const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

  window.scrollTo({ top: sectionScrollTop(target), left: 0, behavior })
  history.pushState(null, '', `#${id}`)

  if (behavior === 'auto') {
    snapSectionToViewportTop(target)
    return true
  }

  const snap = new AbortController()
  pendingSnap = snap

  const settle = () => {
    pendingSnap = null
    snapSectionToViewportTop(target)
  }
  const cancel = () => {
    pendingSnap = null
    snap.abort()
  }

  window.addEventListener('scrollend', settle, { once: true, signal: snap.signal })
  // Taking over with the wheel or a swipe should win over the pending snap.
  for (const event of ['wheel', 'touchstart', 'keydown'] as const) {
    window.addEventListener(event, cancel, { once: true, passive: true, signal: snap.signal })
  }

  return true
}
