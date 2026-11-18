"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Bookmark,
  PlusCircle,
  Menu,
  X,
  Compass,
  Users,
  Home,
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
  const isDetailPage = pathname.startsWith("/lomba/") && pathname !== "/lomba";

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY HEADER (GDGoC RETRO NEO-BRUTALIST STYLE)                    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#faf8f5] border-b-2 border-black">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <NaviableLogo size="md" className="mr-2" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 lg:flex">
            <Link
              href="/"
              className={cn(
                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0",
                pathname === "/"
                  ? "bg-white text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  : "text-slate-700 hover:text-black hover:bg-white hover:border-2 hover:border-black/60 border-2 border-transparent"
              )}
            >
              <Home className={cn("h-4 w-4", pathname === "/" ? "text-[#4285F4]" : "text-slate-600")} />
              <span>Beranda</span>
            </Link>

            <Link
              href="/lomba"
              className={cn(
                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0",
                pathname.startsWith("/lomba")
                  ? "bg-white text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  : "text-slate-700 hover:text-black hover:bg-white hover:border-2 hover:border-black/60 border-2 border-transparent"
              )}
            >
              <Compass className={cn("h-4 w-4", pathname.startsWith("/lomba") ? "text-[#4285F4]" : "text-slate-600")} />
              <span>Kumpulan Lomba</span>
            </Link>

            <Link
              href="/smk"
              className={cn(
                "group relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs xl:text-sm font-black transition-all whitespace-nowrap shrink-0 border-2 border-black",
                pathname === "/smk"
                  ? "bg-[#FBBC04] text-black shadow-[3px_3px_0px_#000]"
                  : "bg-[#FFF9E6] text-black hover:bg-[#FBBC04] shadow-[2px_2px_0px_#000]"
              )}
            >
              <GraduationCap className="h-4 w-4 text-black" />
              <span>Zona SMK</span>
              <span className="rounded-xs bg-black px-1 py-0.2 text-[9px] font-black text-[#FBBC04] uppercase">
                Vokasi
              </span>
            </Link>

            <Link
              href="/cari-tim"
              className={cn(
                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0",
                pathname === "/cari-tim"
                  ? "bg-white text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  : "text-slate-700 hover:text-black hover:bg-white hover:border-2 hover:border-black/60 border-2 border-transparent"
              )}
            >
              <Users className={cn("h-4 w-4", pathname === "/cari-tim" ? "text-[#34A853]" : "text-slate-600")} />
              <span>Cari Tim</span>
            </Link>

            <Link
              href="/saved"
              className={cn(
                "group relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0",
                pathname === "/saved"
                  ? "bg-white text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  : "text-slate-700 hover:text-black hover:bg-white hover:border-2 hover:border-black/60 border-2 border-transparent"
              )}
            >
              <Bookmark className={cn("h-4 w-4", pathname === "/saved" ? "text-[#EA4335]" : "text-slate-600")} />
              <span>Tersimpan</span>
              {mounted && bookmarks.length > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#EA4335] border border-black px-1.5 text-[10px] font-black text-white shadow-[1px_1px_0px_#000]">
                  {bookmarks.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden items-center gap-3 lg:flex shrink-0">
            <Link
              href="/submit"
              className="neo-btn neo-btn-blue h-9.5 px-4 text-xs xl:text-sm font-black whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4 shrink-0 mr-1.5" />
              <span>Pasang Lomba<span className="hidden xl:inline"> Gratis</span></span>
            </Link>
          </div>

          {/* Mobile Right Controls: Quick Bookmark & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/saved"
              aria-label="Lomba Tersimpan"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Bookmark className="h-4.5 w-4.5" />
              {mounted && bookmarks.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-xs bg-[#EA4335] border border-black px-1 text-[9px] font-black text-white">
                  {bookmarks.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all touch-manipulation cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER (RETRO OS WINDOW STYLE)                       */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 animate-fade-in"
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col bg-[#faf8f5] border-l-2 border-black shadow-2xl animate-slide-left">
            {/* Retro Window Titlebar */}
            <div className="retro-window-header border-b-2 border-black px-4 py-2 bg-[#f4f0e8] flex items-center justify-between shrink-0">
              <div className="retro-dots">
                <span className="retro-dot bg-[#EA4335]" />
                <span className="retro-dot bg-[#FBBC04]" />
                <span className="retro-dot bg-[#34A853]" />
                <span className="ml-2 font-mono text-[10px] text-slate-700">menu_nav.exe</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded border border-black bg-white text-black font-black hover:bg-[#EA4335] hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Drawer Header with Logo */}
            <div className="flex items-center justify-between border-b-2 border-black bg-white px-5 py-4 shrink-0">
              <div onClick={() => setMobileOpen(false)}>
                <NaviableLogo size="sm" />
              </div>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
              <p className="px-1 text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 font-mono">
                [Menu Navigasi]
              </p>

              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-bold border-2 transition-all",
                  pathname === "/"
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_#000] font-black"
                    : "border-transparent text-slate-800 hover:bg-white hover:border-black"
                )}
              >
                <Home className="h-4.5 w-4.5 text-[#4285F4]" />
                <span>Beranda Utama</span>
              </Link>

              <Link
                href="/lomba"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-bold border-2 transition-all",
                  pathname.startsWith("/lomba")
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_#000] font-black"
                    : "border-transparent text-slate-800 hover:bg-white hover:border-black"
                )}
              >
                <div className="flex items-center gap-3">
                  <Compass className="h-4.5 w-4.5 text-[#4285F4]" />
                  <span>Kumpulan Lomba</span>
                </div>
                <span className="neo-badge bg-[#34A853] text-white px-1.5 py-0.5 text-[9px]">
                  Terverifikasi
                </span>
              </Link>

              <Link
                href="/smk"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-bold border-2 transition-all",
                  pathname === "/smk"
                    ? "bg-[#FBBC04] text-black border-black shadow-[2px_2px_0px_#000] font-black"
                    : "bg-[#FFF9E6] border-black text-black shadow-[1px_1px_0px_#000]"
                )}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4.5 w-4.5 text-black" />
                  <span>Zona Siswa SMK</span>
                </div>
                <span className="neo-badge bg-black text-[#FBBC04] px-1.5 py-0.5 text-[9px]">
                  Vokasi
                </span>
              </Link>

              <Link
                href="/cari-tim"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-bold border-2 transition-all",
                  pathname === "/cari-tim"
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_#000] font-black"
                    : "border-transparent text-slate-800 hover:bg-white hover:border-black"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4.5 w-4.5 text-[#34A853]" />
                  <span>Cari Tim / Partner Lomba</span>
                </div>
                <span className="neo-badge bg-[#4285F4] text-white px-1.5 py-0.5 text-[9px]">
                  Lobby
                </span>
              </Link>

              <Link
                href="/saved"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-bold border-2 transition-all",
                  pathname === "/saved"
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_#000] font-black"
                    : "border-transparent text-slate-800 hover:bg-white hover:border-black"
                )}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="h-4.5 w-4.5 text-[#EA4335]" />
                  <span>Lomba Tersimpan</span>
                </div>
                {mounted && bookmarks.length > 0 && (
                  <span className="neo-badge bg-[#EA4335] text-white px-2 py-0.5 text-[10px]">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="border-t-2 border-black p-4 space-y-3 shrink-0 bg-white">
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="neo-btn neo-btn-blue w-full py-3 text-sm font-black text-center"
              >
                <PlusCircle className="h-4 w-4 mr-1.5 inline-block" />
                <span>Pasang Lomba Gratis</span>
              </Link>
              <p className="text-center font-mono text-[10px] text-slate-500 font-bold">
                naviable.id - Direktori Pelajar Indonesia
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (RETRO DOCK STYLE)                        */}
      {/* ========================================================================= */}
      {!isDetailPage && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf8f5] border-t-2 border-black px-2 py-1.5 lg:hidden"
          aria-label="Navigasi Bawah Layar Mobile"
        >
          <div className="grid grid-cols-5 items-center gap-1">
            {/* 1. Beranda */}
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 rounded-md text-[10px] font-black transition-all",
                pathname === "/"
                  ? "bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-[#4285F4]"
                  : "text-slate-700 hover:text-black"
              )}
            >
              <Home className="h-4.5 w-4.5" />
              <span>Beranda</span>
            </Link>

            {/* 2. Katalog Lomba */}
            <Link
              href="/lomba"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 rounded-md text-[10px] font-black transition-all",
                pathname.startsWith("/lomba")
                  ? "bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-[#4285F4]"
                  : "text-slate-700 hover:text-black"
              )}
            >
              <Compass className="h-4.5 w-4.5" />
              <span>Lomba</span>
            </Link>

            {/* 3. Cari Tim */}
            <Link
              href="/cari-tim"
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-1 rounded-md text-[10px] font-black transition-all",
                pathname === "/cari-tim"
                  ? "bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-[#34A853]"
                  : "text-slate-700 hover:text-black"
              )}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Cari Tim</span>
            </Link>

            {/* 4. Tersimpan */}
            <Link
              href="/saved"
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-1 rounded-md text-[10px] font-black transition-all",
                pathname === "/saved"
                  ? "bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-[#EA4335]"
                  : "text-slate-700 hover:text-black"
              )}
            >
              <div className="relative">
                <Bookmark className="h-4.5 w-4.5" />
                {mounted && bookmarks.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-xs bg-[#EA4335] border border-black px-0.5 text-[8px] font-black text-white">
                    {bookmarks.length}
                  </span>
                )}
              </div>
              <span>Simpan</span>
            </Link>

            {/* 5. Pasang Lomba */}
            <Link
              href="/submit"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 rounded-md text-[10px] font-black transition-all",
                pathname === "/submit"
                  ? "bg-[#FBBC04] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                  : "bg-[#FBBC04] text-black border border-black"
              )}
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Pasang</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
