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
  Sparkles,
  ArrowUpDown,
  Compass,
  CheckCircle2,
  Gift,
  Flame,
  PlusCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kumpulan Lomba SMA, SMK & MA 2026 Terlengkap : naviable.id",
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
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-slate-500">
            Katalog Resmi Terverifikasi
          </span>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Kumpulan Lomba & Olimpiade Pelajar Indonesia
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Jelajahi dan saring seluruh ajang perlombaan akademik, teknologi, seni, riset,
            dan bisnis terverifikasi untuk siswa SMA, SMK, dan MA. Bebas scam, lengkap
            dengan tautan registrasi dan juknis resmi.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/60 px-3 py-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>{totalActive} Kompetisi Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 text-emerald-800">
              <Gift className="h-4 w-4 text-emerald-600" />
              <span>{totalFree} Pendaftaran Gratis</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200/60 px-3 py-1.5 text-indigo-800">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span>{totalNasional} Skala Nasional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs Horizontal Scroll (Edge-to-edge touch scroll on mobile) */}
      <section className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 scrollbar-none">
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
              className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
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
            <div className="w-full lg:w-72 h-96 rounded-2xl bg-slate-100 animate-pulse" />
          }
        >
          <FilterSidebar className="w-full lg:w-72 lg:sticky lg:top-24 lg:self-start" />
        </Suspense>

        {/* Results Grid */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-slate-500 font-medium">
            <span>
              Menampilkan <strong className="text-slate-900">{results.length}</strong> kompetisi
            </span>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-600 font-semibold">Urutkan:</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
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
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
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
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
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
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Terbaru
                </Link>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-24 text-center px-4 shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <Trophy className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Tidak ada kompetisi yang cocok
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Coba ubah kata kunci pencarian atau sesuaikan pilihan filter kategori dan tingkat wilayah.
              </p>
              <Link
                href="/lomba"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-xs"
              >
                Reset Semua Filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
              {results.map((comp, i) => (
                <div
                  key={comp.id}
                  className="animate-fade-in flex flex-col h-full"
                  style={{
                    animationDelay: `${i * 35}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <CompetitionCard competition={comp} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Sticky Bottom Bar for Event Organizers */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold">Punya Info Lomba Resmi Sekolah atau Kampus?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Daftarkan lomba agendamu sekarang tanpa biaya. Jangkau ratusan ribu siswa berprestasi di seluruh Indonesia.
          </p>
        </div>
        <Link
          href="/submit"
          className="btn-coral shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Pasang Lomba Gratis</span>
        </Link>
      </section>
    </div>
  );
}
