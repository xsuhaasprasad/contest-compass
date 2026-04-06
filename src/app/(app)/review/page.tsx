import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { EmptyState } from "@/components/empty-state";
import { ReviewForm } from "@/components/review-form";
import { MISTAKE_TYPE_LABELS, TOPIC_LABELS } from "@/lib/domain";
import { formatDate, relativeToNow } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { getDueProblems } from "@/server/problems";
import { submitReviewAction } from "@/server/actions/review-actions";

export default async function ReviewPage() {
  const user = await requireUser();
  const problems = await getDueProblems(user.id);
  const current = problems[0];

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="brand-badge">Review Queue</div>
          <h1>Work the oldest due problems first.</h1>
          <p>
            Each review records a full attempt history, updates the interval, and promotes problems
            out of the active queue once they have been answered correctly twice in a row.
          </p>
        </div>
        
      </section>

      {!current ? (
        <EmptyState
          title="Queue clear"
          description="No active problems are due right now. Add a new problem or come back tomorrow for the next review cycle."
          actionHref="/problems/new"
          actionLabel="Add a problem"
        />
      ) : (
        <section className="notebook-layout">
          <article className="dominant-panel">
            <div className="card-title-row">
              <div>
                <span className="tiny-pill">{TOPIC_LABELS[current.topic]}</span>
                <h2 className="card-title" style={{ marginTop: "0.6rem" }}>
                  {current.name}
                </h2>
              </div>
              <span className="pill">Difficulty {current.difficulty}/5</span>
            </div>
            <p className="muted">
              Subtopic: <strong>{current.subtopic}</strong>
            </p>
            <p className="muted">
              Mistake type: <strong>{MISTAKE_TYPE_LABELS[current.mistakeType]}</strong>
            </p>
            {current.notes ? <p>{current.notes}</p> : null}
            {current.solutionUrl ? (
              <Link href={current.solutionUrl} target="_blank" className="mono">
                Open saved solution link
              </Link>
            ) : null}
            <div className="divider" />
            <div className="list">
              <div className="queue-row">
                <div>
                  <strong>Current streak</strong>
                  <p className="muted">Correct reviews in a row</p>
                </div>
                <span className="pill">{current.correctStreak}</span>
              </div>
              <div className="queue-row">
                <div>
                  <strong>Current interval</strong>
                  <p className="muted">Days until the next review when answered correctly</p>
                </div>
                <span className="pill">{current.intervalDays} day(s)</span>
              </div>
              <div className="queue-row">
                <div>
                  <strong>Due date</strong>
                  <p className="muted">{formatDate(current.nextReviewDate)}</p>
                </div>
                <span className="pill">{relativeToNow(current.nextReviewDate)}</span>
              </div>
            </div>
          </article>

          <div className="stack-tight">
            <ReviewForm problemId={current.id} action={submitReviewAction} />
            <article className="aside-note">
              <div className="card-title-row">
                <div>
                  <h2 className="card-title">Queue order</h2>
                  <p className="muted">Due problems sorted by the oldest next-review date first.</p>
                </div>
              </div>
              <div className="list">
                {problems.map((problem) => (
                  <div key={problem.id} className="queue-row subtle-hover">
                    <div>
                      <strong>{problem.name}</strong>
                      <p className="muted">
                        {TOPIC_LABELS[problem.topic]} - {problem.subtopic}
                      </p>
                    </div>
                    <span className="tiny-pill">
                      due {formatDistanceToNowStrict(problem.nextReviewDate, { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      )}
    </div>
  );
}
