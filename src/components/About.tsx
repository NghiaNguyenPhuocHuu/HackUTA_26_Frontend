import { type RefObject, useEffect, useRef, useState } from "react";
import { ThemeArt } from "./art/ThemeArt";
import { clamp01 } from "../utils/clamp";

const DISCORD_URL = "https://discord.gg/2bVsYS3SgS";

const perks = [
  { label: "24 Hours of Building", tone: "terracotta" as const },
  { label: "Free Food & Swag", tone: "ocean" as const },
  { label: "Legendary Prizes", tone: "terracotta" as const },
];

function OdysseyButton({
  href,
  children,
  inactive = false,
}: {
  href?: string;
  children: string;
  inactive?: boolean;
}) {
  if (inactive) {
    return (
      <button
        type="button"
        className="odyssey-btn inline-flex items-center justify-center"
        disabled
        aria-disabled="true"
      >
        {children}
      </button>
    );
  }

  return (
    <a
      className="odyssey-btn inline-flex items-center justify-center"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function OdysseyBoat({
  boatRef,
}: {
  boatRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={boatRef} className="odyssey-boat-track" aria-hidden="true">
      <svg className="odyssey-boat" viewBox="0 0 150 230" role="presentation">
        <g className="odyssey-boat-wake">
          <path d="M68 27C54 15 38 10 20 12" />
          <path d="M82 27C96 15 112 10 130 12" />
          <path d="M62 17C47 5 30 2 10 6" />
          <path d="M88 17C103 5 120 2 140 6" />
        </g>
        <path
          className="odyssey-boat-hull"
          d="M75 5C52 28 32 77 32 130c0 47 18 78 43 95 25-17 43-48 43-95C118 77 98 28 75 5Z"
        />
        <path
          className="odyssey-boat-hull-edge"
          d="M75 12C57 37 41 79 41 128c0 40 14 68 34 84 20-16 34-44 34-84 0-49-16-91-34-116Z"
        />
        <path
          className="odyssey-boat-deck"
          d="M75 21C61 44 50 82 50 127s10 69 25 82c15-13 25-37 25-82S89 44 75 21Z"
        />
        <path
          className="odyssey-boat-planks"
          d="M53 67h44M49 82h52M47 98h56M46 114h58M46 130h58M48 146h54M51 162h48"
        />
        <path className="odyssey-boat-keel" d="M75 34v151" />
        <path className="odyssey-boat-mast" d="M75 15v174" />
        <path
          className="odyssey-boat-rigging"
          d="M75 17 42 73M75 17l33 56M75 17 47 107M75 17l28 90"
        />
        <path
          className="odyssey-boat-sail"
          d="M75 26C57 46 45 70 42 101c14-9 25-14 33-18Z"
        />
        <path
          className="odyssey-boat-sail odyssey-boat-sail-alt"
          d="M75 26c18 20 30 44 33 75-14-9-25-14-33-18Z"
        />
        <path className="odyssey-boat-cabin" d="M59 132h32v30H59Z" />
        <path
          className="odyssey-boat-cabin-window"
          d="M65 139h20v8H65ZM65 151h20v6H65Z"
        />
        {(
          [
            [57, 92],
            [75, 116],
            [93, 140],
          ] as const
        ).map(([x, y], index) => (
          <g
            className={`odyssey-boat-rower odyssey-boat-rower-${index + 1}`}
            key={x}
          >
            <circle className="odyssey-boat-rower-head" cx={x} cy={y} r="3.5" />
            <path
              className="odyssey-boat-rower-body"
              d={`M${x - 4} ${y + 6}c2-4 6-4 8 0l-1 7h-6Z`}
            />
            <g className="odyssey-boat-paddle-set odyssey-boat-paddle-set-left">
              <path
                className="odyssey-boat-paddle-shaft"
                d={`M${x - 2} ${y + 2} ${x - 43} ${y + 14}`}
              />
              <path
                className="odyssey-boat-paddle-blade"
                d={`M${x - 43} ${y + 14}l-9 3 3 6 9-4Z`}
              />
            </g>
            <g className="odyssey-boat-paddle-set odyssey-boat-paddle-set-right">
              <path
                className="odyssey-boat-paddle-shaft"
                d={`M${x + 2} ${y + 2} ${x + 43} ${y + 14}`}
              />
              <path
                className="odyssey-boat-paddle-blade"
                d={`M${x + 43} ${y + 14}l9 3-3 6-9-4Z`}
              />
            </g>
          </g>
        ))}
        <circle className="odyssey-boat-porthole" cx="48" cy="137" r="3" />
        <circle className="odyssey-boat-porthole" cx="102" cy="137" r="3" />
        <circle className="odyssey-boat-compass" cx="75" cy="116" r="7" />
      </svg>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setRevealed(entry.isIntersecting);
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const boat = boatRef.current;
    if (!section || !boat) return;
    let frame = 0;
    const update = () => {
      const bounds = section.getBoundingClientRect();
      const progress = clamp01(
        (innerHeight - bounds.top) / (bounds.height + innerHeight),
      );
      const curve = Math.sin(progress * Math.PI);
      boat.style.setProperty(
        "--boat-left",
        `${-2 + progress * 14 + curve * 1.5}%`,
      );
      boat.style.setProperty("--boat-top", `${6 + progress * 84}%`);
      const curveAngle =
        (Math.atan2(14 + 1.5 * Math.PI * Math.cos(progress * Math.PI), 84) *
          -180) /
        Math.PI;
      boat.style.setProperty("--boat-angle", `${curveAngle}deg`);
    };
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", requestUpdate, { passive: true });
    addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", requestUpdate);
      removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="odyssey-call-section relative isolate overflow-hidden"
      data-theme="dark"
      data-revealed={revealed}
      aria-labelledby="odyssey-call-title"
    >
      <OdysseyBoat boatRef={boatRef} />
      <div className="odyssey-ocean-lines" aria-hidden="true">
        <svg viewBox="0 0 1600 360" preserveAspectRatio="none">
          <path d="M-80 28C80 -30 190 86 350 28S620 -30 780 28s270 58 430 0 270-58 430 0" />
          <path d="M-80 76C80 18 190 134 350 76S620 18 780 76s270 58 430 0 270-58 430 0" />
          <path d="M-80 124C80 66 190 182 350 124s270-58 430 0 270 58 430 0 270-58 430 0" />
          <path d="M-80 174C80 116 190 232 350 174s270-58 430 0 270 58 430 0 270-58 430 0" />
          <path d="M-80 226C80 168 190 284 350 226s270-58 430 0 270 58 430 0 270-58 430 0" />
          <path d="M-80 278C80 220 190 336 350 278s270-58 430 0 270 58 430 0 270-58 430 0" />
          <path d="M-80 334C80 276 190 392 350 334s270-58 430 0 270 58 430 0 270-58 430 0" />
        </svg>
      </div>
      <div className="section-inner odyssey-call-inner relative flex flex-col items-center text-center">
        <h2
          id="odyssey-call-title"
          className="odyssey-call-title heat-wave-text font-semibold uppercase"
        >
          Are you ready to begin your odyssey?
        </h2>
        <ThemeArt name="feast" className="odyssey-art-feast theme-art--plain" />

        <div className="odyssey-call-actions flex flex-col sm:flex-row items-stretch sm:items-center justify-center">
          <OdysseyButton href={DISCORD_URL}>Join Discord</OdysseyButton>
          <OdysseyButton inactive>Devpost</OdysseyButton>
        </div>

        <ul
          className="odyssey-call-perks flex flex-wrap items-center justify-center"
          aria-label="Event highlights"
        >
          {perks.map((perk) => (
            <li key={perk.label} data-tone={perk.tone}>
              <span aria-hidden="true" />
              {perk.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
