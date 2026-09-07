import { useRef, useState, type KeyboardEvent } from "react";
import { OliveBranch } from "./art/OliveBranch";

const eventDays = [
  {
    numeral: "I",
    chapter: "Day One",
    weekday: "Saturday",
    date: "November 14",
    isoDate: "2026-11-14",
    events: [
      { at: "08:00", title: "Check-in & breakfast" },
      { at: "10:00", title: "Opening ceremony" },
      { at: "11:00", title: "Team formation" },
      { at: "11:30", title: "Hacking begins" },
      { at: "12:30", title: "Lunch" },
      { at: "14:00", title: "Workshop: Git & GitHub" },
      { at: "16:00", title: "Sponsor tech talks" },
      { at: "18:30", title: "Dinner" },
      { at: "21:00", title: "Mini-event: trivia night" },
      { at: "23:00", title: "Late-night snacks" },
    ],
  },
  {
    numeral: "II",
    chapter: "Day Two",
    weekday: "Sunday",
    date: "November 15",
    isoDate: "2026-11-15",
    events: [
      { at: "00:30", title: "Midnight mini-event" },
      { at: "02:00", title: "Quiet hours begin" },
      { at: "08:00", title: "Breakfast" },
      { at: "10:00", title: "Hacking ends · submissions due" },
      { at: "10:30", title: "Project expo" },
      { at: "12:00", title: "Judging & lunch" },
      { at: "13:30", title: "Closing ceremony & awards" },
      { at: "15:00", title: "Departure" },
    ],
  },
];

const dayAnchors = eventDays.map((day) =>
  Date.parse(`${day.isoDate}T12:00:00`),
);

function nearestDayIndex(now: number) {
  return dayAnchors.reduce(
    (nearest, anchor, index) => {
      const nearestAnchor = dayAnchors[nearest];
      return nearestAnchor === undefined ||
        Math.abs(anchor - now) < Math.abs(nearestAnchor - now)
        ? index
        : nearest;
    },
    0,
  );
}

function formatTime(at: string) {
  const separator = at.indexOf(":");
  if (separator === -1) throw new Error(`Invalid schedule time: ${at}`);

  const hours = Number(at.slice(0, separator));
  const minutes = Number(at.slice(separator + 1));
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    throw new Error(`Invalid schedule time: ${at}`);
  }

  const period = hours < 12 ? "AM" : "PM";
  return `${hours % 12 === 0 ? 12 : hours % 12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function Schedule() {
  const [selected, setSelected] = useState(() => nearestDayIndex(Date.now()));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = eventDays.length - 1;
    const next = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowDown: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      ArrowUp: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="schedule"
      className="weekend-section relative isolate overflow-hidden"
      data-theme="clay"
      aria-labelledby="weekend-title"
    >
      <span className="weekend-meander" data-edge="top" aria-hidden="true" />

      <div className="section-inner weekend-inner relative">
        <div className="weekend-intro text-center">
          <h2 id="weekend-title" className="font-semibold uppercase">
            Schedule
          </h2>
          <p className="weekend-when">November 14–15, 2026 · UT Arlington</p>
        </div>

        <div
          className="weekend-tablist"
          role="tablist"
          aria-label="Schedule days"
        >
          {eventDays.map((day, index) => {
            const isSelected = index === selected;

            return (
              <button
                key={day.isoDate}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`schedule-tab-${index + 1}`}
                className="weekend-tab"
                aria-selected={isSelected}
                aria-controls={`schedule-panel-${index + 1}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={moveFocus}
              >
                <span className="weekend-tab-numeral" aria-hidden="true">
                  {day.numeral}
                </span>
                <span className="weekend-tab-label">
                  Day {day.numeral}
                  <span className="weekend-tab-date">
                    {`${day.weekday}, ${day.date}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {eventDays.map((day, index) => (
          <div
            key={day.isoDate}
            id={`schedule-panel-${index + 1}`}
            className="weekend-panel"
            role="tabpanel"
            aria-labelledby={`schedule-tab-${index + 1}`}
            tabIndex={0}
            hidden={index !== selected}
          >
            <div className="weekend-day-head">
              <h3>{day.chapter}</h3>
              <p>{`${day.weekday}, ${day.date}, 2026`}</p>
            </div>
            <ol className="weekend-timeline">
              {day.events.map((item) => (
                <li className="weekend-slot" key={item.at}>
                  <time dateTime={`${day.isoDate}T${item.at}`}>
                    {formatTime(item.at)}
                  </time>
                  <span>{item.title}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <p className="weekend-note">
          Times are tentative and may shift as the event draws closer.
        </p>
      </div>

      <OliveBranch className="weekend-olive weekend-olive-top" />
      <OliveBranch className="weekend-olive" />
      <span className="weekend-meander" data-edge="bottom" aria-hidden="true" />
    </section>
  );
}
