import type { ReactNode, MouseEvent } from "react";
import { Logo } from "./art/Logo";
import { Ship } from "./art/Ship";
import { PRIMARY_NAV_LINKS } from "../constants/navigation";
import { scrollToSection } from "../utils/scrollToSection";

const exploreLinks = [
  ...PRIMARY_NAV_LINKS,
  { id: "about", label: "Apply" },
];

const otherHackathons = [
  { href: "https://hackutd.co/", label: "HackUTD" },
  { href: "https://tamuhack.org/", label: "TAMUHack" },
  { href: "https://rowdyhacks.org/", label: "RowdyHacks" },
  { href: "https://hacktx.com/", label: "HackTX" },
  { href: "https://hackunt.com/", label: "HackUNT" },
];

const socialLinks = [
  {
    href: "https://instagram.com/hackuta",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/hackuta",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M8 10v7M8 7.5v.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M12 17v-4.2c0-1.2.9-2.3 2.1-2.3s1.9 1 1.9 2.3V17"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M12 12.8V17"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "https://github.com/hackuta",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .2-1.4-.9-2 3-.3 3-1.5 3-3.4 0-.8-.3-1.5-.8-2 .1-.2.4-1.1-.1-2.2 0 0-.7-.2-2.2.8-.6-.2-1.3-.3-2-.3s-1.4.1-2 .3c-1.5-1-2.2-.8-2.2-.8-.5 1.1-.2 2-.1 2.2-.5.5-.8 1.2-.8 2 0 1.9 1 3.2 3 3.4-.6.5-.9 1.1-.9 2V21"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function InfoColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="footer-column">
      <h3 className="footer-column-title uppercase">{title}</h3>
      {children}
    </div>
  );
}

export function Footer({ motionEnabled = true }: { motionEnabled?: boolean }) {
  const navigate =
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (scrollToSection(id)) event.preventDefault();
    };

  return (
    <footer
      id="footer"
      className={`footer-section relative isolate overflow-hidden${motionEnabled ? " footer-motion" : ""}`}
      data-theme="clay"
      aria-label="Site footer"
    >
      <div className="section-inner footer-content relative">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <a
              className="footer-brand-lockup inline-flex items-center gap-3"
              href="#top"
              aria-label="HackUTA home"
              onClick={navigate("top")}
            >
              <Logo className="site-logo site-logo--footer" variant="light" />
              <span className="footer-brand-name font-semibold">HackUTA</span>
            </a>
            <p className="footer-tagline">
              HackUTA is UTA&apos;s premier hackathon, bringing students
              together to build, learn, and create over a high-energy 24 hours.
            </p>
            <div className="footer-social flex items-center">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="footer-social-link inline-flex items-center justify-center"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <InfoColumn title="Explore">
            <ul className="footer-link-list">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={`#${link.id}`} onClick={navigate(link.id)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </InfoColumn>

          <InfoColumn title="Event">
            <address className="footer-event not-italic">
              <span>November 14–15, 2026</span>
              <span>University of Texas at Arlington</span>
              <span>Arlington, TX</span>
            </address>
          </InfoColumn>

          <InfoColumn title="Other hackathons">
            <ul className="footer-link-list">
              {otherHackathons.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </InfoColumn>
        </div>
      </div>

      <div className="footer-sea" aria-hidden="true">
        <svg
          className="footer-water"
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="footer-water-depth"
              x1="0"
              y1="52"
              x2="0"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#102f46" stopOpacity=".13" />
              <stop offset="1" stopColor="#102f46" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="footer-water-fill"
            fill="url(#footer-water-depth)"
            d="M-60 54c180-20 270 24 450 7s290-7 450 2 310-24 650-6V90H-60Z"
          />
          <path
            className="footer-water-line"
            d="M-60 54c180-20 270 24 450 7s290-7 450 2 310-24 650-6"
          />
        </svg>
        <div className="footer-vessel">
          <Ship className="footer-ship" tone="ink" rowing={motionEnabled} />
        </div>
      </div>

      <div className="section-inner footer-bottom">
        <p>© 2026 HackUTA. All rights reserved.</p>
        <a
          href="https://mlh.io/code-of-conduct"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code of Conduct
        </a>
      </div>
    </footer>
  );
}
