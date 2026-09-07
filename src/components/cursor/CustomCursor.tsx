import { useEffect, useRef, useState } from "react";
import "./cursor.css";

// Impact sparks — 10 random directions
const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
  const dist = 18 + Math.random() * 20;
  return {
    id: i,
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist,
    dur: (0.3 + Math.random() * 0.2).toFixed(2),
  };
});

// ── Spear SVG cursor ─────────────────────────────────────────────────────────
// Oriented so the tip is at (0,0) top-left, shaft trails to bottom-right.
// Total canvas: 44×44 (fits tip + shaft at ~45°)
function SpearSVG({ hovering }: { hovering: boolean }) {
  // Shaft color shifts on hover
  const shaftColor = hovering ? "#64d2ff" : "#c8a84b";
  const tipColor = hovering ? "#e0f4ff" : "#f5e6b0";
  const glowId = "spear-glow";

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="shaftGrad" x1="10" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={shaftColor} />
          <stop offset="50%" stopColor={hovering ? "#a0e8ff" : "#e8c97a"} stopOpacity="0.7" />
          <stop offset="100%" stopColor={hovering ? "#3a8fa8" : "#7a5e22"} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="tipGrad" x1="0" y1="0" x2="14" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={tipColor} />
          <stop offset="60%" stopColor={shaftColor} />
          <stop offset="100%" stopColor={hovering ? "#2a7090" : "#9a7030"} />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={hovering ? "2.5" : "1.2"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Shaft (the pole, runs diagonal) ── */}
      {/* Main pole */}
      <line
        x1="11" y1="11"
        x2="40" y2="40"
        stroke="url(#shaftGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
        style={{ animation: "shaft-shimmer 2.5s ease-in-out infinite" }}
      />
      {/* Highlight streak along shaft */}
      <line
        x1="12" y1="10"
        x2="39" y2="37"
        stroke="white"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* ── Crossguard (small perpendicular bar) ── */}
      <line
        x1="15" y1="19"
        x2="20" y2="14"
        stroke={shaftColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="14" y1="20"
        x2="20" y2="14"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* ── Spearhead (tip) — triangular, points at 0,0 ── */}
      {/* Main blade */}
      <polygon
        points="0,0  14,6  6,14"
        fill="url(#tipGrad)"
        filter={`url(#${glowId})`}
      />
      {/* Blade left edge bevel */}
      <polygon
        points="0,0  14,6  7,7"
        fill="white"
        opacity="0.22"
      />
      {/* Blade center ridge */}
      <line
        x1="0" y1="0"
        x2="10" y2="10"
        stroke="white"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Tip highlight dot */}
      <circle
        cx="1.2" cy="1.2" r="1"
        fill="white"
        opacity="0.75"
      />

      {/* ── Butt cap (end of shaft) ── */}
      <circle
        cx="40" cy="40" r="1.5"
        fill={hovering ? "#3a8fa8" : "#7a5e22"}
        opacity="0.8"
      />
    </svg>
  );
}

// ── Custom Cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const spearRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const sparkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (spearRef.current) {
        spearRef.current.style.left = e.clientX + "px";
        spearRef.current.style.top = e.clientY + "px";
      }
      if (impactRef.current) {
        impactRef.current.style.left = e.clientX + "px";
        impactRef.current.style.top = e.clientY + "px";
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isHover = !!(el?.closest("a, button, [data-hover], input, label, select, textarea"));
      if (isHover !== hoveringRef.current) {
        hoveringRef.current = isHover;
        setHovering(isHover);
      }
    };

    const onDown = () => {
      if (!spearRef.current) return;
      // Thrust animation
      spearRef.current.classList.remove("is-clicking");
      void spearRef.current.offsetWidth;
      spearRef.current.classList.add("is-clicking");

      // Impact rings
      [ring1Ref.current, ring2Ref.current, ring3Ref.current].forEach(r => {
        if (!r) return;
        r.classList.remove("fire");
        void r.offsetWidth;
        r.classList.add("fire");
      });

      // Sparks
      sparkRefs.current.forEach(r => {
        if (!r) return;
        r.classList.remove("fire");
        void r.offsetWidth;
        r.classList.add("fire");
      });
    };

    const onUp = () => {
      spearRef.current?.classList.remove("is-clicking");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      {/* Spear cursor — top-left is the hotspot (tip) */}
      <div
        ref={spearRef}
        className={`cursor-spear${hovering ? " is-hovering" : ""}`}
      >
        <SpearSVG hovering={hovering} />
      </div>

      {/* Impact effect at cursor position */}
      <div ref={impactRef} className="cursor-impact">
        <div ref={ring1Ref} className="impact-ring" />
        <div ref={ring2Ref} className="impact-ring r2" />
        <div ref={ring3Ref} className="impact-ring r3" />
        {SPARKS.map((s, i) => (
          <div
            key={s.id}
            ref={el => { sparkRefs.current[i] = el; }}
            className="impact-spark"
            style={{
              "--tx": `${s.tx}px`,
              "--ty": `${s.ty}px`,
              "--dur": s.dur + "s",
              background: i % 3 === 0 ? "#64d2ff" : "#e8c97a",
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}

export default CustomCursor;