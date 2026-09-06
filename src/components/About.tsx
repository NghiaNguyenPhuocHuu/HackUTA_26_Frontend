import { useEffect, useRef, useState } from 'react'

const DISCORD_URL = 'https://discord.gg/2bVsYS3SgS'
const DEVPOST_URL = 'https://hackuta7.devpost.com/'

const perks = [
  { label: '24 Hours of Building', tone: 'terracotta' as const },
  { label: 'Free Food & Swag', tone: 'ocean' as const },
  { label: 'Legendary Prizes', tone: 'terracotta' as const },
]

function OdysseyButton({
  href,
  children,
}: {
  href: string
  children: string
}) {
  return (
    <a
      className="odyssey-btn inline-flex items-center justify-center"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      setRevealed(entry.isIntersecting)
    }, { threshold: 0.18 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="odyssey-call-section relative isolate overflow-hidden"
      data-theme="dark"
      data-revealed={revealed}
      aria-labelledby="odyssey-call-title"
    >
      <div className="section-inner odyssey-call-inner relative flex flex-col items-center text-center">
        <h2 id="odyssey-call-title" className="odyssey-call-title font-semibold uppercase">
          Are you ready to begin your odyssey?
        </h2>
        <p className="odyssey-call-lede">
          Join hundreds of builders, creators, and dreamers for 24 hours at sea.
          Register now and chart a course worth remembering.
        </p>

        <div className="odyssey-call-actions flex flex-col sm:flex-row items-stretch sm:items-center justify-center">
          <OdysseyButton href={DISCORD_URL}>Join Discord</OdysseyButton>
          <OdysseyButton href={DEVPOST_URL}>Devpost</OdysseyButton>
        </div>

        <ul className="odyssey-call-perks flex flex-wrap items-center justify-center" aria-label="Event highlights">
          {perks.map((perk) => (
            <li key={perk.label} data-tone={perk.tone}>
              <span aria-hidden="true" />
              {perk.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
