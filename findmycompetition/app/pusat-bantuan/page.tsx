"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  ArrowLeft,
  ChevronDown,
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
        q: "Bagaimana cara mendaftar lomba yang saya temukan di naviable.id?",
        a: "Klik tombol 'Daftar Sekarang' pada halaman rincian lomba yang Anda pilih. Anda akan langsung diarahkan ke formulir resmi panitia (Google Form, website kampus, atau portal registrasi kementerian). Pastikan membaca buku panduan teknis (Juknis) yang juga telah kami sediakan tautan unduhannya.",
      },
      {
        q: "Apakah seluruh lomba di naviable.id aman dari penipuan (scam)?",
        a: "Ya. Setiap lomba yang tampil berstatus 'Terverifikasi' telah melalui kurasi manual oleh tim kurator naviable.id untuk memastikan kredibilitas penyelenggara, kejelasan kontak panitia, dan legalitas juknis sebelum ditayangkan.",
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
        q: "Apakah memasang info lomba di naviable.id dipungut biaya?",
        a: "Pemasangan informasi kompetisi reguler di naviable.id adalah 100% GRATIS untuk seluruh OSIS, BEM, organisasi pelajar/mahasiswa, kementerian, dan instansi pendidikan di Indonesia.",
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
          className="neo-btn neo-btn-white px-3 py-1.5 text-xs font-black inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header Banner */}
      <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
        {/* Retro Window Header */}
        <div className="retro-window-header border-b-2 border-black bg-[#E8F0FE] px-4 py-2 flex items-center justify-between">
          <div className="retro-dots">
            <span className="retro-dot bg-[#EA4335]" />
            <span className="retro-dot bg-[#FBBC04]" />
            <span className="retro-dot bg-[#34A853]" />
            <span className="ml-2 font-mono text-[11px] font-black text-black">
              naviable://help_center.sys
            </span>
          </div>
          <span className="neo-badge bg-[#34A853] text-white px-2 py-0.5 text-[9px]">
            ONLINE SUPPORT
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <div className="neo-badge bg-[#FEF7E0] text-black px-2.5 py-1 text-xs mb-3">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            <span>PUSAT BANTUAN & PANDUAN</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Pusat Bantuan naviable.id
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Temukan jawaban atas pertanyaan seputar partisipasi kompetisi, publikasi lomba,
            atau hubungi kurator kami langsung jika memerlukan bantuan teknis.
          </p>

          {/* 3 Quick Action Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/lomba"
              className="neo-btn neo-btn-white p-4 flex items-center gap-3 text-left w-full justify-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#4285F4] text-white shrink-0 shadow-[2px_2px_0px_#000]">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-black">Jelajahi Lomba</h4>
                <p className="font-mono text-[10px] text-slate-600">Filter & juknis</p>
              </div>
            </Link>

            <Link
              href="/submit"
              className="neo-btn neo-btn-white p-4 flex items-center gap-3 text-left w-full justify-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#FBBC04] text-black shrink-0 shadow-[2px_2px_0px_#000]">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-black">Pasang Lomba</h4>
                <p className="font-mono text-[10px] text-slate-600">Gratis panitia</p>
              </div>
            </Link>

            <Link
              href="/cari-tim"
              className="neo-btn neo-btn-white p-4 flex items-center gap-3 text-left w-full justify-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#34A853] text-white shrink-0 shadow-[2px_2px_0px_#000]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-black">Cari Partner Tim</h4>
                <p className="font-mono text-[10px] text-slate-600">Matchmaking</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Sections */}
      <div className="space-y-6">
        {FAQS_HELP.map((section, sIdx) => (
          <div key={section.category} className="space-y-3">
            <h2 className="font-mono text-xs font-black uppercase tracking-wider text-black px-1">
              [{section.category}]
            </h2>

            <div className="space-y-3">
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isOpen = !!openItems[key];

                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_#000]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-black text-black hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <span className="pr-4">{item.q}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 stroke-[2.5] text-black transition-transform duration-200",
                          isOpen && "rotate-180 text-[#4285F4]"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t-2 border-black bg-[#FAF8F5] px-4 py-4 sm:px-5 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium animate-fade-in">
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
      <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-black">
            Masih Butuh Bantuan Lain?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
            Kirimkan pertanyaan, laporan koreksi data lomba, atau kerja sama kemitraan kepada tim kami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border-2 border-black bg-[#FAF8F5] p-5 space-y-2 shadow-[2px_2px_0px_#000]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#E8F0FE] text-[#1967D2] mb-3 shadow-[1px_1px_0px_#000]">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-black">Email Dukungan Resmi</h3>
            <p className="text-xs text-slate-600 font-medium">
              Pertanyaan umum, laporan kompetisi tidak valid, atau kendala teknis.
            </p>
            <a
              href="mailto:halo@naviable.id"
              className="inline-block font-mono text-xs font-black text-[#4285F4] hover:underline pt-1"
            >
              halo@naviable.id
            </a>
          </div>

          <div className="rounded-xl border-2 border-black bg-[#FAF8F5] p-5 space-y-2 shadow-[2px_2px_0px_#000]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#E6F4EA] text-[#137333] mb-3 shadow-[1px_1px_0px_#000]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-black">Dukungan Komunitas Siswa</h3>
            <p className="text-xs text-slate-600 font-medium">
              Diskusi persiapan olimpiade & informasi seputar SNBP jalur prestasi.
            </p>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs font-black text-[#137333] hover:underline pt-1"
            >
              Gabung Discord Pelajar →
            </a>
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="border-t-2 border-black/10 pt-6 space-y-4">
          <h3 className="text-sm font-black text-black">
            Kirim Pesan Cepat ke Tim Kurator
          </h3>

          {formSent ? (
            <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#E6F4EA] p-4 text-xs font-black text-[#137333] shadow-[3px_3px_0px_#000] animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Terima kasih! Pesan bantuan Anda telah terkirim ke tim kurator naviable.id.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subjek pertanyaan (misal: Perpanjangan deadline lomba / Koreksi Juknis)"
                  className="h-11 w-full rounded-lg border-2 border-black bg-[#FAF8F5] px-3.5 text-xs font-semibold text-black placeholder:text-slate-500 focus:bg-white focus:outline-none focus:shadow-[2px_2px_0px_#000]"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan atau tautan lomba yang ingin ditanyakan..."
                  required
                  className="w-full rounded-lg border-2 border-black bg-[#FAF8F5] p-3 text-xs font-semibold text-black placeholder:text-slate-500 focus:bg-white focus:outline-none focus:shadow-[2px_2px_0px_#000]"
                />
              </div>
              <button
                type="submit"
                className="neo-btn neo-btn-blue px-6 py-2.5 text-xs font-black inline-flex items-center gap-2"
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
