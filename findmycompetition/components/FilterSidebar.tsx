"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, RotateCcw, Filter, ChevronDown } from "lucide-react";
import { cn, CATEGORY_LABELS, LEVEL_LABELS } from "@/lib/utils";
import { categoryEnum, levelEnum } from "@/db/schema";

const FEE_OPTIONS = [
  { value: "all", label: "Semua Biaya" },
  { value: "free", label: "Gratis" },
  { value: "paid", label: "Berbayar" },
] as const;

const AUDIENCE_OPTIONS = [
  { value: "all", label: "Semua Jenjang" },
  { value: "SMA", label: "SMA" },
  { value: "SMK", label: "SMK" },
  { value: "MA", label: "MA" },
] as const;

export default function FilterSidebar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const fee = searchParams.get("fee") || "all";
  const audience = searchParams.get("audience") || "all";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        const hash = pathname === "/" ? "#eksplorasi" : "";
        const queryStr = params.toString() ? `?${params.toString()}` : "";
        router.push(`${pathname}${queryStr}${hash}`, { scroll: false });
      });
    },
    [router, searchParams, pathname, startTransition]
  );

  const resetFilters = () => {
    startTransition(() => {
      const hash = pathname === "/" ? "#eksplorasi" : "";
      router.push(`${pathname}${hash}`, { scroll: false });
    });
  };

  let activeCount = 0;
  if (q) activeCount++;
  if (category) activeCount++;
  if (level) activeCount++;
  if (fee !== "all") activeCount++;
  if (audience !== "all") activeCount++;

  const hasFilters = activeCount > 0;

  return (
    <aside
      className={cn(
        "rounded-xl border-2 border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#000] transition-all",
        className
      )}
    >
      {/* Mobile Toggle Trigger Header */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm font-black text-black cursor-pointer"
        >
          <Filter className="h-4 w-4 text-[#4285F4]" />
          <span>Filter & Kategori</span>
          {activeCount > 0 && (
            <span className="neo-badge bg-[#EA4335] text-white px-1.5 py-0.2 text-[9px]">
              {activeCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2.5">
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-black text-[#EA4335] hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="neo-btn px-2.5 py-1 text-xs font-black bg-white shadow-[1px_1px_0px_#000] cursor-pointer"
          >
            {mobileOpen ? "Tutup ▲" : "Buka Filter ▼"}
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between border-b-2 border-black/10 pb-3">
        <div className="flex items-center gap-2 text-sm font-black text-black">
          <Filter className="h-4 w-4 text-[#4285F4]" />
          <span>Filter Lengkap</span>
          {activeCount > 0 && (
            <span className="neo-badge bg-[#EA4335] text-white px-1.5 py-0.2 text-[9px]">
              {activeCount}
            </span>
          )}
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-black text-[#EA4335] hover:underline transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Filter Body (Collapsible on mobile, always visible on desktop) */}
      <div
        className={cn(
          "space-y-4 pt-3 lg:pt-4",
          !mobileOpen && "hidden lg:block"
        )}
      >
        {/* Keyword Search */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-black uppercase tracking-wider text-slate-700">
            Kata Kunci
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-black" />
            <input
              type="text"
              value={q}
              onChange={(e) => updateParams("q", e.target.value)}
              placeholder="Cari judul / panitia..."
              className="h-10 w-full rounded-lg border-2 border-black bg-[#FAF8F5] pl-9 pr-3 text-xs font-bold text-black placeholder:text-slate-500 focus:bg-white focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-black uppercase tracking-wider text-slate-700">
            Kategori Bidang
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => updateParams("category", e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border-2 border-black bg-[#FAF8F5] px-3 pr-8 text-xs font-bold text-black focus:bg-white focus:outline-none cursor-pointer transition-all"
            >
              <option value="">Semua Kategori</option>
              {categoryEnum.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-black" />
          </div>
        </div>

        {/* Level Dropdown */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-black uppercase tracking-wider text-slate-700">
            Tingkat Wilayah
          </label>
          <div className="relative">
            <select
              value={level}
              onChange={(e) => updateParams("level", e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border-2 border-black bg-[#FAF8F5] px-3 pr-8 text-xs font-bold text-black focus:bg-white focus:outline-none cursor-pointer transition-all"
            >
              <option value="">Semua Tingkat</option>
              {levelEnum.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-black" />
          </div>
        </div>

        {/* Target Audience Pills */}
        <div className="space-y-2">
          <label className="font-mono text-xs font-black uppercase tracking-wider text-slate-700">
            Target Peserta
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {AUDIENCE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => updateParams("audience", opt.value)}
                className={cn(
                  "neo-btn py-2 text-xs font-black text-center cursor-pointer",
                  audience === opt.value
                    ? "bg-[#4285F4] text-white shadow-[2px_2px_0px_#000]"
                    : "bg-[#FAF8F5] text-black hover:bg-white shadow-[1px_1px_0px_#000]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fee Options */}
        <div className="space-y-2">
          <label className="font-mono text-xs font-black uppercase tracking-wider text-slate-700">
            Biaya Pendaftaran
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {FEE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => updateParams("fee", opt.value)}
                className={cn(
                  "neo-btn py-2 text-xs font-black text-center cursor-pointer",
                  fee === opt.value
                    ? "bg-[#34A853] text-white shadow-[2px_2px_0px_#000]"
                    : "bg-[#FAF8F5] text-black hover:bg-white shadow-[1px_1px_0px_#000]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
