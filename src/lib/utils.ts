import { clsx } from "clsx";
import { format, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: Parameters<typeof clsx>) {
  return clsx(inputs);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function relativeToNow(date: Date | string) {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

export function percent(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}
