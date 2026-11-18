"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Zap, Gift, Trophy, SlidersHorizontal } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-black/10 pb-3">
      {/* Pills Horizontal Scroll on Mobile */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 scrollbar-none">
        <button
          type="button"
          onClick={() =>
            setFilter({ fee: null, level: null, audience: null })
          }
          className={cn(
            "neo-btn px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] cursor-pointer",
            isAll
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-[#FAF8F5]"
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
            "neo-btn px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5",
            currentFee === "free"
              ? "bg-[#34A853] text-white"
              : "bg-white text-black hover:bg-[#FAF8F5]"
          )}
        >
          <Gift className="h-3.5 w-3.5" />
          <span>Pendaftaran Gratis</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter({
              level: currentLevel === "NASIONAL" ? null : "NASIONAL",
            })
          }
          className={cn(
            "neo-btn px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5",
            currentLevel === "NASIONAL"
              ? "bg-[#4285F4] text-white"
              : "bg-white text-black hover:bg-[#FAF8F5]"
          )}
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Tingkat Nasional</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter({
              audience: currentAudience === "SMK" ? null : "SMK",
            })
          }
          className={cn(
            "neo-btn px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5",
            currentAudience === "SMK"
              ? "bg-[#FBBC04] text-black"
              : "bg-white text-black hover:bg-[#FAF8F5]"
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Khusus SMK (Vokasi / LKS)</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-xs font-mono font-bold text-slate-600">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Gunakan filter sidebar untuk detail</span>
      </div>
    </div>
  );
}
