import { AuthForm } from "@/components/auth-form";
import { redirectIfAuthenticated, signUpAction } from "@/server/actions/auth-actions";

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <main className="auth-shell">
      <AuthForm action={signUpAction} mode="signup" />
    </main>
  );
}
