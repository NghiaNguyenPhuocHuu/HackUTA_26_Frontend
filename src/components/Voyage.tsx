import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Ship } from './art/Ship'

type VoyageProps = { motionEnabled: boolean }

const chapters = [
  {
    title: ['Gather', 'your crew.'],
    day: 'Saturday · November 14',
    description: 'Meet other builders. Find your people. Give a promising idea a place to begin.',
    name: 'The departure',
    navigation: 'Depart',
    landmark: 'An ancient harbor with olive trees and a gathering place for the crew.',
    image: 'departure',
  },
  {
    title: ['Outthink', 'the impossible.'],
    day: 'Saturday · November 14',
    description: 'Every odyssey meets a Cyclops. Experiment, ask for help, and find another way through.',
    name: 'The encounter · Polyphemus',
    navigation: 'Encounter',
    landmark: 'Polyphemus, a great Cyclops whose single eye watches from an island mountain.',
    image: 'encounter',
  },
  {
    title: ['Make your', 'idea real.'],
    day: 'Sunday · November 15',
    description: 'Bring the pieces together. Turn what you have learned into something you can show the world.',
    name: 'The discovery',
    navigation: 'Discover',
    landmark: 'An owl beside an olive tree and illustrated tablets on a rocky island.',
    image: 'discovery',
  },
  {
    title: ['Bring home', 'something new.'],
    day: 'Sunday · November 15',
    description: 'Share your project. Celebrate your crew. Take home new friendships and a story of your own.',
    name: 'The return',
    navigation: 'Return',
    landmark: 'A homecoming arch framed by olive branches and a rising terracotta sun.',
    image: 'return',
  },
]

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function Voyage({ motionEnabled }: VoyageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 960px) and (min-height: 660px)').matches)
  const [activeChapter, setActiveChapter] = useState(0)
  const activeRef = useRef(0)
  const animated = motionEnabled && desktop

  useEffect(() => {
    const media = window.matchMedia('(min-width: 960px) and (min-height: 660px)')
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !animated) return
    let frame = 0

    const update = () => {
      frame = 0
      const bounds = section.getBoundingClientRect()
      const progress = clamp(-bounds.top / Math.max(1, bounds.height - window.innerHeight))
      const chapter = Math.min(3, Math.floor(progress * 4))
      const local = progress * 4 - chapter
      // More than half of each chapter is a quiet hold at its landmark.
      const travel = chapter === 3 ? 0 : clamp((local - 0.53) / 0.45)
      const eased = travel * travel * (3 - 2 * travel)
      const current = travel > 0.5 ? Math.min(3, chapter + 1) : chapter

      section.style.setProperty('--scene-position', (chapter + eased).toFixed(4))
      section.style.setProperty('--journey', progress.toFixed(4))
      section.style.setProperty('--ship-travel', `${(Math.sin(progress * Math.PI) * 44).toFixed(2)}px`)
      section.style.setProperty('--chapter-opacity', String(travel === 0 || travel === 1 ? 1 : Math.min(1, 0.12 + Math.abs(travel - 0.5) * 3)))
      section.style.setProperty('--chapter-lift', `${((travel < 0.5 ? -travel : 1 - travel) * 12).toFixed(2)}px`)
      if (activeRef.current !== current) {
        activeRef.current = current
        setActiveChapter(current)
      }
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
  }, [animated])

  const goToChapter = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    if (!animated) {
      document.getElementById(`voyage-chapter-${index + 1}`)?.scrollIntoView({ behavior: 'auto', block: 'start' })
      return
    }
    const start = window.scrollY + section.getBoundingClientRect().top
    const distance = section.offsetHeight - window.innerHeight
    window.scrollTo({ top: start + distance * ((index + 0.25) / 4), behavior: 'smooth' })
  }

  const handleChapterKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const destination = event.key === 'ArrowRight' ? (index + 1) % 4
      : event.key === 'ArrowLeft' ? (index + 3) % 4
        : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : null
    if (destination === null) return
    event.preventDefault()
    controlRefs.current[destination]?.focus({ preventScroll: true })
    goToChapter(destination)
  }

  return (
    <section ref={sectionRef} id="voyage" className="od-voyage" data-animated={animated} aria-labelledby="voyage-title">
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
        <div className="od-voyage-top flex items-center justify-between gap-5">
          <div className="od-scene-label inline-flex items-center gap-4 font-semibold uppercase">
            <span className="od-scene-number inline-flex items-center justify-center">02</span>
            <h2 id="voyage-title">The voyage</h2>
          </div>
          <a href="#schedule" className="od-schedule-skip inline-flex items-center gap-3">Skip to schedule <span aria-hidden="true">↓</span></a>
        </div>

        <div className="od-voyage-scene">
          <div className="od-chapters">
          {chapters.map((chapter, index) => (
            <article
              key={chapter.name}
              id={`voyage-chapter-${index + 1}`}
              className="od-chapter"
              data-active={activeChapter === index}
              aria-hidden={animated && activeChapter !== index ? true : undefined}
              aria-labelledby={`voyage-heading-${index + 1}`}
            >
              <div className="od-chapter-art">
                <img src={`/images/island-${chapter.image}-v7.webp`} width="1536" height="1024" alt={chapter.landmark} loading="lazy" decoding="async" />
              </div>
              <div className="od-chapter-copy">
                <p className="od-chapter-day font-semibold uppercase">{chapter.day}</p>
                <h3 id={`voyage-heading-${index + 1}`} className="od-chapter-title font-semibold uppercase">
                  {chapter.title[0]}<br />{chapter.title[1]}
                </h3>
                <p className="od-chapter-description">{chapter.description}</p>
                <p className="od-chapter-label uppercase"><span>0{index + 1}</span><span aria-hidden="true">/</span>{chapter.name}</p>
              </div>
            </article>
          ))}
          </div>
          <div className="od-island-window" aria-hidden="true">
            <div className="od-island-strip">
              {chapters.map((chapter, index) => (
                <div className="od-island-panel" key={chapter.image} data-active={activeChapter === index}>
                  <img src={`/images/island-${chapter.image}-v7.webp`} width="1536" height="1024" alt="" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="od-voyage-boat" aria-hidden="true">
          <Ship className="od-voyage-ship" rowing={animated} tone="clay" style={{ color: 'var(--sand)' }} />
        </div>

        <div className="od-foreground-sea" aria-hidden="true">
          <svg viewBox="0 0 1800 34" preserveAspectRatio="none" fill="none">
            <path d="M-60 14Q50 0 160 14T380 14T600 14T820 14T1040 14T1260 14T1480 14T1700 14T1920 14" />
          </svg>
        </div>

        <div className="od-voyage-bottom">
          <nav className="od-voyage-controls flex items-center" aria-label="Voyage chapters">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.name}
                ref={(element) => { controlRefs.current[index] = element }}
                type="button"
                aria-pressed={activeChapter === index}
                aria-controls={`voyage-chapter-${index + 1}`}
                onClick={() => goToChapter(index)}
                onKeyDown={(event) => handleChapterKey(event, index)}
                className="od-chapter-control group inline-flex items-center gap-3"
              >
                <span className="od-control-number inline-flex items-center justify-center">0{index + 1}</span>
                <span>{chapter.navigation}</span>
                {index < 3 && <span className="od-control-line" aria-hidden="true"><span /></span>}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
