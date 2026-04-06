"use client";

import { useActionState } from "react";
import { CONFIDENCE_LABELS, CONFIDENCE_LEVELS, REVIEW_RESULTS } from "@/lib/domain";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/validation";
import { SubmitButton } from "@/components/submit-button";

type ReviewFormProps = {
  problemId: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

export function ReviewForm({ problemId, action }: ReviewFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="card">
      <input type="hidden" name="problemId" value={problemId} />
      <div className="field-full">
        <label htmlFor="result">How did it go?</label>
        <select className="select" id="result" name="result" defaultValue={REVIEW_RESULTS[0]}>
          {REVIEW_RESULTS.map((result) => (
            <option key={result} value={result}>
              {result}
            </option>
          ))}
        </select>
      </div>

      <div className="field-full">
        <label htmlFor="confidence">Confidence level</label>
        <select className="select" id="confidence" name="confidence" defaultValue={CONFIDENCE_LEVELS[1]}>
          {CONFIDENCE_LEVELS.map((confidence) => (
            <option key={confidence} value={confidence}>
              {CONFIDENCE_LABELS[confidence]}
            </option>
          ))}
        </select>
      </div>

      {state.message ? <div className="message">{state.message}</div> : null}

      <div className="button-row">
        <SubmitButton label="Record review" pendingLabel="Recording..." />
      </div>
    </form>
  );
}
