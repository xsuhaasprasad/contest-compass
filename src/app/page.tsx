import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarClock, ChartNoAxesCombined } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="hero">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="brand-badge">AMC / AIME Training</span>
          <h1>Turn every missed contest problem into future points.</h1>
          <p>
            Contest Compass helps you log mistakes with structure, review them on a spaced schedule,
            and spot weak topics before the next mock or contest day.
          </p>
          <div className="button-row">
            <Link href={user ? "/dashboard" : "/signup"} className="button">
              {user ? "Open dashboard" : "Start training"}
            </Link>
            {!user ? (
              <Link href="/login" className="ghost-button">
                Log in
              </Link>
            ) : null}
          </div>
        </div>

        <div className="hero-metrics">
          <div className="hero-stat">
            <strong className="stat-value">Structured</strong>
            <p className="muted">Capture topic, subtopic, mistake type, notes, and solution links.</p>
          </div>
          <div className="hero-stat">
            <strong className="stat-value">Scheduled</strong>
            <p className="muted">Daily queue sorted by urgency with confidence-sensitive interval growth.</p>
          </div>
          <div className="hero-stat">
            <strong className="stat-value">Measured</strong>
            <p className="muted">Dashboard analytics surface weak subtopics and reset-heavy mistakes.</p>
          </div>
        </div>
      </section>

      <section className="cards-grid grid">
        <article className="card">
          <div className="card-title-row">
            <BookOpenText />
            <span className="tiny-pill">Problem logging</span>
          </div>
          <h2 className="card-title">Preserve the lesson, not just the answer.</h2>
          <p className="muted">
            Each miss becomes a searchable training artifact instead of a forgotten notebook scribble.
          </p>
        </article>
        <article className="card">
          <div className="card-title-row">
            <CalendarClock />
            <span className="tiny-pill">Review queue</span>
          </div>
          <h2 className="card-title">Bring back the right problem on the right day.</h2>
          <p className="muted">
            Correct answers lengthen the interval. Incorrect ones snap the problem back into rotation.
          </p>
        </article>
        <article className="card">
          <div className="card-title-row">
            <ChartNoAxesCombined />
            <span className="tiny-pill">Analytics</span>
          </div>
          <h2 className="card-title">See your math habits as data.</h2>
          <p className="muted">
            Topic accuracy, mistake distributions, and daily activity make weak spots hard to ignore.
          </p>
        </article>
        <article className="card">
          <div className="card-title-row">
            <ArrowRight />
            <span className="tiny-pill">Personal</span>
          </div>
          <h2 className="card-title">Every account keeps its own dataset.</h2>
          <p className="muted">
            Your review queue, history, and charts stay isolated so the feedback stays personal.
          </p>
        </article>
      </section>
    </main>
  );
}
