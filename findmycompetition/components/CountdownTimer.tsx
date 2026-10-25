"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(deadline: Date): TimeLeft {
  const diff = Math.max(0, new Date(deadline).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50/80 shadow-xs sm:h-16 sm:w-16">
        <span className="text-xl font-black tabular-nums tracking-tight text-indigo-900 sm:text-2xl">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({
  deadlineDate,
}: {
  deadlineDate: Date | string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calcTimeLeft(new Date(deadlineDate))
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(new Date(deadlineDate)));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadlineDate]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        {["Hari", "Jam", "Menit", "Detik"].map((label) => (
          <TimeUnit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
        <span className="text-sm font-semibold text-red-400">
          Pendaftaran telah ditutup
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <TimeUnit value={timeLeft.days} label="Hari" />
      <span className="mt-[-16px] text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.hours} label="Jam" />
      <span className="mt-[-16px] text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.minutes} label="Menit" />
      <span className="mt-[-16px] text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.seconds} label="Detik" />
    </div>
  );
}
