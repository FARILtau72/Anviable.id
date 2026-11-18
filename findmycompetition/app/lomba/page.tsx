import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db, withDbRetry, ensureMatchmakingTables } from "@/db";
import { competitions } from "@/db/schema";
import { eq, asc, desc, and, or, like, sql, type SQL } from "drizzle-orm";
import { type Category, type Level, categoryEnum, levelEnum } from "@/db/schema";
import CompetitionCard from "@/components/CompetitionCard";
import FilterSidebar from "@/components/FilterSidebar";
import QuickFilterBar from "@/components/QuickFilterBar";
import {
  Trophy,
  ArrowUpDown,
  Compass,
  CheckCircle2,
  Gift,
  PlusCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kumpulan Lomba SMA, SMK & MA 2026 Terlengkap - naviable.id",
  description:
    "Jelajahi dan saring seluruh ajang perlombaan akademik, teknologi, seni, riset, dan bisnis terverifikasi untuk siswa SMA, SMK, dan MA di seluruh Indonesia.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
    fee?: string;
    audience?: string;
    sort?: string;
  }>;
}

const CATEGORY_TABS = [
  { value: "ALL", label: "Semua Kategori", categoryKey: "" },
  { value: "SAINS_MATEMATIKA", label: "Sains & Olimpiade", categoryKey: "SAINS_MATEMATIKA" },
  { value: "TEKNOLOGI_RPL", label: "IT & Rekayasa", categoryKey: "TEKNOLOGI_RPL" },
  { value: "BISNIS_AKUNTANSI", label: "Bisnis & Startup", categoryKey: "BISNIS_AKUNTANSI" },
  { value: "DESAIN_SENI", label: "Seni & Desain", categoryKey: "DESAIN_SENI" },
  { value: "BAHASA_DEBAT", label: "Debat & Bahasa", categoryKey: "BAHASA_DEBAT" },
  { value: "LOKAL_VOKASI", label: "Kejuruan / Vokasi", categoryKey: "LOKAL_VOKASI" },
];

