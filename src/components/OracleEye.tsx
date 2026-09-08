import { useEffect, useRef, useState } from "react";

const EYE_CENTER = { x: 110, y: 58 };
const MAX_PUPIL_OFFSET = 14;
const EYE_MESSAGE = "Odysseus had eyes like Athena's";
const CENTERED_OFFSET = { x: 0, y: 0 };

function isFinitePoint(point: { x: number; y: number }) {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const rect = svg.getBoundingClientRect();
  const { x, y, width, height } = svg.viewBox.baseVal;
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(clientY) ||
    !Number.isFinite(rect.left) ||
    !Number.isFinite(rect.top) ||
    !Number.isFinite(rect.width) ||
    !Number.isFinite(rect.height) ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    rect.width <= 0 ||
    rect.height <= 0 ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  const point = {
    x: x + ((clientX - rect.left) / rect.width) * width,
    y: y + ((clientY - rect.top) / rect.height) * height,
  };
  return isFinitePoint(point) ? point : null;
}

function clampPupilOffset(dx: number, dy: number) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return CENTERED_OFFSET;
  const dist = Math.hypot(dx, dy);
  if (dist <= MAX_PUPIL_OFFSET || dist === 0) return { x: dx, y: dy };
  const scale = MAX_PUPIL_OFFSET / dist;
  return { x: dx * scale, y: dy * scale };
}

export function OracleEye({ motionEnabled }: { motionEnabled: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const [irisOffset, setIrisOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;

      const point = clientToSvg(svg, event.clientX, event.clientY);
      if (!point) return;
      targetRef.current = clampPupilOffset(
        point.x - EYE_CENTER.x,
        point.y - EYE_CENTER.y,
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      const trackedTarget = targetRef.current;
      const target =
        isHovered || !isFinitePoint(trackedTarget)
          ? CENTERED_OFFSET
          : trackedTarget;
      const current = currentRef.current;
      const ease = motionEnabled ? 0.14 : 1;

      if (!isFinitePoint(current)) {
        current.x = 0;
        current.y = 0;
      }

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;

      setIrisOffset({ x: current.x, y: current.y });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered, motionEnabled]);

  return (
    <div
      className="oracle-eye-wrap"
      data-message-open={showMessage || undefined}
    >
      <button
        type="button"
        className="oracle-eye-button"
        data-closed={isHovered || undefined}
        aria-label="Oracle eye"
        aria-expanded={showMessage}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={() => setShowMessage((open) => !open)}
      >
        <svg
          ref={svgRef}
          className="oracle-eye"
          viewBox="0 0 220 116"
          fill="none"
          aria-hidden="true"
        >
          <g className="oracle-eye-iris">
            <g
              className="oracle-eye-iris-track"
              transform={`translate(${irisOffset.x} ${irisOffset.y})`}
            >
              <circle cx="110" cy="58" r="25" />
              <circle cx="110" cy="58" r="7" className="oracle-eye-pupil" />
            </g>
          </g>
          <path
            className="oracle-eye-lashes--top"
            d="M110 0v15M35 13l12 18M185 13l-12 18"
          />
          <path d="M110 101v15M35 103l12-18M185 103l-12-18" />
          <path
            className="oracle-eye-outline"
            d="M8 58c27-31 61-47 102-47s75 16 102 47c-27 31-61 47-102 47S35 89 8 58Z"
          />
          <g className="oracle-eye-lid">
            <path
              d="M8 58c27-31 61-47 102-47s75 16 102 47"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </button>
      <p
        className="oracle-eye-message"
        role="status"
        aria-live="polite"
        aria-hidden={!showMessage}
      >
        {EYE_MESSAGE}
      </p>
    </div>
  );
}
