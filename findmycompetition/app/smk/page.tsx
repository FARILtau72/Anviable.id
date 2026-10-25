import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db, withDbRetry, ensureMatchmakingTables } from "@/db";
import { competitions } from "@/db/schema";
import { eq, asc, desc, or, sql, type SQL } from "drizzle-orm";
import SmkFilterExplorer from "@/components/SmkFilterExplorer";
import type { CompetitionCardData } from "@/components/CompetitionCard";
import {
  GraduationCap,
  Sparkles,
  Trophy,
  ShieldCheck,
  Building2,
  Landmark,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zona Lomba Khusus Siswa SMK 2026 : Filter 2-Tier Jurusan & Penyelenggara Resmi : naviable.id",
  description:
    "Direktori lomba khusus siswa SMK se-Indonesia dengan filter 2-tier: sesuaikan dengan jurusan (RPL, TKJ, DKV, Akuntansi, Mesin, Kuliner) dan kurasi penyelenggara resmi (Puspresnas, Ditjen Vokasi, Politeknik Negeri).",
};

export default async function SmkSpecialPage() {
  await connection();
  await ensureMatchmakingTables();

  // Query verified competitions that match vocational interests or are open to SMK
  const rawCompetitions = await withDbRetry(() =>
    db
      .select()
      .from(competitions)
      .where(
        or(
          eq(competitions.category, "TEKNOLOGI_RPL"),
          eq(competitions.category, "LOKAL_VOKASI"),
          eq(competitions.category, "DESAIN_SENI"),
          eq(competitions.category, "BISNIS_AKUNTANSI"),
          sql`JSON_CONTAINS(${competitions.targetAudience}, JSON_QUOTE('SMK'))`
        )
      )
      .orderBy(asc(competitions.deadlineDate))
  );

  // Format competitions to pass to client component
  const formattedCompetitions: CompetitionCardData[] = (rawCompetitions || []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    organizer: c.organizer,
    category: c.category,
    level: c.level,
    targetAudience: c.targetAudience,
    registrationFee: c.registrationFee,
    posterUrl: c.posterUrl,
    deadlineDate: c.deadlineDate,
    isVerified: c.isVerified,
  }));

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER BANNER (ZONA SISWA SMK)                                    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-900/60 px-3.5 py-1 text-xs font-bold text-indigo-200 shadow-2xs backdrop-blur-sm">
            <GraduationCap className="h-4 w-4 text-amber-400" />
            <span>Zona Khusus Kejuruan: Solusi Lomba Siswa SMK se-Indonesia</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Cari Lomba SMK yang Tepat Sasaran dengan Filter 2-Tier
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Sering kesulitan menemukan lomba yang sesuai dengan kompetensi keahlianmu? naviable.id menghadirkan sistem penyaringan 2-tier: cocokkan lomba langsung dengan <strong>jurusan spesifikmu</strong> (RPL, TKJ, DKV, Akuntansi, Mesin, Kuliner) dan saring berdasarkan <strong>penyelenggara resmi terakreditasi</strong> (Puspresnas, Kemendikbud, Balai Talenta, atau Politeknik Negeri).
          </p>

          {/* 3 Keunggulan Khusus Siswa SMK */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
              <Landmark className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-100 font-bold">Terindeks SIMT Puspresnas</strong>
                <span className="text-slate-400 text-[11px] leading-tight">
                  Sertifikat resmi pemerintah yang diakui untuk kurasi prestasi nasional.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
              <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-100 font-bold">Tiket Emas SNBP Vokasi</strong>
                <span className="text-slate-400 text-[11px] leading-tight">
                  Lomba dari politeknik negeri (PENS, Polban, PNJ) jadi poin besar masuk PTN.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
              <Building2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-100 font-bold">Portofolio Uji Kompetensi (UKK)</strong>
                <span className="text-slate-400 text-[11px] leading-tight">
                  Proyek lomba kejuruan diakui langsung oleh asesor LSP dan mitra industri.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-TIER FILTER EXPLORER                                            */}
      {/* ========================================================================= */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100" />}>
        <SmkFilterExplorer competitions={formattedCompetitions} />
      </Suspense>

      {/* ========================================================================= */}
      {/* 3. PANDUAN PRESTASI SISWA SMK                                             */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-semibold text-indigo-600 mb-1.5 block">
          Panduan Jalur Prestasi SMK
        </span>
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl tracking-tight">
          Mengapa Sertifikat Lomba Sangat Krusial untuk Siswa SMK?
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Prioritas Seleksi SNBP Jalur Vokasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Politeknik Negeri dan Program Vokasi Universitas Negeri sangat memprioritaskan siswa SMK yang memiliki prestasi di bidang yang selaras dengan program studi D-4 / Sarjana Terapan.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Nilai Tambah Uji Sertifikasi LSP</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hasil karya atau prototipe kompetisi (seperti aplikasi untuk RPL atau rancangan robotika untuk Mekatronika) menjadi bukti otentik dalam portofolio UKK di depan asesor BNSP.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-black text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Penyerapan Kerja Langsung Industri</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Banyak perusahaan teknologi dan korporasi mitra (seperti Dicoding, AWS, Astra) merekrut siswa berprestasi langsung dari ajang hackathon dan lomba kejuruan resmi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
