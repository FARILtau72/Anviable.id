"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle2,
  Send,
  X,
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  initials: string;
  school: string;
  skill: string;
  skillCategory: string;
  pitch: string;
  badgeBg: string;
}

const INITIAL_PROFILES: Profile[] = [
  {
    id: "p1",
    name: "Nicky Arsenta",
    initials: "NA",
    school: "SMK Negeri 2 Depok",
    skill: "Front-end React, Next.js & Tailwind",
    skillCategory: "Keahlian",
    pitch:
      "Mencari UI Designer dan 1 Hacker untuk Hackathon Nasional IoT. Siap berdiskusi juknis bersama.",
    badgeBg: "bg-blue-600 text-white",
  },
  {
    id: "p2",
    name: "Clarissa Putri",
    initials: "CP",
    school: "SMA N 1 Yogyakarta",
    skill: "Penulis LKTI & Riset Bioteknologi",
    skillCategory: "Keahlian",
    pitch:
      "Punya draft riset bioteknologi nanoplastik sudah 60%. Butuh rekan data analyst atau coder untuk visualisasi uji lab.",
    badgeBg: "bg-emerald-600 text-white",
  },
  {
    id: "p3",
    name: "Daris Pratama",
    initials: "DP",
    school: "SMA Labschool Jakarta",
    skill: "Debat Bahasa Inggris (Asian Parliamentary)",
    skillCategory: "Keahlian",
    pitch:
      "Mencari pembicara kedua dan ketiga untuk kompetisi debat parlementer tingkat nasional di UGM dan Unair.",
    badgeBg: "bg-purple-600 text-white",
  },
];

export default function TeamMatchmakingSection() {
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleConnect = (id: string, name: string) => {
    if (connectedIds.includes(id)) return;
    setConnectedIds((prev) => [...prev, id]);
    setSuccessToast(`Undangan kolaborasi telah terkirim ke ${name}!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <section
      id="cari-tim"
      className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl"
    >
      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-5 space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            <span>Komunitas Kolaborasi Tim</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            Butuh Rekan Tim untuk Hackathon atau LKTI?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Temukan rekan kolaborasi satu tim lintas sekolah, kota, dan kompetensi keahlian. Lengkapi peran hacker, hipster, dan hustler untuk memperbesar peluang juara.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/cari-tim"
              className="btn-coral inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs sm:text-sm font-bold cursor-pointer"
            >
              Jelajahi Portal Cari Tim
            </Link>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Panduan Matchmaking
            </button>
          </div>

          <p className="text-[11px] text-slate-400 pt-2">
            *Fitur terbuka untuk seluruh pelajar SMA, SMK, dan MA di Indonesia tanpa biaya.
          </p>
        </div>

        {/* Right Column: Profile Cards with Authentic Initial Badges */}
        <div className="lg:col-span-7 space-y-3.5">
          {profiles.map((profile) => {
            const isConnected = connectedIds.includes(profile.id);

            return (
              <div
                key={profile.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-800/60 p-4 sm:p-5 transition-colors hover:border-slate-700 hover:bg-slate-800/90"
              >
                {/* Profile Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${profile.badgeBg}`}
                  >
                    {profile.initials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{profile.name}</h4>
                      <span className="text-[11px] text-slate-400">({profile.school})</span>
                    </div>

                    <div className="inline-block rounded-md bg-slate-700/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      {profile.skillCategory}: {profile.skill}
                    </div>

                    <p className="text-xs text-slate-300 leading-snug pt-0.5">
                      &quot;{profile.pitch}&quot;
                    </p>
                  </div>
                </div>

                {/* Connect Action Button */}
                <button
                  type="button"
                  onClick={() => handleConnect(profile.id, profile.name)}
                  disabled={isConnected}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isConnected
                      ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700"
                      : "bg-slate-700 text-white hover:bg-indigo-700 hover:border-indigo-600"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Terkirim</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Ajak Koneksi</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matchmaker Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Tutup dialog"
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-900 text-indigo-200">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Panduan Matchmaking Tim</h3>
                <p className="text-xs text-slate-400">Temukan rekan lomba sesuai bidang keahlian</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Fitur pencocokan tim naviable.id menghubungkan pelajar SMA dan SMK berdasarkan keahlian teknis (pemrograman, desain antarmuka, riset laboratorium, naskah esai) dan domisili kota.
            </p>

            <div className="space-y-2.5">
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs">
                <span className="font-bold text-indigo-400">Langkah 1:</span> Lengkapi profil minat dan keahlian yang kamu kuasai.
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs">
                <span className="font-bold text-indigo-400">Langkah 2:</span> Tentukan ajang kompetisi target yang ingin kamu ikuti.
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs">
                <span className="font-bold text-indigo-400">Langkah 3:</span> Kirim undangan kolaborasi kepada rekan yang memiliki keahlian saling melengkapi.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setSuccessToast("Siap menjelajahi portal tim!");
              }}
              className="btn-coral mt-6 w-full py-3 rounded-xl text-xs font-bold text-center cursor-pointer"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
