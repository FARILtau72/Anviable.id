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
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Trash2,
  Settings,
  AlertCircle,
  Copy,
} from "lucide-react";
import type { TeamPosting, TalentProfile } from "@/db/schema";
import {
  createTeamPostingAction,
  createTalentProfileAction,
  applyToTeamAction,
  updateTeamStatusWithPinAction,
  deleteTeamPostingWithPinAction,
  deleteTalentProfileWithPinAction,
} from "@/lib/actions";

interface MatchmakingExplorerProps {
  initialTeams: TeamPosting[];
  initialTalents: TalentProfile[];
}

function maskContact(contact: string): string {
  if (!contact) return "Tersedia via verifikasi";
  const digits = contact.replace(/[^0-9]/g, "");
  if (digits.length >= 8) {
    const prefix = digits.slice(0, 4);
    const suffix = digits.slice(-3);
    return `${prefix}-****-${suffix}`;
  }
  if (contact.includes("@")) {
    const [user, domain] = contact.split("@");
    return `${user.slice(0, 2)}***@${domain}`;
  }
  if (contact.length > 4) {
    return `${contact.slice(0, 3)}***`;
  }
  return "***";
}

function getRoleBadgeTheme(role: string): { bg: string; text: string; border: string; category: string } {
  const r = role.toLowerCase();
  if (
    r.includes("code") ||
    r.includes("developer") ||
    r.includes("frontend") ||
    r.includes("backend") ||
    r.includes("web") ||
    r.includes("iot") ||
    r.includes("hardware") ||
    r.includes("python") ||
    r.includes("tech")
  ) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200/80",
      category: "Hacker / Teknis",
    };
  }
  if (
    r.includes("design") ||
    r.includes("ui") ||
    r.includes("ux") ||
    r.includes("figma") ||
    r.includes("animasi") ||
    r.includes("video") ||
    r.includes("seni")
  ) {
    return {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200/80",
      category: "Hipster / Desain",
    };
  }
  return {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/80",
    category: "Hustler / Presentasi",
  };
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

  // Contact modal state (safety & privacy)
  const [selectedTalentForContact, setSelectedTalentForContact] = useState<TalentProfile | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // PIN Self-Service Management state
  const [manageTeamTarget, setManageTeamTarget] = useState<TeamPosting | null>(null);
  const [manageTalentTarget, setManageTalentTarget] = useState<TalentProfile | null>(null);
  const [managePinInput, setManagePinInput] = useState("");
  const [managePinError, setManagePinError] = useState<string | null>(null);

  // Generated default PINs for new forms
  const [teamFormPin, setTeamFormPin] = useState("2846");
  const [talentFormPin, setTalentFormPin] = useState("1973");

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

                const isClosed = team.status === "CLOSED";

                return (
                  <div
                    key={team.id}
                    className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-2xs hover:shadow-md transition-all group ${
                      isClosed
                        ? "border-slate-200/60 opacity-80 bg-slate-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Status */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                            <Laptop className="h-3 w-3" />
                            <span>{team.workFormat}</span>
                          </span>

                          {isClosed ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              <Lock className="h-2.5 w-2.5" />
                              <span>Tim Penuh (Closed)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Buka Rekrutmen</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            👥 {team.membersCount}/{team.maxMembers}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setManageTeamTarget(team);
                              setManagePinInput("");
                              setManagePinError(null);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Kelola status tim / tutup lowongan (PIN)"
                            aria-label="Kelola tim"
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </button>
                        </div>
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

                      {/* Roles Needed Badges with Classification Colors */}
                      <div className="space-y-1 pt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Dicari:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {roles.map((r: string, idx: number) => {
                            const theme = getRoleBadgeTheme(r);
                            return (
                              <span
                                key={idx}
                                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${theme.bg} ${theme.border} ${theme.text}`}
                                title={theme.category}
                              >
                                + {r}
                              </span>
                            );
                          })}
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

                      {isClosed ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 cursor-not-allowed">
                          <Lock className="h-3 w-3" />
                          <span>Sudah Penuh</span>
                        </span>
                      ) : (
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
                      )}
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
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Status & Grade */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Siap Diajak Lomba</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-medium text-slate-400">
                            {tal.gradeLevel}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setManageTalentTarget(tal);
                              setManagePinInput("");
                              setManagePinError(null);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Kelola / Hapus profil saya (PIN)"
                            aria-label="Kelola profil"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Name & School */}
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
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

                      {/* Skills Tags with Categorization Colors */}
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s: string, idx: number) => {
                          const theme = getRoleBadgeTheme(s);
                          return (
                            <span
                              key={idx}
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${theme.bg} ${theme.border} ${theme.text}`}
                            >
                              #{s}
                            </span>
                          );
                        })}
                      </div>

                      {/* Masked Contact Security Indicator */}
                      <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                        <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>Kontak Terproteksi: {maskContact(tal.contactInfo)}</span>
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

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTalentForContact(tal);
                          setIsContactModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Hubungi Siswa</span>
                      </button>
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
                      `Halo kak ${selectedTeam.leaderName}, saya ${applicantName} dari ${schoolName}. Saya telah mengirim lamaran kolaborasi via naviable.id untuk posisi ${roleApplied} di tim "${selectedTeam.teamName}". Senang bisa terhubung!`
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
                const pin = (fd.get("managePin") as string)?.trim() || teamFormPin;

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
                  managePin: pin,
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

                {/* Row 6: PIN Pengelola Mandiri */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                      <span>PIN Pengelola Lowongan (4 Digit)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Kunci untuk tutup / hapus tim</span>
                  </div>
                  <input
                    name="managePin"
                    required
                    maxLength={10}
                    value={teamFormPin}
                    onChange={(e) => setTeamFormPin(e.target.value)}
                    placeholder="Contoh: 1234"
                    className="mt-2 w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-base sm:text-sm font-mono font-bold tracking-widest text-indigo-700 focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Catat PIN ini. Hanya kamu yang memegang PIN ini yang dapat menandai tim sebagai "PENUH" atau menghapus postingan.
                  </p>
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
                const pin = (fd.get("managePin") as string)?.trim() || talentFormPin;

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
                  managePin: pin,
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

                {/* PIN Pengelola Mandiri */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-emerald-600" />
                      <span>PIN Pengelola Profil (4 Digit)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Kunci untuk hapus profil</span>
                  </div>
                  <input
                    name="managePin"
                    required
                    maxLength={10}
                    value={talentFormPin}
                    onChange={(e) => setTalentFormPin(e.target.value)}
                    placeholder="Contoh: 1234"
                    className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-base sm:text-sm font-mono font-bold tracking-widest text-emerald-700 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Catat PIN ini. Kamu dapat menghapus profilmu sewaktu-waktu setelah berhasil menemukan tim lomba.
                  </p>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateTalentModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-coral rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Daftar Talent Pool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HUBUNGI SISWA (Safe Reveal & Ethics Pledge)                       */}
      {/* ========================================================================= */}
      {isContactModalOpen && selectedTalentForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="relative flex flex-col w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Hubungi Siswa Resmi</h3>
                  <p className="text-[11px] text-slate-500">Privasi dan etika komunikasi antar pelajar</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsContactModalOpen(false);
                  setSelectedTalentForContact(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedTalentForContact.fullName}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    {selectedTalentForContact.contactChannel}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedTalentForContact.schoolName} ({selectedTalentForContact.major})
                </p>
              </div>

              {/* Ethics pledge notice */}
              <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-900 leading-relaxed">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Komitmen Etika Pelajar:</strong>
                  Gunakan nomor kontak ini secara sopan khusus untuk mendiskusikan ajakan bergabung ke tim lomba. Dilarang keras mengirimkan spam, pelecehan, atau penawaran di luar kompetisi.
                </div>
              </div>

              {/* Direct Unmasked Contact Display */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kontak Langsung:</label>
                <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-800">
                  <span>{selectedTalentForContact.contactInfo}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTalentForContact.contactInfo);
                      showToast("Kontak berhasil disalin ke clipboard!");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  setIsContactModalOpen(false);
                  setSelectedTalentForContact(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white cursor-pointer"
              >
                Tutup
              </button>

              {selectedTalentForContact.contactChannel === "WHATSAPP" ? (
                <button
                  type="button"
                  onClick={() => {
                    const cleanPhone = selectedTalentForContact.contactInfo.replace(/[^0-9]/g, "");
                    const formatted = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
                    const template = encodeURIComponent(
                      `Halo ${selectedTalentForContact.fullName}, saya melihat profil keahlianmu di naviable.id. Kami sedang mencari rekan tim untuk lomba/hackathon. Apakah kamu tertarik untuk ngobrol lebih lanjut?`
                    );
                    window.open(`https://wa.me/${formatted}?text=${template}`, "_blank");
                    setIsContactModalOpen(false);
                    setSelectedTalentForContact(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Buka Chat WhatsApp</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTalentForContact.contactInfo);
                    showToast("ID / Kontak berhasil disalin!");
                    setIsContactModalOpen(false);
                    setSelectedTalentForContact(null);
                  }}
                  className="btn-coral rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <span>Salin Kontak</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: KELOLA TIM DENGAN PIN (Self-Service Status & Delete)               */}
      {/* ========================================================================= */}
      {manageTeamTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="relative flex flex-col w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Kelola Status Tim</h3>
                  <p className="text-[11px] text-slate-500">
                    Tim: <strong className="text-indigo-600">{manageTeamTarget.teamName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setManageTeamTarget(null);
                  setManagePinInput("");
                  setManagePinError(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Masukkan PIN Pengelola (4 Digit):</span>
                </label>
                <input
                  type="password"
                  maxLength={10}
                  value={managePinInput}
                  onChange={(e) => {
                    setManagePinInput(e.target.value);
                    setManagePinError(null);
                  }}
                  placeholder="PIN saat membuat tim"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm font-mono font-bold tracking-widest text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                {managePinError && (
                  <p className="text-[11px] font-semibold text-rose-600">{managePinError}</p>
                )}
              </div>

              {/* Status Info */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 space-y-1">
                <p className="text-xs text-slate-600">
                  Status saat ini:{" "}
                  <strong className={manageTeamTarget.status === "CLOSED" ? "text-slate-700" : "text-emerald-600"}>
                    {manageTeamTarget.status === "CLOSED" ? "PENUH (CLOSED)" : "BUKA REKRUTMEN (OPEN)"}
                  </strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  Jika tim sudah lengkap, kamu bisa menandai status sebagai "PENUH" agar tidak menerima lamaran lagi.
                </p>
              </div>

              {/* Actions Grid */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting || !managePinInput}
                  onClick={async () => {
                    setIsSubmitting(true);
                    setManagePinError(null);
                    const newStatus = manageTeamTarget.status === "OPEN" ? "CLOSED" : "OPEN";
                    const res = await updateTeamStatusWithPinAction(
                      manageTeamTarget.id,
                      managePinInput,
                      newStatus
                    );
                    setIsSubmitting(false);
                    if (res.success) {
                      showToast(res.message);
                      setManageTeamTarget(null);
                      setManagePinInput("");
                    } else {
                      setManagePinError(res.message);
                    }
                  }}
                  className="w-full rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 py-2.5 text-xs font-bold text-indigo-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {manageTeamTarget.status === "OPEN"
                    ? "Tandai Tim Sebagai PENUH (Tutup Rekrutmen)"
                    : "Buka Kembali Lowongan Rekrutmen (OPEN)"}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !managePinInput}
                  onClick={async () => {
                    if (confirm("Apakah kamu yakin ingin menghapus postingan tim ini secara permanen?")) {
                      setIsSubmitting(true);
                      setManagePinError(null);
                      const res = await deleteTeamPostingWithPinAction(
                        manageTeamTarget.id,
                        managePinInput
                      );
                      setIsSubmitting(false);
                      if (res.success) {
                        showToast(res.message);
                        setManageTeamTarget(null);
                        setManagePinInput("");
                      } else {
                        setManagePinError(res.message);
                      }
                    }
                  }}
                  className="w-full rounded-xl border border-rose-200 bg-white hover:bg-rose-50 py-2.5 text-xs font-bold text-rose-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  Hapus Postingan Tim Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: KELOLA / HAPUS TALENT PROFILE DENGAN PIN                         */}
      {/* ========================================================================= */}
      {manageTalentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="relative flex flex-col w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Kelola Profil Talent</h3>
                  <p className="text-[11px] text-slate-500">
                    Profil: <strong className="text-slate-800">{manageTalentTarget.fullName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setManageTalentTarget(null);
                  setManagePinInput("");
                  setManagePinError(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-rose-600" />
                  <span>Masukkan PIN Pengelola (4 Digit):</span>
                </label>
                <input
                  type="password"
                  maxLength={10}
                  value={managePinInput}
                  onChange={(e) => {
                    setManagePinInput(e.target.value);
                    setManagePinError(null);
                  }}
                  placeholder="PIN saat mendaftarkan profil"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm font-mono font-bold tracking-widest text-slate-900 focus:border-rose-500 focus:outline-none"
                />
                {managePinError && (
                  <p className="text-[11px] font-semibold text-rose-600">{managePinError}</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 space-y-1 text-slate-600 text-xs">
                <p>
                  Sudah bergabung dengan tim lomba atau ingin menarik profilmu dari pencarian publik?
                </p>
                <p className="text-[11px] text-slate-400">
                  Data profil dan kontakmu akan segera dihapus permanen dari sistem naviable.id.
                </p>
              </div>

              <button
                type="button"
                disabled={isSubmitting || !managePinInput}
                onClick={async () => {
                  if (confirm("Apakah kamu yakin ingin menghapus profil talent ini?")) {
                    setIsSubmitting(true);
                    setManagePinError(null);
                    const res = await deleteTalentProfileWithPinAction(
                      manageTalentTarget.id,
                      managePinInput
                    );
                    setIsSubmitting(false);
                    if (res.success) {
                      showToast(res.message);
                      setManageTalentTarget(null);
                      setManagePinInput("");
                    } else {
                      setManagePinError(res.message);
                    }
                  }
                }}
                className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                Hapus Profil dari Talent Pool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
