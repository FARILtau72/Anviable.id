import Link from "next/link";
import { Megaphone, ArrowRight, ShieldCheck } from "lucide-react";

export default function OrganizerCTABanner() {
  return (
    <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
      {/* Retro Window Titlebar */}
      <div className="retro-window-header border-b-2 border-black bg-[#FAF8F5] px-4 py-2 flex items-center justify-between">
        <div className="retro-dots">
          <span className="retro-dot bg-[#EA4335]" />
          <span className="retro-dot bg-[#FBBC04]" />
          <span className="retro-dot bg-[#34A853]" />
          <span className="ml-2 font-mono text-[11px] font-black text-black">
            naviable://organizer_channel.sys
          </span>
        </div>
        <span className="neo-badge bg-[#FBBC04] text-black px-2 py-0.5 text-[9px]">
          GRATIS UNTUK PANITIA
        </span>
      </div>

      <div className="p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Side */}
          <div className="max-w-2xl space-y-4">
            <span className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-2.5 py-1 text-xs">
              <Megaphone className="h-3.5 w-3.5 mr-1" />
              <span>KANAL PUBLIKASI PENYELENGGARA</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-black">
              Punya Agenda Lomba untuk Pelajar SMA & SMK?
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-xl">
              Publikasikan ajang kompetisi OSIS, BEM kampus, dinas pendidikan, atau komunitasmu. Informasi ditinjau tim kurator dan disajikan langsung ke ribuan pelajar di seluruh Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="neo-badge bg-[#E6F4EA] text-[#137333] px-2.5 py-1 text-xs">
                ✓ Verifikasi data 24 jam
              </span>
              <span className="neo-badge bg-[#FEF7E0] text-[#B06000] px-2.5 py-1 text-xs">
                ✓ Tautan juknis resmi
              </span>
              <span className="neo-badge bg-[#FCE8E6] text-[#C5221F] px-2.5 py-1 text-xs">
                ✓ Bebas biaya publikasi
              </span>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/submit"
              className="neo-btn neo-btn-blue px-6 py-3.5 text-xs sm:text-sm font-black text-center flex items-center justify-center gap-2"
            >
              <span>Daftarkan Lomba Gratis</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/submit#promosi"
              className="neo-btn neo-btn-white px-6 py-3.5 text-xs sm:text-sm font-black text-center"
            >
              Panduan Kurasi & Publikasi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
