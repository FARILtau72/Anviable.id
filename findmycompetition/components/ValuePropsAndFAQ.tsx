"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  CalendarCheck,
  Sparkles,
  ChevronDown,
  PlusCircle,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const VALUE_PROPS = [
  {
    icon: GraduationCap,
    title: "Portofolio Jalur Prestasi (SNBP)",
    description:
      "Sertifikat kejuaraan nasional dan provinsi terkurasi dapat dilampirkan untuk verifikasi portofolio prestasi masuk Perguruan Tinggi Negeri.",
    badge: "Jalur Prestasi",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
  },
  {
    icon: FileCheck,
    title: "Akses Juknis Tanpa Berbelit",
    description:
      "Unduh PDF buku panduan teknis resmi (Juknis) langsung tanpa harus melewati safelink beriklan atau menunggu balasan admin media sosial.",
    badge: "1-Klik Akses",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    icon: CalendarCheck,
    title: "Sinkronisasi Kalender Ponsel",
    description:
      "Integrasi satu klik ke Google Calendar dan file .ics. Dapatkan alarm otomatis sebelum batas waktu pendaftaran kompetisi ditutup.",
    badge: "Pengingat Otomatis",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-400",
  },
  {
    icon: ShieldCheck,
    title: "100% Kurasi Terverifikasi",
    description:
      "Seluruh ajang dari BPTI Kemendikbud, universitas negeri, dan industri mitra divalidasi keabsahannya untuk menjamin kompetisi aman dan kredibel.",
    badge: "Anti Penipuan",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400",
  },
];

const FAQS = [
  {
    q: "Apakah semua lomba di naviable.id dapat diikuti secara gratis?",
    a: "Tidak semua, namun kami menyediakan filter khusus '100% Gratis'. Mayoritas lomba prestisius pemerintah (seperti OSN, LKS, dan FLS2N) tidak memungut biaya pendaftaran sama sekali.",
  },
  {
    q: "Apakah sertifikat lomba di naviable.id diakui untuk SNBP atau Beasiswa?",
    a: "Ya! Kompetisi tingkat nasional dan provinsi yang diadakan oleh kementerian (BPTI/Puspresnas) maupun Perguruan Tinggi Negeri terakreditasi memiliki poin sertifikat yang sah untuk pendaftaran SNBP, SIMAK UI, SNBT, dan Beasiswa Indonesia Maju (BIM).",
  },
  {
    q: "Bagaimana cara menyimpan lomba yang menarik tanpa membuat akun?",
    a: "Cukup klik ikon 'Bookmark' pada kartu lomba manapun. Data lomba akan otomatis tersimpan di penyimpanan browser lokal Anda (LocalStorage) dan dapat diakses kapan saja di halaman 'Tersimpan'.",
  },
  {
    q: "Apakah organisasi atau sekolah kami dapat mendaftarkan lomba baru?",
    a: "Sangat bisa! Silakan buka halaman 'Ajukan Lomba', isi formulir informasi kompetisi, juknis, dan kontak panitia. Tim kurator naviable.id akan memverifikasi dalam kurun waktu 1x24 jam sebelum dipublikasikan.",
  },
];

export default function ValuePropsAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-16 pt-8">
      {/* Value Proposition Bento Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Standar Kurasi Terbaik
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mengapa Pelajar Memilih <span className="gradient-text">naviable.id</span>?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Platform yang dirancang khusus untuk mempermudah siswa dan guru pembimbing menemukan ajang prestasi terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 bg-gradient-to-br bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  item.color
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-800/80 border border-slate-700/50 px-2.5 py-0.5 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Organizer Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
              <PlusCircle className="h-3.5 w-3.5" />
              Untuk Penyelenggara & OSIS / Himpunan
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Punya Agenda Lomba Pelajar? Publikasikan Gratis di Sini!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Jangkau puluhan ribu siswa SMA dan SMK berprestasi dari seluruh penjuru Indonesia. Submisi cepat dan langsung diverifikasi.
            </p>
          </div>
          <Link
            href="/submit"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="h-4 w-4 text-indigo-600" />
            Ajukan Lomba Sekarang
          </Link>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            Pertanyaan Umum
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Informasi penting seputar pendaftaran dan legalitas kompetisi di naviable.id
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-white hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-1 sm:px-5 text-xs sm:text-sm leading-relaxed text-slate-400 border-t border-slate-800/60 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
