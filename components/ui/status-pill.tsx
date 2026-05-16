import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  absent: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  leave: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  late: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
};

export function StatusPill({ children, tone = "good" }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className={cn("inline-flex min-h-7 items-center rounded-full px-3 text-sm font-medium", variants[tone])}>
      {children}
    </span>
  );
}
