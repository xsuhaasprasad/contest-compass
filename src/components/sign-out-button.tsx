import { signOutAction } from "@/server/actions/auth-actions";

export function SignOutButton() {
  return (
    <form action={signOutAction} className="inline-form">
      <button type="submit" className="ghost-button">
        Log out
      </button>
    </form>
  );
}
