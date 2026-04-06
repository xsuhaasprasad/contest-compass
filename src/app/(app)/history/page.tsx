import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import {
  MISTAKE_TYPES,
  MISTAKE_TYPE_LABELS,
  PROBLEM_STATUSES,
  STATUS_LABELS,
  TOPICS,
  TOPIC_LABELS,
} from "@/lib/domain";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { getProblemHistory } from "@/server/problems";

type HistoryPageProps = {
  searchParams: Promise<{
    q?: string;
    topic?: (typeof TOPICS)[number];
    mistakeType?: (typeof MISTAKE_TYPES)[number];
    status?: (typeof PROBLEM_STATUSES)[number];
  }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const problems = await getProblemHistory(user.id, {
    query: params.q,
    topic: params.topic,
    mistakeType: params.mistakeType,
    status: params.status,
  });

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="brand-badge">Problem History</div>
          <h1>Search your archive of misses and recoveries.</h1>
          <p>
            Filter by topic, mistake type, or status to study how specific habits evolve over time.
          </p>
        </div>
        <aside className="aside-note">
          <span className="scribble">Archive view</span>
          <p className="muted">
            This page should feel more like a study ledger than a polished admin dashboard.
          </p>
        </aside>
      </section>

      <section className="aside-note">
        <form className="form-grid" method="get">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input
              className="input"
              id="q"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Problem name or subtopic"
            />
          </div>
          <div className="field">
            <label htmlFor="topic">Topic</label>
            <select className="select" id="topic" name="topic" defaultValue={params.topic ?? ""}>
              <option value="">All topics</option>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {TOPIC_LABELS[topic]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="mistakeType">Mistake type</label>
            <select
              className="select"
              id="mistakeType"
              name="mistakeType"
              defaultValue={params.mistakeType ?? ""}
            >
              <option value="">All mistake types</option>
              {MISTAKE_TYPES.map((mistakeType) => (
                <option key={mistakeType} value={mistakeType}>
                  {MISTAKE_TYPE_LABELS[mistakeType]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select className="select" id="status" name="status" defaultValue={params.status ?? ""}>
              <option value="">All statuses</option>
              {PROBLEM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="button-row">
            <button type="submit" className="button">
              Apply filters
            </button>
            <Link href="/history" className="ghost-button">
              Reset
            </Link>
          </div>
        </form>
      </section>

      <section className="dominant-panel">
        <div className="card-title-row">
          <div>
            <h2 className="card-title">Logged problems</h2>
            <p className="muted">{problems.length} problems match the current filters.</p>
          </div>
        </div>

        {problems.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Status</th>
                  <th>Attempts</th>
                  <th>Accuracy</th>
                  <th>Next review</th>
                  <th>Last review</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr key={problem.id}>
                    <td>
                      <strong>{problem.name}</strong>
                      <span className="muted">
                        {TOPIC_LABELS[problem.topic]} - {problem.subtopic} -{" "}
                        {MISTAKE_TYPE_LABELS[problem.mistakeType]}
                      </span>
                    </td>
                    <td>{STATUS_LABELS[problem.status]}</td>
                    <td>{problem.attempts}</td>
                    <td>{problem.accuracy}%</td>
                    <td>{formatDate(problem.nextReviewDate)}</td>
                    <td>{problem.lastReview ? formatDate(problem.lastReview.reviewedAt) : "Never"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No problems match these filters"
            description="Adjust the filters or add a new problem to start building your archive."
            actionHref="/problems/new"
            actionLabel="Add a problem"
          />
        )}
      </section>
    </div>
  );
}
