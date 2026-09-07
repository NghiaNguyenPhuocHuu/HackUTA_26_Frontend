import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Logo } from "./art/Logo";
import { PRIMARY_NAV_LINKS } from "../constants/navigation";
import { scrollToSection } from "../utils/scrollToSection";
import { clamp01 } from "../utils/clamp";

export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("clay");
  const [active, setActive] = useState("");
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mlhBadge = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("main > section"),
      );
      const headerHeight =
        header.current?.querySelector(".header-inner")?.clientHeight ?? 84;
      const readingLine = headerHeight + 65;
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      const behindHeader = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= headerHeight / 2 && rect.bottom > headerHeight / 2;
      });
      setTheme(
        behindHeader?.dataset.theme ??
          (scrollY < headerHeight ? "clay" : "dark"),
      );
      setActive(current?.id ?? "");
      const fade = clamp01(scrollY / 500);
      document.documentElement.style.setProperty(
        "--mlh-badge-fade",
        String(fade),
      );
      if (mlhBadge.current) {
        mlhBadge.current.style.pointerEvents = fade > 0.95 ? "none" : "auto";
        mlhBadge.current.setAttribute(
          "aria-hidden",
          fade > 0.95 ? "true" : "false",
        );
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
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

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || !header.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const resize = () => {
      if (innerWidth >= 768) setOpen(false);
    };
    addEventListener("keydown", close);
    addEventListener("pointerdown", outside);
    addEventListener("resize", resize);
    return () => {
      removeEventListener("keydown", close);
      removeEventListener("pointerdown", outside);
      removeEventListener("resize", resize);
    };
  }, [open]);

  const navigate = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToSection(id)) {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <>
      <a
        ref={mlhBadge}
        id="mlh-trust-badge"
        className="header-mlh-badge"
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=gray"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-gray.svg"
          alt="Major League Hacking 2026 Hackathon Season"
        />
      </a>
      <header
        ref={header}
        className="site-header"
        data-theme={theme}
        data-open={open}
      >
        <div className="header-inner flex items-center justify-between md:grid">
          <a
            href="#top"
            className="header-brand"
            aria-label="HackUTA home"
            onClick={navigate("top")}
          >
            <Logo className="site-logo" variant="adaptive" />
          </a>
          <nav
            aria-label="Main navigation"
            className="header-pill-nav items-center uppercase"
          >
            {PRIMARY_NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active === link.id ? "location" : undefined}
                onClick={navigate(link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions flex items-center justify-end">
            <button
              ref={menuButton}
              className="menu-toggle md:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
              type="button"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mobile-navigation"
          hidden={!open}
        >
          {PRIMARY_NAV_LINKS.map((link, index) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "location" : undefined}
              onClick={navigate(link.id)}
            >
              <span>0{index + 1}</span>
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </header>
    </>
  );
}
