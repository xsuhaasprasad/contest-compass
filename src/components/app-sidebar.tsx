import Link from "next/link";
import { BookMarked, ChartColumnBig, Clock3, PlusCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/sign-out-button";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: ChartColumnBig },
  { href: "/problems/new", label: "Add Problem", icon: PlusCircle },
  { href: "/review", label: "Review Queue", icon: Clock3 },
  { href: "/history", label: "Problem History", icon: BookMarked },
];

type SidebarProps = {
  pathname: string;
};

export async function AppSidebar({ pathname }: SidebarProps) {
  const user = await requireUser();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-badge">Contest Compass</div>
        <div>
          <div className="brand-title">Train the mistakes you actually make.</div>
          <p className="brand-copy">
            Log contest problems, review them on schedule, and track where your points leak.
          </p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("nav-link", active && "active")}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="aside-note">
          <span className="tiny-pill">Signed in</span>
          <strong>{user.name || user.email}</strong>
          <span className="muted mono">{user.email}</span>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
