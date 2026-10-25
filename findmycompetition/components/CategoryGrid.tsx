"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  FlaskConical,
  Code,
  TrendingUp,
  FileText,
  Palette,
  Mic,
} from "lucide-react";
import type { Category } from "@/db/schema";

interface CategoryGridProps {
  categoryCounts?: Record<string, number>;
}

const CATEGORIES = [
  {
    key: "SAINS_MATEMATIKA" as Category,
    title: "Sains & Olimpiade Akademik",
    description:
      "Persiapan OSN, KSM, Olimpiade Matematika, Fisika Terapan, Kimia & Biomedik. Terbuka semua bidang sains.",
    icon: FlaskConical,
    iconBg: "bg-purple-100 text-purple-700",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    actionText: "Jelajahi Olimpiade",
  },
  {
    key: "TEKNOLOGI_RPL" as Category,
    title: "Rekayasa, Coding & Robotik",
    description:
      "Mobile Development, Pemrograman Web, Internet of Things (IoT), Game Dev, Cyber Security, dan Robotik SMK.",
    icon: Code,
    iconBg: "bg-orange-100 text-orange-700",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
    actionText: "Jelajahi Lomba IT",
  },
  {
    key: "BISNIS_AKUNTANSI" as Category,
    title: "Bisnis, Startup & Pemasaran",
    description:
      "Business Plan, Inovasi BMC, Pitching Wirausaha, E-Commerce, Influencer Management, & Kasus Finansial.",
    icon: TrendingUp,
    iconBg: "bg-emerald-100 text-emerald-700",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    actionText: "Jelajahi Bisnis Plan",
  },
  {
    key: "UMUM" as Category,
    title: "Karya Tulis Ilmiah & Esai",
    description:
      "LKTI Nasional, Kompetisi Esai Kritis Pelajar, Karya Riset Remaja (KIR), dan Riset Humaniora/Sosial.",
    icon: FileText,
    iconBg: "bg-blue-100 text-blue-700",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    actionText: "Jelajahi LKTI & Riset",
  },
  {
    key: "DESAIN_SENI" as Category,
    title: "Seni, Desain & Videografi",
    description:
      "FLS2N, Desain Poster, Fotografi, Animasi 2D/3D, Film Pendek Pelajar, Vokal Solo & Komposisi Musik.",
    icon: Palette,
    iconBg: "bg-amber-100 text-amber-700",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    actionText: "Jelajahi Bidang Kreatif",
  },
  {
    key: "BAHASA_DEBAT" as Category,
    title: "Debat, Bahasa & Model UN",
    description:
      "NSDC English Debate, LDBI Bahasa Indonesia, Storytelling, Speech Contest, dan Model United Nations (MUN).",
    icon: Mic,
    iconBg: "bg-teal-100 text-teal-700",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
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
          <span className="text-xs font-semibold text-slate-500">
            Peminatan Akademik & Kejuruan
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Eksplorasi Bidang Minat & Jurusanmu
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Pilih jalur kompetisi yang sesuai dengan peminatan IPA, IPS, Bahasa, atau Konsentrasi Keahlian SMK.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/lomba")}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Lihat Seluruh Kategori
        </button>
      </div>

      {/* 6 Category Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.key] || 0;
          const isSelected = currentCategory === cat.key;

          return (
            <button
              type="button"
              key={cat.title}
              onClick={() => handleSelect(cat.key)}
              className={`group flex flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 text-left transition-all duration-200 shadow-xs hover:border-slate-300 hover:shadow-md cursor-pointer ${
                isSelected
                  ? "border-indigo-600 ring-2 ring-indigo-600/20"
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Top: Icon & Count Badge */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cat.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${cat.badgeBg}`}>
                    {count > 0 ? `${count} Lomba Aktif` : "Katalog Terbuka"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {cat.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-900">
                <span>{cat.actionText}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
