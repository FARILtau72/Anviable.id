import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2, EyeOff, Database } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi : anviable.id",
  description:
    "Kebijakan privasi dan perlindungan data pengguna platform anviable.id. Transparan, aman, dan mematuhi regulasi perlindungan data pribadi.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6 sm:py-10">
      {/* Breadcrumb & Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 mb-4">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span>Keamanan & Kerahasiaan Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Kebijakan Privasi
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Terakhir diperbarui: 24 Oktober 2026. anviable.id berkomitmen menjaga kepercayaan pengguna dengan menjunjung tinggi privasi pelajar, guru, dan penyelenggara kompetisi sesuai ketentuan Undang-Undang Perlindungan Data Pribadi (UU PDP).
        </p>
      </section>

      {/* Main Content Articles */}
      <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs text-sm sm:text-base text-slate-700 leading-relaxed">
        {/* Poin 1: Data Lokal Tanpa Wajib Login */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <EyeOff className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              1. Privasi Akses Pelajar (Bebas Melacak Tanpa Akun)
            </h2>
          </div>
          <p>
            anviable.id dirancang agar dapat digunakan secara bebas tanpa mewajibkan siswa membuat akun atau mengumpulkan data identitas sensitif hanya untuk sekadar membaca informasi lomba.
          </p>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs sm:text-sm text-indigo-900">
            <strong>Penyimpanan Bookmark (LocalStorage Browser):</strong> Fitur &quot;Lomba Tersimpan&quot; disimpan langsung di memori browser lokal perangkat Anda, bukan di server pelacak kami. Anda memegang kendali penuh untuk menghapus data riwayat ini kapan pun melalui pengaturan browser Anda.
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Poin 2: Data yang Diserahkan Pengguna */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              2. Data yang Dikumpulkan Saat Interaksi Sukarela
            </h2>
          </div>
          <p>
            Kami hanya mengumpulkan data saat Anda secara sukarela mengisinya pada formulir interaktif di situs kami:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>
              <strong>Pengajuan Lomba Baru:</strong> Nama kompetisi, penyelenggara, deskripsi, juknis, link pendaftaran, serta nomor kontak atau email panitia yang dicantumkan untuk verifikasi kurasi.
            </li>
            <li>
              <strong>Pencarian Rekan Tim & Talent Pool:</strong> Nama/alias, asal sekolah, peminatan bidang keahlian, deskripsi ide proyek, serta nomor WhatsApp/sosial media yang sengaja disediakan agar calon rekan satu tim dapat menghubungi Anda.
            </li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Poin 3: Penggunaan & Larangan Penjualan Data */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              3. Jaminan Perlindungan (Tidak Ada Penjualan Data)
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs sm:text-sm text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Komitmen Tanpa Pihak Ketiga:</strong> anviable.id tidak pernah dan tidak akan pernah menjual, menyewakan, atau memperdagangkan data kontak siswa atau panitia kepada pihak ketiga untuk kepentingan iklan pemasaran (ad network spam).
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Poin 4: Hak Pengguna */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">
            4. Hak Pengguna atas Koreksi & Penghapusan
          </h2>
          <p>
            Sesuai perundangan yang berlaku, setiap pengguna yang mempublikasikan postingan pencarian tim atau informasi lomba berhak mengajukan:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>Koreksi data informasi lomba yang mengalami perpanjangan deadline.</li>
            <li>Penutupan / penarikan postingan pencarian tim yang kuotanya telah terpenuhi.</li>
            <li>Penghapusan nomor kontak dari direktori publik jika tidak lagi aktif.</li>
          </ul>
          <p className="pt-2 text-xs text-slate-500">
            Pengajuan dapat dikirimkan langsung melalui halaman <Link href="/pusat-bantuan" className="font-bold text-indigo-600 hover:underline">Pusat Bantuan</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
