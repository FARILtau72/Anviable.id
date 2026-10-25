import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import NaviableLogo from "@/components/NaviableLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top 4-column link section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <NaviableLogo size="lg" />

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Direktori dan kurasi informasi kompetisi resmi untuk siswa SMA, SMK, dan MA di seluruh Nusantara. Menghubungkan pelajar ke ajang OSN, LKS SMK, FLS2N, LKTI, olimpiade sains, dan kejuaraan teknologi.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Kurasi Resmi & Bebas Scam</span>
            </div>
          </div>

          {/* Col 1: Kategori Lomba */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">
              Kategori Lomba
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link href="/lomba?category=SAINS_MATEMATIKA" className="hover:text-indigo-900 transition-colors">
                  Sains & Olimpiade
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=TEKNOLOGI_RPL" className="hover:text-indigo-900 transition-colors">
                  Teknologi & RPL
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=DESAIN_SENI" className="hover:text-indigo-900 transition-colors">
                  Seni & Desain
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=BISNIS_AKUNTANSI" className="hover:text-indigo-900 transition-colors">
                  Bisnis & Akuntansi
                </Link>
              </li>
              <li>
                <Link href="/lomba?category=BAHASA_DEBAT" className="hover:text-indigo-900 transition-colors">
                  Bahasa & Debat
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Fitur Pelajar */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">
              Layanan Pelajar
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link href="/lomba" className="hover:text-indigo-900 transition-colors">
                  Katalog Lomba Lengkap
                </Link>
              </li>
              <li>
                <Link href="/smk" className="hover:text-amber-800 font-semibold text-amber-700 transition-colors flex items-center gap-1.5">
                  <span>Zona Khusus Siswa SMK</span>
                  <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">
                    2-Tier
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cari-tim" className="hover:text-indigo-900 transition-colors">
                  Portal Cari Rekan Tim
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-indigo-900 transition-colors">
                  Daftar Lomba Tersimpan
                </Link>
              </li>
              <li>
                <Link href="/pusat-bantuan" className="hover:text-indigo-900 transition-colors">
                  Pusat Bantuan & Tanya Jawab
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Penyelenggara & Kurasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">
              Penyelenggara
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link href="/submit" className="hover:text-orange-700 font-semibold text-orange-600 transition-colors">
                  Daftarkan Info Lomba
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-900 transition-colors">
                  Panel Moderasi & Kurasi
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <span className="block text-[11px] font-semibold text-slate-500 mb-1">
                Sumber Resmi Terverifikasi:
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Puspresnas Kemendikbudristek, Ditjen Vokasi, Perguruan Tinggi Negeri, dan Panitia Resmi Terdaftar.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>
            © 2026 <span className="font-semibold text-slate-800">naviable.id</span>. Didistribusikan untuk Generasi Emas Siswa SMA, SMK & MA se-Indonesia.
          </p>

          <div className="flex items-center gap-6 text-slate-500">
            <Link href="/syarat-ketentuan" className="hover:text-indigo-600 transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/kebijakan-privasi" className="hover:text-indigo-600 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/pusat-bantuan" className="hover:text-indigo-600 transition-colors">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
