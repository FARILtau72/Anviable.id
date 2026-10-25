import { Suspense } from "react";
import { connection } from "next/server";
import { db, withDbRetry } from "@/db";
import { competitions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import SpotlightHero from "@/components/SpotlightHero";
import FeaturedCompetitions from "@/components/FeaturedCompetitions";
import CategoryGrid from "@/components/CategoryGrid";
import TeamMatchmakingSection from "@/components/TeamMatchmakingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import OrganizerCTABanner from "@/components/OrganizerCTABanner";

export default async function HomePage() {
  await connection();

  // Fetch all verified competitions with resilient retry
  const allVerified = await withDbRetry(() =>
    db
      .select()
      .from(competitions)
      .where(eq(competitions.isVerified, true))
      .orderBy(asc(competitions.deadlineDate))
  );

  const categoryCounts = allVerified.reduce<Record<string, number>>(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-20 sm:space-y-28 pb-12">
      {/* 1. Hero Section with PTN Headline & Search Command */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100" />}>
        <SpotlightHero totalCompetitions={allVerified.length} />
      </Suspense>

      {/* 2. Lomba Unggulan Bulan Ini (Pilihan Kurator) */}
      <Suspense fallback={<div className="h-72 w-full animate-pulse rounded-2xl bg-slate-100" />}>
        <FeaturedCompetitions competitions={allVerified} />
      </Suspense>

      {/* 3. Eksplorasi Bidang Minat & Jurusanmu (6 Bento Cards) */}
      <Suspense fallback={<div className="h-72 w-full animate-pulse rounded-2xl bg-slate-100" />}>
        <CategoryGrid categoryCounts={categoryCounts} />
      </Suspense>

      {/* 4. Matchmaking Rekan Lomba (Dark Navy Banner) */}
      <TeamMatchmakingSection />

      {/* 5. Edukasi & Manfaat Portofolio Kompetisi Pelajar */}
      <TestimonialsSection />

      {/* 6. Organisasi, Sekolah, atau Kampusmu Punya Lomba? (Royal Blue CTA) */}
      <OrganizerCTABanner />
    </div>
  );
}