export default async function KumpulanLombaPage({ searchParams }: PageProps) {
  await connection();
  await ensureMatchmakingTables();
  const params = (await searchParams) || {};
  const { q, category, level, fee, audience, sort } = params;

  // Build dynamic SQL conditions at database level
  const whereConditions: SQL[] = [eq(competitions.isVerified, true)];

  const qClean = q ? q.toLowerCase().trim() : "";
  if (qClean) {
    whereConditions.push(
      or(
        like(competitions.title, `%${qClean}%`),
        like(competitions.organizer, `%${qClean}%`),
        like(competitions.description, `%${qClean}%`)
      )!
    );
  }

  if (category && (categoryEnum as readonly string[]).includes(category)) {
    whereConditions.push(eq(competitions.category, category as Category));
  }

  if (level && (levelEnum as readonly string[]).includes(level)) {
    whereConditions.push(eq(competitions.level, level as Level));
  }

  if (fee) {
    const f = fee.toLowerCase();
    if (f === "free") {
      whereConditions.push(eq(competitions.registrationFee, 0));
    } else if (f === "paid") {
      whereConditions.push(sql`${competitions.registrationFee} > 0`);
    }
  }

  if (audience && audience !== "all") {
    whereConditions.push(
      sql`JSON_CONTAINS(${competitions.targetAudience}, JSON_QUOTE(${audience}))`
    );
  }

  // Database-level sorting
  let orderByClause = asc(competitions.deadlineDate);
  if (sort === "popular") {
    orderByClause = desc(competitions.viewsCount);
  } else if (sort === "latest") {
    orderByClause = desc(competitions.createdAt);
  } else if (sort === "fee_asc") {
    orderByClause = asc(competitions.registrationFee);
  }

  // Parallel database execution: Filtered query + Aggregate statistics
  const [results, statsList] = await Promise.all([
    withDbRetry(() =>
      db
        .select()
        .from(competitions)
        .where(and(...whereConditions))
        .orderBy(orderByClause)
    ),
    withDbRetry(() =>
      db
        .select({
          total: sql<number>`COUNT(*)`,
          freeCount: sql<number>`COALESCE(SUM(CASE WHEN ${competitions.registrationFee} = 0 THEN 1 ELSE 0 END), 0)`,
          nasionalCount: sql<number>`COALESCE(SUM(CASE WHEN ${competitions.level} = 'NASIONAL' THEN 1 ELSE 0 END), 0)`,
        })
        .from(competitions)
        .where(eq(competitions.isVerified, true))
    ),
  ]);

  const stats = statsList[0];
  const totalActive = Number(stats?.total || 0);
  const totalFree = Number(stats?.freeCount || 0);
  const totalNasional = Number(stats?.nasionalCount || 0);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
        {/* Retro Window Titlebar */}
        <div className="retro-window-header border-b-2 border-black bg-[#E8F0FE] px-4 py-2 flex items-center justify-between">
          <div className="retro-dots">
            <span className="retro-dot bg-[#EA4335]" />
            <span className="retro-dot bg-[#FBBC04]" />
            <span className="retro-dot bg-[#34A853]" />
            <span className="ml-2 font-mono text-[11px] font-black text-black">
              naviable://katalog_lomba.sys
            </span>
          </div>
          <span className="neo-badge bg-[#34A853] text-white px-2 py-0.5 text-[9px]">
            TERVERIFIKASI
          </span>
        </div>

        <div className="p-6 sm:p-10 space-y-4">
          <div className="neo-badge bg-[#FEF7E0] text-black px-2.5 py-1 text-xs">
            <span>KATALOG RESMI TERVERIFIKASI</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl lg:text-5xl">
            Kumpulan Lomba & Olimpiade Pelajar Indonesia
          </h1>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-3xl">
            Jelajahi dan saring seluruh ajang perlombaan akademik, teknologi, seni, riset,
            dan bisnis terverifikasi untuk siswa SMA, SMK, dan MA. Bebas scam, lengkap
            dengan tautan registrasi dan juknis resmi.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm font-black">
            <div className="neo-badge bg-[#FAF8F5] text-black px-3 py-1.5 flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-[#FBBC04]" />
              <span>{totalActive} Kompetisi Aktif</span>
            </div>
            <div className="neo-badge bg-[#E6F4EA] text-[#137333] px-3 py-1.5 flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-[#34A853]" />
              <span>{totalFree} Pendaftaran Gratis</span>
            </div>
            <div className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-3 py-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#4285F4]" />
              <span>{totalNasional} Skala Nasional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs Horizontal Scroll */}
      <section className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive =
            (!category && tab.categoryKey === "") || category === tab.categoryKey;
          const href = tab.categoryKey
            ? `/lomba?category=${tab.categoryKey}`
            : `/lomba`;

          return (
            <Link
              key={tab.value}
              href={href}
              className={`neo-btn px-4 py-2 text-xs sm:text-sm font-black whitespace-nowrap ${
                isActive
                  ? "bg-black text-white shadow-[3px_3px_0px_#000]"
                  : "bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-[#FAF8F5]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </section>

      {/* 3. Quick Filter Bar */}
      <Suspense fallback={null}>
        <QuickFilterBar totalCount={results.length} />
      </Suspense>

      {/* 4. Main Explorer with Sidebar & Results Grid */}
      <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row items-start">
        {/* Sidebar Filter */}
        <Suspense
          fallback={
            <div className="w-full lg:w-72 h-96 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] animate-pulse" />
          }
        >
          <FilterSidebar className="w-full lg:w-72 lg:sticky lg:top-24 lg:self-start" />
        </Suspense>

        {/* Results Grid */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm font-bold text-slate-700">
            <span>
              Menampilkan <strong className="text-black font-black font-mono">{results.length}</strong> kompetisi
            </span>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-black" />
              <span className="text-black font-black">Urutkan:</span>
              <div className="inline-flex rounded-lg border-2 border-black bg-white p-0.5 text-xs font-black shadow-[2px_2px_0px_#000]">
                <Link
                  href={`/lomba?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(category ? { category } : {}),
                    ...(level ? { level } : {}),
                    ...(fee ? { fee } : {}),
                    sort: "deadline_asc",
                  }).toString()}`}
                  className={`rounded-md px-2 py-1 transition-all ${
                    !sort || sort === "deadline_asc"
                      ? "bg-black text-white"
                      : "text-black hover:bg-[#FAF8F5]"
                  }`}
                >
                  Deadline
                </Link>
                <Link
                  href={`/lomba?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(category ? { category } : {}),
                    ...(level ? { level } : {}),
                    ...(fee ? { fee } : {}),
                    sort: "popular",
                  }).toString()}`}
                  className={`rounded-md px-2 py-1 transition-all ${
                    sort === "popular"
                      ? "bg-black text-white"
                      : "text-black hover:bg-[#FAF8F5]"
                  }`}
                >
                  Populer
                </Link>
                <Link
                  href={`/lomba?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(category ? { category } : {}),
                    ...(level ? { level } : {}),
                    ...(fee ? { fee } : {}),
                    sort: "latest",
                  }).toString()}`}
                  className={`rounded-md px-2 py-1 transition-all ${
                    sort === "latest"
                      ? "bg-black text-white"
                      : "text-black hover:bg-[#FAF8F5]"
                  }`}
                >
                  Terbaru
                </Link>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="neo-box flex flex-col items-center justify-center bg-white py-20 text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-[#FEF7E0] shadow-[2px_2px_0px_#000] mb-4 text-black">
                <Trophy className="h-8 w-8 text-[#FBBC04]" />
              </div>
              <h3 className="text-lg font-black text-black">
                Tidak ada kompetisi yang cocok
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-sm font-medium">
                Coba sesuaikan kata kunci pencarian atau reset filter kategori dan tingkat wilayah.
              </p>
              <Link
                href="/lomba"
                className="neo-btn neo-btn-blue mt-5 px-5 py-2 text-xs font-black"
              >
                Reset Semua Filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
              {results.map((comp) => (
                <div key={comp.id} className="flex flex-col h-full">
                  <CompetitionCard competition={comp} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Sticky Bottom Bar for Event Organizers */}
      <section className="neo-box bg-[#FAF8F5] border-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_#000]">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black text-black">Punya Info Lomba Resmi Sekolah atau Kampus?</h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Daftarkan lomba agendamu sekarang tanpa biaya. Jangkau ratusan ribu siswa berprestasi di seluruh Indonesia.
          </p>
        </div>
        <Link
          href="/submit"
          className="neo-btn neo-btn-blue shrink-0 px-6 py-3 text-xs sm:text-sm font-black flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Pasang Lomba Gratis</span>
        </Link>
      </section>
    </div>
  );
}
