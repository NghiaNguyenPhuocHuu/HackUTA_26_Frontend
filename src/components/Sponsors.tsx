import { useEffect, useRef, useState } from "react";
import { OliveBranch } from "./art/OliveBranch";

type SponsorTier = "platinum" | "gold" | "silver" | "bronze";

type Sponsor = {
  name: string;
  tier: SponsorTier;
  logo?: string;
  href?: string;
  description?: string;
  /** Presenting is a Platinum-only designation from the sponsor packet. */
  presenting?: boolean;
};

const SPONSOR_EMAIL = "sponsor@hackuta.org";
const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("HackUTA 2026 sponsorship")}`;

const sponsorTiers: Record<SponsorTier, Sponsor[]> = {
  // Keep the roster empty until partnerships are confirmed.
  platinum: [],
  gold: [],
  silver: [],
  bronze: [],
};

const tierDetails: Array<{
  tier: SponsorTier;
  numeral: string;
  label: string;
  emptyLabel: string;
  emptyDetail: string;
  slots: number;
}> = [
  {
    tier: "platinum",
    numeral: "I",
    label: "Platinum",
    emptyLabel: "Platinum berth",
    emptyDetail: "Keynote · presenting available",
    slots: 2,
  },
  {
    tier: "gold",
    numeral: "II",
    label: "Gold",
    emptyLabel: "Gold berth",
    emptyDetail: "API · mentors · shirt mark",
    slots: 3,
  },
  {
    tier: "silver",
    numeral: "III",
    label: "Silver",
    emptyLabel: "Silver berth",
    emptyDetail: "Track · judges · stage time",
    slots: 3,
  },
  {
    tier: "bronze",
    numeral: "IV",
    label: "Bronze",
    emptyLabel: "Bronze berth",
    emptyDetail: "Logo · mentors · floor table",
    slots: 4,
  },
];

const sponsorPerks = [
  { label: "Recruit earlier", detail: "Meet builders before the job board" },
  { label: "Be known on campus", detail: "Site, shirts, itinerary, social" },
  { label: "Watch them ship", detail: "Your API in a 24-hour room" },
] as const;

function SponsorCard({
  sponsor,
  tier,
  index,
  emptyLabel,
  emptyDetail,
  showEmptyCopy,
}: {
  sponsor?: Sponsor;
  tier: SponsorTier;
  index: number;
  emptyLabel: string;
  emptyDetail: string;
  showEmptyCopy: boolean;
}) {
  const isEmpty = !sponsor;
  const isPresenting = Boolean(sponsor?.presenting && tier === "platinum");
  const accessibleName = sponsor?.name ?? `${tier} sponsor slot ${index + 1}`;

  const cardContent = sponsor?.logo ? (
    <img
      className="sponsor-card-logo"
      src={sponsor.logo}
      alt={sponsor.description ?? `${sponsor.name} logo`}
    />
  ) : sponsor ? (
    <span className="sponsor-card-name">{sponsor.name}</span>
  ) : showEmptyCopy ? (
    <span className="sponsor-card-placeholder">
      <span className="sponsor-card-placeholder-title">{emptyLabel}</span>
      <span className="sponsor-card-placeholder-detail">{emptyDetail}</span>
    </span>
  ) : (
    <span className="sr-only">{emptyLabel}</span>
  );

  const inner = (
    <span className="sponsor-card-content">
      {isPresenting ? (
        <span className="sponsor-card-badge">Presenting</span>
      ) : null}
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
    isPresenting ? "sponsor-card--presenting" : null,
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
  numeral,
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
        <h3>
          <span className="sponsor-tier-numeral" aria-hidden="true">
            {numeral}
          </span>
          <span>{label}</span>
        </h3>
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
            showEmptyCopy={
              !sponsors[index] &&
              sponsors.slice(0, index).every((entry) => Boolean(entry))
            }
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
            Start with the goal — recruiting, brand, or product — and we will
            price a package around it.
          </p>
          <ul className="sponsors-cta-perks" aria-label="Why sponsor">
            {sponsorPerks.map((perk) => (
              <li key={perk.label}>
                <span className="sponsors-cta-perk-label">{perk.label}</span>
                <span className="sponsors-cta-perk-detail">{perk.detail}</span>
              </li>
            ))}
          </ul>
          <a className="sponsors-cta-link" href={SPONSOR_MAILTO}>
            Become a patron <span aria-hidden="true">→</span>
          </a>
          <p className="sponsors-cta-contact">
            Sponsor inquiries
            <br />
            {SPONSOR_EMAIL}
          </p>
        </div>
      </div>
    </section>
  );
}
