"use client";

import { useState } from "react";
import { Share2, Copy, Check, CalendarPlus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadICS, getGoogleCalendarUrl } from "@/lib/ics";

interface ShareProps {
  title: string;
  description: string;
  slug: string;
  deadlineDate: Date | string;
  eventDate?: Date | string | null;
  registrationUrl: string;
  className?: string;
}

export default function ShareAndCalendarButtons({
  title,
  description,
  slug,
  deadlineDate,
  eventDate,
  registrationUrl,
  className,
}: ShareProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/lomba/${slug}`
      : `https://anviable.id/lomba/${slug}`;

  const whatsappText = encodeURIComponent(
    `🏆 ${title}\n\n📅 Deadline: ${new Date(deadlineDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}\n\n🔗 Info & Daftar: ${pageUrl}`
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = pageUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCalendar = () => {
    const start = eventDate ? new Date(eventDate) : new Date(deadlineDate);
    downloadICS({
      title,
      description,
      startDate: start,
      url: registrationUrl,
    });
  };

  const googleCalUrl = getGoogleCalendarUrl({
    title,
    description,
    startDate: eventDate ? new Date(eventDate) : new Date(deadlineDate),
    url: registrationUrl,
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <a
        href={`https://wa.me/?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-xs transition-all hover:bg-emerald-100"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
        Share ke WA
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-slate-500" />
        )}
        {copied ? "Tersalin!" : "Salin Link"}
      </button>

      <button
        type="button"
        onClick={handleCalendar}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
      >
        <CalendarPlus className="h-3.5 w-3.5 text-slate-500" />
        Kalender (.ics)
      </button>

      <a
        href={googleCalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-800 shadow-xs transition-all hover:bg-sky-100"
      >
        <CalendarPlus className="h-3.5 w-3.5 text-sky-600" />
        Google Calendar
      </a>
    </div>
  );
}
