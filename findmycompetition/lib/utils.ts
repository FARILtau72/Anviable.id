import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category, Level } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .concat("-", Date.now().toString(36));
}

export const CATEGORY_LABELS: Record<Category, string> = {
  TEKNOLOGI_RPL: "Teknologi & RPL",
  DESAIN_SENI: "Desain & Seni",
  SAINS_MATEMATIKA: "Sains & Matematika",
  BISNIS_AKUNTANSI: "Bisnis & Akuntansi",
  BAHASA_DEBAT: "Bahasa & Debat",
  LOKAL_VOKASI: "Lokal & Vokasi",
  UMUM: "Umum",
};

export const LEVEL_LABELS: Record<Level, string> = {
  KOTA_KABUPATEN: "Kota / Kabupaten",
  PROVINSI: "Provinsi",
  NASIONAL: "Nasional",
  INTERNASIONAL: "Internasional",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  TEKNOLOGI_RPL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DESAIN_SENI: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  SAINS_MATEMATIKA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  BISNIS_AKUNTANSI: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  BAHASA_DEBAT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  LOKAL_VOKASI: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  UMUM: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export const CATEGORY_GRADIENTS: Record<Category, string> = {
  TEKNOLOGI_RPL: "from-blue-600 to-indigo-700",
  DESAIN_SENI: "from-pink-600 to-rose-700",
  SAINS_MATEMATIKA: "from-cyan-600 to-teal-700",
  BISNIS_AKUNTANSI: "from-amber-600 to-yellow-700",
  BAHASA_DEBAT: "from-purple-600 to-violet-700",
  LOKAL_VOKASI: "from-orange-600 to-red-700",
  UMUM: "from-slate-600 to-gray-700",
};
