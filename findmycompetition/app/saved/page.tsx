"use client";

import { useBookmarks } from "@/components/BookmarkButton";
import CompetitionCard from "@/components/CompetitionCard";
import { Bookmark, Trash2, Trophy } from "lucide-react";
import Link from "next/link";
import type { Category, Level } from "@/db/schema";

export default function SavedPage() {
  const { bookmarks, clearAll } = useBookmarks();

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs">
            <Bookmark className="h-3.5 w-3.5" />
            Lomba Tersimpan
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Koleksi <span className="gradient-ptn">Bookmark</span> Anda
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Daftar kompetisi yang tersimpan di browser Anda ({bookmarks.length} lomba)
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus Semua Bookmark
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {bookmarks.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 sm:p-20 text-center shadow-xs">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
            <Bookmark className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Belum ada kompetisi yang disimpan
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Simpan lomba yang menarik minatmu dengan menekan tombol bookmark pada kartu lomba agar kamu tidak ketinggalan deadline.
          </p>
          <Link
            href="/"
            className="btn-coral mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-md cursor-pointer"
          >
            <Trophy className="h-4 w-4" />
            Jelajahi Lomba Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((item) => (
            <CompetitionCard
              key={item.id}
              competition={{
                id: item.id,
                slug: item.slug,
                title: item.title,
                organizer: item.organizer,
                category: item.category as Category,
                level: item.level as Level,
                targetAudience: item.targetAudience ?? ["SMA", "SMK"],
                posterUrl: item.posterUrl,
                registrationFee: item.registrationFee,
                deadlineDate: item.deadlineDate,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
