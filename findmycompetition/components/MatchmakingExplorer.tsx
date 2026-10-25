"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  Search,
  MapPin,
  Laptop,
  MessageCircle,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  X,
  Send,
  Trophy,
  GraduationCap,
  Briefcase,
  Share2,
} from "lucide-react";
import type { TeamPosting, TalentProfile } from "@/db/schema";
import {
  createTeamPostingAction,
  createTalentProfileAction,
  applyToTeamAction,
} from "@/lib/actions";

interface MatchmakingExplorerProps {
  initialTeams: TeamPosting[];
  initialTalents: TalentProfile[];
}

const COMMON_ROLES = [
  "UI/UX Designer",
  "Frontend / Web",
  "Backend Coder",
  "IoT / Hardware",
  "Penulis LKTI",
  "Data Analyst",
  "Presenter / Pitcher",
  "Debater",
];

const COMMON_SKILLS = [
  "Figma",
  "Next.js",
  "Python",
  "IoT / Arduino",
  "Penelitian Ilmiah",
  "Public Speaking",
  "Video Editing",
];

export default function MatchmakingExplorer({
  initialTeams,
  initialTalents,
}: MatchmakingExplorerProps) {
  const [activeTab, setActiveTab] = useState<"teams" | "talents">("teams");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedTeam, setSelectedTeam] = useState<TeamPosting | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isCreateTalentModalOpen, setIsCreateTalentModalOpen] = useState(false);

  // Quick chips helper state for team modal
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [customRoleInput, setCustomRoleInput] = useState("");

  // Quick chips helper state for talent modal
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");

  // Status feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleRoleChip = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const addCustomRole = () => {
    if (customRoleInput.trim() && !selectedRoles.includes(customRoleInput.trim())) {
      setSelectedRoles((prev) => [...prev, customRoleInput.trim()]);
      setCustomRoleInput("");
    }
  };

  const toggleSkillChip = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills((prev) => [...prev, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  // Filtered lists
  const filteredTeams = initialTeams.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const roles = Array.isArray(t.rolesNeeded)
      ? t.rolesNeeded.join(" ").toLowerCase()
      : typeof t.rolesNeeded === "string"
      ? (t.rolesNeeded as string).toLowerCase()
      : "";
    return (
      t.teamName.toLowerCase().includes(q) ||
      t.competitionTitle.toLowerCase().includes(q) ||
      t.schoolName.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      roles.includes(q)
    );
  });

  const filteredTalents = initialTalents.filter((tal) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const skills = Array.isArray(tal.skills)
      ? tal.skills.join(" ").toLowerCase()
      : typeof tal.skills === "string"
      ? (tal.skills as string).toLowerCase()
      : "";
    return (
      tal.fullName.toLowerCase().includes(q) ||
      tal.schoolName.toLowerCase().includes(q) ||
      tal.major.toLowerCase().includes(q) ||
      skills.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl animate-fade-in border border-slate-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Bar: Dual Tab + Actions */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
        {/* Dual Tabs */}
        <div className="grid grid-cols-2 w-full sm:w-auto sm:inline-flex rounded-2xl border border-slate-200 bg-slate-100/80 p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("teams")}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "teams"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="h-4 w-4 text-indigo-600 shrink-0" />
            <span className="truncate">Lowongan Tim ({filteredTeams.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("talents")}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "talents"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">Talent Pool ({filteredTalents.length})</span>
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="grid grid-cols-2 w-full sm:flex sm:w-auto items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRoles(["UI/UX Designer"]);
              setIsCreateTeamModalOpen(true);
            }}
            className="btn-coral inline-flex items-center justify-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs cursor-pointer text-center"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className="truncate">Buka Tim Baru</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedSkills(["Figma"]);
              setIsCreateTalentModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer text-center"
          >
            <GraduationCap className="h-4 w-4 text-indigo-600 shrink-0" />
            <span className="truncate">Pajang Profil</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeTab === "teams"
              ? "Cari nama tim, target lomba (Hackathon, LKTI), atau keahlian yang dicari..."
              : "Cari nama siswa, keahlian (Figma, Python), jurusan, atau sekolah..."
          }
          className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Hapus
          </button>
        )}
      </div>

      {/* ---------------- TAB 1: LOWONGAN TIM ---------------- */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Belum ada tim yang cocok</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Coba sesuaikan kata kunci pencarian atau jadilah yang pertama membuka rekrutmen tim untuk kompetisi impianmu!
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRoles(["UI/UX Designer"]);
                  setIsCreateTeamModalOpen(true);
                }}
                className="mt-4 btn-coral inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Buka Rekrutmen Tim</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.map((team) => {
                const roles = Array.isArray(team.rolesNeeded)
                  ? team.rolesNeeded
                  : typeof team.rolesNeeded === "string"
                  ? JSON.parse(team.rolesNeeded as string)
                  : [];

                return (
                  <div
                    key={team.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                          <Laptop className="h-3 w-3" />
                          <span>{team.workFormat}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {team.membersCount}/{team.maxMembers} Anggota
                        </span>
                      </div>

                      {/* Team Name & Competition */}
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {team.teamName}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-indigo-600 flex items-center gap-1 line-clamp-1">
                          <Trophy className="h-3 w-3 shrink-0" />
                          <span>{team.competitionTitle}</span>
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {team.description}
                      </p>

                      {/* Roles Needed Badges */}
                      <div className="space-y-1 pt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Dicari:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {roles.map((r: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-md bg-amber-50 border border-amber-200/70 px-2 py-0.5 text-[10px] font-bold text-amber-800"
                            >
                              + {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Apply Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 leading-tight">
                        <p className="font-bold text-slate-800 truncate max-w-[130px]">
                          {team.leaderName}
                        </p>
                        <p className="truncate max-w-[130px] text-slate-400">
                          {team.schoolName}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsApplyModalOpen(true);
                        }}
                        className="btn-coral inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                        <span>Ajak Koneksi</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 2: TALENT POOL SISWA ---------------- */}
      {activeTab === "talents" && (
        <div className="space-y-4">
          {filteredTalents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Belum ada talenta yang cocok</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Jadilah siswa pertama yang memajang profil agar tim-tim berprestasi bisa langsung mengajakmu kolaborasi!
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSkills(["Figma"]);
                  setIsCreateTalentModalOpen(true);
                }}
                className="mt-4 btn-coral inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Pajang Profil Saya</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTalents.map((tal) => {
                const skills = Array.isArray(tal.skills)
                  ? tal.skills
                  : typeof tal.skills === "string"
                  ? JSON.parse(tal.skills as string)
                  : [];

                return (
                  <div
                    key={tal.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Status & Grade */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Siap Diajak Lomba</span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {tal.gradeLevel}
                        </span>
                      </div>

                      {/* Name & School */}
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900">
                          {tal.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{tal.schoolName} • {tal.major}</span>
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {tal.bio}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700"
                          >
                            #{s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {tal.portfolioUrl ? (
                        <a
                          href={tal.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Portofolio</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Portofolio via chat</span>
                      )}

                      <a
                        href={
                          tal.contactChannel === "WHATSAPP"
                            ? `https://wa.me/${tal.contactInfo.replace(/[^0-9]/g, "")}`
                            : "#"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 shadow-2xs transition-all"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Chat ({tal.contactChannel})</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: AJAK KONEKSI / LAMAR POSISI TIM (Streamlined & Compact)          */}
      {/* ========================================================================= */}
      {isApplyModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="relative flex flex-col w-full max-w-md max-h-[88vh] rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            {/* Sticky Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 shrink-0 bg-white">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kirim Lamaran Kolaborasi</h3>
                <p className="text-xs text-slate-500">
                  Gabung ke tim <strong className="text-indigo-600">{selectedTeam.teamName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSelectedTeam(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                const fd = new FormData(e.currentTarget);
                const applicantName = fd.get("applicantName") as string;
                const schoolName = fd.get("schoolName") as string;
                const roleApplied = fd.get("roleApplied") as string;
                const contactInfo = fd.get("contactInfo") as string;

                const res = await applyToTeamAction({
                  teamPostingId: selectedTeam.id,
                  applicantName,
                  schoolName,
                  roleApplied,
                  message: fd.get("message") as string,
                  contactInfo,
                  portfolioUrl: fd.get("portfolioUrl") as string,
                });
                setIsSubmitting(false);

                if (res.success) {
                  showToast(res.message);
                  setIsApplyModalOpen(false);

                  // If leader contact is WhatsApp, offer direct redirect with prefilled message
                  if (selectedTeam.contactChannel === "WHATSAPP" && selectedTeam.contactInfo) {
                    const cleanPhone = selectedTeam.contactInfo.replace(/[^0-9]/g, "");
                    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
                    const templateText = encodeURIComponent(
                      `Halo kak ${selectedTeam.leaderName}, saya ${applicantName} dari ${schoolName}. Saya telah mengirim lamaran kolaborasi via anviable.id untuk posisi ${roleApplied} di tim "${selectedTeam.teamName}". Senang bisa terhubung!`
                    );
                    const waUrl = `https://wa.me/${formattedPhone}?text=${templateText}`;
                    window.open(waUrl, "_blank");
                  }

                  setSelectedTeam(null);
                } else {
                  alert(res.message);
                }
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nama Siswa</label>
                    <input
                      name="applicantName"
                      required
                      placeholder="Kevin Sanjaya"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Asal Sekolah</label>
                    <input
                      name="schoolName"
                      required
                      placeholder="SMAN 1 Bandung"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Role yang Diminati</label>
                    <input
                      name="roleApplied"
                      required
                      placeholder="UI/UX Designer"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Kontak (WA/Discord)</label>
                    <input
                      name="contactInfo"
                      required
                      placeholder="0812-xxxx-xxxx"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Pesan Singkat & Skill</label>
                  <textarea
                    name="message"
                    required
                    rows={2}
                    placeholder="Ceritakan skill dan kesiapanmu untuk sprint lomba ini..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Link Portofolio (Opsional)</label>
                  <input
                    name="portfolioUrl"
                    placeholder="https://github.com/... atau Drive"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-coral rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  {isSubmitting ? "Mengirim..." : "Kirimkan Lamaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUKA REKRUTMEN TIM BARU (Compact, Clean, Fits All Screens)       */}
      {/* ========================================================================= */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            {/* Sticky Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 shrink-0 bg-white">
              <div>
                <h3 className="text-base font-black text-slate-900">Buka Lowongan Tim Baru</h3>
                <p className="text-xs text-slate-500">Cari rekan satu tim untuk lomba impianmu</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateTeamModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedRoles.length === 0) {
                  alert("Pilih minimal 1 posisi yang dicari.");
                  return;
                }
                setIsSubmitting(true);
                const fd = new FormData(e.currentTarget);
                const res = await createTeamPostingAction({
                  teamName: fd.get("teamName") as string,
                  leaderName: fd.get("leaderName") as string,
                  schoolName: fd.get("schoolName") as string,
                  city: (fd.get("city") as string) || "Indonesia",
                  competitionTitle: fd.get("competitionTitle") as string,
                  rolesNeeded: selectedRoles,
                  description: fd.get("description") as string,
                  workFormat: fd.get("workFormat") as string,
                  contactChannel: fd.get("contactChannel") as string,
                  contactInfo: fd.get("contactInfo") as string,
                  maxMembers: parseInt(fd.get("maxMembers") as string) || 3,
                });

                setIsSubmitting(false);
                if (res.success) {
                  showToast(res.message);
                  setIsCreateTeamModalOpen(false);
                } else {
                  alert(res.message);
                }
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="overflow-y-auto px-5 py-4 space-y-3.5 flex-1 text-xs sm:text-sm">
                {/* Row 1: Nama Tim & Target Lomba */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nama Tim</label>
                    <input
                      name="teamName"
                      required
                      placeholder="Misal: Nusantara AI Hackers"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Target Lomba</label>
                    <input
                      name="competitionTitle"
                      required
                      placeholder="Misal: Hackathon IoT PENS / LKTI"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Ketua Tim & Asal Sekolah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nama Ketua</label>
                    <input
                      name="leaderName"
                      required
                      placeholder="Nama lengkap kamu"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Asal Sekolah & Kota</label>
                    <input
                      name="schoolName"
                      required
                      placeholder="SMKN 1 Cimahi, Bandung"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 3: Posisi yang Dicari (Interactive Chips + Input) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Posisi yang Dicari:
                    </label>
                    <span className="text-[11px] text-slate-400">Klik chip untuk memilih</span>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_ROLES.map((role) => {
                      const isSelected = selectedRoles.includes(role);
                      return (
                        <button
                          type="button"
                          key={role}
                          onClick={() => toggleRoleChip(role)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {role}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Role Input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomRole();
                        }
                      }}
                      placeholder="Tambah posisi lain..."
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomRole}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>

                  {/* Selected Roles Preview */}
                  {selectedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedRoles.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[11px] font-bold text-amber-800"
                        >
                          {r}
                          <button
                            type="button"
                            onClick={() => toggleRoleChip(r)}
                            className="text-amber-500 hover:text-amber-800 ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 4: Deskripsi Singkat */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Ide / Kriteria Rekan</label>
                  <textarea
                    name="description"
                    required
                    rows={2}
                    placeholder="Ceritakan progres ide lombamu dan kriteria rekan yang dicari..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Row 5: Format & Kontak */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Format</label>
                    <select
                      name="workFormat"
                      defaultValue="ONLINE"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="ONLINE">100% Online</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ONSITE">Tatap Muka</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Kanal</label>
                    <select
                      name="contactChannel"
                      defaultValue="WHATSAPP"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="TELEGRAM">Telegram</option>
                      <option value="DISCORD">Discord</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nomor / Kontak</label>
                    <input
                      name="contactInfo"
                      required
                      placeholder="0812-xxxx-xxxx"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-coral rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Publikasikan Tim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PAJANG PROFIL TALENT SISWA (Streamlined & Compact)               */}
      {/* ========================================================================= */}
      {isCreateTalentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            {/* Sticky Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 shrink-0 bg-white">
              <div>
                <h3 className="text-base font-black text-slate-900">Daftar ke Talent Pool</h3>
                <p className="text-xs text-slate-500">Pajang keahlianmu agar dihubungi ketua tim</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateTalentModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedSkills.length === 0) {
                  alert("Pilih minimal 1 keahlian.");
                  return;
                }
                setIsSubmitting(true);
                const fd = new FormData(e.currentTarget);
                const res = await createTalentProfileAction({
                  fullName: fd.get("fullName") as string,
                  schoolName: fd.get("schoolName") as string,
                  gradeLevel: (fd.get("gradeLevel") as string) || "Siswa SMA/SMK",
                  major: (fd.get("major") as string) || "Umum",
                  skills: selectedSkills,
                  bio: fd.get("bio") as string,
                  achievements: fd.get("achievements") as string,
                  portfolioUrl: fd.get("portfolioUrl") as string,
                  contactChannel: fd.get("contactChannel") as string,
                  contactInfo: fd.get("contactInfo") as string,
                });

                setIsSubmitting(false);
                if (res.success) {
                  showToast(res.message);
                  setIsCreateTalentModalOpen(false);
                } else {
                  alert(res.message);
                }
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="overflow-y-auto px-5 py-4 space-y-3.5 flex-1 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                    <input
                      name="fullName"
                      required
                      placeholder="Alya Salsabila"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Asal Sekolah</label>
                    <input
                      name="schoolName"
                      required
                      placeholder="SMAN 8 Jakarta"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Kelas & Jurusan</label>
                    <input
                      name="major"
                      required
                      placeholder="Kelas 11 - RPL / MIPA"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Kontak WA / ID Discord</label>
                    <input
                      name="contactInfo"
                      required
                      placeholder="0812-xxxx-xxxx"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Keahlian Utama:</label>
                    <span className="text-[11px] text-slate-400">Klik untuk memilih</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleSkillChip(skill)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSkill();
                        }
                      }}
                      placeholder="Tambah skill lain..."
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>

                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-800"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => toggleSkillChip(s)}
                            className="text-emerald-500 hover:text-emerald-800 ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Bio Singkat</label>
                  <textarea
                    name="bio"
                    required
                    rows={2}
                    placeholder="Ceritakan peran yang ingin kamu ambil dan minat lombamu..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Link Portofolio (Opsional)</label>
                  <input
                    name="portfolioUrl"
                    placeholder="https://github.com/... atau Drive"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateTalentModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-coral rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Daftar Talent Pool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
