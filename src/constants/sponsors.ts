type SponsorTier = "platinum" | "gold" | "silver" | "bronze";

export type Sponsor = {
  /** Used for the logo alt text and as the React key. */
  name: string;
  /** Path or URL to the sponsor logo. */
  image: string;
  tier: SponsorTier;
  link: string;
};

export const SPONSOR_EMAIL = "sponsor@hackuta.org";

export const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(
  "HackUTA 2026 sponsorship",
)}`;

/** Highest tier first: the roster renders tiers in this order. */
export const SPONSOR_TIERS: Array<{
  tier: SponsorTier;
  label: string;
  numeral: string;
}> = [
  { tier: "platinum", label: "Platinum", numeral: "I" },
  { tier: "gold", label: "Gold", numeral: "II" },
  { tier: "silver", label: "Silver", numeral: "III" },
  { tier: "bronze", label: "Bronze", numeral: "IV" },
];

/**
 * Add confirmed sponsors here. While this list is empty the section shows
 * "Sponsors announced soon" instead of the roster.
 */
export const sponsors: Sponsor[] = [];
