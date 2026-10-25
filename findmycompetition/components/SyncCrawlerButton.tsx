"use client";

import { useTransition } from "react";
import { cleanupFakeCrawledCompetitionsAction } from "@/lib/actions";
import { Trash2, Loader2 } from "lucide-react";

export default function SyncCrawlerButton({ validatedCount }: { validatedCount: number }) {
  const [isPending, startTransition] = useTransition();

  const handleCleanup = () => {
    if (
      confirm(
        "Bersihkan seluruh data uji coba crawler (sains-nasional.id, hackathon-smk.id, dll) dari direktori web dan antrean staging?"
      )
    ) {
      startTransition(async () => {
        const res = await cleanupFakeCrawledCompetitionsAction();
        alert(res.message);
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleCleanup}
        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
        )}
        <span>Bersihkan Data Uji / Link Error</span>
      </button>
    </div>
  );
}
