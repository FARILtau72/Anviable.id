"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
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
          <div className="inline-flex items-center gap-1.5 neo-badge bg-[#E8F0FE] text-[#1967D2] px-2.5 py-1 text-xs mb-1">
            <Trophy className="h-3.5 w-3.5" />
            <span>AGENDA UNGGULAN PELAJAR</span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-black sm:text-3xl">
            Lomba Unggulan Bulan Ini
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
            Jadwal pendaftaran terdekat dengan panduan juknis lengkap dan kontak panitia resmi.
          </p>
        </div>

        {/* View All button */}
        <div className="flex items-center gap-3">
          <Link
            href="/lomba"
            className="neo-btn neo-btn-white px-4 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5"
          >
            <span>Lihat Semua ({competitions.length} Lomba)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex items-center justify-between sm:hidden text-[11px] text-slate-600 font-mono font-bold px-1">
        <span>* Geser kartu horizontal</span>
        <span className="neo-badge bg-[#FBBC04] text-black px-1.5 py-0.2 text-[9px]">GESER</span>
      </div>

      {/* 4 Cards: Mobile Horizontal Swipe Carousel & Desktop 4-Col Grid */}
      <div className="-mx-4 flex items-stretch gap-4 overflow-x-auto px-4 pb-4 pt-1 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-0 lg:grid-cols-4 sm:overflow-visible scrollbar-none">
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
