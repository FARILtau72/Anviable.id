"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
} from "lucide-react";

interface SpotlightHeroProps {
  totalCompetitions?: number;
}

const POPULAR_TAGS = [
  { label: "Semua Bidang", value: "" },
  { label: "Olimpiade Sains", category: "SAINS_MATEMATIKA" },
  { label: "LKTI Nasional SMA", q: "LKTI" },
  { label: "Lomba UI/UX & Coding", category: "TEKNOLOGI_RPL" },
  { label: "Desain & Poster", category: "DESAIN_SENI" },
  { label: "KIR & Karya Ilmiah", q: "KIR" },
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
    <section className="relative pt-8 pb-10 text-center">
      {/* Main Headline (Clean, Authoritative, High-Contrast per R-01 & R-25) */}
      <h1 className="mx-auto max-w-4xl text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl sm:leading-[1.12]">
        Raih Prestasi, Bangun Portofolio, dan Buka Jalan Masuk{" "}
        <span className="text-indigo-900">PTN Impianmu</span>
      </h1>

      {/* Subtitle with Honest, Specific Indonesian Copy */}
      <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
        Pusat informasi kompetisi akademik, teknologi, sains OSN, riset LKTI, seni, hingga kejuruan SMK di Indonesia. Terhubung langsung dengan dokumen juknis dan tautan pendaftaran panitia resmi.
      </p>

      {/* Large Floating Search Card */}
      <div className="mx-auto mt-8 max-w-3xl">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-white p-2.5 shadow-md shadow-slate-200/60 border border-slate-200"
        >
          {/* Text Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari lomba riset, olimpiade matematika, web development, debat..."
              className="h-11 w-full rounded-xl bg-transparent pl-10 pr-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Level Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              aria-label="Filter berdasarkan jenjang atau tingkat kompetisi"
              className="h-11 w-full sm:w-44 appearance-none rounded-xl bg-slate-50 border border-slate-200 px-3.5 pr-8 text-base sm:text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          {/* Submit Button (Specific Action Label per R-15, No Decorative Arrow per R-08) */}
          <button
            type="submit"
            className="flex h-11 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-900 px-6 text-sm font-bold text-white hover:bg-indigo-950 transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Cari Lomba</span>
          </button>
        </form>

        {/* Popular Category Chips */}
        <div className="-mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0 scrollbar-none">
          <span className="shrink-0 text-xs font-semibold text-slate-400 mr-1">
            Jalur Pilihan:
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
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Live Database Metric Bar (Authentic, Single Real Source per R-17 & R-38) */}
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-slate-200/90 bg-white/80 px-4 py-3 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
          <span className="font-semibold text-slate-900">
            {totalCompetitions} Kompetisi Terverifikasi Aktif
          </span>
          <span className="text-slate-400">diperbarui berkala</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Tautan langsung ke juknis PDF dan formulir panitia
        </div>
      </div>
    </section>
  );
}
