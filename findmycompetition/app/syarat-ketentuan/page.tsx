import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan : anviable.id",
  description:
    "Syarat dan ketentuan penggunaan platform anviable.id untuk pelajar SMA/SMK/MA dan penyelenggara kompetisi di seluruh Indonesia.",
};

export default function SyaratKetentuanPage() {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 mb-4">
          <FileText className="h-3.5 w-3.5 text-indigo-600" />
          <span>Dokumen Legal Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Syarat & Ketentuan Layanan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Terakhir diperbarui: 24 Oktober 2026. Mohon membaca ketentuan berikut sebelum memanfaatkan
          layanan kurasi direktori kompetisi dan matchmaking tim di anviable.id.
        </p>
      </section>

      {/* Main Content Articles */}
      <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs text-sm sm:text-base text-slate-700 leading-relaxed">
        {/* Pasal 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">1</span>
            Pendahuluan & Definisi
          </h2>
          <p>
            Selamat datang di <strong>anviable.id</strong>. Platform ini dikembangkan sebagai sarana agregator informasi, direktori kompetisi akademik maupun non-akademik, serta fasilitas pencarian rekan tim kolaborasi yang ditujukan secara khusus bagi siswa SMA, SMK, MA, dan guru pembimbing di seluruh wilayah Republik Indonesia.
          </p>
          <p>
            Dengan mengakses situs ini, Anda menyatakan setuju untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, Anda disarankan untuk tidak melanjutkan penggunaan situs.
          </p>
        </section>

        <hr className="border-slate-100" />

        {/* Pasal 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">2</span>
            Akses Informasi Bebas Biaya (Tanpa Pungutan)
          </h2>
          <p>
            Seluruh siswa, guru pembimbing, dan masyarakat umum dapat mengakses seluruh katalog lomba, mengunduh tautan petunjuk teknis (Juknis), menyimpan bookmark kompetisi, dan menggunakan sinkronisasi kalender di anviable.id secara <strong>100% gratis tanpa biaya langganan</strong>.
          </p>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs sm:text-sm text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              anviable.id tidak pernah memungut biaya pendaftaran atas nama platform kami secara sepihak. Segala biaya pendaftaran lomba (jika ada) disetorkan langsung kepada panitia penyelenggara resmi yang tercantum dalam Juknis.
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Pasal 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">3</span>
            Ketentuan Publikasi bagi Penyelenggara
          </h2>
          <p>
            Pihak panitia penyelenggara lomba (OSIS, BEM, Himpunan Mahasiswa, Institusi Pendidikan, Kementerian, maupun Perusahaan) yang mengajukan kompetisi melalui formulir &quot;Pasang Lomba&quot; wajib mematuhi standar berikut:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>Menyediakan informasi yang valid, transparan, dan tidak menyesatkan.</li>
            <li>Melampirkan tautan berkas panduan teknis resmi (Juknis/Rulebook) dan kanal kontak panitia yang aktif.</li>
            <li>Kompetisi tidak mengandung unsur penipuan, skema piramida/MLM, konten perjudian, pornografi, maupun SARA.</li>
            <li>Tim kurator anviable.id berhak menolak atau menghapus publikasi lomba yang dinilai melanggar etika edukasi dan keselamatan siswa.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Pasal 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">4</span>
            Fitur Matchmaking Rekan Tim (Etika Kolaborasi)
          </h2>
          <p>
            Pada fitur pencarian rekan lomba dan talent pool:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>Pengguna dilarang menyalahgunakan kontak rekan tim untuk tujuan spamming, promosi komersial di luar lomba, maupun pelecehan.</li>
            <li>Pengguna bertanggung jawab penuh atas komitmen dan komunikasi yang disepakati bersama anggota tim yang terbentuk.</li>
            <li>anviable.id bertindak sebagai fasilitator penghubung dan tidak bertanggung jawab atas perselisihan internal antara anggota tim.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Pasal 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">5</span>
            Batasan Tanggung Jawab & Hak Cipta
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm text-slate-600 space-y-2">
            <p className="flex items-center gap-2 font-bold text-slate-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Klarifikasi Hubungan Pihak Ketiga:
            </p>
            <p>
              Poster lomba, logo institusi, dan merek dagang penyelenggara yang dimuat di anviable.id merupakan hak milik sah dari masing-masing penyelenggara kompetisi bersangkutan. anviable.id menampilkan materi tersebut untuk tujuan diseminasi informasi edukasi non-komersial bagi pelajar.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
