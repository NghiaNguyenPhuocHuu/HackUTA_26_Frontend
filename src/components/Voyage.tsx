import { useEffect, useRef, useState } from 'react'
import { Ship } from './art/Ship'

type VoyageProps = { motionEnabled: boolean }

const chapters = [
  {
    description:
      'HackUTA is a 24-hour hackathon at UT Arlington where college students design, build, and pitch a project from scratch. Beginners and veterans alike: if you can bring curiosity, there is a place for you on this voyage.',
    landmark: 'An ancient harbor with olive trees, where every odyssey sets sail.',
    image: 'departure',
    side: 'right',
  },
  {
    description:
      'Compete for cash prizes, sponsor awards, and swag across multiple tracks. Prize pools and categories will be announced as the event approaches. Build something bold and make the judges take notice.',
    landmark: 'Polyphemus watches from his island, a trial worth conquering for the reward.',
    image: 'encounter',
    side: 'left',
  },
  {
    description:
      'HackUTA is organized by ACM at UTA, students who have run hackathons before and care about helping others ship their first project. They handle logistics, mentors, food, and keeping the voyage on course from check-in to awards.',
    landmark: 'An owl beside an olive tree, wisdom passed down by those who have sailed before.',
    image: 'discovery',
    side: 'right',
  },
  {
    description:
      'Free food, workshops, a team-formation mixer, late-night debugging with new friends, and plenty of inside jokes along the way. Come to build, and leave with a story worth retelling.',
    landmark: 'A homecoming arch framed by olive branches, the celebration at journey\'s end.',
    image: 'return',
    side: 'left',
  },
]

// Serpentine route drawn in a 100 × 400 box that stretches to the journey.
// Each waypoint sits at the vertical centre of a chapter and leans toward its island.
const ROUTE = 'M50 0C50 25 62 25 62 50C62 100 38 100 38 150C38 200 62 200 62 250C62 300 38 300 38 350C38 375 50 375 50 400'

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function Voyage({ motionEnabled }: VoyageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<SVGPathElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)
  const stopRefs = useRef<Array<HTMLElement | null>>([])
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 960px) and (min-height: 660px)').matches)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 960px)').matches)
  const [activeChapter, setActiveChapter] = useState(0)
  const activeRef = useRef(0)
  const animated = motionEnabled && desktop

  useEffect(() => {
    const tall = window.matchMedia('(min-width: 960px) and (min-height: 660px)')
    const broad = window.matchMedia('(min-width: 960px)')
    const update = () => {
      setDesktop(tall.matches)
      setWide(broad.matches)
    }
    update()
    tall.addEventListener('change', update)
    broad.addEventListener('change', update)
    return () => {
      tall.removeEventListener('change', update)
      broad.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const readingLine = window.innerHeight / 2

      let nearest = 0
      let shortest = Infinity
      stopRefs.current.forEach((stop, index) => {
        if (!stop) return
        const bounds = stop.getBoundingClientRect()
        const distance = Math.abs(bounds.top + bounds.height / 2 - readingLine)
        if (distance < shortest) {
          shortest = distance
          nearest = index
        }
      })
      if (activeRef.current !== nearest) {
        activeRef.current = nearest
        setActiveChapter(nearest)
      }

      const journey = journeyRef.current
      const route = routeRef.current
      const ship = shipRef.current
      if (!journey || !route || !ship) return

      const bounds = journey.getBoundingClientRect()
      const progress = clamp((readingLine - bounds.top) / Math.max(1, bounds.height))
      const total = route.getTotalLength()
      const travelled = progress * total
      const point = route.getPointAtLength(travelled)
      const ahead = route.getPointAtLength(Math.min(total, travelled + 4))
      const behind = route.getPointAtLength(Math.max(0, travelled - 4))
      const dx = ((ahead.x - behind.x) / 100) * bounds.width
      const dy = ((ahead.y - behind.y) / 400) * bounds.height
      // Keep the hull upright and only let the bow dip toward the direction of travel.
      const tilt = Math.max(-11, Math.min(11, (dx / (Math.abs(dy) + 1)) * 9))

      ship.style.setProperty('--ship-x', `${((point.x / 100) * bounds.width).toFixed(2)}px`)
      ship.style.setProperty('--ship-y', `${((point.y / 400) * bounds.height).toFixed(2)}px`)
      ship.style.setProperty('--ship-tilt', `${tilt.toFixed(2)}deg`)
      ship.dataset.ready = 'true'
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [animated, wide])

  return (
    <section ref={sectionRef} id="voyage" className="od-voyage" data-animated={animated} aria-label="About HackUTA">
      <svg className="od-voyage-art-filter" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="odyssey-indigo-art" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 .55  0 0 0 0 .63  0 0 0 0 .67  .5315 1.788 .1805 0 -.25"
            />
          </filter>
        </defs>
      </svg>
      <div className="od-voyage-stage">
        <div className="od-voyage-top flex items-center justify-end gap-5">
          <a href="#schedule" className="od-schedule-skip inline-flex items-center gap-3">Skip to schedule <span aria-hidden="true">↓</span></a>
        </div>

        <div ref={journeyRef} className="od-journey">
          {wide && (
            <svg
              className="od-journey-route"
              viewBox="0 0 100 400"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path ref={routeRef} className="od-journey-track" d={ROUTE} />
            </svg>
          )}

          <div className="od-journey-stops">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.image}
                ref={(element) => { stopRefs.current[index] = element }}
                id={`voyage-chapter-${index + 1}`}
                className="od-chapter"
                data-side={chapter.side}
                data-active={activeChapter === index}
                aria-labelledby={`voyage-copy-${index + 1}`}
              >
                <div className="od-chapter-art">
                  <img src={`/images/island-${chapter.image}-v7.webp`} width="1536" height="1024" alt={chapter.landmark} loading="lazy" decoding="async" />
                </div>
                <div className="od-chapter-copy">
                  <p id={`voyage-copy-${index + 1}`} className="od-chapter-description">{chapter.description}</p>
                </div>
              </article>
            ))}
          </div>

          {animated && (
            <div ref={shipRef} className="od-journey-ship" aria-hidden="true">
              <Ship className="od-voyage-ship" rowing tone="clay" style={{ color: 'var(--light)' }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
