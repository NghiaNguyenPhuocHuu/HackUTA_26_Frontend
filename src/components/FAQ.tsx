import { useState } from "react";
import { OracleEye } from "./OracleEye";
import { ThemeArt } from "./art/ThemeArt";

const questions = [
  {
    question: "Who can apply to HackUTA 2026?",
    answer:
      "HackUTA is open to all college, university, and trade-school students who will be 18 or older by November 14, 2026. Recent graduates from December 2025 or later and high school seniors who are 18+ are welcome as well. Bring a government-issued ID or student ID for check-in.",
  },
  {
    question: "Do I need to be a UTA student or live in Texas?",
    answer:
      "Nope! We love hosting students from across the state and beyond. HackUTA 2026 is fully in person at UTA, so just make it to Arlington for check-in.",
  },
  {
    question: "How much does it cost to attend?",
    answer:
      "HackUTA is completely free thanks to our sponsors. We cover four meals, snacks, caffeine, workspace, and swag throughout the weekend, while you handle your own travel.",
  },
  {
    question: "What if I've never been to a hackathon?",
    answer:
      "No experience required. We run onboarding sessions, beginner-friendly workshops, and have mentors and MLH coaches on site to help you scope ideas, learn new tools, and ship something you're proud of.",
  },
  {
    question: "How do teams work?",
    answer:
      "Teams can have up to four hackers. You can list your teammates on the application or arrive solo. We host a team formation mixer and share a Discord channel to help you find collaborators before hacking starts.",
  },
  {
    question: "What should I bring?",
    answer:
      "Pack your laptop, chargers, and any hardware you plan to hack on. A valid student ID, government ID, toiletries, medications, and something comfy to nap with, like a hoodie, pillow, or sleeping bag and a deodorant, will make the 24 hours much easier.",
  },
  {
    question: "Can I start on my project early?",
    answer:
      "You can brainstorm and explore public resources ahead of time, but all code, design assets, and build work must be created during the official hacking window from noon Oct 4 to noon Oct 5. Using open source libraries or templates is fine as long as you start fresh and give credit.",
  },
  {
    question: "How does judging and prizes work?",
    answer:
      "We host an expo-style demo fair where judges visit each team. Expect a short pitch of three to four minutes and Q&A covering your problem, solution, and tech. Projects are evaluated on creativity, impact, technical execution, and presentation, with overall winners plus sponsor challenges announced at closing.",
  },
  {
    question: "How do I contact organizers or request accomodations?",
    answer: "Join the HackUTA Discord from the About section!",
  },
];

function FAQContact({ className }: { className: string }) {
  return (
    <p className={`oracle-description ${className}`}>
      Still have some questions? You can always email us at{" "}
      <a href="mailto:hello@hackuta.org" className="oracle-email-link">
        hello@hackuta.org
      </a>
    </p>
  );
}

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
      <ThemeArt name="temple" className="oracle-art-temple theme-art--on-light" />
      <div className="oracle-orbit" aria-hidden="true" />
      <div className="section-inner oracle-layout grid">
        <div className="oracle-intro">
          <h2 id="oracle-title" className="font-semibold uppercase">
            We know you
            <br />
            have some questions.
          </h2>
          <FAQContact className="hidden md:block" />
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
          <FAQContact className="md:hidden" />
        </div>
      </div>
    </section>
  );
}
