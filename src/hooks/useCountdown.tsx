import { useEffect, useState } from "react";

const EVENT_START = new Date("2026-11-14T00:00:00-06:00"); // CST, adjust as needed

function getTimeParts(target: Date) {
  const diffMs = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diffMs === 0,
  };
}

export function useCountdown(target: Date = EVENT_START) {
  const [parts, setParts] = useState(() => getTimeParts(target));

  useEffect(() => {
    if (parts.done) return;
    const id = window.setInterval(() => {
      setParts(getTimeParts(target));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target, parts.done]);

  return parts;
}