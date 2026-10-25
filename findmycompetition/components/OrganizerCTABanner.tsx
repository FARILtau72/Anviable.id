import Link from "next/link";
import { Megaphone } from "lucide-react";

export default function OrganizerCTABanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white p-8 sm:p-12 lg:p-14 border border-indigo-900 shadow-xl">
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Side */}
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-md bg-indigo-900/80 px-3 py-1 text-xs font-semibold text-indigo-200 border border-indigo-800">
            <Megaphone className="h-3.5 w-3.5 text-indigo-300" />
            <span>Kanal Publikasi Penyelenggara</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            Punya Info Kompetisi untuk Pelajar?
          </h2>

          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-xl">
            Publikasikan ajang kompetisi OSIS, BEM, universitas, dinas, atau komunitasmu. Informasi akan ditinjau tim kurator dan disajikan langsung ke ribuan pelajar SMA, SMK, dan MA di seluruh Indonesia.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-indigo-200 font-medium">
            <span>• Verifikasi data dalam 24 jam</span>
            <span>• Tautan langsung ke dokumen juknis resmi</span>
            <span>• Gratis tanpa biaya pemasangan informasi</span>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
          <Link
            href="/submit"
            className="btn-coral flex items-center justify-center rounded-xl px-6 py-3.5 text-xs sm:text-sm font-bold text-center cursor-pointer shadow-md"
          >
            Daftarkan Lomba Gratis
          </Link>

          <Link
            href="/submit#promosi"
            className="inline-flex items-center justify-center rounded-xl border border-indigo-800 bg-indigo-900/60 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-900 transition-colors text-center cursor-pointer"
          >
            Panduan Kurasi & Publikasi
          </Link>
        </div>
      </div>
    </section>
  );
}
