"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle2,
  Send,
  X,
  Sparkles,
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
    badgeBg: "bg-[#4285F4] text-white",
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
    badgeBg: "bg-[#34A853] text-white",
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
    badgeBg: "bg-[#FBBC04] text-black",
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
      className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000]"
    >
      {/* Retro Window Titlebar */}
      <div className="retro-window-header border-b-2 border-black bg-[#E8F0FE] px-4 py-2 flex items-center justify-between">
        <div className="retro-dots">
          <span className="retro-dot bg-[#EA4335]" />
          <span className="retro-dot bg-[#FBBC04]" />
          <span className="retro-dot bg-[#34A853]" />
          <span className="ml-2 font-mono text-[11px] font-black text-black">
            naviable://team_matchmaking_lobby.sys
          </span>
        </div>
        <span className="neo-badge bg-[#34A853] text-white px-2 py-0.5 text-[9px]">
          SERVER AKTIF
        </span>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 neo-badge bg-[#34A853] text-white px-4 py-3 text-xs font-black shadow-[4px_4px_0px_#000] animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-5 space-y-4">
            <span className="neo-badge bg-[#FEF7E0] text-black px-2.5 py-1 text-xs">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>LOBBY KOMUNITAS REKAN LOMBA</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-black">
              Butuh Rekan Tim Hackathon atau Riset LKTI?
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Temukan rekan kolaborasi satu tim lintas sekolah, kota, dan keahlian. Lengkapi formasi hacker, hipster, dan hustler untuk memperbesar peluang menang!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/cari-tim"
                className="neo-btn neo-btn-blue px-5 py-3 text-xs sm:text-sm font-black"
              >
                Jelajahi Portal Cari Tim
              </Link>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="neo-btn neo-btn-white px-4 py-3 text-xs sm:text-sm font-black"
              >
                Panduan Matchmaking
              </button>
            </div>

            <p className="font-mono text-[11px] text-slate-500 pt-2 font-bold">
              [Fitur 100% gratis untuk seluruh pelajar SMA, SMK, dan MA se-Indonesia]
            </p>
          </div>

          {/* Right Column: Profile Cards with Neo-Brutalist Badges */}
          <div className="lg:col-span-7 space-y-3.5">
            {profiles.map((profile) => {
              const isConnected = connectedIds.includes(profile.id);

              return (
                <div
                  key={profile.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border-2 border-black bg-[#FAF8F5] p-4 sm:p-5 shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all"
                >
                  {/* Profile Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-black font-mono font-black text-xs shadow-[2px_2px_0px_#000] ${profile.badgeBg}`}
                    >
                      {profile.initials}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-black">{profile.name}</h4>
                        <span className="font-mono text-[11px] text-slate-600">({profile.school})</span>
                      </div>

                      <div className="inline-block neo-badge bg-white text-black px-2 py-0.5 text-[10px] font-bold">
                        {profile.skillCategory}: {profile.skill}
                      </div>

                      <p className="text-xs text-slate-700 leading-snug pt-0.5 font-medium">
                        &quot;{profile.pitch}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Connect Action Button */}
                  <button
                    type="button"
                    onClick={() => handleConnect(profile.id, profile.name)}
                    disabled={isConnected}
                    className={`shrink-0 neo-btn px-4 py-2 text-xs font-black ${
                      isConnected
                        ? "bg-[#E6F4EA] text-[#137333] shadow-[1px_1px_0px_#000] cursor-default"
                        : "neo-btn-yellow"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        <span>Terkirim</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-1" />
                        <span>Ajak Tim</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matchmaker Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-lg neo-box bg-[#FAF8F5] p-6 sm:p-8 text-black shadow-[8px_8px_0px_#000]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Tutup dialog"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded border-2 border-black bg-white hover:bg-[#EA4335] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black bg-[#FBBC04] text-black shadow-[2px_2px_0px_#000]">
                <Users className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black">Panduan Matchmaking Tim</h3>
                <p className="font-mono text-xs text-slate-600">Prosedur Pembentukan Tim Lomba</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-5 font-medium">
              Fitur pencocokan tim naviable.id menghubungkan pelajar SMA dan SMK berdasarkan keahlian teknis (pemrograman, desain antarmuka, riset laboratorium, naskah esai) dan domisili kota.
            </p>

            <div className="space-y-2.5">
              <div className="rounded-lg border-2 border-black bg-white p-3 text-xs shadow-[2px_2px_0px_#000]">
                <span className="font-black text-[#4285F4]">Langkah 1:</span> Lengkapi profil minat dan keahlian yang kamu kuasai.
              </div>
              <div className="rounded-lg border-2 border-black bg-white p-3 text-xs shadow-[2px_2px_0px_#000]">
                <span className="font-black text-[#FBBC04]">Langkah 2:</span> Tentukan ajang kompetisi target yang ingin kamu ikuti.
              </div>
              <div className="rounded-lg border-2 border-black bg-white p-3 text-xs shadow-[2px_2px_0px_#000]">
                <span className="font-black text-[#34A853]">Langkah 3:</span> Kirim undangan kolaborasi kepada rekan yang memiliki keahlian saling melengkapi.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setSuccessToast("Siap menjelajahi portal tim!");
              }}
              className="neo-btn neo-btn-blue mt-6 w-full py-3 text-xs font-black text-center"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
