"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
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
    label: "RPL, TKJ & Cyber",
    icon: Laptop,
    desc: "Coding, Web Dev, Mobile & Jaringan",
  },
  {
    id: "DKV_DESAIN",
    label: "DKV & Multimedia",
    icon: Palette,
    desc: "UI/UX, 3D, Video & Grafis",
  },
  {
    id: "AKL_BISNIS",
    label: "Akuntansi & Bisnis",
    icon: Briefcase,
    desc: "Business Plan, Finansial & E-Commerce",
  },
  {
    id: "MESIN_OTOMOTIF",
    label: "Mesin & Robotika",
    icon: Wrench,
    desc: "IoT Hardware, Otomotif & Mekatronika",
  },
  {
    id: "KULINER_PARIWISATA",
    label: "Tata Boga & Hotel",
    icon: Utensils,
    desc: "Gastronomi, Pastry & Pariwisata",
  },
  {
    id: "TTG_RISET",
    label: "Teknologi Terapan",
    icon: Lightbulb,
    desc: "Karya Ilmiah & Solusi Inovasi",
  },
];

const ORGANIZER_TIERS: {
  id: SmkOrganizerTier;
  label: string;
  badge: string;
  icon: typeof Landmark;
  desc: string;
}[] = [
  {
    id: "ALL",
    label: "Semua Penyelenggara",
    badge: "Terverifikasi",
    icon: Award,
    desc: "Puspresnas, Politeknik Negeri & Industri",
  },
  {
    id: "PEMERINTAH",
    label: "Pemerintah / Ditjen Vokasi",
    badge: "SIMT Puspresnas",
    icon: Landmark,
    desc: "Kemendikbud, Puspresnas & BPTI",
  },
  {
    id: "KAMPUS_VOKASI",
    label: "Politeknik Negeri",
    badge: "SNBP Vokasi",
    icon: GraduationCap,
    desc: "PENS, Polban, PNJ & Vokasi Kampus",
  },
  {
    id: "INDUSTRI",
    label: "Mitra Industri & LSP",
    badge: "Portofolio UKK",
    icon: Building2,
    desc: "Dicoding, AWS, CISCO & LSP BNSP",
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
      {/* 2-TIER FILTER CONTROL PANEL */}
      <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-5 sm:p-7 space-y-6">
        {/* Tier 1 Header */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded border border-black bg-[#FBBC04] text-[11px] font-black text-black shadow-[1px_1px_0px_#000]">
                1
              </span>
              <h2 className="text-sm sm:text-base font-black text-black">
                Tier 1: Pilih Bidang Keahlian / Jurusan SMK
              </h2>
            </div>
            <span className="neo-badge bg-[#FEF7E0] text-black px-2.5 py-1 text-xs">
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
                  className={`flex flex-col text-left p-3 rounded-lg border-2 border-black transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FBBC04] text-black shadow-[3px_3px_0px_#000] font-black -translate-x-0.5 -translate-y-0.5"
                      : "bg-[#FAF8F5] text-black hover:bg-white shadow-[2px_2px_0px_#000]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded border border-black ${
                        isSelected ? "bg-white text-black" : "bg-white text-black"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-black shrink-0" />
                    )}
                  </div>
                  <span className="text-xs font-black leading-snug line-clamp-1">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-700 font-medium mt-0.5 line-clamp-1">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2 Header */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded border border-black bg-[#34A853] text-[11px] font-black text-white shadow-[1px_1px_0px_#000]">
                2
              </span>
              <h2 className="text-sm sm:text-base font-black text-black">
                Tier 2: Kategori & Reputasi Penyelenggara Resmi
              </h2>
            </div>
            <span className="neo-badge bg-[#E6F4EA] text-[#137333] px-2.5 py-1 text-xs">
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
                  className={`flex flex-col justify-between text-left p-3.5 rounded-lg border-2 border-black transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#34A853] text-white shadow-[3px_3px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                      : "bg-[#FAF8F5] text-black hover:bg-white shadow-[2px_2px_0px_#000]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded border border-black ${
                          isSelected ? "bg-white text-black" : "bg-white text-black"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`neo-badge text-[9px] px-1.5 py-0.2 ${
                          isSelected ? "bg-black text-white" : "bg-white text-black"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    </div>
                    <span className="text-xs font-black leading-tight block">
                      {tier.label}
                    </span>
                    <p className={`text-[10px] mt-1 leading-snug line-clamp-2 ${isSelected ? "text-emerald-100" : "text-slate-600"}`}>
                      {tier.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Search & Free Toggle Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-black/10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kompetensi (misal: LKS, IoT, Animasi, Web Design)..."
              className="w-full rounded-lg border-2 border-black bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-xs font-bold text-black placeholder:text-slate-500 focus:bg-white focus:outline-none focus:shadow-[2px_2px_0px_#000]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#EA4335] hover:underline cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFreeOnly((prev) => !prev)}
              className={`neo-btn px-3.5 py-2 text-xs font-black cursor-pointer flex items-center gap-1.5 ${
                freeOnly
                  ? "bg-[#34A853] text-white shadow-[2px_2px_0px_#000]"
                  : "bg-white text-black shadow-[2px_2px_0px_#000]"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Hanya Gratis</span>
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
                className="text-xs font-black text-[#EA4335] hover:underline px-2 cursor-pointer font-mono"
              >
                [Reset]
              </button>
            )}
          </div>
        </div>
      </section>

      {/* RESULTS LISTING */}
      <section className="space-y-4">
        {/* Results Metadata Summary */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#4285F4]" />
            <h3 className="text-sm font-black text-black">
              Menampilkan {filteredCompetitions.length} Lomba Kejuruan Terpilih
            </h3>
          </div>
          <div className="text-xs font-mono font-bold text-slate-600">
            Bidang: <strong className="text-black">{activeMajorObj.label}</strong>
          </div>
        </div>

        {filteredCompetitions.length === 0 ? (
          <div className="neo-box flex flex-col items-center justify-center bg-white py-16 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#FEF7E0] text-black mb-3 shadow-[2px_2px_0px_#000]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h4 className="text-base font-black text-black">
              Belum ada lomba yang cocok dengan kombinasi 2 filter ini
            </h4>
            <p className="mt-1 text-xs text-slate-600 max-w-md font-medium">
              Coba ganti pilihan kategori penyelenggara ke &quot;Semua Penyelenggara&quot; atau nonaktifkan filter gratis untuk melihat opsi kompetisi lainnya.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedMajor("ALL");
                setSelectedOrganizerTier("ALL");
                setFreeOnly(false);
                setSearchQuery("");
              }}
              className="neo-btn neo-btn-blue mt-4 px-4 py-2 text-xs font-black cursor-pointer"
            >
              Tampilkan Seluruh Lomba Vokasi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCompetitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        )}
      </section>

      {/* CALL TO ACTION: KOLABORASI TIM SMK */}
      <section className="neo-box bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-3 py-1 text-xs">
              <Users className="h-3.5 w-3.5 mr-1 inline-block" />
              <span>KOLABORASI TIM LINTAS JURUSAN</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-black">
              Anak RPL Butuh Desainer DKV? Atau Butuh Pitcher Akuntansi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Di naviable.id, kamu bisa rekrut anggota tim lintas SMK dan jurusan se-Indonesia untuk persiapan Hackathon, LKS SMK, dan Lomba Inovasi Kejuruan.
            </p>
          </div>

          <Link
            href="/cari-tim"
            className="neo-btn neo-btn-yellow px-6 py-3.5 text-xs sm:text-sm font-black flex items-center gap-2 shrink-0"
          >
            <span>Buka Bursa Tim SMK</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
