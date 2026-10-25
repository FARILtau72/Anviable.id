"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Level } from "@/db/schema";

const STORAGE_KEY = "naviable_saved";
const LEGACY_STORAGE_KEYS = ["anviable_saved", "lombahub_saved"];
const EVENT_NAME = "naviable_bookmark_change";

export interface BookmarkData {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  category: Category;
  level: Level;
  targetAudience?: string[];
  posterUrl?: string | null;
  deadlineDate: string;
  registrationFee: number;
}

function getBookmarks(): BookmarkData[] {
  if (typeof window === "undefined") return [];
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const legacy of LEGACY_STORAGE_KEYS) {
        const found = localStorage.getItem(legacy);
        if (found) {
          raw = found;
          break;
        }
      }
    }
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function setBookmarks(data: BookmarkData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useBookmarks() {
  const [bookmarks, setBm] = useState<BookmarkData[]>([]);

  useEffect(() => {
    setBm(getBookmarks());
    const handler = () => setBm(getBookmarks());
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggle = useCallback((item: BookmarkData) => {
    const current = getBookmarks();
    const exists = current.findIndex((b) => b.id === item.id);
    if (exists >= 0) {
      current.splice(exists, 1);
    } else {
      current.push(item);
    }
    setBookmarks(current);
  }, []);

  const clearAll = useCallback(() => {
    setBookmarks([]);
  }, []);

  return { bookmarks, isBookmarked, toggle, clearAll };
}

export default function BookmarkButton({
  competition,
  className,
  size = "default",
}: {
  competition: BookmarkData;
  className?: string;
  size?: "default" | "md" | "lg";
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(competition.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(competition);
      }}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
        size === "lg"
          ? saved
            ? "border border-indigo-200 bg-indigo-50 text-indigo-700 shadow-xs"
            : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          : saved
          ? "border border-amber-400 bg-amber-400 text-slate-950 shadow-md"
          : "border border-white/20 bg-black/50 text-white backdrop-blur-md hover:bg-black/70",
        size === "lg" ? "gap-2.5 px-5 py-3 text-sm font-bold w-full" : size === "md" ? "h-11 w-11" : "h-8 w-8",
        className
      )}
      aria-label={saved ? "Hapus dari tersimpan" : "Simpan lomba"}
    >
      {saved ? (
        <BookmarkCheck className="h-4 w-4 fill-current" />
      ) : (
        <Bookmark className="h-4 w-4 transition-transform group-hover:scale-110" />
      )}
      {size === "lg" && (
        <span>{saved ? "Tersimpan di Bookmark" : "Simpan ke Bookmark"}</span>
      )}
    </button>
  );
}
