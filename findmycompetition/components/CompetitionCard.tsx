import Link from "next/link";
import dayjs from "dayjs";
import { Clock, Award, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import BookmarkButton, { type BookmarkData } from "@/components/BookmarkButton";
import type { Category, Level } from "@/db/schema";
import {
  cn,
  formatCurrency,
  CATEGORY_LABELS,
  LEVEL_LABELS,
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

const CATEGORY_WINDOW_COLORS: Record<Category, { bg: string; dot: string; label: string }> = {
  TEKNOLOGI_RPL: { bg: "bg-[#E8F0FE]", dot: "bg-[#4285F4]", label: "teknologi.app" },
  SAINS_MATEMATIKA: { bg: "bg-[#E6F4EA]", dot: "bg-[#34A853]", label: "sains_osn.app" },
  DESAIN_SENI: { bg: "bg-[#FCE8E6]", dot: "bg-[#EA4335]", label: "desain_seni.app" },
  BISNIS_AKUNTANSI: { bg: "bg-[#FEF7E0]", dot: "bg-[#FBBC04]", label: "bisnis_plan.app" },
  BAHASA_DEBAT: { bg: "bg-[#F3E8FD]", dot: "bg-[#A142F4]", label: "debat_bahasa.app" },
  LOKAL_VOKASI: { bg: "bg-[#FEF7E0]", dot: "bg-[#FBBC04]", label: "vokasi_smk.app" },
  UMUM: { bg: "bg-[#F1F3F4]", dot: "bg-[#5F6368]", label: "kompetisi_umum.app" },
};

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

  const headerInfo = CATEGORY_WINDOW_COLORS[competition.category] || CATEGORY_WINDOW_COLORS.UMUM;

  return (
    <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] transition-all duration-200">
      {/* Retro Window Titlebar */}
      <div className={`flex items-center justify-between border-b-2 border-black px-3 py-1.5 ${headerInfo.bg} shrink-0`}>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-black bg-[#EA4335]" />
          <span className="h-2 w-2 rounded-full border border-black bg-[#FBBC04]" />
          <span className="h-2 w-2 rounded-full border border-black bg-[#34A853]" />
          <span className="ml-1 font-mono text-[10px] font-bold text-black uppercase tracking-wider">
            {headerInfo.label}
          </span>
        </div>
        <span className="neo-badge bg-[#FBBC04] text-black px-1.5 py-0.2 text-[9px] font-black uppercase">
          {CATEGORY_LABELS[competition.category]}
        </span>
      </div>

      {/* Poster Image Container */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b-2 border-black shrink-0">
        {competition.posterUrl ? (
          <img
            src={competition.posterUrl}
            alt={competition.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#FAF8F5] text-slate-400">
            <Award className="h-10 w-10 text-slate-500" />
          </div>
        )}

        {/* Top Badges Floating Over Image */}
        <div className="absolute left-2.5 top-2.5 right-2.5 flex items-center justify-between">
          <span className="neo-badge bg-white text-black px-2 py-0.5 text-[10px] font-black">
            {audiences.length > 0 ? audiences.join(", ") : "SMA & SMK"}
          </span>
          <BookmarkButton competition={bookmarkData} />
        </div>

        {/* Bottom Urgency Tag */}
        {daysLeft > 0 && daysLeft <= 14 && (
          <div className="absolute left-2.5 bottom-2.5">
            <span className="neo-badge bg-[#EA4335] text-white px-2 py-0.5 text-[10px] font-black">
              <Clock className="h-3 w-3 mr-1 inline-block" />
              Sisa {daysLeft} hari
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 bg-white">
        {/* Top Information Block */}
        <div className="flex flex-col">
          {/* Organizer */}
          <p className="font-mono text-[11px] font-bold text-slate-500 line-clamp-1 h-4 overflow-hidden">
            {competition.organizer}
          </p>

          {/* Title: Exactly 2 lines height across cards */}
          <Link
            href={`/lomba/${competition.slug}`}
            className="mt-1 block text-sm font-black text-black line-clamp-2 leading-snug group-hover:text-[#4285F4] transition-colors h-10 overflow-hidden"
            title={competition.title}
          >
            {competition.title}
          </Link>

          {/* Audience / Level Badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 h-6 overflow-hidden">
            <span className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-2 py-0.5 text-[9px]">
              {LEVEL_LABELS[competition.level]}
            </span>
            <span className="neo-badge bg-[#E6F4EA] text-[#137333] px-2 py-0.5 text-[9px]">
              {competition.registrationFee === 0 ? "Gratis" : formatCurrency(competition.registrationFee)}
            </span>
            <span className="neo-badge bg-[#FEF7E0] text-[#B06000] px-2 py-0.5 text-[9px]">
              {audiences.includes("SMK") ? "SMK Vokasi" : "Pelajar"}
            </span>
          </div>
        </div>

        {/* Bottom Information Block */}
        <div className="mt-4 pt-3 border-t-2 border-black/10">
          <div className="flex items-center justify-between text-xs mb-3">
            <div>
              <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase">Biaya:</span>
              <span className="font-mono font-black text-black">
                {competition.registrationFee === 0 ? "Gratis" : formatCurrency(competition.registrationFee)}
              </span>
            </div>

            <div className="text-right">
              <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase">Deadline:</span>
              <span className="font-mono font-bold text-slate-800">
                {dayjs(competition.deadlineDate).format("DD MMM YYYY")}
              </span>
            </div>
          </div>

          {/* Action Button: Matches GDGoC Card "Lihat Agenda >" */}
          <Link
            href={`/lomba/${competition.slug}`}
            className="neo-btn neo-btn-white w-full py-2 text-xs font-black flex items-center justify-center gap-1.5"
          >
            <span>Lihat Detail & Juknis</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
