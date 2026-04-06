import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p className="muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="button">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
