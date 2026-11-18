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
  open: "bg-[#34A853] text-white border-2 border-black shadow-[2px_2px_0px_#000]",
  closing: "bg-[#FBBC04] text-black border-2 border-black shadow-[2px_2px_0px_#000]",
  closed: "bg-[#EA4335] text-white border-2 border-black shadow-[2px_2px_0px_#000]",
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
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-black uppercase transition-all tracking-wide",
        STATUS_STYLES[type],
        className
      )}
    >
      <Icon className="h-3 w-3 stroke-[2.5]" />
      {label}
    </span>
  );
}
