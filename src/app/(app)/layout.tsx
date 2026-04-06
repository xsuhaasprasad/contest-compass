import { type ReactNode } from "react";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/dashboard";

  return (
    <div className="app-shell">
      <AppSidebar pathname={pathname} />
      <main className="content">{children}</main>
    </div>
  );
}
