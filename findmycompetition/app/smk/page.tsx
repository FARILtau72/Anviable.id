import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db, withDbRetry, ensureMatchmakingTables } from "@/db";
import { competitions } from "@/db/schema";
import { eq, asc, or, sql } from "drizzle-orm";
import SmkFilterExplorer from "@/components/SmkFilterExplorer";
import type { CompetitionCardData } from "@/components/CompetitionCard";
import {
  GraduationCap,
  Building2,
  Landmark,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zona Lomba Khusus Siswa SMK 2026 - Filter 2-Tier Jurusan & Penyelenggara Resmi - naviable.id",
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
      {/* 1. HERO HEADER BANNER (ZONA SISWA SMK: GDGoC RETRO NEO-BRUTALIST) */}
      <section className="neo-box overflow-hidden bg-[#FBBC04] border-2 border-black shadow-[6px_6px_0px_#000] text-black">
        {/* Retro Window Header */}
        <div className="retro-window-header border-b-2 border-black bg-white px-4 py-2 flex items-center justify-between">
          <div className="retro-dots">
            <span className="retro-dot bg-[#EA4335]" />
            <span className="retro-dot bg-[#FBBC04]" />
            <span className="retro-dot bg-[#34A853]" />
            <span className="ml-2 font-mono text-[11px] font-black text-black">
              naviable://zona_kejuruan_smk.sys
            </span>
          </div>
          <span className="neo-badge bg-black text-[#FBBC04] px-2 py-0.5 text-[9px]">
            VOKASI UNGGUL
          </span>
        </div>

        <div className="p-6 sm:p-10 space-y-4">
          <div className="neo-badge bg-white text-black px-3 py-1 text-xs">
            <GraduationCap className="h-4 w-4 mr-1 inline-block" />
            <span>ZONA KHUSUS SISWA SMK SE-INDONESIA</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl lg:text-5xl leading-tight">
            Cari Lomba SMK yang Tepat Sasaran dengan Filter 2-Tier
          </h1>

          <p className="text-sm sm:text-base text-slate-900 leading-relaxed max-w-3xl font-medium">
            Sering kesulitan menemukan lomba yang sesuai dengan kompetensi keahlianmu? naviable.id menghadirkan sistem penyaringan 2-tier: cocokkan lomba langsung dengan <strong>jurusan spesifikmu</strong> (RPL, TKJ, DKV, Akuntansi, Mesin, Kuliner) dan saring berdasarkan <strong>penyelenggara resmi terakreditasi</strong> (Puspresnas, Kemendikbud, Balai Talenta, atau Politeknik Negeri).
          </p>

          {/* 3 Keunggulan Khusus Siswa SMK */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-xl border-2 border-black bg-white p-3.5 shadow-[2px_2px_0px_#000] flex items-start gap-2.5">
              <Landmark className="h-4 w-4 text-[#4285F4] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-black font-black">Terindeks SIMT Puspresnas</strong>
                <span className="text-slate-700 text-[11px] font-medium leading-tight">
                  Sertifikat resmi pemerintah yang diakui untuk kurasi prestasi nasional.
                </span>
              </div>
            </div>

            <div className="rounded-xl border-2 border-black bg-white p-3.5 shadow-[2px_2px_0px_#000] flex items-start gap-2.5">
              <GraduationCap className="h-4 w-4 text-[#34A853] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-black font-black">Tiket Emas SNBP Vokasi</strong>
                <span className="text-slate-700 text-[11px] font-medium leading-tight">
                  Lomba dari politeknik negeri (PENS, Polban, PNJ) jadi poin besar masuk PTN.
                </span>
              </div>
            </div>

            <div className="rounded-xl border-2 border-black bg-white p-3.5 shadow-[2px_2px_0px_#000] flex items-start gap-2.5">
              <Building2 className="h-4 w-4 text-[#EA4335] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-black font-black">Portofolio Uji Kompetensi (UKK)</strong>
                <span className="text-slate-700 text-[11px] font-medium leading-tight">
                  Proyek lomba kejuruan diakui langsung oleh asesor LSP dan mitra industri.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-TIER FILTER EXPLORER */}
      <Suspense fallback={<div className="h-96 w-full neo-box animate-pulse" />}>
        <SmkFilterExplorer competitions={formattedCompetitions} />
      </Suspense>

      {/* 3. PANDUAN PRESTASI SISWA SMK */}
      <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
        <div className="retro-window-header border-b-2 border-black bg-[#FAF8F5] px-4 py-2 flex items-center justify-between">
          <span className="font-mono text-xs font-black uppercase text-black">
            [PANDUAN_JALUR_PRESTASI_SMK.DOC]
          </span>
          <span className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-2 py-0.5 text-[9px]">
            INFORMASI
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-black sm:text-2xl tracking-tight">
            Mengapa Sertifikat Lomba Sangat Krusial untuk Siswa SMK?
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-2">
            <div className="rounded-xl border-2 border-black bg-[#FAF8F5] p-5 shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#4285F4] text-white font-mono font-black text-sm shadow-[1px_1px_0px_#000]">
                1
              </div>
              <h3 className="font-black text-black text-sm">Prioritas Seleksi SNBP Jalur Vokasi</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Politeknik Negeri dan Program Vokasi Universitas Negeri sangat memprioritaskan siswa SMK yang memiliki prestasi di bidang yang selaras dengan program studi D-4 / Sarjana Terapan.
              </p>
            </div>

            <div className="rounded-xl border-2 border-black bg-[#FAF8F5] p-5 shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#34A853] text-white font-mono font-black text-sm shadow-[1px_1px_0px_#000]">
                2
              </div>
              <h3 className="font-black text-black text-sm">Nilai Tambah Uji Sertifikasi LSP</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Hasil karya atau prototipe kompetisi (seperti aplikasi untuk RPL atau rancangan robotika untuk Mekatronika) menjadi bukti otentik dalam portofolio UKK di depan asesor BNSP.
              </p>
            </div>

            <div className="rounded-xl border-2 border-black bg-[#FAF8F5] p-5 shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#FBBC04] text-black font-mono font-black text-sm shadow-[1px_1px_0px_#000]">
                3
              </div>
              <h3 className="font-black text-black text-sm">Penyerapan Kerja Langsung Industri</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Banyak perusahaan teknologi dan korporasi mitra (seperti Dicoding, AWS, Astra) merekrut siswa berprestasi langsung dari ajang hackathon dan lomba kejuruan resmi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
