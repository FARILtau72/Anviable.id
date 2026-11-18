"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  FlaskConical,
  Code,
  TrendingUp,
  FileText,
  Palette,
  Mic,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import type { Category } from "@/db/schema";

interface CategoryGridProps {
  categoryCounts?: Record<string, number>;
}

const CATEGORIES = [
  {
    key: "SAINS_MATEMATIKA" as Category,
    title: "Sains & Olimpiade Akademik",
    appName: "sains_osn.exe",
    description:
      "Persiapan OSN, KSM, Olimpiade Matematika, Fisika Terapan, Kimia & Biomedik. Terbuka semua bidang sains.",
    icon: FlaskConical,
    iconBg: "bg-[#34A853] text-white",
    headerBg: "bg-[#E6F4EA]",
    actionText: "Jelajahi Olimpiade",
  },
  {
    key: "TEKNOLOGI_RPL" as Category,
    title: "Rekayasa, Coding & Robotik",
    appName: "coding_hack.exe",
    description:
      "Mobile Development, Pemrograman Web, Internet of Things (IoT), Game Dev, Cyber Security, dan Robotik SMK.",
    icon: Code,
    iconBg: "bg-[#4285F4] text-white",
    headerBg: "bg-[#E8F0FE]",
    actionText: "Jelajahi Lomba IT",
  },
  {
    key: "BISNIS_AKUNTANSI" as Category,
    title: "Bisnis, Startup & Pemasaran",
    appName: "startup_biz.exe",
    description:
      "Business Plan, Inovasi BMC, Pitching Wirausaha, E-Commerce, Influencer Management, & Kasus Finansial.",
    icon: TrendingUp,
    iconBg: "bg-[#FBBC04] text-black",
    headerBg: "bg-[#FEF7E0]",
    actionText: "Jelajahi Bisnis Plan",
  },
  {
    key: "UMUM" as Category,
    title: "Karya Tulis Ilmiah & Esai",
    appName: "lkti_riset.exe",
    description:
      "LKTI Nasional, Kompetisi Esai Kritis Pelajar, Karya Riset Remaja (KIR), dan Riset Humaniora/Sosial.",
    icon: FileText,
    iconBg: "bg-[#4285F4] text-white",
    headerBg: "bg-[#E8F0FE]",
    actionText: "Jelajahi LKTI & Riset",
  },
  {
    key: "DESAIN_SENI" as Category,
    title: "Seni, Desain & Videografi",
    appName: "kreatif_seni.exe",
    description:
      "FLS2N, Desain Poster, Fotografi, Animasi 2D/3D, Film Pendek Pelajar, Vokal Solo & Komposisi Musik.",
    icon: Palette,
    iconBg: "bg-[#EA4335] text-white",
    headerBg: "bg-[#FCE8E6]",
    actionText: "Jelajahi Bidang Kreatif",
  },
  {
    key: "BAHASA_DEBAT" as Category,
    title: "Debat, Bahasa & Model UN",
    appName: "debat_mun.exe",
    description:
      "NSDC English Debate, LDBI Bahasa Indonesia, Storytelling, Speech Contest, dan Model United Nations (MUN).",
    icon: Mic,
    iconBg: "bg-[#A142F4] text-white",
    headerBg: "bg-[#F3E8FD]",
    actionText: "Jelajahi Debat & Bahasa",
  },
];

export default function CategoryGrid({ categoryCounts = {} }: CategoryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleSelect = (key: Category) => {
    router.push(`/lomba?category=${key}`);
  };

  return (
    <section id="bidang-minat" className="space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 neo-badge bg-[#E6F4EA] text-[#137333] px-2.5 py-1 text-xs mb-1">
            <span>KATALOG KATEGORI LOMBA</span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-black sm:text-3xl">
            Eksplorasi Bidang Minat & Jurusanmu
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
            Pilih jalur kompetisi yang sesuai dengan peminatan IPA, IPS, Bahasa, atau Konsentrasi Keahlian SMK.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/lomba")}
          className="neo-btn neo-btn-white px-4 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5"
        >
          <span>Semua Kategori</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 6 Category Window Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.key] || 0;
          const isSelected = currentCategory === cat.key;

          return (
            <button
              type="button"
              key={cat.title}
              onClick={() => handleSelect(cat.key)}
              className={`group flex flex-col justify-between rounded-xl border-2 border-black bg-white overflow-hidden text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "shadow-[6px_6px_0px_#000] -translate-x-0.5 -translate-y-0.5 ring-2 ring-black"
                  : "shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
              }`}
            >
              {/* Retro Window Header */}
              <div className={`flex items-center justify-between border-b-2 border-black px-3.5 py-1.5 ${cat.headerBg} w-full`}>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-black bg-[#EA4335]" />
                  <span className="h-2 w-2 rounded-full border border-black bg-[#FBBC04]" />
                  <span className="h-2 w-2 rounded-full border border-black bg-[#34A853]" />
                  <span className="ml-1 font-mono text-[10px] font-bold text-black uppercase">
                    {cat.appName}
                  </span>
                </div>
                <span className="neo-badge bg-white text-black px-1.5 py-0.2 text-[9px] font-black">
                  {count > 0 ? `${count} Lomba` : "Aktif"}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 w-full bg-white">
                <div>
                  {/* Icon */}
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] ${cat.iconBg}`}>
                    <Icon className="h-5 w-5 stroke-[2.5]" />
                  </div>

                  {/* Title */}
                  <h3 className="mt-3.5 text-base font-black text-black group-hover:text-[#4285F4] transition-colors">
                    {cat.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 font-medium">
                    {cat.description}
                  </p>
                </div>

                {/* Action Link Footer */}
                <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-black text-black group-hover:text-[#4285F4]">
                  <span>{cat.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Zona Khusus SMK Spotlight Banner: Neo-Brutalist Retro Box */}
      <div className="neo-box bg-[#FEF7E0] border-2 border-black p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#FBBC04] text-black shadow-[2px_2px_0px_#000] shrink-0">
            <GraduationCap className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-black">
                Siswa SMK? Temukan Lomba Sesuai Jurusanmu dengan Filter 2-Tier
              </h4>
              <span className="neo-badge bg-black text-[#FBBC04] px-1.5 py-0.2 text-[9px]">
                UNGGULAN
              </span>
            </div>
            <p className="text-[11px] text-slate-700 mt-1 font-medium max-w-2xl">
              Saring kompetisi berdasarkan jurusan kejuruan spesifikmu (RPL, TKJ, DKV, Akuntansi, Mesin) dan kurasi penyelenggara resmi (Puspresnas / Politeknik Negeri).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/smk")}
          className="neo-btn neo-btn-yellow px-5 py-2.5 text-xs font-black whitespace-nowrap shrink-0"
        >
          <span>Buka Zona SMK</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
        </button>
      </div>
    </section>
  );
}
