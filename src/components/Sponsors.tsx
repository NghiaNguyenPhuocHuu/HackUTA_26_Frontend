import { useEffect, useRef, useState } from "react";
import { OliveBranch } from "./art/OliveBranch";
import {
  SPONSOR_EMAIL,
  SPONSOR_MAILTO,
  SPONSOR_TIERS,
  sponsors,
  type Sponsor,
} from "../constants/sponsors";

/** Tiers that actually have sponsors, highest first. */
const roster = SPONSOR_TIERS.map((meta) => ({
  ...meta,
  items: sponsors.filter((sponsor) => sponsor.tier === meta.tier),
})).filter((group) => group.items.length > 0);

function SponsorBadge({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      className="sponsor-badge"
      href={sponsor.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="sponsor-badge-logo"
        src={sponsor.image}
        alt={sponsor.name}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

function SponsorRoster() {
  return (
    <div className="sponsor-roster">
      {roster.map(({ tier, label, numeral, items }) => (
        <section className={`sponsor-tier sponsor-tier--${tier}`} key={tier}>
          <div className="sponsor-tier-heading">
            <span className="sponsor-tier-line" aria-hidden="true" />
            <h3>
              <span className="sponsor-tier-numeral" aria-hidden="true">
                {numeral}
              </span>
              <span>{label}</span>
            </h3>
            <span className="sponsor-tier-line" aria-hidden="true" />
          </div>
          <ul className="sponsor-badges">
            {items.map((sponsor) => (
              <li
                className={`sponsor-slot sponsor-slot--${tier}`}
                key={sponsor.name}
              >
                <SponsorBadge sponsor={sponsor} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Pediment, frieze, columns, and steps that frame the sponsor roster. */
function SponsorTemple({ empty }: { empty: boolean }) {
  return (
    <div className="sponsors-temple">
      <svg
        className="sponsors-temple-pediment"
        viewBox="0 0 1000 170"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 156 500 8l492 148v13H8Z"
          fill="var(--clay)"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        <path
          d="M78 145 500 29l422 116Z"
          stroke="var(--ink)"
          strokeOpacity=".4"
          strokeWidth="2"
        />
        <path d="m500 71 6 18 18 6-18 6-6 18-6-18-18-6 18-6Z" fill="#b4654d" />
      </svg>

      <p className="sponsors-temple-frieze">
        <span aria-hidden="true" />
        {empty ? "Our honorable sponsors" : "Our honorable sponsors"}
        <span aria-hidden="true" />
      </p>

      <div className="sponsors-temple-body">
        <div className="sponsors-temple-column" aria-hidden="true">
          <span />
        </div>
        <div className="sponsors-temple-screen">
          {empty ? (
            <p className="sponsors-temple-message">Sponsors announced soon</p>
          ) : (
            <SponsorRoster />
          )}
        </div>
        <div className="sponsors-temple-column" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="sponsors-temple-steps" aria-hidden="true" />
    </div>
  );
}

export function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const rosterEmpty = sponsors.length === 0;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="sponsors-section relative isolate overflow-hidden"
      data-theme="dark"
      data-revealed={revealed}
      data-roster={rosterEmpty ? "empty" : "filled"}
      aria-labelledby="sponsors-title"
    >
      <div className="sponsors-voyage-lines" aria-hidden="true">
        <svg viewBox="0 0 1440 860" preserveAspectRatio="none" fill="none">
          <path d="M-80 74c280 18 350 174 300 356s-7 329 283 479" />
          <path d="M1520 74c-280 18-350 174-300 356s7 329-283 479" />
          <path d="M-60 770c208-94 349-42 496 43s290 56 442-32 288-126 622-4" />
        </svg>
      </div>

      <div className="sponsors-olive" aria-hidden="true">
        <OliveBranch className="sponsors-olive-branch" />
      </div>

      <div className="section-inner sponsors-inner relative">
        <header className="sponsors-header">
          <h2 id="sponsors-title" className="sponsors-title uppercase">
            Sponsors of
            <br />
            HackUTA 26
          </h2>
          <p className="sponsors-subtitle">
            No great voyage is undertaken alone.
          </p>
        </header>

        <SponsorTemple empty={rosterEmpty} />

        <div className="sponsors-cta">
          <a
            className="odyssey-btn inline-flex items-center justify-center"
            href={SPONSOR_MAILTO}
          >
            Become a sponsor
          </a>
          <p className="sponsors-footnote">
            Sponsor inquiries
            <span aria-hidden="true"> · </span>
            <a href={SPONSOR_MAILTO}>{SPONSOR_EMAIL}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
