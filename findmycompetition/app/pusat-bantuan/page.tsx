"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  Compass,
  PlusCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS_HELP = [
  {
    category: "UNTUK SISWA & PELAJAR",
    items: [
      {
        q: "Bagaimana cara mendaftar lomba yang saya temukan di anviable.id?",
        a: "Klik tombol 'Daftar Sekarang' pada halaman rincian lomba yang Anda pilih. Anda akan langsung diarahkan ke formulir resmi panitia (Google Form, website kampus, atau portal registrasi kementerian). Pastikan membaca buku panduan teknis (Juknis) yang juga telah kami sediakan tautan unduhannya.",
      },
      {
        q: "Apakah seluruh lomba di anviable.id aman dari penipuan (scam)?",
        a: "Ya. Setiap lomba yang tampil berstatus 'Terverifikasi' telah melalui kurasi manual oleh tim kurator anviable.id untuk memastikan kredibilitas penyelenggara, kejelasan kontak panitia, dan legalitas juknis sebelum ditayangkan.",
      },
      {
        q: "Bagaimana cara menggunakan fitur simpan kalender agar tidak ketinggalan deadline?",
        a: "Di setiap kartu lomba atau halaman detail, klik tombol 'Google Calendar' untuk sinkronisasi otomatis ke kalender ponsel Anda, atau klik 'Unduh Kalender (.ics)' untuk perangkat iOS Apple Calendar / Outlook.",
      },
      {
        q: "Bagaimana cara mencari rekan satu tim untuk Hackathon atau LKTI?",
        a: "Buka menu 'Cari Tim'. Anda dapat menjelajahi tim-tim yang sedang membuka lowongan anggota dengan role tertentu (Coder, Desain, Riset), atau Anda dapat memposting profil skill Anda sendiri agar panitia tim lain dapat mengajak Anda bergabung.",
      },
    ],
  },
  {
    category: "UNTUK PANITIA & PENYELENGGARA",
    items: [
      {
        q: "Apakah memasang info lomba di anviable.id dipungut biaya?",
        a: "Pemasangan informasi kompetisi reguler di anviable.id adalah 100% GRATIS untuk seluruh OSIS, BEM, organisasi pelajar/mahasiswa, kementerian, dan instansi pendidikan di Indonesia.",
      },
      {
        q: "Berapa lama waktu verifikasi submisi lomba hingga terbit di katalog?",
        a: "Proses verifikasi oleh tim kurator kami memakan waktu maksimal 1x24 jam kerja. Pastikan formulir Anda dilengkapi tautan Juknis dan poster yang jelas agar kurasi dapat langsung disetujui.",
      },
      {
        q: "Bagaimana jika jadwal lomba kami diperpanjang (extended deadline)?",
        a: "Silakan kirimkan permohonan pembaruan informasi melalui kontak bantuan email atau WhatsApp di bawah ini dengan menyertakan tautan lomba Anda. Tim kami akan segera memperbarui tanggal tenggat waktu.",
      },
    ],
  },
];

export default function PusatBantuanPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [formSent, setFormSent] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setFormSent(true);
    setTimeout(() => {
      setMessage("");
      setSubject("");
    }, 1000);
  };

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
          <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
          <span>Layanan Bantuan & Dukungan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Pusat Bantuan anviable.id
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Temukan jawaban atas pertanyaan seputar partisipasi kompetisi, publikasi lomba,
          atau hubungi kurator kami langsung jika memerlukan bantuan teknis.
        </p>

        {/* 3 Quick Action Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/lomba"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Jelajahi Lomba</h4>
              <p className="text-[11px] text-slate-500">Filter kompetisi & juknis</p>
            </div>
          </Link>

          <Link
            href="/submit"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shrink-0">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Pasang Lomba</h4>
              <p className="text-[11px] text-slate-500">Gratis untuk panitia</p>
            </div>
          </Link>

          <Link
            href="/cari-tim"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Cari Partner Tim</h4>
              <p className="text-[11px] text-slate-500">Kolaborasi antarsekolah</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Accordion FAQ Sections */}
      <div className="space-y-6">
        {FAQS_HELP.map((section, sIdx) => (
          <div key={section.category} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 px-1">
              {section.category}
            </h2>

            <div className="space-y-3">
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isOpen = !!openItems[key];

                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <span className="pr-4">{item.q}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                          isOpen && "rotate-180 text-indigo-600"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-5 text-xs sm:text-sm leading-relaxed text-slate-600 animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact & Support Channels */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Masih Butuh Bantuan Lain?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Kirimkan pertanyaan, laporan koreksi data lomba, atau kerja sama kemitraan kepada tim kami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-3">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Email Dukungan Resmi</h3>
            <p className="text-xs text-slate-500">
              Pertanyaan umum, laporan kompetisi tidak valid, atau kendala teknis.
            </p>
            <a
              href="mailto:halo@anviable.id"
              className="inline-block text-xs font-bold text-indigo-600 hover:underline pt-1"
            >
              halo@anviable.id
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-3">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dukungan Komunitas Siswa</h3>
            <p className="text-xs text-slate-500">
              Diskusi persiapan olimpiade & informasi seputar SNBP jalur prestasi.
            </p>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-emerald-600 hover:underline pt-1"
            >
              Gabung Discord Pelajar →
            </a>
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Kirim Pesan Cepat ke Tim Kurator
          </h3>

          {formSent ? (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Terima kasih! Pesan bantuan Anda telah terkirim ke tim kurator anviable.id.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subjek pertanyaan (misal: Perpanjangan deadline lomba / Koreksi Juknis)"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan atau tautan lomba yang ingin ditanyakan..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <button
                type="submit"
                className="btn-coral inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Pesan</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
