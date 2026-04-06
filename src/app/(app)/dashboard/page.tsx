import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock4, Target } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { DashboardCharts } from "@/components/dashboard-charts";
import { ReviewHeatmap } from "@/components/review-heatmap";
import { EmptyState } from "@/components/empty-state";
import { getDashboardData } from "@/server/dashboard";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="brand-badge">Dashboard</div>
          <h1>See where your contest points are leaking.</h1>
          <p>
            Review performance, weak topics, reset-heavy mistakes, and practice consistency in one
            place.
          </p>
        </div>
      </section>

      <section className="stats-grid grid">
        <article className="stat-strip">
          <div className="card-title-row">
            <Target size={18} />
            <span className="tiny-pill">Total problems</span>
          </div>
          <div className="stat-value">{data.stats.totalProblems}</div>
          <p className="stat-caption">Logged across your personal training archive.</p>
        </article>
        <article className="stat-strip">
          <div className="card-title-row">
            <Clock4 size={18} />
            <span className="tiny-pill">Active reviews</span>
          </div>
          <div className="stat-value highlight-number">{data.stats.activeCount}</div>
          <p className="stat-caption">Problems still cycling through the queue.</p>
        </article>
        <article className="stat-strip">
          <div className="card-title-row">
            <CheckCircle2 size={18} />
            <span className="tiny-pill">Success rate</span>
          </div>
          <div className="stat-value">{data.stats.reviewSuccessRate}%</div>
          <p className="stat-caption">Correct reviews across all recorded attempts.</p>
        </article>
        <article className="stat-strip">
          <div className="card-title-row">
            <AlertTriangle size={18} />
            <span className="tiny-pill">Incorrect reviews</span>
          </div>
          <div className="stat-value">{data.stats.incorrectReviews}</div>
          <p className="stat-caption">Resets and misses worth revisiting deliberately.</p>
        </article>
      </section>

      {data.stats.totalProblems === 0 ? (
        <EmptyState
          title="No problems logged yet"
          description="Start by adding your first missed problem so the review queue and analytics can come alive."
          actionHref="/problems/new"
          actionLabel="Add your first problem"
        />
      ) : (
        <>
          <section className="notebook-layout">
            <div className="stack-tight">
              <div className="dominant-panel">
                <h2 className="section-heading">Error map</h2>
                <p className="muted">
                  Start with the broad pattern first, then drill into subtopics that keep reappearing.
                </p>
                <DashboardCharts
                  topicAnalysis={data.topicAnalysis}
                  mistakeDistribution={data.mistakeDistribution}
                  accuracyTrend={data.accuracyTrend}
                />
              </div>
            </div>

            <div className="stack-tight">
              <ReviewHeatmap data={data.heatmap} />
              <div className="aside-note">
                <span className="scribble">Quick interpretation</span>
                <p className="muted">
                  A sparse heatmap usually means the queue is being logged faster than it is being reviewed.
                </p>
              </div>
            </div>
          </section>

          <section className="notebook-layout">
            <div className="stack-tight">
              <article className="dominant-panel">
                <div className="card-title-row">
                  <div>
                    <h2 className="card-title">Most failed subtopics</h2>
                    <p className="muted">The concepts that produce the most incorrect reviews.</p>
                  </div>
                </div>
                <div className="list">
                  {data.subtopicFailures.length ? (
                    data.subtopicFailures.map((item) => (
                      <div key={item.subtopic} className="list-item subtle-hover">
                        <div>
                          <strong>{item.subtopic}</strong>
                          <p className="muted">Incorrect reviews tied to this subtopic.</p>
                        </div>
                        <span className="pill">{item.failures}</span>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No failed subtopics yet"
                      description="Once you record a few reviews, this section will spotlight repeat trouble spots."
                    />
                  )}
                </div>
              </article>

              <article className="dominant-panel">
                <div className="card-title-row">
                  <div>
                    <h2 className="card-title">Next actions</h2>
                    <p className="muted">The most useful next moves based on your current log.</p>
                  </div>
                </div>
                <div className="list">
                  <div className="list-item">
                    <div>
                      <strong>Clear the due queue first</strong>
                      <p className="muted">
                        Active reviews compound faster than brand-new logs when the queue starts piling up.
                      </p>
                    </div>
                    <Link href="/review" className="button">
                      Open review queue
                    </Link>
                  </div>
                  <div className="list-item">
                    <div>
                      <strong>Log the newest miss while it is still fresh</strong>
                      <p className="muted">
                        Capture the exact misconception now so future-you gets the real lesson.
                      </p>
                    </div>
                    <Link href="/problems/new" className="ghost-button">
                      Add another problem
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            <div className="stack-tight">
              <article className="aside-note">
                <div className="card-title-row">
                  <div>
                    <h2 className="card-title">Reset-heavy mistakes</h2>
                    <p className="muted">The habits that most often send work back to day 1.</p>
                  </div>
                </div>
                <div className="list">
                  {data.mistakeResets.length ? (
                    data.mistakeResets.map((item) => (
                      <div key={item.mistakeType} className="list-item subtle-hover">
                        <div>
                          <strong>{item.label}</strong>
                          <p className="muted">Reviews that reset the interval.</p>
                        </div>
                        <span className="pill">{item.resets}</span>
                      </div>
                    ))
                  ) : (
                    <p className="muted">Reset-heavy patterns will show up here once review data accumulates.</p>
                  )}
                </div>
              </article>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
