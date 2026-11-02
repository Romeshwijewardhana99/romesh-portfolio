import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

const principles = [
  ["A clear starting point", "We begin with the problem, the people using your product, and what a useful result looks like."],
  ["The whole system, connected", "Interfaces, APIs and databases designed together, so your tools work as one."],
  ["Built for what comes next", "Readable code, considered decisions and a foundation you can maintain and grow."],
];

export default function AboutSection() {
  return (
    <section id="about" className="public-section public-about" aria-labelledby="about-heading">
      <div className="public-container">
        <div className="public-about-grid">
          <div>
            <p className="public-eyebrow">The person behind the work</p>
            <h2 id="about-heading" className="public-heading">One developer.<br />The whole picture.</h2>
            <p className="public-copy public-about-copy">I&apos;m Romesh, a full-stack developer focused on practical software. I bring the frontend, backend and database together to turn complex requirements into something people can actually use.</p>
            <Link href="/contact" className="public-text-link">Let&apos;s talk about your project <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="public-principles">
            {principles.map(([title, description]) => <div className="public-principle" key={title}>
              <span className="public-check"><Check size={17} strokeWidth={1.7} aria-hidden="true" /></span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </div>)}
          </div>
        </div>
        <div className="public-process" aria-label="How a project takes shape">
          {[ ["01", "Understand", "Your goals, users and requirements."], ["02", "Design", "A clear experience and a sound plan."], ["03", "Build", "Connected frontend and backend."], ["04", "Launch", "Deployment and a considered handover."] ].map(([number, title, detail]) => <div key={number}>
            <span>{number}</span><h3>{title}</h3><p>{detail}</p>
          </div>)}
        </div>
      </div>
    </section>
  );
}
