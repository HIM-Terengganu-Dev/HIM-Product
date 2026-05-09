import { cn } from "@/lib/utils";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/types";
import type { Priority, Status } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  const dotColor: Record<Priority, string> = {
    Urgent: "bg-red-500",
    High: "bg-orange-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotColor[priority])}
      />
      {config.label}
    </span>
  );
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  );
}
