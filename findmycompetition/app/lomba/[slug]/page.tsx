import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { db, withDbRetry } from "@/db";
import { competitions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import dayjs from "dayjs";
import {
  ExternalLink,
  FileText,
  Calendar,
  Users,
  Tag,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import CountdownTimer from "@/components/CountdownTimer";
import BookmarkButton, { type BookmarkData } from "@/components/BookmarkButton";
import ShareAndCalendarButtons from "@/components/ShareAndCalendarButtons";
import PosterHeroWithLightbox from "@/components/PosterHeroWithLightbox";
import {
  formatCurrency,
  CATEGORY_LABELS,
  LEVEL_LABELS,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  cn,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const [comp] = await withDbRetry(() =>
    db
      .select()
      .from(competitions)
      .where(eq(competitions.slug, slug))
      .limit(1)
  );

  if (!comp) return { title: "Tidak Ditemukan" };

  return {
    title: comp.title,
    description: comp.description.substring(0, 160),
    openGraph: {
      title: comp.title,
      description: comp.description.substring(0, 160),
      type: "article",
    },
  };
}

export default async function CompetitionDetailPage({ params }: PageProps) {
  await connection();
  const { slug } = await params;

  const [comp] = await withDbRetry(() =>
    db
      .select()
      .from(competitions)
      .where(eq(competitions.slug, slug))
      .limit(1)
  );

  if (!comp) notFound();

  // Increment views asynchronously without blocking page render
  withDbRetry(() =>
    db
      .update(competitions)
      .set({ viewsCount: sql`${competitions.viewsCount} + 1` })
      .where(eq(competitions.id, comp.id))
  ).catch((err) =>
    console.warn("View count increment notice:", err?.message || err)
  );

  let audiences: string[] = [];
  if (Array.isArray(comp.targetAudience)) {
    audiences = comp.targetAudience;
  } else if (typeof comp.targetAudience === "string") {
    try {
      audiences = JSON.parse(comp.targetAudience);
    } catch {
      audiences = [comp.targetAudience];
    }
  }
  const isClosed = dayjs(comp.deadlineDate).isBefore(dayjs());

  const bookmarkData: BookmarkData = {
    id: comp.id,
    slug: comp.slug,
    title: comp.title,
    organizer: comp.organizer,
    category: comp.category,
    level: comp.level,
    targetAudience: audiences,
    posterUrl: comp.posterUrl,
    deadlineDate: comp.deadlineDate.toISOString(),
    registrationFee: comp.registrationFee,
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24 lg:pb-0">
      {/* Back button */}
      <div>
        <Link
          href="/lomba"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
          Kembali ke Kumpulan Lomba
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Poster & Hero Banner with Fullscreen Lightbox */}
          <PosterHeroWithLightbox
            posterUrl={comp.posterUrl}
            title={comp.title}
            category={comp.category}
            level={comp.level}
            deadlineDate={comp.deadlineDate}
          />

          {/* Title & Info Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <span>Kompetisi Terkurasi</span>
              <span>•</span>
              <span>{LEVEL_LABELS[comp.level]}</span>
            </div>
            <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {comp.title}
            </h1>
            <p className="text-sm text-slate-500">
              Diselenggarakan secara resmi oleh{" "}
              <span className="font-bold text-slate-800">
                {comp.organizer}
              </span>
            </p>
          </div>

          {/* Description Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Deskripsi & Gambaran Kompetisi
            </h2>
            <div className="h-[1px] w-full bg-slate-100" />
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
              {comp.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Mulai Pendaftaran</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {dayjs(comp.startDate).format("DD MMMM YYYY")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-rose-700">Batas Akhir (Deadline)</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {dayjs(comp.deadlineDate).format("DD MMMM YYYY")}
                </p>
              </div>
            </div>

            {comp.eventDate && (
              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Pelaksanaan Acara</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {dayjs(comp.eventDate).format("DD MMMM YYYY")}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Biaya Registrasi</p>
                <p className="mt-0.5 text-sm font-bold text-emerald-600">
                  {formatCurrency(comp.registrationFee)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:col-span-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500">Target Jenjang Peserta</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {audiences.map((a) => (
                    <span
                      key={a}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Bagikan & Simpan ke Kalender</h3>
            <ShareAndCalendarButtons
              title={comp.title}
              description={comp.description}
              slug={comp.slug}
              deadlineDate={comp.deadlineDate}
              eventDate={comp.eventDate}
              registrationUrl={comp.registrationUrl}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Countdown Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sisa Waktu Pendaftaran
              </h3>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <CountdownTimer deadlineDate={comp.deadlineDate} />
          </div>

          {/* CTA Buttons */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <a
              href={comp.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-sm font-bold transition-all shadow-md",
                isClosed
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "btn-coral shadow-orange-500/25"
              )}
            >
              <ExternalLink className="h-4 w-4" />
              <span>
                {isClosed ? "Pendaftaran Telah Ditutup" : "Daftar Sekarang (Portal Resmi)"}
              </span>
            </a>

            {comp.guidebookUrl && (
              <a
                href={comp.guidebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all"
              >
                <FileText className="h-4 w-4 text-indigo-600" />
                Unduh Buku Panduan (Juknis)
              </a>
            )}

            <BookmarkButton competition={bookmarkData} size="lg" className="w-full" />
          </div>

          {/* Verified Badge */}
          {comp.isVerified && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs font-semibold text-emerald-800 shadow-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900">Terverifikasi oleh Tim anviable.id</p>
                <p className="text-[11px] text-emerald-700">
                  Penyelenggara kredibel & link registrasi valid.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Fixed Bottom Action Bar (Tokopedia / Airbnb Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-2.5 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-2xl lg:hidden">
        <BookmarkButton
          competition={bookmarkData}
          size="md"
          className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-2.5 shadow-2xs"
        />
        <a
          href={comp.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "btn-coral flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all text-center",
            isClosed && "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none pointer-events-none"
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {isClosed ? "Pendaftaran Telah Ditutup" : "Daftar Sekarang (Portal Resmi)"}
          </span>
        </a>
      </div>
    </div>
  );
}
