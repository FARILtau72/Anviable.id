"use client";

import Link from "next/link";
import CompetitionCard, { type CompetitionCardData } from "@/components/CompetitionCard";

interface FeaturedCompetitionsProps {
  competitions: CompetitionCardData[];
}

export default function FeaturedCompetitions({
  competitions,
}: FeaturedCompetitionsProps) {
  // Take the first 4 for the featured row
  const featured = competitions.slice(0, 4);

  return (
    <section id="lomba-unggulan" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">
            Kurasi Pilihan Pelajar
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Lomba Unggulan Bulan Ini
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
            Jadwal tenggat pendaftaran terdekat yang telah dilengkapi dokumen juknis dan kontak panitia resmi.
          </p>
        </div>

        {/* View All link (Specific, Accessible, Clean) */}
        <div className="flex items-center gap-3">
          <Link
            href="/lomba"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua ({competitions.length} Lomba)
          </Link>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex items-center justify-between sm:hidden text-[11px] text-slate-500 font-medium px-1">
        <span>Geser horizontal untuk melihat daftar</span>
        <span className="font-semibold text-slate-700">Geser</span>
      </div>

      {/* 4 Cards: Mobile Horizontal Swipe Carousel & Desktop 4-Col Grid */}
      <div className="-mx-4 flex items-stretch gap-4 overflow-x-auto px-4 pb-3 pt-1 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-0 lg:grid-cols-4 sm:overflow-visible scrollbar-none">
        {featured.map((comp) => (
          <div
            key={comp.id}
            className="w-[82vw] max-w-[310px] shrink-0 snap-center sm:w-auto sm:max-w-none flex flex-col h-full"
          >
            <CompetitionCard competition={comp} />
          </div>
        ))}
      </div>
    </section>
  );
}
