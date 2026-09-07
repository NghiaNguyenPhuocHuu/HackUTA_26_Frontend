import { useState } from "react";
import { OracleEye } from "./OracleEye";

const questions = [
  {
    question: "What happens at a hackathon?",
    answer:
      "You spend the weekend turning an idea into a project with other students. It is a chance to try new tools, meet fellow builders, and share what you made.",
  },
  {
    question: "Is HackUTA beginner-friendly?",
    answer:
      "Yes. You do not need hackathon experience or a polished idea. Curiosity and a willingness to make something are enough to begin.",
  },
  {
    question: "Do I need a team or project idea?",
    answer:
      "No. You can start without either. Begin with a problem you care about, meet other students, and find a direction together.",
  },
  {
    question: "Who can attend?",
    answer:
      "HackUTA 2026 is planned for college students age 18 and older, at every experience level. Final eligibility details will be confirmed when applications open.",
  },
  {
    question: "When and where is it?",
    answer:
      "November 14–15, 2026 at the University of Texas at Arlington. The exact venue and check-in times will be shared closer to the event.",
  },
  {
    question: "When can I apply?",
    answer:
      "Applications are not open yet. Keep this page close. The application link and full participant details will appear here as soon as they are ready.",
  },
];

export function FAQ({ motionEnabled }: { motionEnabled: boolean }) {
  const [openItems, setOpenItems] = useState(() => new Set([0]));

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section
      id="faq"
      className="oracle-section relative isolate overflow-hidden"
      data-theme="clay"
      aria-labelledby="oracle-title"
    >
      <div className="oracle-orbit" aria-hidden="true" />
      <div className="section-inner oracle-layout grid">
        <div className="oracle-intro">
          <h2 id="oracle-title" className="font-semibold uppercase">
            We know you
            <br />
            have some questions.
          </h2>
          <p className="oracle-description">
            Or you can always email us at{" "}
            <a href="mailto:info@hackuta.org">info@hackuta.org</a>
          </p>
          <OracleEye motionEnabled={motionEnabled} />
        </div>
        <div className="oracle-questions">
          {questions.map((item, index) => {
            const isOpen = openItems.has(index);
            const answerId = `faq-answer-${index + 1}`;
            const questionId = `faq-question-${index + 1}`;

            return (
              <article
                className="oracle-item"
                key={item.question}
                data-open={isOpen || undefined}
              >
                <button
                  type="button"
                  className="oracle-summary"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  id={questionId}
                  onClick={() => toggleItem(index)}
                >
                  <span className="oracle-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>{item.question}</span>
                  <span className="oracle-toggle" aria-hidden="true" />
                </button>
                <div
                  id={answerId}
                  className="oracle-answer"
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                >
                  <div className="oracle-answer-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
