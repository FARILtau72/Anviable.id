"use client";

import { useTransition } from "react";
import { publishStagedCompetitionAction, deleteStagedCompetitionAction } from "@/lib/actions";
import { CheckCircle2, Loader2, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

export default function StagingRowActions({
  id,
  sourceUrl,
  status,
}: {
  id: string;
  sourceUrl: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handlePublish = () => {
    if (confirm("Pastikan tautan dan tanggal lomba ini valid sebelum mempublikasikan ke website. Lanjutkan?")) {
      startTransition(async () => {
        const res = await publishStagedCompetitionAction(id);
        alert(res.message);
      });
    }
  };

  const handleDelete = () => {
    if (confirm("Hapus data antrean lomba ini dari staging? Tindakan ini tidak dapat dibatalkan.")) {
      startTransition(async () => {
        const res = await deleteStagedCompetitionAction(id);
        alert(res.message);
      });
    }
  };

  const isAlreadyActive = status === "VERIFIED_ACTIVE";

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Link to Source */}
      <Link
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-xs"
        title="Uji / Buka Tautan Sumber"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>

      {/* Delete / Reject Button */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
        title="Tolak & Hapus dari Staging"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Publish Button */}
      <button
        type="button"
        disabled={isPending || isAlreadyActive}
        onClick={handlePublish}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer ${
          isAlreadyActive
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : status === "VALIDATED"
            ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isAlreadyActive ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Terbit di Website</span>
          </>
        ) : (
          <span>Publish ke Website</span>
        )}
      </button>
    </div>
  );
}
