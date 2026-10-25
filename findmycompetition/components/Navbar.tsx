"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Trophy,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  Menu,
  X,
  Compass,
  Users,
  Home,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/components/BookmarkButton";
import NaviableLogo from "@/components/NaviableLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { bookmarks } = useBookmarks();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Do not show bottom nav on single competition detail page
  // (detail page already has dedicated floating "Daftar Sekarang" + Bookmark action bar)
  const isDetailPage =
    pathname.startsWith("/lomba/") && pathname !== "/lomba";

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY HEADER (DESKTOP + MOBILE)                                  */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <NaviableLogo size="md" className="mr-2" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
            <Link
              href="/"
              className={cn(
                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0",
                pathname === "/"
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <Home className={cn("h-4 w-4 transition-colors", pathname === "/" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span>Beranda</span>
            </Link>

            <Link
              href="/lomba"
              className={cn(
                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0",
                pathname.startsWith("/lomba")
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <Compass className={cn("h-4 w-4 transition-colors", pathname.startsWith("/lomba") ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span>Kumpulan Lomba</span>
            </Link>

            <Link
              href="/smk"
              className={cn(
                "group relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0",
                pathname === "/smk"
                  ? "bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-200"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <GraduationCap className={cn("h-4 w-4 transition-colors", pathname === "/smk" ? "text-amber-600" : "text-amber-500 group-hover:text-amber-600")} />
              <span>Zona SMK</span>
              <span className="rounded-full bg-amber-100 border border-amber-300/80 px-1.5 py-0.5 text-[9px] font-black text-amber-900 uppercase tracking-wider">
                Vokasi
              </span>
            </Link>

            <Link
              href="/cari-tim"
              className={cn(
                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0",
                pathname === "/cari-tim"
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <Users className={cn("h-4 w-4 transition-colors", pathname === "/cari-tim" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span>Cari Tim</span>
            </Link>

            <Link
              href="/saved"
              className={cn(
                "group relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0",
                pathname === "/saved"
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <Bookmark className={cn("h-4 w-4 transition-colors", pathname === "/saved" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span>Tersimpan</span>
              {mounted && bookmarks.length > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white shadow-2xs">
                  {bookmarks.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden items-center gap-3 lg:flex shrink-0">
            <Link
              href="/submit"
              className="btn-coral inline-flex h-9.5 items-center gap-1.5 rounded-xl px-4 text-xs xl:text-sm font-bold shadow-sm whitespace-nowrap active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>Pasang Lomba<span className="hidden xl:inline"> Gratis</span></span>
            </Link>
          </div>

          {/* Mobile Right Controls: Quick Bookmark & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/saved"
              aria-label="Lomba Tersimpan"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 active:scale-95 transition-transform cursor-pointer"
            >
              <Bookmark className="h-4.5 w-4.5" />
              {mounted && bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {bookmarks.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-100 active:scale-95 transition-transform touch-manipulation cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER (FULL SHEET WITH BACKDROP)                     */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col bg-white shadow-2xl animate-slide-left">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 shrink-0">
              <div onClick={() => setMobileOpen(false)}>
                <NaviableLogo size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 active:scale-95 transition-transform cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Navigasi Menu
              </p>

              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all",
                  pathname === "/"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Home className="h-4.5 w-4.5 text-indigo-600" />
                <span>Beranda Utama</span>
              </Link>

              <Link
                href="/lomba"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all",
                  pathname.startsWith("/lomba")
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Compass className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Kumpulan Lomba</span>
                </div>
                <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Resmi
                </span>
              </Link>

              <Link
                href="/smk"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all",
                  pathname === "/smk"
                    ? "bg-amber-50 text-amber-900"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4.5 w-4.5 text-amber-600" />
                  <span>Zona Khusus Siswa SMK</span>
                </div>
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Filter 2-Tier
                </span>
              </Link>

              <Link
                href="/cari-tim"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all",
                  pathname === "/cari-tim"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4.5 w-4.5 text-emerald-600" />
                  <span>Cari Tim / Partner Lomba</span>
                </div>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Baru
                </span>
              </Link>

              <Link
                href="/saved"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all",
                  pathname === "/saved"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="h-4.5 w-4.5 text-amber-500" />
                  <span>Lomba Tersimpan</span>
                </div>
                {mounted && bookmarks.length > 0 && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="border-t border-slate-100 p-4 space-y-3 shrink-0 bg-slate-50/50">
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="btn-coral flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-md active:scale-95 transition-all text-center"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Pasang Lomba Gratis</span>
              </Link>
              <p className="text-center text-[10px] text-slate-400 font-medium">
                naviable.id © 2026 : Pelajar Indonesia
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR                                           */}
      {/* ========================================================================= */}
      {!isDetailPage && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl px-2 py-1.5 lg:hidden"
          aria-label="Navigasi Bawah Layar Mobile"
        >
          <div className="grid grid-cols-5 items-center">
            {/* 1. Beranda */}
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-90",
                pathname === "/"
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Home className="h-5 w-5" />
              <span>Beranda</span>
            </Link>

            {/* 2. Katalog Lomba */}
            <Link
              href="/lomba"
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-90",
                pathname.startsWith("/lomba")
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Compass className="h-5 w-5" />
              <span>Lomba</span>
            </Link>

            {/* 3. Cari Tim */}
            <Link
              href="/cari-tim"
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-90",
                pathname === "/cari-tim"
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Users className="h-5 w-5" />
              <span>Cari Tim</span>
            </Link>

            {/* 4. Tersimpan */}
            <Link
              href="/saved"
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-90",
                pathname === "/saved"
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div className="relative">
                <Bookmark className="h-5 w-5" />
                {mounted && bookmarks.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-black text-white">
                    {bookmarks.length}
                  </span>
                )}
              </div>
              <span>Disimpan</span>
            </Link>

            {/* 5. Pasang Lomba */}
            <Link
              href="/submit"
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-90",
                pathname === "/submit"
                  ? "text-orange-600 font-extrabold"
                  : "text-orange-500 hover:text-orange-600"
              )}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Pasang</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
