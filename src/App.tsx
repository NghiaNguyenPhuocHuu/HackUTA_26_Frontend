import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Schedule } from "./components/Schedule";
import { FAQ } from "./components/FAQ";
import { Sponsors } from "./components/Sponsors";
import { Footer } from "./components/Footer";
import { useMotionPreference } from "./hooks/useMotionPreference";
import { useEffect } from "react";
import { scrollToSection } from "./utils/scrollToSection";

export default function App() {
  const { motionEnabled } = useMotionPreference();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const scrollFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      requestAnimationFrame(() => {
        scrollToSection(id);
      });
    };

    scrollFromHash();
    window.addEventListener("hashchange", scrollFromHash);
    return () => window.removeEventListener("hashchange", scrollFromHash);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero motionEnabled={motionEnabled} />
        <About />
        <Schedule />
        <FAQ />
        <Sponsors />
      </main>
      <Footer motionEnabled={motionEnabled} />
    </>
  );
}
