import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Voyage } from './components/Voyage'
import { Schedule } from './components/Schedule'
import { FAQ } from './components/FAQ'
import { Sponsors } from './components/Sponsors'
import { Arrival } from './components/Arrival'
import { Footer } from './components/Footer'
import { useMotionPreference } from './hooks/useMotionPreference'
import './styles/sections.css'

export default function App() {
  const { motionEnabled } = useMotionPreference()
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content" tabIndex={-1}>
      <Hero motionEnabled={motionEnabled} />
      <About motionEnabled={motionEnabled} />
      <Voyage motionEnabled={motionEnabled} />
      <Schedule />
      <FAQ />
      <Sponsors />
      <Arrival motionEnabled={motionEnabled} />
    </main>
    <Footer />
  </>
}
