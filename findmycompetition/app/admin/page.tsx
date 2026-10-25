import { db, withDbRetry } from "@/db";
import { competitions, crawledCompetitionsStaging } from "@/db/schema";
import { desc } from "drizzle-orm";
import dayjs from "dayjs";
import { ShieldCheck, CheckCircle2, Clock, AlertCircle, Bot, Sparkles } from "lucide-react";
import AdminRowActions from "@/components/AdminRowActions";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import StagingRowActions from "@/components/StagingRowActions";
import SyncCrawlerButton from "@/components/SyncCrawlerButton";
import { isAdminAuthenticated } from "@/lib/auth";
import { connection } from "next/server";
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  formatCurrency,
  CATEGORY_COLORS,
} from "@/lib/utils";

export default async function AdminPage() {
  await connection();
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLoginForm />;
  }

  const allCompetitions = await withDbRetry(() =>
    db
      .select()
      .from(competitions)
      .orderBy(desc(competitions.createdAt))
  );

  const stagedCompetitions = await withDbRetry(() =>
    db
      .select()
      .from(crawledCompetitionsStaging)
      .orderBy(desc(crawledCompetitionsStaging.extractedAt))
      .limit(30)
  );

  const unverified = allCompetitions.filter((c) => !c.isVerified);
  const verified = allCompetitions.filter((c) => c.isVerified);
  const validatedStaged = stagedCompetitions.filter((s) => s.status === "VALIDATED");

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Panel Moderasi Terkunci
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900">
            Dashboard <span className="gradient-ptn">Admin & Kurasi</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Kelola persetujuan kompetisi publik dan pantau hasil ekstraksi crawler TiDB secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminLogoutButton />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Direktori
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">{allCompetitions.length}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">
              Menunggu Verifikasi
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-amber-700">
            {unverified.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">
              Aktif di Publik
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700">
            {verified.length}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-700">
              Bot Staging (TiDB)
            </span>
            <div className="h-8 w-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-sky-700">
            {stagedCompetitions.length}
          </p>
        </div>
      </div>

      {/* Bot Staging Section (TiDB Interconnected) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Hasil Ekstraksi Bot Staging ({stagedCompetitions.length})
              </h2>
              <p className="text-xs text-slate-500">
                Data lomba hasil multi-tier extraction Scrapy yang tersimpan di TiDB Cloud.
              </p>
            </div>
          </div>

          <SyncCrawlerButton validatedCount={validatedStaged.length} />
        </div>

        {stagedCompetitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            Belum ada data kompetisi di tabel staging TiDB. Jalankan crawler untuk mengisi data.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Lomba & Penyelenggara</th>
                  <th className="px-4 py-3">Domain & Kategori</th>
                  <th className="px-4 py-3">Tier & Skor</th>
                  <th className="px-4 py-3">Status Pipeline</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stagedCompetitions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.organizer}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 items-start">
                        <span className="font-mono text-[11px] text-slate-700 font-medium">
                          {item.domain}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {item.extractionTier}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {(item.extractionScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          item.status === "VALIDATED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "VERIFIED_ACTIVE"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StagingRowActions
                        id={item.id}
                        sourceUrl={item.canonicalUrl || item.sourceUrl}
                        status={item.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Moderation Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Menunggu Verifikasi ({unverified.length})
          </h2>
        </div>

        {unverified.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            Tidak ada kompetisi baru yang menunggu moderasi.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Judul & Penyelenggara</th>
                  <th className="px-4 py-3">Kategori / Tingkat</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Biaya</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unverified.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {comp.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {comp.organizer}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            CATEGORY_COLORS[comp.category]
                          }`}
                        >
                          {CATEGORY_LABELS[comp.category]}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {LEVEL_LABELS[comp.level]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                      {dayjs(comp.deadlineDate).format("DD MMM YYYY")}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap text-slate-900">
                      {formatCurrency(comp.registrationFee)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminRowActions
                        id={comp.id}
                        slug={comp.slug}
                        isVerified={comp.isVerified}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* All Competitions Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Seluruh Lomba Terverifikasi ({verified.length})
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Judul & Penyelenggara</th>
                <th className="px-4 py-3">Kategori / Tingkat</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Dilihat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verified.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {comp.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {comp.organizer}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          CATEGORY_COLORS[comp.category]
                        }`}
                      >
                        {CATEGORY_LABELS[comp.category]}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {LEVEL_LABELS[comp.level]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                    {dayjs(comp.deadlineDate).format("DD MMM YYYY")}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {comp.viewsCount}x
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminRowActions
                      id={comp.id}
                      slug={comp.slug}
                      isVerified={comp.isVerified}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
