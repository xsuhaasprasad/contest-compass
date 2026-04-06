"use client";

import Link from "next/link";
import { useActionState } from "react";
import { INITIAL_ACTION_STATE } from "@/lib/validation";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/validation";

type AuthFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  mode: "login" | "signup";
  successMessage?: string;
};

export function AuthForm({ action, mode, successMessage }: AuthFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="auth-card">
      <div>
        <div className="brand-badge">{isSignup ? "New Account" : "Welcome back"}</div>
        <h1 className="auth-title">
          {isSignup ? "Build your review system." : "Pick up your training streak."}
        </h1>
        <p className="muted">
          {isSignup
            ? "Create a personal math-mistake tracker with spaced repetition and analytics."
            : "Log in to review due problems, inspect weak topics, and keep the queue moving."}
        </p>
      </div>

      {successMessage ? <div className="message success-message">{successMessage}</div> : null}
      {state.message ? <div className="message">{state.message}</div> : null}

      {isSignup ? (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input className="input" id="name" name="name" placeholder="Contest student" />
          {state.fieldErrors?.name ? (
            <span className="field-error">{state.fieldErrors.name[0]}</span>
          ) : null}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" required />
        {state.fieldErrors?.email ? (
          <span className="field-error">{state.fieldErrors.email[0]}</span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" required />
        {state.fieldErrors?.password ? (
          <span className="field-error">{state.fieldErrors.password[0]}</span>
        ) : null}
      </div>

      <div className="button-row">
        <SubmitButton
          label={isSignup ? "Create account" : "Log in"}
          pendingLabel={isSignup ? "Creating..." : "Logging in..."}
        />
      </div>

      <p className="muted">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="mono">
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
