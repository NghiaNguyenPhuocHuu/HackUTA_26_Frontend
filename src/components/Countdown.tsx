import { useCountdown } from "../hooks/useCountdown";

export function HeroCountdown() {
  const { days, hours, minutes, seconds, done } = useCountdown();

  if (done) {
    return (
      <div className="od-hero-countdown" role="status">
        <span>We've set sail</span>
      </div>
    );
  }

  return (
    <div className="od-hero-countdown" role="timer" aria-live="off">
      {[
        { label: "days", value: days },
        { label: "hrs", value: hours },
        { label: "min", value: minutes },
        { label: "sec", value: seconds },
      ].map((unit) => (
        <div className="od-hero-countdown-unit" key={unit.label}>
          <span className="od-hero-countdown-value">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="od-hero-countdown-label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}