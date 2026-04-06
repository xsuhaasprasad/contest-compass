import { ProblemForm } from "@/components/problem-form";
import { createProblemAction } from "@/server/actions/problem-actions";

export default function NewProblemPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="brand-badge">Add Problem</div>
          <h1>Log a miss while the mistake is still vivid.</h1>
          <p>
            Name the contest problem, tag the concept and failure mode, then send it straight into
            your review system.
          </p>
        </div>
      </section>

      <ProblemForm action={createProblemAction} />
    </div>
  );
}
