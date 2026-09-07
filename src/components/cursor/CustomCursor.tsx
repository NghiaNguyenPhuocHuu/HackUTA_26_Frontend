import { useEffect, useRef, useState } from "react";
import "./cursor.css";

// Impact sparks
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

function BowSVG({ hovering }: { hovering: boolean }) {
  const bowColor = hovering ? "#64d2ff" : "#c8a84b";
  const trim = hovering ? "#a0e8ff" : "#e8c97a";

  return (
    <svg
      width="54"
      height="54"
      viewBox="-6 -6 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bowColor} />
          <stop offset="100%" stopColor={trim} />
        </linearGradient>
      </defs>

      {/* Curved bow limb (arc) */}
      <path
        d="M 50 0 C 20 0 0 20 0 50"
        stroke="url(#bowGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className="bow-limb"
      />

      {/* Back limb mirror for thickness */}
      <path
        d="M 48 2 C 22 2 0 18 0 48"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
        className="bow-limb-back"
      />

      {/* String */}
      <line
        x1="0" y1="50"
        x2="25" y2="25"
        stroke="#fff"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
        className={`bow-string-left ${hovering ? "is-hover" : ""}`}
        style={{ transformBox: 'fill-box', transformOrigin: '10px 6px' }}
      />
      <line
        x1="25" y1="25"
        x2="50" y2="0"
        stroke="#fff"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
        className={`bow-string-right ${hovering ? "is-hover" : ""}`}
        style={{ transformBox: 'fill-box', transformOrigin: '10px 6px' }}
      />

      {/* Arrow group — positioned so tip is near top-left (hotspot) */}
      <g className="bow-arrow">
        <line x1="0" y1="0" x2="34" y2="34" stroke="#f5e6b0" strokeWidth="2.6" strokeLinecap="round" />
        <polygon points="-6,-6 4,0 0,4" fill="#c8a84b" opacity="0.95" />
        <line x1="28" y1="28" x2="34" y2="34" stroke="#ffffff33" strokeWidth="0.6" strokeLinecap="round" />
      </g>
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
      {/* Bow cursor — top-left is the hotspot (tip) */}
      <div
        ref={spearRef}
        className={`cursor-spear${hovering ? " is-hovering" : ""}`}
      >
        <BowSVG hovering={hovering} />
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