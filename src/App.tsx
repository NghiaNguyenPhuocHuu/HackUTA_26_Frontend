import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Voyage } from "./components/Voyage";
import { Schedule } from "./components/Schedule";
import { FAQ } from "./components/FAQ";
import { Sponsors } from "./components/Sponsors";
import { Footer } from "./components/Footer";
import { useMotionPreference } from "./hooks/useMotionPreference";

export default function App() {
  const { motionEnabled } = useMotionPreference();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero motionEnabled={motionEnabled} />
        <About />
        <Voyage motionEnabled={motionEnabled} />
        <Schedule />
        <FAQ />
        <Sponsors />
      </main>
      <Footer motionEnabled={motionEnabled} />
    </>
  );
}
