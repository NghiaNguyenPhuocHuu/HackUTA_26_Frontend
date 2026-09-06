const questions = [
  {
    question: 'What happens at a hackathon?',
    answer: 'You spend the weekend turning an idea into a project with other students. It is a chance to try new tools, meet fellow builders, and share what you made.',
  },
  {
    question: 'Is HackUTA beginner-friendly?',
    answer: 'Yes. You do not need hackathon experience or a polished idea. Curiosity and a willingness to make something are enough to begin.',
  },
  {
    question: 'Do I need a team or project idea?',
    answer: 'No. You can start without either. Begin with a problem you care about, meet other students, and find a direction together.',
  },
  {
    question: 'Who can attend?',
    answer: 'HackUTA 2026 is planned for college students age 18 and older, at every experience level. Final eligibility details will be confirmed when applications open.',
  },
  {
    question: 'When and where is it?',
    answer: 'November 14–15, 2026 at the University of Texas at Arlington. The exact venue and check-in times will be shared closer to the event.',
  },
  {
    question: 'When can I apply?',
    answer: 'Applications are not open yet. Keep this page close—the application link and full participant details will appear here as soon as they are ready.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="oracle-section relative isolate overflow-hidden" data-theme="clay" aria-labelledby="oracle-title">
      <div className="oracle-orbit" aria-hidden="true" />
      <div className="section-inner oracle-layout grid">
        <div className="oracle-intro">
          <p className="section-kicker flex items-center gap-3"><span className="section-index">03</span> Ask the oracle</p>
          <h2 id="oracle-title" className="font-semibold uppercase">A few things<br />before you sail.</h2>
          <p className="oracle-description">The essentials we can answer now. The rest arrives as applications open.</p>
          <svg className="oracle-eye" viewBox="0 0 220 116" fill="none" aria-hidden="true">
            <path d="M8 58c27-31 61-47 102-47s75 16 102 47c-27 31-61 47-102 47S35 89 8 58Z" />
            <circle cx="110" cy="58" r="25" />
            <circle cx="110" cy="58" r="7" className="oracle-eye-pupil" />
            <path d="M110 0v15M110 101v15M35 13l12 18M185 13l-12 18M35 103l12-18M185 103l-12-18" />
          </svg>
          <p className="oracle-status status-dot">Applications open soon</p>
        </div>
        <div className="oracle-questions">
          {questions.map((item, index) => (
            <details className="oracle-item" key={item.question} open={index === 0}>
              <summary>
                <span className="oracle-number" aria-hidden="true">0{index + 1}</span>
                <span>{item.question}</span>
                <span className="oracle-toggle" aria-hidden="true" />
              </summary>
              <div className="oracle-answer"><p>{item.answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
