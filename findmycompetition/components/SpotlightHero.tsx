"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface SpotlightHeroProps {
  totalCompetitions?: number;
}

const POPULAR_TAGS = [
  { label: "Semua Bidang", value: "" },
  { label: "Olimpiade Sains", category: "SAINS_MATEMATIKA", color: "bg-[#E8F0FE] text-[#1967D2]" },
  { label: "LKTI Nasional SMA", q: "LKTI", color: "bg-[#FEF7E0] text-[#B06000]" },
  { label: "Lomba UI/UX & Coding", category: "TEKNOLOGI_RPL", color: "bg-[#E6F4EA] text-[#137333]" },
  { label: "Desain & Poster", category: "DESAIN_SENI", color: "bg-[#FCE8E6] text-[#C5221F]" },
  { label: "KIR & Karya Ilmiah", q: "KIR", color: "bg-[#F3E8FD] text-[#8430CE]" },
];

const LEVEL_OPTIONS = [
  { label: "Semua Tingkat", value: "" },
  { label: "Tingkat Nasional", value: "NASIONAL" },
  { label: "Tingkat Provinsi", value: "PROVINSI" },
  { label: "Kota / Kabupaten", value: "KOTA_KABUPATEN" },
  { label: "Internasional", value: "INTERNASIONAL" },
];

export default function SpotlightHero({ totalCompetitions = 8 }: SpotlightHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const activeCategory = searchParams.get("category") || "";

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (level) params.set("level", level);
    router.push(`/lomba?${params.toString()}`);
  };

  const handleTagClick = (tag: typeof POPULAR_TAGS[0]) => {
    const params = new URLSearchParams();
    if (tag.category) params.set("category", tag.category);
    if (tag.q) params.set("q", tag.q);
    router.push(`/lomba?${params.toString()}`);
  };

  return (
    <section className="relative pt-6 pb-8 text-center">
      {/* Top Retro Eyebrow Pill */}
      <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FBBC04] px-4 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000] mb-6">
        <span className="inline-block h-2 w-2 rounded-full bg-[#EA4335] animate-pulse" />
        <span>DIREKTORI RESMI KOMPETISI PELAJAR SE-INDONESIA</span>
      </div>

      {/* Main Headline (Playful GDGoC Neo-Brutalist Typography) */}
      <h1 className="mx-auto max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl sm:leading-[1.12]">
        Raih Prestasi, Bangun Portofolio, & Masuk{" "}
        <span className="relative inline-block text-[#4285F4] underline decoration-[#FBBC04] decoration-wavy decoration-2">
          Kampus Impianmu
        </span>
      </h1>

      {/* Subtitle with Honest Copy */}
      <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-base text-slate-700 leading-relaxed font-medium">
        Pusat kurasi informasi olimpiade sains OSN, lomba coding, UI/UX, karya ilmiah LKTI, hingga kejuruan LKS SMK. Terhubung langsung dengan dokumen juknis dan kontak panitia resmi.
      </p>

      {/* Large Retro Search Window Card */}
      <div className="mx-auto mt-8 max-w-3xl text-left">
        <div className="neo-box overflow-hidden">
          {/* Retro Window Title Bar */}
          <div className="retro-window-header">
            <div className="retro-dots">
              <span className="retro-dot bg-[#EA4335]" />
              <span className="retro-dot bg-[#FBBC04]" />
              <span className="retro-dot bg-[#34A853]" />
              <span className="ml-2 font-mono text-black font-bold">naviable://search_engine.sys</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
              Filter Terpadu
            </span>
          </div>

          {/* Form Area */}
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 bg-white flex flex-col sm:flex-row items-center gap-2.5"
          >
            {/* Text Input */}
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-black pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari olimpiade matematika, web development, LKTI..."
                className="h-11 w-full rounded-lg bg-[#FAF8F5] border-2 border-black pl-10 pr-3 text-base sm:text-sm font-semibold text-black placeholder:text-slate-500 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000] transition-all"
              />
            </div>

            {/* Level Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                aria-label="Filter berdasarkan jenjang atau tingkat kompetisi"
                className="h-11 w-full sm:w-44 appearance-none rounded-lg bg-[#FAF8F5] border-2 border-black px-3.5 pr-8 text-base sm:text-xs font-bold text-black focus:outline-none cursor-pointer"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-black" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="neo-btn neo-btn-blue h-11 w-full sm:w-auto px-6 text-sm font-black whitespace-nowrap"
            >
              <Search className="h-4 w-4 mr-1.5" />
              <span>Cari Lomba</span>
            </button>
          </form>
        </div>

        {/* Popular Category Chips */}
        <div className="-mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0 scrollbar-none">
          <span className="shrink-0 text-xs font-black uppercase font-mono text-slate-600 mr-1">
            Topik Pilihan:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isActive =
              (tag.value === "" && !activeCategory && !query) ||
              (tag.category && activeCategory === tag.category);

            return (
              <button
                type="button"
                key={tag.label}
                onClick={() => handleTagClick(tag)}
                className={`neo-btn px-3 py-1 text-xs font-bold ${
                  isActive
                    ? "bg-black text-white shadow-[2px_2px_0px_#000]"
                    : `${tag.color || "bg-white text-black"} shadow-[2px_2px_0px_#000] hover:bg-white`
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Retro Pixel Dino Banner Bar */}
      <div className="mx-auto mt-8 max-w-2xl neo-box-sm bg-[#FAF8F5] px-4 py-2.5 text-xs text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Retro Pixel Mascot Icon */}
          <div className="flex items-center justify-center h-6 w-6 rounded bg-[#34A853] border border-black text-white font-mono font-bold text-xs shadow-[1px_1px_0px_#000]">
            ★
          </div>
          <span className="font-bold text-black font-mono">
            {totalCompetitions} Kompetisi Aktif Terverifikasi
          </span>
          <span className="neo-badge bg-[#34A853] text-white px-1.5 py-0.2 text-[9px]">
            UPDATE 2026
          </span>
        </div>
        <div className="text-slate-600 text-[11px] font-mono">
          [100% Bebas Biaya Pemasangan]
        </div>
      </div>
    </section>
  );
}
