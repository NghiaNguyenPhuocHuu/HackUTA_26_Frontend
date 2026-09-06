export function Schedule() {
  return (
    <section
      id="schedule"
      className="weekend-section relative"
      data-theme="clay"
      aria-labelledby="weekend-title"
    >
      <div className="section-inner">
        <div className="weekend-layout grid lg:grid-cols-2 lg:items-center">
          <div className="weekend-intro">
            <h2 id="weekend-title" className="font-semibold uppercase">
              Schedule
              <br />
              coming soon.
            </h2>
            <p className="weekend-when">November 14–15, 2026 · UT Arlington</p>
          </div>

          <div className="weekend-soon">
            <p className="weekend-soon-label font-semibold uppercase">
              Full timeline on the way
            </p>
            <p className="weekend-soon-copy">
              We are still charting workshops, meals, ceremonies, and hacking
              blocks for the weekend. The complete schedule will be posted here
              as the voyage draws closer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
