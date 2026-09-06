const weekend = [
  { day: 'SAT', date: '14', title: 'Arrive & begin', description: 'Meet your crew. Give your idea a place to begin.' },
  { day: 'SAT', date: '14', title: 'Build & learn', description: 'Try something. Get stuck. Find another way.' },
  { day: 'SUN', date: '15', title: 'Finish & present', description: 'Bring it together. Share what you made.' },
  { day: 'SUN', date: '15', title: 'Celebrate', description: 'The things you built. The people you met.' },
]

export function Schedule() {
  return (
    <section id="schedule" className="weekend-section relative" data-theme="clay" aria-labelledby="weekend-title">
      <div className="section-inner">
        <div className="weekend-heading flex flex-col lg:flex-row lg:items-end lg:justify-between">
          <div><p className="weekend-eyebrow uppercase">Two days. Your next chapter.</p><h2 id="weekend-title" className="font-semibold uppercase">The weekend<br />at a glance.</h2></div>
          <div className="weekend-date"><p>November 14–15, 2026</p><span>Provisional outline · Exact times to come</span></div>
        </div>
        <ol className="weekend-list">
          {weekend.map((event, index) => (
            <li key={event.title} className="weekend-row grid items-center">
              <span className="weekend-number" aria-hidden="true">0{index + 1}</span>
              <span className="weekend-day"><span>{event.day}</span><b>{event.date}</b></span>
              <h3 className="font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <span className="weekend-time">Time TBA</span>
            </li>
          ))}
        </ol>
        <p className="weekend-note flex items-center gap-2"><span aria-hidden="true">✳</span> A little room for the unexpected. We’ll share the full schedule closer to the voyage.</p>
      </div>
    </section>
  )
}
