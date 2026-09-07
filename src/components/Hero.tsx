import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Ship } from "./art/Ship";
import { Logo } from "./art/Logo";
import { HERO_AMBIENT_STORM } from "../constants/heroWeather";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HeroWaves } from "./HeroWaves";
import { clamp01 } from "../utils/clamp";

type HeroProps = { motionEnabled: boolean };
type HeroStyle = CSSProperties & { "--storm": number };

const rain = Array.from({ length: 52 }, (_, index) => ({
  left: `${(index * 37 + 11) % 101}%`,
  delay: `${-((index * 0.37) % 3.8)}s`,
  duration: `${1.05 + (index % 7) * 0.08}s`,
  opacity: 0.16 + (index % 5) * 0.07,
}));

const HERO_WORDMARK = "HackUTA";
const TYPEWRITER_START_DELAY_MS = 420;
const TYPEWRITER_CHAR_DELAY_MS = 92;

function HeroWordmark({
  motionEnabled,
  onComplete,
}: {
  motionEnabled: boolean;
  onComplete: () => void;
}) {
  const [length, setLength] = useState(
    motionEnabled ? 0 : HERO_WORDMARK.length,
  );
  const completedRef = useRef(!motionEnabled);

  useEffect(() => {
    if (!motionEnabled) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    if (length >= HERO_WORDMARK.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    const delay =
      length === 0 ? TYPEWRITER_START_DELAY_MS : TYPEWRITER_CHAR_DELAY_MS;
    const timer = window.setTimeout(() => setLength(length + 1), delay);
    return () => window.clearTimeout(timer);
  }, [length, motionEnabled, onComplete]);

  const typing = motionEnabled && length < HERO_WORDMARK.length;

  return (
    <span className="od-hero-wordmark">
      {HERO_WORDMARK.slice(0, length)}
      {typing ? (
        <span className="od-hero-wordmark-cursor" aria-hidden="true">
          |
        </span>
      ) : null}
    </span>
  );
}

export function Hero({ motionEnabled }: HeroProps) {
  const storm = motionEnabled ? HERO_AMBIENT_STORM : 0;
  const heroStyle: HeroStyle = { "--storm": storm };
  const heroRef = useRef<HTMLElement>(null);
  const [showYear, setShowYear] = useState(!motionEnabled);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frame = 0;
    const apply = () => {
      const rect = hero.getBoundingClientRect();
      const exit = clamp01(-rect.top / (rect.height * 0.55));
      hero.style.setProperty("--hero-exit", String(exit));
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    apply();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    addEventListener("scrollend", apply);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      removeEventListener("scrollend", apply);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="od-hero"
      data-animated={motionEnabled}
      data-motion={motionEnabled}
      style={heroStyle}
      aria-labelledby="hero-title"
    >
      <div className="od-hero-stage">
        <HeroAtmosphere motionEnabled={motionEnabled} storm={storm} />
        <div className="od-lightning od-lightning-left" aria-hidden="true">
          <svg viewBox="0 0 120 330">
            <path d="m75 4-43 118 38-9-34 90 33-13-25 132 69-173-39 13 34-77-37 9Z" />
          </svg>
        </div>
        <div className="od-lightning od-lightning-right" aria-hidden="true">
          <svg viewBox="0 0 120 330">
            <path d="m75 4-43 118 38-9-34 90 33-13-25 132 69-173-39 13 34-77-37 9Z" />
          </svg>
        </div>
        <div className="od-lightning-wash" aria-hidden="true" />
        <div className="od-hero-coast od-hero-coast-left" aria-hidden="true">
          <img
            src="/images/coast-cliff-v7.webp"
            width="1024"
            height="1536"
            alt=""
            fetchPriority="high"
          />
        </div>
        <div className="od-hero-coast od-hero-coast-right" aria-hidden="true">
          <img
            src="/images/coast-cliff-v7.webp"
            width="1024"
            height="1536"
            alt=""
          />
        </div>
        <div className="od-rain" aria-hidden="true">
          {rain.map((drop, index) => (
            <i
              key={index}
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>
        <div className="od-hero-copy relative z-10 mx-auto">
          <div className="od-hero-copy-logo">
            <Logo className="od-hero-logo" />
          </div>
          <div className="od-hero-copy-text">
            <p className="od-hero-date uppercase">
              <span>November 14–15, 2026</span>
            </p>
            <h1 id="hero-title" className="od-hero-title flex items-end gap-2">
              <HeroWordmark
                motionEnabled={motionEnabled}
                onComplete={() => setShowYear(true)}
              />
              <span
                className="od-hero-year font-semibold"
                data-visible={showYear}
              >
                26
              </span>
            </h1>
            <div className="od-hero-coming-soon" role="status">
              <span className="od-hero-coming-soon-mark" aria-hidden="true" />
              <span>Coming soon</span>
            </div>
          </div>
        </div>
        <div className="od-hero-boat" aria-hidden="true">
          <Ship className="od-hero-ship" rowing={motionEnabled} tone="ink" />
        </div>
        <HeroWaves motionEnabled={motionEnabled} storm={storm} />
        <div className="od-departure-water" aria-hidden="true">
          <svg viewBox="0 0 3200 120" preserveAspectRatio="none">
            <g className="od-wave-surface">
              <path
                d="M-400 27Q-300 2-200 27T0 27T200 27T400 27T600 27T800 27T1000 27T1200 27T1400 27T1600 27T1800 27T2000 27T2200 27T2400 27T2600 27T2800 27T3000 27T3200 27T3400 27v130H-400Z"
                fill="currentColor"
              />
              <path
                d="M-400 27Q-300 2-200 27T0 27T200 27T400 27T600 27T800 27T1000 27T1200 27T1400 27T1600 27T1800 27T2000 27T2200 27T2400 27T2600 27T2800 27T3000 27T3200 27T3400 27"
                stroke="var(--clay)"
                strokeWidth="2"
              />
            </g>
            <g className="od-wave-ripple">
              <path
                d="M-400 52Q-300 34-200 52T0 52T200 52T400 52T600 52T800 52T1000 52T1200 52T1400 52T1600 52T1800 52T2000 52T2200 52T2400 52T2600 52T2800 52T3000 52T3200 52T3400 52"
                stroke="var(--clay)"
                strokeWidth="1"
                opacity=".55"
              />
            </g>
            <g className="od-wave-depth">
              <path
                d="M-400 74Q-300 58-200 74T0 74T200 74T400 74T600 74T800 74T1000 74T1200 74T1400 74T1600 74T1800 74T2000 74T2200 74T2400 74T2600 74T2800 74T3000 74T3200 74T3400 74"
                stroke="var(--clay)"
                strokeWidth="1"
                opacity=".35"
              />
            </g>
          </svg>
        </div>
        <div className="od-hero-foot absolute inset-x-0 bottom-0 z-20 flex items-center">
          <span>
            Arlington, Texas <span aria-hidden="true">/</span> 2026
          </span>
        </div>
      </div>
    </section>
  );
}
