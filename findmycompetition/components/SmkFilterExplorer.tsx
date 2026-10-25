"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Building2,
  Laptop,
  Palette,
  Briefcase,
  Wrench,
  Utensils,
  Lightbulb,
  Award,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import CompetitionCard, { type CompetitionCardData } from "@/components/CompetitionCard";

export interface SmkFilterExplorerProps {
  competitions: CompetitionCardData[];
}

type SmkMajorTier =
  | "ALL"
  | "RPL_TKJ"
  | "DKV_DESAIN"
  | "AKL_BISNIS"
  | "MESIN_OTOMOTIF"
  | "KULINER_PARIWISATA"
  | "TTG_RISET";

type SmkOrganizerTier = "ALL" | "PEMERINTAH" | "KAMPUS_VOKASI" | "INDUSTRI";

const MAJOR_OPTIONS: { id: SmkMajorTier; label: string; icon: typeof Laptop; desc: string }[] = [
  {
    id: "ALL",
    label: "Semua Jurusan SMK",
    icon: GraduationCap,
    desc: "Seluruh cabang lomba kejuruan & vokasi",
  },
  {
    id: "RPL_TKJ",
    label: "RPL, TKJ & Cyber Security",
    icon: Laptop,
    desc: "Coding, Web Dev, Mobile, Cloud & Jaringan",
  },
  {
    id: "DKV_DESAIN",
    label: "DKV, Animasi & Multimedia",
    icon: Palette,
    desc: "UI/UX, 3D Modeling, Video & Grafis",
  },
  {
    id: "AKL_BISNIS",
    label: "Akuntansi & Bisnis Digital",
    icon: Briefcase,
    desc: "Business Plan, Finansial & E-Commerce",
  },
  {
    id: "MESIN_OTOMOTIF",
    label: "Mesin, Otomotif & Mekatronika",
    icon: Wrench,
    desc: "Robotika, IoT Hardware & Manufaktur",
  },
  {
    id: "KULINER_PARIWISATA",
    label: "Tata Boga & Pariwisata",
    icon: Utensils,
    desc: "Gastronomi, Pastry & Hospitality",
  },
  {
    id: "TTG_RISET",
    label: "Teknologi Tepat Guna & Riset",
    icon: Lightbulb,
    desc: "Karya Ilmiah Terapan & Solusi Nyata",
  },
];

const ORGANIZER_TIERS: {
  id: SmkOrganizerTier;
  label: string;
  badge: string;
  icon: typeof Landmark;
  desc: string;
  badgeStyle: string;
}[] = [
  {
    id: "ALL",
    label: "Semua Penyelenggara Resmi",
    badge: "Terverifikasi",
    icon: Award,
    desc: "Puspresnas, Politeknik Negeri & Industri",
    badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "PEMERINTAH",
    label: "Resmi Pemerintah / Ditjen Vokasi",
    badge: "Terindeks SIMT Puspresnas",
    icon: Landmark,
    desc: "Kemendikbud, Puspresnas, BPTI, LKS SMK & Dinas",
    badgeStyle: "bg-amber-50 text-amber-900 border-amber-300",
  },
  {
    id: "KAMPUS_VOKASI",
    label: "Politeknik Negeri & Vokasi Kampus",
    badge: "Tiket Emas SNBP Vokasi",
    icon: GraduationCap,
    desc: "PENS, Polban, PNJ, Polinema, UI & UGM Vokasi",
    badgeStyle: "bg-indigo-50 text-indigo-900 border-indigo-200",
  },
  {
    id: "INDUSTRI",
    label: "Industri Teknologi & Asosiasi LSP",
    badge: "Nilai Tambah Portofolio UKK",
    icon: Building2,
    desc: "Dicoding, AWS, CISCO, Astra & Asosiasi Kejuruan",
    badgeStyle: "bg-emerald-50 text-emerald-900 border-emerald-300",
  },
];

function matchesMajor(comp: CompetitionCardData, major: SmkMajorTier): boolean {
  if (major === "ALL") return true;

  const text = `${comp.title} ${comp.organizer} ${comp.category}`.toLowerCase();

  switch (major) {
    case "RPL_TKJ":
      return (
        comp.category === "TEKNOLOGI_RPL" ||
        /rpl|tkj|sija|coding|developer|software|hackathon|cyber|web|aplikasi|cloud|iot/i.test(text)
      );
    case "DKV_DESAIN":
      return (
        comp.category === "DESAIN_SENI" ||
        /dkv|desain|multimedia|animasi|poster|ui\/ux|video|game|film|kreatif/i.test(text)
      );
    case "AKL_BISNIS":
      return (
        comp.category === "BISNIS_AKUNTANSI" ||
        /akuntansi|bisnis|akl|bdp|marketing|keuangan|startup|business|manajemen/i.test(text)
      );
    case "MESIN_OTOMOTIF":
      return (
        comp.category === "LOKAL_VOKASI" ||
        /mesin|otomotif|tkr|tsm|robotik|mekatronika|las|elektronik|manufaktur/i.test(text)
      );
    case "KULINER_PARIWISATA":
      return /kuliner|boga|pastry|perhotelan|pariwisata|hospitality|cooking|tata boga/i.test(text);
    case "TTG_RISET":
      return (
        comp.category === "SAINS_MATEMATIKA" ||
        comp.category === "LOKAL_VOKASI" ||
        /tepat guna|ttg|terapan|inovasi|lkti|penelitian|rekayasa/i.test(text)
      );
    default:
      return true;
  }
}

