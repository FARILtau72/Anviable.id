"use client";

import { useState, useEffect } from "react";
import { ZoomIn, ExternalLink, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import type { Category, Level } from "@/db/schema";
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  cn,
} from "@/lib/utils";

interface PosterHeroWithLightboxProps {
  posterUrl: string | null;
  title: string;
  category: Category;
  level: Level;
  deadlineDate: Date | string;
}

export default function PosterHeroWithLightbox({
  posterUrl,
  title,
  category,
  level,
  deadlineDate,
}: PosterHeroWithLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const hasPoster = Boolean(posterUrl);

  return (
    <>
      {/* Poster & Hero Banner Container */}
      <div
        className={cn(
          "group relative h-64 w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br shadow-md sm:h-80 select-none",
          CATEGORY_GRADIENTS[category],
          hasPoster && "cursor-zoom-in"
        )}
        onClick={() => {
          if (hasPoster) setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (hasPoster && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        role={hasPoster ? "button" : undefined}
        tabIndex={hasPoster ? 0 : undefined}
        aria-label={hasPoster ? `Klik untuk memperbesar poster lomba ${title}` : undefined}
      >
        {posterUrl && (
          <img
            src={posterUrl}
            alt={`Poster ${title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity group-hover:from-black/90" />

        {/* Top-Right Zoom Hint Badge */}
        {hasPoster && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md shadow-xs transition-all group-hover:bg-black/80 group-hover:border-white/35">
              <ZoomIn className="h-3.5 w-3.5 text-white/90" />
              <span>Klik untuk Perbesar</span>
            </span>
          </div>
        )}

        {/* Bottom Metadata Badges */}
        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-xs backdrop-blur-md",
                CATEGORY_COLORS[category]
              )}
            >
              {CATEGORY_LABELS[category]}
            </span>
            <span className="inline-flex items-center rounded-xl border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
              {LEVEL_LABELS[level]}
            </span>
          </div>
          <StatusBadge deadlineDate={deadlineDate} />
        </div>
      </div>

      {/* Fullscreen Modal Lightbox */}
      {isOpen && posterUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau poster lengkap: ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex flex-col items-center w-full max-w-5xl max-h-[96vh] gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="flex w-full items-center justify-between gap-3 px-1 text-white">
              <div className="min-w-0 pr-2">
                <p className="truncate text-xs sm:text-sm font-semibold text-slate-200">
                  {title}
                </p>
                <p className="text-[11px] text-slate-400">
                  Resolusi Penuh Poster Resmi
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={posterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors"
                  title="Buka gambar asli di tab baru"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Buka Asli</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-white/20 bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                  aria-label="Tutup pratinjau"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Poster Canvas */}
            <div className="relative flex w-full max-h-[82vh] items-center justify-center overflow-auto rounded-2xl border border-white/10 bg-black/50 p-2 sm:p-4 shadow-2xl">
              <img
                src={posterUrl}
                alt={`Poster lengkap ${title}`}
                className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>

            {/* Hint Footer */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>
                Tekan <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">Esc</kbd> atau klik di luar untuk menutup
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
