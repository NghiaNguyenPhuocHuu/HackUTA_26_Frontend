import { type RefObject, useEffect, useRef, useState } from 'react'

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

function OdysseyBoat({ boatRef }: { boatRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={boatRef} className="odyssey-boat-track" aria-hidden="true">
      <svg className="odyssey-boat" viewBox="0 0 150 230" role="presentation">
        <g className="odyssey-boat-wake">
          <path d="M61 188C45 207 28 216 10 218" />
          <path d="M89 188C105 207 122 216 140 218" />
          <path d="M58 198C40 222 22 230 4 231" />
          <path d="M92 198C110 222 128 230 146 231" />
        </g>
        <path className="odyssey-boat-hull" d="M75 5C52 28 32 77 32 130c0 47 18 78 43 95 25-17 43-48 43-95C118 77 98 28 75 5Z" />
        <path className="odyssey-boat-hull-edge" d="M75 12C57 37 41 79 41 128c0 40 14 68 34 84 20-16 34-44 34-84 0-49-16-91-34-116Z" />
        <path className="odyssey-boat-deck" d="M75 21C61 44 50 82 50 127s10 69 25 82c15-13 25-37 25-82S89 44 75 21Z" />
        <path className="odyssey-boat-planks" d="M53 67h44M49 82h52M47 98h56M46 114h58M46 130h58M48 146h54M51 162h48" />
        <path className="odyssey-boat-keel" d="M75 34v151" />
        <path className="odyssey-boat-mast" d="M75 15v174" />
        <path className="odyssey-boat-rigging" d="M75 17 42 73M75 17l33 56M75 17 47 107M75 17l28 90" />
        <path className="odyssey-boat-sail" d="M75 26C57 46 45 70 42 101c14-9 25-14 33-18Z" />
        <path className="odyssey-boat-sail odyssey-boat-sail-alt" d="M75 26c18 20 30 44 33 75-14-9-25-14-33-18Z" />
        {([59, 91] as const).map((x) => (
          <g className="odyssey-boat-rower" key={x}>
            <circle className="odyssey-boat-rower-head" cx={x} cy="112" r="3.5" />
            <path className="odyssey-boat-rower-body" d={`M${x - 4} 118c2-4 6-4 8 0l-1 7h-6Z`} />
            <path className="odyssey-boat-oar" d={`M${x - 2} 120 ${x - 19} 130M${x + 2} 120 ${x + 19} 130`} />
          </g>
        ))}
        <path className="odyssey-boat-cabin" d="M59 132h32v30H59Z" />
        <path className="odyssey-boat-cabin-window" d="M65 139h20v8H65ZM65 151h20v6H65Z" />
        <circle className="odyssey-boat-porthole" cx="48" cy="137" r="3" />
        <circle className="odyssey-boat-porthole" cx="102" cy="137" r="3" />
        <circle className="odyssey-boat-compass" cx="75" cy="116" r="7" />
      </svg>
    </div>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const boatRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    const section = sectionRef.current
    const boat = boatRef.current
    if (!section || !boat) return
    let frame = 0
    const update = () => {
      const bounds = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (bounds.height + innerHeight)))
      boat.style.setProperty('--boat-left', `${6 + progress * 5}%`)
      boat.style.setProperty('--boat-top', `${8 + progress * 78}%`)
      boat.style.setProperty('--boat-angle', `${-18 + progress * 36}deg`)
    }
    const requestUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', requestUpdate, { passive: true })
    addEventListener('resize', requestUpdate)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', requestUpdate)
      removeEventListener('resize', requestUpdate)
    }
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
      <OdysseyBoat boatRef={boatRef} />
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
