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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'

  window.scrollTo({ top: sectionScrollTop(target), left: 0, behavior })
  history.pushState(null, '', `#${id}`)

  if (behavior === 'auto') {
    snapSectionToViewportTop(target)
  } else {
    window.addEventListener('scrollend', () => snapSectionToViewportTop(target), {
      once: true,
    })
  }

  return true
}