function matchesOrganizerTier(comp: CompetitionCardData, tier: SmkOrganizerTier): boolean {
  if (tier === "ALL") return true;

  const org = `${comp.organizer} ${comp.title}`.toLowerCase();

  switch (tier) {
    case "PEMERINTAH":
      return /puspresnas|kemendikbud|kemdikbud|ditjen vokasi|bpti|balai pengembangan talenta|lks|dinas pendidikan|kemenag|kemenpora|kementerian|pemerintah/i.test(
        org
      );
    case "KAMPUS_VOKASI":
      return /politeknik|pens|polban|pnj|polinema|polines|polimed|fakultas vokasi|sekolah vokasi|vokasi ui|vokasi ugm|universitas|institut teknologi|akademik/i.test(
        org
      );
    case "INDUSTRI":
      return /dicoding|aws|google|cisco|telkom|astra|toyota|lsp|pt |persero|corp|industri|asosiasi/i.test(
        org
      );
    default:
      return true;
  }
}

export default function SmkFilterExplorer({ competitions }: SmkFilterExplorerProps) {
  const [selectedMajor, setSelectedMajor] = useState<SmkMajorTier>("ALL");
  const [selectedOrganizerTier, setSelectedOrganizerTier] = useState<SmkOrganizerTier>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  // Compute filtered competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      // 1. Tier 1: Major check
      if (!matchesMajor(comp, selectedMajor)) return false;

      // 2. Tier 2: Organizer Tier check
      if (!matchesOrganizerTier(comp, selectedOrganizerTier)) return false;

      // 3. Free only toggle
      if (freeOnly && comp.registrationFee > 0) return false;

      // 4. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const haystack = `${comp.title} ${comp.organizer} ${comp.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [competitions, selectedMajor, selectedOrganizerTier, freeOnly, searchQuery]);

  const activeMajorObj = MAJOR_OPTIONS.find((m) => m.id === selectedMajor) || MAJOR_OPTIONS[0];
  const activeOrgObj = ORGANIZER_TIERS.find((o) => o.id === selectedOrganizerTier) || ORGANIZER_TIERS[0];

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 2-TIER FILTER CONTROL PANEL                                              */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
        {/* Tier 1 Header */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-black text-white">
                1
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Tier 1: Pilih Bidang Keahlian / Jurusan SMK
              </h2>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full w-fit">
              {activeMajorObj.label}
            </span>
          </div>

          {/* Tier 1 Grid Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {MAJOR_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedMajor === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedMajor(opt.id)}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? "text-indigo-950 font-extrabold" : "text-slate-800"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2 Header */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-black text-white">
                2
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Tier 2: Kategori & Reputasi Penyelenggara Resmi
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
              {activeOrgObj.badge}
            </span>
          </div>

          {/* Tier 2 Organizer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ORGANIZER_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedOrganizerTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedOrganizerTier(tier.id)}
                  className={`flex flex-col justify-between text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                          isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeStyle}`}
                      >
                        {tier.badge}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight block ${
                        isSelected ? "text-emerald-950 font-extrabold" : "text-slate-800"
                      }`}
                    >
                      {tier.label}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                      {tier.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Search & Free Toggle Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kompetensi (misal: LKS, IoT, Animasi, Web Design)..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFreeOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                freeOnly
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Hanya yang Gratis (Rp 0)</span>
            </button>

            {(selectedMajor !== "ALL" ||
              selectedOrganizerTier !== "ALL" ||
              searchQuery ||
              freeOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedMajor("ALL");
                  setSelectedOrganizerTier("ALL");
                  setSearchQuery("");
                  setFreeOnly(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* RESULTS LISTING                                                           */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        {/* Results Metadata Summary */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Menampilkan {filteredCompetitions.length} Lomba Kejuruan Terpilih
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Bidang: <strong className="text-slate-800">{activeMajorObj.label}</strong>
          </div>
        </div>

        {filteredCompetitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Belum ada lomba yang cocok dengan kombinasi 2 filter ini
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-md">
              Coba ganti pilihan kategori penyelenggara ke "Semua Penyelenggara" atau nonaktifkan filter gratis untuk melihat opsi kompetisi lainnya.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedMajor("ALL");
                setSelectedOrganizerTier("ALL");
                setFreeOnly(false);
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Tampilkan Seluruh Lomba Vokasi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCompetitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* CALL TO ACTION: KOLABORASI TIM SMK                                        */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-indigo-200 backdrop-blur-xs">
              <Users className="h-3.5 w-3.5 text-indigo-300" />
              <span>Butuh Rekan Tim Beda Jurusan?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Anak RPL Butuh Desainer DKV? Atau Butuh Pitcher Akuntansi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Di naviable.id, kamu bisa rekrut anggota tim lintas SMK dan jurusan se-Indonesia untuk persiapan Hackathon, LKS SMK, dan Lomba Inovasi Kejuruan.
            </p>
          </div>

          <Link
            href="/cari-tim"
            className="btn-coral inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all shrink-0"
          >
            <span>Buka Bursa Tim SMK</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
