import { useEffect, useRef, useState } from "react";
import { OliveBranch } from "./art/OliveBranch";

type SponsorTier = "presenting" | "olympians" | "argonauts";

type Sponsor = {
  name: string;
  tier: SponsorTier;
  logo?: string;
  href?: string;
  description?: string;
};

const sponsorTiers: Record<SponsorTier, Sponsor[]> = {
  // Keep the roster empty until partnerships are confirmed.
  presenting: [],
  olympians: [],
  argonauts: [],
};

const tierDetails: Array<{
  tier: SponsorTier;
  label: string;
  emptyLabel: string;
  emptyDetail: string;
  slots: number;
}> = [
  {
    tier: "presenting",
    label: "Presenting Partner",
    emptyLabel: "Title Sponsor",
    emptyDetail: "The name above the voyage",
    slots: 1,
  },
  {
    tier: "olympians",
    label: "Olympians",
    emptyLabel: "Open berth",
    emptyDetail: "Champion the builders",
    slots: 3,
  },
  {
    tier: "argonauts",
    label: "Argonauts",
    emptyLabel: "Join the crew",
    emptyDetail: "Fuel the first miles",
    slots: 5,
  },
];

function SponsorCard({
  sponsor,
  tier,
  index,
  emptyLabel,
  emptyDetail,
}: {
  sponsor?: Sponsor;
  tier: SponsorTier;
  index: number;
  emptyLabel: string;
  emptyDetail: string;
}) {
  const isEmpty = !sponsor;
  const accessibleName = sponsor?.name ?? `${tier} sponsor slot ${index + 1}`;

  const cardContent = sponsor?.logo ? (
    <img
      className="sponsor-card-logo"
      src={sponsor.logo}
      alt={sponsor.description ?? `${sponsor.name} logo`}
    />
  ) : sponsor ? (
    <span className="sponsor-card-name">{sponsor.name}</span>
  ) : (
    <span className="sponsor-card-placeholder">
      <span className="sponsor-card-placeholder-title">{emptyLabel}</span>
      <span className="sponsor-card-placeholder-detail">{emptyDetail}</span>
    </span>
  );

  const inner = (
    <span className="sponsor-card-content">
      {cardContent}
      {sponsor?.description && !sponsor.logo ? (
        <span className="sr-only">{sponsor.description}</span>
      ) : null}
    </span>
  );

  const className = [
    "sponsor-card",
    `sponsor-card--${tier}`,
    isEmpty ? "sponsor-card--empty" : null,
  ]
    .filter(Boolean)
    .join(" ");

  if (sponsor?.href) {
    return (
      <a
        className={className}
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${sponsor.name}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <article
      className={className}
      aria-label={sponsor ? accessibleName : undefined}
    >
      {inner}
    </article>
  );
}

function SponsorTier({
  tier,
  label,
  emptyLabel,
  emptyDetail,
  slots,
}: (typeof tierDetails)[number]) {
  const sponsors = sponsorTiers[tier];
  const cardCount = Math.max(slots, sponsors.length);

  return (
    <div className={`sponsor-tier sponsor-tier--${tier}`}>
      <div className="sponsor-tier-heading">
        <span className="sponsor-tier-line" aria-hidden="true" />
        <h3>{label}</h3>
        <span className="sponsor-tier-line" aria-hidden="true" />
      </div>
      <div className="sponsor-card-grid">
        {Array.from({ length: cardCount }, (_, index) => (
          <SponsorCard
            key={sponsors[index]?.name ?? `${tier}-slot-${index + 1}`}
            sponsor={sponsors[index]}
            tier={tier}
            index={index}
            emptyLabel={emptyLabel}
            emptyDetail={emptyDetail}
          />
        ))}
      </div>
    </div>
  );
}

export function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.12 },
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
      aria-labelledby="sponsors-title"
    >
      <div className="sponsors-voyage-lines" aria-hidden="true">
        <svg viewBox="0 0 1440 860" preserveAspectRatio="none" fill="none">
          <path d="M-80 74c280 18 350 174 300 356s-7 329 283 479" />
          <path d="M1520 74c-280 18-350 174-300 356s7 329-283 479" />
          <path d="M-60 770c208-94 349-42 496 43s290 56 442-32 288-126 622-4" />
        </svg>
      </div>

      <div className="section-inner sponsors-inner relative">
        <header className="sponsors-intro">
          <h2 id="sponsors-title" className="sponsors-title uppercase">
            Patrons of
            <br />
            the Odyssey.
          </h2>
          <div className="sponsors-intro-ornament" aria-hidden="true">
            <span />
            <OliveBranch className="sponsors-branch" />
            <span />
          </div>
          <p className="sponsors-subtitle">
            No great voyage is undertaken alone.
          </p>
        </header>

        <div className="sponsors-panel">
          <div className="sponsors-panel-rule">
            <span aria-hidden="true" />
            <span>Honor roll</span>
            <span aria-hidden="true" />
          </div>
          <div className="sponsor-tiers">
            {tierDetails.map((tier) => (
              <SponsorTier key={tier.tier} {...tier} />
            ))}
          </div>
        </div>

        <div className="sponsors-cta">
          <h3>
            Help fund
            <br />
            the next quest.
          </h3>
          <p className="sponsors-cta-copy">
            Put your name beside the builders who will remember who believed
            first.
          </p>
          <a
            className="sponsors-cta-link"
            href="mailto:info@hackuta.org?subject=HackUTA%202026%20sponsorship"
          >
            Become a patron <span aria-hidden="true">→</span>
          </a>
          <p className="sponsors-cta-contact">
            Sponsor inquiries
            <br />
            info@hackuta.org
          </p>
        </div>
      </div>
    </section>
  );
}
