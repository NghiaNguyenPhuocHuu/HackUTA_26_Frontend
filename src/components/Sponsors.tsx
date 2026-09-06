import { OliveBranch } from './art/OliveBranch'

export function Sponsors() {
  return (
    <section id="sponsors" className="supporters-section relative isolate overflow-hidden" data-theme="dark" aria-labelledby="supporters-title">
      <div className="section-inner relative">
        <p className="section-kicker flex items-center gap-3"><span className="section-index">04</span> The supporters</p>
        <div className="supporters-content relative">
          <h2 id="supporters-title" className="font-semibold uppercase">Every voyage<br />needs a little wind.</h2>
          <div className="supporters-copy flex flex-col md:flex-row">
            <p>Behind every new idea are people who believe it deserves a beginning. Our sponsors help make that possible.</p>
            <div className="supporters-announcement"><span className="supporters-status-label flex items-center gap-2"><i aria-hidden="true" /> On the horizon</span><p>Our 2026 supporters<br />will be announced soon.</p></div>
          </div>
        </div>
      </div>
      <div className="supporters-olive pointer-events-none" aria-hidden="true"><span className="supporters-orbit" /><OliveBranch className="supporters-branch" /></div>
    </section>
  )
}
