"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Zap, Gift, Trophy, Sparkles, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuickFilterBar({
  totalCount,
}: {
  totalCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentFee = searchParams.get("fee") || "all";
  const currentLevel = searchParams.get("level") || "";
  const currentAudience = searchParams.get("audience") || "all";

  const setFilter = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const hash = pathname === "/" ? "#eksplorasi" : "";
    const queryStr = params.toString() ? `?${params.toString()}` : "";
    router.push(`${pathname}${queryStr}${hash}`, { scroll: false });
  };

  const isAll =
    currentFee === "all" &&
    !currentLevel &&
    currentAudience === "all";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
      {/* Pills Horizontal Scroll on Mobile */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 scrollbar-none">
        <button
          type="button"
          onClick={() =>
            setFilter({ fee: null, level: null, audience: null })
          }
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
            isAll
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs"
          )}
        >
          Semua ({totalCount})
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter({
              fee: currentFee === "free" ? null : "free",
            })
          }
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
            currentFee === "free"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs"
          )}
        >
          <Gift className="h-3 w-3 text-emerald-500" />
          Pendaftaran Gratis
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter({
              level: currentLevel === "NASIONAL" ? null : "NASIONAL",
            })
          }
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
            currentLevel === "NASIONAL"
              ? "bg-indigo-700 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs"
          )}
        >
          <Trophy className="h-3 w-3 text-indigo-500" />
          Tingkat Nasional
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter({
              audience: currentAudience === "SMK" ? null : "SMK",
            })
          }
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
            currentAudience === "SMK"
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs"
          )}
        >
          <Zap className="h-3 w-3 text-orange-500" />
          Khusus SMK (WorldSkills / LKS)
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Gunakan sidebar untuk saring lebih detail</span>
      </div>
    </div>
  );
}
