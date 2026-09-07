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
  slots: number;
}> = [
  { tier: "platinum", numeral: "I", label: "Platinum", slots: 2 },
  { tier: "gold", numeral: "II", label: "Gold", slots: 3 },
  { tier: "silver", numeral: "III", label: "Silver", slots: 3 },
  { tier: "bronze", numeral: "IV", label: "Bronze", slots: 4 },
];

const sponsorPerks = [
  { label: "Recruit earlier", tone: "terracotta" as const },
  { label: "Campus presence", tone: "ocean" as const },
  { label: "Ship with builders", tone: "terracotta" as const },
] as const;

function SponsorCard({
  sponsor,
  tier,
}: {
  sponsor?: Sponsor;
  tier: SponsorTier;
}) {
  const isEmpty = !sponsor;
  const isPresenting = Boolean(sponsor?.presenting && tier === "platinum");

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
      <span className="sponsor-card-placeholder-title">Open</span>
      <span className="sponsor-card-placeholder-detail">Seeking patron</span>
    </span>
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

  if (isEmpty) {
    return (
      <a
        className={className}
        href={SPONSOR_MAILTO}
        aria-label={`Inquire about ${tier} sponsorship`}
      >
        {inner}
      </a>
    );
  }

  if (sponsor.href) {
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
    <article className={className} aria-label={sponsor.name}>
      {inner}
    </article>
  );
}

function SponsorTier({
  tier,
  numeral,
  label,
  slots,
}: (typeof tierDetails)[number]) {
  const sponsors = sponsorTiers[tier];
  const hasOpenBerth = sponsors.length < slots;

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
      <div
        className={[
          "sponsor-card-grid",
          sponsors.length + (hasOpenBerth ? 1 : 0) < 3
            ? "sponsor-card-grid--sparse"
            : null,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} tier={tier} />
        ))}
        {hasOpenBerth ? <SponsorCard tier={tier} /> : null}
      </div>
    </div>
  );
}

function SponsorsPerks() {
  return (
    <ul className="sponsors-perks" aria-label="Why sponsor">
      {sponsorPerks.map((perk) => (
        <li key={perk.label} data-tone={perk.tone}>
          <span aria-hidden="true" />
          {perk.label}
        </li>
      ))}
    </ul>
  );
}

function SponsorsEmptyCall() {
  return (
    <div className="sponsors-call">
      <div className="sponsors-call-intro">
        <p className="sponsors-status status-dot">Seeking patrons</p>
        <h2 id="sponsors-title" className="sponsors-title uppercase">
          Patrons of
          <br />
          the Odyssey.
        </h2>
        <p className="sponsors-lede">
          No great voyage is undertaken alone. Partner with HackUTA to recruit,
          build brand on campus, or put your API in a 24-hour room.
        </p>
        <div className="sponsors-call-actions">
          <a
            className="odyssey-btn inline-flex items-center justify-center"
            href={SPONSOR_MAILTO}
          >
            Become a patron
          </a>
        </div>
        <SponsorsPerks />
        <p className="sponsors-footnote">
          Honor roll opens as partnerships are confirmed
          <span aria-hidden="true"> · </span>
          <a href={SPONSOR_MAILTO}>{SPONSOR_EMAIL}</a>
        </p>
      </div>

      <div className="sponsors-temple">
        <svg className="sponsors-temple-pediment" viewBox="0 0 1000 170" fill="none" aria-hidden="true">
          <path d="M8 156 500 8l492 148v13H8Z" fill="var(--clay)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M78 145 500 29l422 116Z" stroke="var(--ink)" strokeOpacity=".4" strokeWidth="2" />
          <path d="m500 71 6 18 18 6-18 6-6 18-6-18-18-6 18-6Z" fill="#b4654d" />
        </svg>
        <div className="sponsors-temple-frieze" aria-hidden="true"><span />Honor roll<span /></div>
        <div className="sponsors-temple-body">
          <div className="sponsors-temple-column" aria-hidden="true"><span /></div>
          <div className="sponsors-temple-screen">
          <p>Sponsors announced soon</p>
          </div>
          <div className="sponsors-temple-column" aria-hidden="true"><span /></div>
        </div>
        <div className="sponsors-temple-steps" aria-hidden="true" />
      </div>
    </div>
  );
}

function SponsorsFilled() {
  return (
    <>
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
        <p className="sponsors-cta-kicker">A berth still open?</p>
        <a
          className="odyssey-btn inline-flex items-center justify-center"
          href={SPONSOR_MAILTO}
        >
          Become a patron
        </a>
        <p className="sponsors-cta-contact">
          Sponsor inquiries
          <span aria-hidden="true"> · </span>
          <a href={SPONSOR_MAILTO}>{SPONSOR_EMAIL}</a>
        </p>
      </div>
    </>
  );
}

export function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const rosterEmpty = tierDetails.every(
    ({ tier }) => sponsorTiers[tier].length === 0,
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
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
        {rosterEmpty ? <SponsorsEmptyCall /> : <SponsorsFilled />}
      </div>
    </section>
  );
}
