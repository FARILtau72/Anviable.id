import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, School, Building2, Landmark, GraduationCap } from "lucide-react";
import NaviableLogo from "@/components/NaviableLogo";

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white mt-24">
      {/* Retro Landmark Skyline Bar (Inspired by 'Dari IPB untuk Bogor' in GDGoC screenshot) */}
      <div className="border-b-2 border-black bg-[#FAF8F5] py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col items-center text-center space-y-4">
          <div className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-3 py-1 text-xs">
            <span>DARI PELAJAR UNTUK INDONESIA</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-black">
            Merajut Prestasi Siswa SMA, SMK, & MA se-Nusantara
          </h3>
          <p className="text-xs text-slate-600 max-w-xl font-medium">
            Mendukung talenta muda Indonesia dari Sabang sampai Merauke menuju perguruan tinggi negeri dan dunia industri profesional.
          </p>

          {/* Retro Skyline Landmark Glyphs */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4 text-black">
            <div className="flex flex-col items-center gap-1 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000] group-hover:-translate-y-1 transition-transform">
                <School className="h-6 w-6 text-[#4285F4]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-700">SMA & MA</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000] group-hover:-translate-y-1 transition-transform">
                <GraduationCap className="h-6 w-6 text-[#FBBC04]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-700">SMK Vokasi</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000] group-hover:-translate-y-1 transition-transform">
                <Landmark className="h-6 w-6 text-[#EA4335]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-700">PTN Impian</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000] group-hover:-translate-y-1 transition-transform">
                <Building2 className="h-6 w-6 text-[#34A853]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-700">Industri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-10 border-b-2 border-black/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <NaviableLogo size="lg" />

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Direktori dan kurasi informasi kompetisi resmi untuk siswa SMA, SMK, dan MA di seluruh Nusantara. Menghubungkan pelajar ke ajang OSN, LKS SMK, FLS2N, LKTI, olimpiade sains, dan kejuaraan teknologi.
            </p>

            <div className="inline-flex items-center gap-2 neo-badge bg-[#E6F4EA] text-[#137333] px-3 py-1.5 text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Kurasi Resmi & Bebas Scam</span>
            </div>
          </div>

          {/* Col 1: Kategori Lomba */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-black">
              [Kategori Lomba]
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold text-slate-700">
              <li>
                <Link href="/lomba?category=SAINS_MATEMATIKA" className="hover:text-[#4285F4] transition-colors">
                  Sains & Olimpiade
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=TEKNOLOGI_RPL" className="hover:text-[#4285F4] transition-colors">
                  Teknologi & RPL
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=DESAIN_SENI" className="hover:text-[#4285F4] transition-colors">
                  Seni & Desain
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=BISNIS_AKUNTANSI" className="hover:text-[#4285F4] transition-colors">
                  Bisnis & Akuntansi
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=BAHASA_DEBAT" className="hover:text-[#4285F4] transition-colors">
                  Bahasa & Debat
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Fitur Pelajar */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-black">
              [Layanan Pelajar]
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold text-slate-700">
              <li>
                <Link href="/lomba" className="hover:text-[#4285F4] transition-colors">
                  Katalog Lomba Lengkap
                </Link>
              </li>
              <li>
                <Link href="/smk" className="hover:text-black flex items-center gap-1.5">
                  <span>Zona Siswa SMK</span>
                  <span className="neo-badge bg-[#FBBC04] text-black px-1.5 py-0.2 text-[9px]">
                    2-Tier
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cari-tim" className="hover:text-[#4285F4] transition-colors">
                  Portal Rekan Tim
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-[#4285F4] transition-colors">
                  Daftar Tersimpan
                </Link>
              </li>
              <li>
                <Link href="/pusat-bantuan" className="hover:text-[#4285F4] transition-colors">
                  Pusat Bantuan & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Penyelenggara & Kurasi */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-black">
              [Penyelenggara]
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold text-slate-700">
              <li>
                <Link href="/submit" className="text-black font-black hover:text-[#4285F4] transition-colors">
                  Daftarkan Info Lomba
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#4285F4] transition-colors">
                  Panel Moderasi & Kurasi
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <span className="block font-mono text-[10px] font-bold text-slate-500 uppercase mb-1">
                Sumber Data Resmi:
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Puspresnas Kemendikbudristek, Ditjen Vokasi, Perguruan Tinggi Negeri, & Panitia Terverifikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs font-bold text-slate-600 sm:flex-row">
          <p>
            © 2026 <span className="font-black text-black">naviable.id</span>. Pelajar Indonesia Berprestasi.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/syarat-ketentuan" className="hover:text-[#4285F4] transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/kebijakan-privasi" className="hover:text-[#4285F4] transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/pusat-bantuan" className="hover:text-[#4285F4] transition-colors">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
