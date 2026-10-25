import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";

type StatusType = "open" | "closing" | "closed";

function getStatus(deadline: Date | string): { type: StatusType; label: string } {
  const diff = dayjs(deadline).diff(dayjs(), "day", true);
  if (diff < 0) return { type: "closed", label: "Ditutup" };
  if (diff <= 7) return { type: "closing", label: "Segera Tutup" };
  return { type: "open", label: "Buka" };
}

const STATUS_STYLES: Record<StatusType, string> = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs",
  closing: "bg-amber-50 text-amber-800 border-amber-300 shadow-xs",
  closed: "bg-rose-50 text-rose-700 border-rose-300 shadow-xs",
};

const STATUS_ICONS: Record<StatusType, typeof Clock> = {
  open: CheckCircle2,
  closing: AlertTriangle,
  closed: Clock,
};

export default function StatusBadge({
  deadlineDate,
  className,
}: {
  deadlineDate: Date | string;
  className?: string;
}) {
  const { type, label } = getStatus(deadlineDate);
  const Icon = STATUS_ICONS[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md transition-all",
        STATUS_STYLES[type],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
