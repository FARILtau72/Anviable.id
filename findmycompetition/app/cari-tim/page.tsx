import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db, withDbRetry, ensureMatchmakingTables } from "@/db";
import { teamPostings, talentProfiles } from "@/db/schema";
import { desc } from "drizzle-orm";
import MatchmakingExplorer from "@/components/MatchmakingExplorer";
import {
  Users,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Trophy,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Rekan Tim Lomba & Hackathon Pelajar SMA/SMK : naviable.id",
  description:
    "Temukan partner tim tangguh untuk Hackathon, LKTI, LKS SMK, dan Olimpiade. Rekrut anggota dengan keahlian spesifik atau tawarkan skill-mu sebagai free agent.",
};

export default async function CariTimPage() {
  await connection();
  await ensureMatchmakingTables();

  const rawTeams = await withDbRetry(() =>
    db.select().from(teamPostings).orderBy(desc(teamPostings.createdAt))
  );

  const rawTalents = await withDbRetry(() =>
    db.select().from(talentProfiles).orderBy(desc(talentProfiles.createdAt))
  );

  // Security sanitize: strip managePin from client payload
  const teams = (rawTeams || []).map((t) => {
    const { managePin, ...rest } = t;
    return { ...rest, managePin: "" };
  });

  const talents = (rawTalents || []).map((tal) => {
    const { managePin, ...rest } = tal;
    return { ...rest, managePin: "" };
  });

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-900/60 px-3.5 py-1 text-xs font-bold text-indigo-300 shadow-2xs backdrop-blur-sm">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ekosistem Kolaborasi Siswa SMA & SMK se-Indonesia</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Cari Rekan Tim Lomba & Hackathon Pelajar
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Jangan biarkan kekurangan anggota menghalangi prestasimu! Temukan teman satu tim lintas
            sekolah, kota, dan kompetensi keahlian yang memiliki ambisi juara yang sama untuk
            ajang Hackathon, LKTI, Robotik, LKS SMK, dan Debat Nasional.
          </p>

          {/* 3 Keunggulan Fitur */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-slate-200">Rekrut Berbasis Role Spesifik</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
              <Globe2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-200">Kolaborasi Lintas 38 Provinsi</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="font-semibold text-slate-200">Kontak Resmi & Bebas Ghosting</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Matchmaking Explorer (Dual-mode: Teams & Talents) */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100" />}>
        <MatchmakingExplorer initialTeams={teams} initialTalents={talents} />
      </Suspense>

      {/* 3. Panduan Etika & Tips Kolaborasi */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-semibold text-slate-500 mb-1.5 block">
          Panduan Kolaborasi Tim
        </span>
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
          3 Kunci Membangun Tim Juara di naviable.id
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-black text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Bagi Peran yang Seimbang</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pastikan tim memiliki kombinasi peran teknis (Hacker/Coder/Riset) dan peran non-teknis
              (Hipster/UI/Desain Poster dan Hustler/Pitching/Presenter).
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-black text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Sepakati Komitmen Waktu</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tentukan jadwal pertemuan online mingguan (via Google Meet/Discord) dan deadline internal
              minimal H-5 sebelum batas submit juknis resmi.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-black text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Tautkan ke Lomba Terverifikasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pilih kompetisi resmi terakreditasi BPTI atau kampus terpercaya di katalog naviable.id
              agar sertifikat kemenangan dapat diakui di pendaftaran SNBP & Beasiswa.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Belum menemukan kompetisi yang ingin diikuti?
          </p>
          <Link
            href="/lomba"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>Jelajahi Katalog Lomba Lengkap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
