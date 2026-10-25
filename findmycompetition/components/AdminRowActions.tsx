"use client";

import { useTransition } from "react";
import { toggleVerifyCompetitionAction, deleteCompetitionAction } from "@/lib/actions";
import { CheckCircle2, XCircle, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminRowActions({
  id,
  slug,
  isVerified,
}: {
  id: string;
  slug: string;
  isVerified: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleVerifyCompetitionAction(id, isVerified);
    });
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus kompetisi ini?")) {
      startTransition(async () => {
        await deleteCompetitionAction(id);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/lomba/${slug}`}
        target="_blank"
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-xs"
        title="Lihat Halaman Publik"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>

      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer ${
          isVerified
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isVerified ? (
          <>
            <XCircle className="h-3.5 w-3.5" />
            Batal Verifikasi
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Setujui & Verifikasi
          </>
        )}
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        title="Hapus Lomba"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
