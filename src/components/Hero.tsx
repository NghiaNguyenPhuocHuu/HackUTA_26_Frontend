import { type CSSProperties } from "react";
import { Ship } from "./art/Ship";
import { Wordmark } from "./art/Wordmark";
import { HERO_AMBIENT_STORM } from "../constants/heroWeather";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HeroWaves } from "./HeroWaves";

type HeroProps = { motionEnabled: boolean };

const rain = Array.from({ length: 52 }, (_, index) => ({
  left: `${(index * 37 + 11) % 101}%`,
  delay: `${-((index * 0.37) % 3.8)}s`,
  duration: `${1.05 + (index % 7) * 0.08}s`,
  opacity: 0.16 + (index % 5) * 0.07,
}));

export function Hero({ motionEnabled }: HeroProps) {
  const storm = motionEnabled ? HERO_AMBIENT_STORM : 0;

  return (
    <section
      id="top"
      className="od-hero"
      data-animated={motionEnabled}
      data-motion={motionEnabled}
      style={{ "--storm": storm } as CSSProperties}
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
              style={
                {
                  left: drop.left,
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                  opacity: drop.opacity,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="od-hero-copy relative z-10 mx-auto text-center">
          <p className="od-hero-date flex items-center justify-center font-semibold uppercase">
            <span>November 14–15, 2026</span>
            <span className="od-hero-date-divider" aria-hidden="true" />
            <span>UT Arlington</span>
          </p>
          <h1 id="hero-title" className="od-hero-title mx-auto">
            <span className="sr-only">HackUTA 2026: The Odyssey</span>
            <span aria-hidden="true">
              <Wordmark className="od-hero-wordmark" />
            </span>
          </h1>
          <p className="od-hero-edition flex items-center justify-center font-semibold uppercase">
            <span className="od-star" aria-hidden="true">
              ✦
            </span>
            <span>The Odyssey</span>
            <span className="od-star" aria-hidden="true">
              ✦
            </span>
          </p>
          <p className="od-hero-description">
            A 24-hour hackathon.
            <br className="od-mobile-break" /> A journey worth taking.
          </p>
          <a
            className="od-set-sail group inline-flex items-center justify-between font-semibold uppercase"
            href="#about"
          >
            <span>Set sail</span>
            <svg
              className="transition-transform duration-300 group-hover:translate-y-1"
              viewBox="0 0 24 24"
              width="23"
              height="23"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3v17m-6-6 6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </a>
          <p className="od-hero-eligibility">
            College students 18+ <span aria-hidden="true">·</span> All
            experience levels
          </p>
          <p className="od-hero-availability">
            <span aria-hidden="true" />
            Applications open soon
          </p>
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
        <div className="od-hero-foot absolute inset-x-0 bottom-0 z-20 flex items-center justify-between">
          <span>
            Arlington, Texas <span aria-hidden="true">/</span> 2026
          </span>
          <a
            href="#about"
            className="od-scroll-invitation inline-flex items-center gap-4"
          >
            Scroll into the story{" "}
            <span className="od-scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
