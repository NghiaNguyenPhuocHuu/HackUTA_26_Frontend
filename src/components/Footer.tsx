import { Logo } from './art/Logo'

export function Footer() {
  return (
    <footer className="site-footer" data-theme="dark">
      <div className="footer-main flex flex-col md:flex-row md:items-center md:justify-between">
        <a className="footer-brand inline-flex items-center gap-3" href="#top" aria-label="HackUTA 2026 — back to the beginning"><Logo className="site-logo site-logo--footer" variant="dark" /><span>2026</span></a>
        <nav className="footer-nav flex flex-wrap items-center" aria-label="Footer"><a href="#about">The crew</a><a href="#schedule">The weekend</a><a href="#faq">FAQ</a><a href="#sponsors">The supporters</a></nav>
        <a className="footer-back group inline-flex items-center gap-4" href="#top">Back to the beginning <span className="transition-transform group-hover:-translate-y-1" aria-hidden="true">↑</span></a>
      </div>
      <div className="footer-bottom flex flex-col sm:flex-row sm:justify-between"><p>Made for the journey. Made at UT Arlington.</p><p>HackUTA 2026 <span aria-hidden="true">·</span> Arlington, Texas</p></div>
    </footer>
  )
}
