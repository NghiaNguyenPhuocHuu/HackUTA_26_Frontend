import { useEffect, useRef } from 'react'

export function About({ motionEnabled = true }: { motionEnabled?: boolean }) {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = section.current
    if (!element) return
    if (!motionEnabled) {
      element.style.setProperty('--crew-progress', '1')
      return
    }
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight * 0.85)))
        element.style.setProperty('--crew-progress', String(progress))
      })
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [motionEnabled])

  return (
    <section ref={section} id="about" className="crew-section relative isolate overflow-hidden" data-theme="dark" aria-labelledby="crew-title">
      <div className="section-inner relative">
        <p className="section-kicker flex items-center gap-3"><span className="section-index">01</span> The crew</p>
        <h2 id="crew-title" className="crew-title font-semibold uppercase">First hackathon?<br /><span>You belong here.</span></h2>
        <div className="crew-bottom grid md:grid-cols-2">
          <div>
            <p className="crew-intro">You don’t need a finished idea.<br className="hidden sm:block" /> Just a place to start.</p>
            <p className="crew-description">HackUTA brings college students together for 24 hours of making, learning, and figuring things out. Come with a spark of an idea. Find people who help you take it further.</p>
            <a className="section-text-link group inline-flex items-center justify-between" href="#voyage">Meet your next adventure <span className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true">↘</span></a>
          </div>
          <div className="crew-notes">
            <div className="crew-note flex items-start gap-5">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 4v40M4 24h40M10 10l28 28M10 38l28-28" stroke="currentColor" strokeWidth="1.5" /><circle cx="24" cy="24" r="8" fill="var(--night)" stroke="currentColor" strokeWidth="1.5" /></svg>
              <div><h3>Start where you are.</h3><p>First-timers and experienced builders.<br />There’s room for both.</p></div>
            </div>
            <div className="crew-note flex items-start gap-5">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M7 34V22l9-9 8 9 8-9 9 9v12H7ZM16 13V7m16 6V7M15 34V24m18 10V24m-9 10V22" stroke="currentColor" strokeWidth="1.5" /></svg>
              <div><h3>Find your crew.</h3><p>Open to college students, 18+.<br />Better ideas begin with other people.</p></div>
            </div>
            <div className="crew-location flex items-center gap-3"><span aria-hidden="true">↗</span> UT Arlington <span className="crew-location-divider" aria-hidden="true" /> November 14–15</div>
          </div>
        </div>
        <dl className="crew-facts grid" aria-label="HackUTA 2026 at a glance">
          <div><dt>24</dt><dd>hours to make<br />something real</dd></div>
          <div><dt>18+</dt><dd>college students<br />from any school</dd></div>
          <div><dt>Any</dt><dd>experience level<br />has a place here</dd></div>
        </dl>
      </div>
      <svg className="crew-thread pointer-events-none" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" aria-hidden="true"><path className="crew-thread-base" d="M0 25h310c160 0 170 65 335 65h795" /><path className="crew-thread-line" pathLength="1" d="M0 25h310c160 0 170 65 335 65h795" /><circle cx="645" cy="90" r="5" /></svg>
    </section>
  )
}
