import Link from "next/link";
import dayjs from "dayjs";
import { Clock, Award } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import BookmarkButton, { type BookmarkData } from "@/components/BookmarkButton";
import type { Category, Level } from "@/db/schema";
import {
  cn,
  formatCurrency,
  CATEGORY_LABELS,
  LEVEL_LABELS,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
} from "@/lib/utils";

export interface CompetitionCardData {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  category: Category;
  level: Level;
  targetAudience?: string[] | unknown;
  registrationFee: number;
  posterUrl?: string | null;
  deadlineDate: Date | string;
  isVerified?: boolean;
}

export default function CompetitionCard({
  competition,
}: {
  competition: CompetitionCardData;
}) {
  const deadlineDateObj = new Date(competition.deadlineDate);
  const deadlineIso =
    typeof competition.deadlineDate === "string"
      ? competition.deadlineDate
      : competition.deadlineDate.toISOString();

  let audiences: string[] = [];
  if (Array.isArray(competition.targetAudience)) {
    audiences = competition.targetAudience as string[];
  } else if (typeof competition.targetAudience === "string") {
    try {
      audiences = JSON.parse(competition.targetAudience);
    } catch {
      audiences = [competition.targetAudience];
    }
  }

  const daysLeft = Math.ceil(
    (deadlineDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const bookmarkData: BookmarkData = {
    id: competition.id,
    slug: competition.slug,
    title: competition.title,
    organizer: competition.organizer,
    category: competition.category,
    level: competition.level,
    targetAudience: audiences,
    posterUrl: competition.posterUrl,
    deadlineDate: deadlineIso,
    registrationFee: competition.registrationFee,
  };

  return (
    <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Poster Image Container */}
      <div
        className={cn(
          "relative h-44 w-full overflow-hidden bg-gradient-to-br shrink-0",
          CATEGORY_GRADIENTS[competition.category]
        )}
      >
        {competition.posterUrl ? (
          <img
            src={competition.posterUrl}
            alt={competition.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/50">
            <Award className="h-12 w-12" />
          </div>
        )}

        {/* Gradient dark mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
            {audiences.length > 0 ? audiences.join(", ") : "SMA & SMK"}
          </span>
          <BookmarkButton competition={bookmarkData} />
        </div>

        {/* Bottom category tag on image */}
        <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
            {CATEGORY_LABELS[competition.category]}
          </span>
          {daysLeft > 0 && daysLeft <= 14 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              <Clock className="h-2.5 w-2.5" />
              Sisa {daysLeft} hari
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Top Information Block */}
        <div className="flex flex-col">
          {/* Organizer */}
          <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 h-4 overflow-hidden">
            {competition.organizer}
          </p>

          {/* Title: Exactly 2 lines height (h-10) across ALL cards */}
          <Link
            href={`/lomba/${competition.slug}`}
            className="mt-1 block text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors h-10 overflow-hidden"
            title={competition.title}
          >
            {competition.title}
          </Link>

          {/* Audience / Level Tag Pills: Fixed height across all cards */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 h-6 overflow-hidden">
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              {LEVEL_LABELS[competition.level]}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {competition.registrationFee === 0 ? "Gratis" : formatCurrency(competition.registrationFee)}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {audiences.includes("SMK") ? "SMK" : "Pelajar"}
            </span>
          </div>
        </div>

        {/* Bottom Information Block: Pinned to bottom with mt-auto, perfectly aligned across cards */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="block text-[10px] font-medium text-slate-400">Biaya:</span>
              <span className="font-bold text-slate-900">
                {competition.registrationFee === 0 ? "Gratis" : formatCurrency(competition.registrationFee)}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] font-medium text-slate-400">Batas Waktu:</span>
              <span className="font-semibold text-slate-700">
                {dayjs(competition.deadlineDate).format("DD MMM YYYY")}
              </span>
            </div>
          </div>

          {/* Action Button: Specific & Honest per R-15 & R-38 */}
          <div className="mt-3">
            <Link
              href={`/lomba/${competition.slug}`}
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-indigo-900 transition-colors cursor-pointer"
            >
              <span>Lihat Detail & Juknis</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
