"use client";

import { useActionState } from "react";
import {
  MISTAKE_TYPES,
  MISTAKE_TYPE_LABELS,
  TOPICS,
  TOPIC_LABELS,
} from "@/lib/domain";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/validation";
import { SubmitButton } from "@/components/submit-button";

type ProblemFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

export function ProblemForm({ action }: ProblemFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="form-card">
      <div>
        <div className="brand-badge">Problem Logging</div>
        <h2 className="card-title">Capture what went wrong while it is still fresh.</h2>
        <p className="muted">
          Every problem starts in today’s queue so you can revisit the mistake right away.
        </p>
      </div>

      {state.message ? <div className="message">{state.message}</div> : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Problem name</label>
          <input
            className="input"
            id="name"
            name="name"
            placeholder="2022 AMC 10B #15"
            required
          />
          {state.fieldErrors?.name ? (
            <span className="field-error">{state.fieldErrors.name[0]}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="topic">Topic</label>
          <select className="select" id="topic" name="topic" defaultValue={TOPICS[0]}>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {TOPIC_LABELS[topic]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="subtopic">Subtopic</label>
          <input
            className="input"
            id="subtopic"
            name="subtopic"
            placeholder="similar triangles"
            required
          />
          {state.fieldErrors?.subtopic ? (
            <span className="field-error">{state.fieldErrors.subtopic[0]}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="mistakeType">Mistake type</label>
          <select className="select" id="mistakeType" name="mistakeType" defaultValue={MISTAKE_TYPES[0]}>
            {MISTAKE_TYPES.map((mistakeType) => (
              <option key={mistakeType} value={mistakeType}>
                {MISTAKE_TYPE_LABELS[mistakeType]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="difficulty">Difficulty</label>
          <select className="select" id="difficulty" name="difficulty" defaultValue="3">
            {[1, 2, 3, 4, 5].map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="solutionUrl">External solution link</label>
          <input
            className="input"
            id="solutionUrl"
            name="solutionUrl"
            placeholder="https://..."
          />
          {state.fieldErrors?.solutionUrl ? (
            <span className="field-error">{state.fieldErrors.solutionUrl[0]}</span>
          ) : null}
        </div>

        <div className="field-full">
          <label htmlFor="notes">Personal notes</label>
          <textarea
            className="textarea"
            id="notes"
            name="notes"
            placeholder="What confused you? What do you want future-you to notice next time?"
          />
          {state.fieldErrors?.notes ? (
            <span className="field-error">{state.fieldErrors.notes[0]}</span>
          ) : null}
        </div>
      </div>

      <div className="button-row">
        <SubmitButton label="Add to review queue" pendingLabel="Adding..." />
      </div>
    </form>
  );
}
