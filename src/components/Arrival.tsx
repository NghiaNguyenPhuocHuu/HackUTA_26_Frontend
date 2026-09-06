import { Ship } from './art/Ship'

export function Arrival({ motionEnabled = true }: { motionEnabled?: boolean }) {
  return (
    <section id="arrival" className={`arrival-section relative isolate overflow-hidden text-center${motionEnabled ? ' arrival-motion' : ''}`} data-theme="clay" aria-labelledby="arrival-title">
      <div className="arrival-sun pointer-events-none" aria-hidden="true"><div /></div>
      <div className="section-inner relative">
        <p className="section-kicker flex items-center justify-center gap-3"><span className="section-index">04</span> Back to Arlington</p>
        <p className="arrival-date uppercase">November 14–15, 2026 <span aria-hidden="true">/</span> UT Arlington</p>
        <h2 id="arrival-title" className="font-semibold uppercase">Your odyssey<br />begins here.</h2>
        <p className="arrival-description">Bring an idea. Find your crew.<br className="sm:hidden" /> See what you can make.</p>
        <p className="arrival-status inline-flex items-center gap-2.5"><span aria-hidden="true" /> Applications open soon</p>
      </div>
      <div className="arrival-sea pointer-events-none" aria-hidden="true">
        <svg className="arrival-water" viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none">
          <path d="M-60 32c180-20 270 24 450 7s290-7 450 2 310-24 650-6M-60 54c180-20 270 24 450 7s290-7 450 2 310-24 650-6" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="arrival-vessel"><Ship className="arrival-ship" tone="ink" rowing={motionEnabled} /></div>
      </div>
      <div className="arrival-coordinates flex justify-between" aria-hidden="true"><span>The journey is just beginning.</span><span>32.73° N &nbsp; 97.11° W</span></div>
    </section>
  )
}
