import { useEffect, useRef, useState } from "react";
import { Logo } from "./art/Logo";

const links = [
  { id: "about", label: "About" },
  { id: "schedule", label: "Schedule" },
  { id: "faq", label: "FAQ" },
  { id: "sponsors", label: "Sponsors" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("clay");
  const [active, setActive] = useState("");
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

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
      if (!header.current?.contains(event.target as Node)) setOpen(false);
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

  return (
    <header
      ref={header}
      className="site-header"
      data-theme={theme}
      data-open={open}
    >
      <div className="header-inner flex items-center justify-between md:justify-center">
        <a
          href="#top"
          className="header-brand"
          aria-label="HackUTA home"
          onClick={() => setOpen(false)}
        >
          <Logo className="site-logo" />
        </a>
        <nav
          aria-label="Main navigation"
          className="header-pill-nav items-center uppercase"
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header-actions flex items-center gap-3">
          <a href="#arrival" className="header-apply font-semibold uppercase">
            Apply now
          </a>
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
        {links.map((link, index) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={active === link.id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            <span>0{index + 1}</span>
            {link.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
