import { AuthForm } from "@/components/auth-form";
import { redirectIfAuthenticated, signInAction } from "@/server/actions/auth-actions";

type LoginPageProps = {
  searchParams: Promise<{
    created?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <AuthForm
        action={signInAction}
        mode="login"
        successMessage={
          params.created ? "Account created. Log in to start your review queue." : undefined
        }
      />
    </main>
  );
}
