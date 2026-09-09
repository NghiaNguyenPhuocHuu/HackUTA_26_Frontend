import { useEffect, useId, useRef, useState } from "react";
import "./cursor.css";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "label",
  '[role="button"]',
  '[role="link"]',
  "[data-hover]",
].join(",");

const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const dist = 20 + (i % 4) * 5;

  return {
    id: i,
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist,
    dur: 0.3 + (i % 3) * 0.05,
  };
});

type CursorTheme = "clay" | "dark";

const THEME_PALETTE: Record<CursorTheme, { bow: string; trim: string }> = {
  clay: { bow: "var(--ink)", trim: "var(--night)" },
  dark: { bow: "var(--clay)", trim: "var(--sand)" },
};

function BowSVG({
  hovering,
  theme,
  gradientId,
}: {
  hovering: boolean;
  theme: CursorTheme;
  gradientId: string;
}) {
  const palette = THEME_PALETTE[theme] ?? THEME_PALETTE.clay;
  const bowColor = hovering ? "#64d2ff" : palette.bow;
  const trim = hovering ? "#a0e8ff" : palette.trim;

  return (
    <svg
      width="54"
      height="54"
      viewBox="-6 -6 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bowColor} />
          <stop offset="100%" stopColor={trim} />
        </linearGradient>
      </defs>

      <g className="bow-group">
        <path
          d="M 50 0 C 20 0 0 20 0 50"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="bow-limb"
        />

        <path
          d="M 48 2 C 22 2 0 18 0 48"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
          className="bow-limb-back"
        />

        <line
          x1="0"
          y1="50"
          x2="25"
          y2="25"
          stroke="#fff"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.85"
          className={`bow-string-left ${hovering ? "is-hover" : ""}`}
          style={{ transformBox: "fill-box", transformOrigin: "10px 6px" }}
        />
        <line
          x1="25"
          y1="25"
          x2="50"
          y2="0"
          stroke="#fff"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.85"
          className={`bow-string-right ${hovering ? "is-hover" : ""}`}
          style={{ transformBox: "fill-box", transformOrigin: "10px 6px" }}
        />
      </g>

      <g className="bow-arrow">
        <line
          x1="0"
          y1="0"
          x2="34"
          y2="34"
          stroke="#f5e6b0"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <polygon points="-6,-6 4,0 0,4" fill="#c8a84b" opacity="0.95" />
        <line
          x1="28"
          y1="28"
          x2="34"
          y2="34"
          stroke="#ffffff33"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function supportsFinePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export default function CustomCursor() {
  const gradientId = useId().replace(/:/g, "");
  const cursorRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const sparkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [enabled] = useState(() => supportsFinePointer());
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);

  const [theme, setTheme] = useState<CursorTheme>("clay");
  const themeRef = useRef<CursorTheme>("clay");

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-enabled");

    let frame: number | null = null;
    let mouseX = 0;
    let mouseY = 0;

    const setHover = (next: boolean) => {
      if (next === hoveringRef.current) return;
      hoveringRef.current = next;
      setHovering(next);
    };

    const updateHoverFromTarget = (target: Element | null) => {
      setHover(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const applyPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const under = document.elementFromPoint(mouseX, mouseY);
      const nextTheme: CursorTheme =
        under?.closest<HTMLElement>("[data-theme]")?.dataset.theme === "dark"
          ? "dark"
          : "clay";

      if (nextTheme !== themeRef.current) {
        themeRef.current = nextTheme;
        setTheme(nextTheme);
      }

      frame = null;
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorRef.current?.classList.add("is-visible");

      if (frame === null) {
        frame = requestAnimationFrame(applyPosition);
      }

      updateHoverFromTarget(e.target as Element | null);
    };

    const onPointerOver = (e: PointerEvent) => {
      updateHoverFromTarget(e.target as Element | null);
    };

    const restartImpact = () => {
      const elements = [
        ring1Ref.current,
        ring2Ref.current,
        ring3Ref.current,
        ...sparkRefs.current,
      ].filter((el): el is HTMLDivElement => Boolean(el));

      elements.forEach((el) => el.classList.remove("fire"));

      if (cursorRef.current) {
        void cursorRef.current.offsetWidth;
      }

      elements.forEach((el) => el.classList.add("fire"));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || !visualRef.current) return;

      visualRef.current.classList.remove("is-clicking");
      void visualRef.current.offsetWidth;
      visualRef.current.classList.add("is-clicking");
      restartImpact();
    };

    const resetClick = () => {
      visualRef.current?.classList.remove("is-clicking");
    };

    const visual = visualRef.current;

    const onAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName === "arrow-release") {
        resetClick();
      }
    };

    const hideCursor = () => {
      cursorRef.current?.classList.remove("is-visible");
    };

    const showCursor = () => {
      cursorRef.current?.classList.add("is-visible");
    };

    visual?.addEventListener("animationend", onAnimationEnd);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointercancel", resetClick);
    window.addEventListener("blur", resetClick);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    return () => {
      root.classList.remove("custom-cursor-enabled");
      if (frame !== null) cancelAnimationFrame(frame);
      visual?.removeEventListener("animationend", onAnimationEnd);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointercancel", resetClick);
      window.removeEventListener("blur", resetClick);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <div
        ref={visualRef}
        className={`cursor-bow-visual${hovering ? " is-hovering" : ""}`}
      >
        <BowSVG hovering={hovering} theme={theme} gradientId={gradientId} />
      </div>

      <div className="cursor-impact">
        <div ref={ring1Ref} className="impact-ring" />
        <div ref={ring2Ref} className="impact-ring r2" />
        <div ref={ring3Ref} className="impact-ring r3" />
        {SPARKS.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              sparkRefs.current[i] = el;
            }}
            className="impact-spark"
            style={
              {
                "--tx": `${s.tx}px`,
                "--ty": `${s.ty}px`,
                "--dur": `${s.dur}s`,
                background: i % 3 === 0 ? "#64d2ff" : "#e8c97a",
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}