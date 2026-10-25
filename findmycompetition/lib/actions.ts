"use server";

import { db, withDbRetry } from "@/db";
import {
  competitions,
  teamPostings,
  talentProfiles,
  teamApplications,
  crawledCompetitionsStaging,
} from "@/db/schema";
import { eq, or, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { headers } from "next/headers";

// In-memory sliding window rate limiter to protect server actions against spam
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(
  actionName: string,
  maxRequests = 8,
  windowMs = 60000
): Promise<boolean> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const key = `${actionName}:${ip}`;
    const now = Date.now();
    const current = rateLimitMap.get(key);

    if (!current || now > current.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return false;
    }

    if (current.count >= maxRequests) {
      return true;
    }

    current.count++;
    return false;
  } catch {
    return false;
  }
}

function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>?/gm, "") // strip HTML tags
    .trim();
}

const submitSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(255),
  organizer: z.string().min(3, "Penyelenggara minimal 3 karakter").max(255),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  category: z.enum([
    "TEKNOLOGI_RPL",
    "DESAIN_SENI",
    "SAINS_MATEMATIKA",
    "BISNIS_AKUNTANSI",
    "BAHASA_DEBAT",
    "LOKAL_VOKASI",
    "UMUM",
  ]),
  level: z.enum([
    "KOTA_KABUPATEN",
    "PROVINSI",
    "NASIONAL",
    "INTERNASIONAL",
  ]),
  targetAudience: z.array(z.string()).min(1, "Pilih minimal 1 target peserta"),
  registrationFee: z.coerce.number().min(0),
  posterUrl: z.string().url().optional().or(z.literal("")),
  guidebookUrl: z.string().url().optional().or(z.literal("")),
  registrationUrl: z.string().url("URL pendaftaran harus valid"),
  startDate: z.string().min(1),
  deadlineDate: z.string().min(1),
  eventDate: z.string().optional(),
});

export type SubmitFormData = z.infer<typeof submitSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .concat("-", Date.now().toString(36));
}

export async function submitCompetitionAction(
  data: SubmitFormData
): Promise<{ success: boolean; message: string }> {
  try {
    if (await isRateLimited("submitCompetition", 5, 60000)) {
      return {
        success: false,
        message: "Terlalu banyak pengajuan dalam waktu singkat. Mohon tunggu 1 menit.",
      };
    }

    const validated = submitSchema.parse({
      ...data,
      title: sanitizeText(data.title),
      organizer: sanitizeText(data.organizer),
      description: sanitizeText(data.description),
    });

    await withDbRetry(() =>
      db.insert(competitions).values({
        title: validated.title,
        slug: slugify(validated.title),
        organizer: validated.organizer,
        description: validated.description,
        category: validated.category,
        level: validated.level,
        targetAudience: validated.targetAudience,
        registrationFee: validated.registrationFee,
        posterUrl: validated.posterUrl || null,
        guidebookUrl: validated.guidebookUrl || null,
        registrationUrl: validated.registrationUrl,
        startDate: new Date(validated.startDate),
        deadlineDate: new Date(validated.deadlineDate),
        eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
        isVerified: false,
        isFeatured: false,
        viewsCount: 0,
      })
    );

    revalidatePath("/");
    revalidatePath("/lomba");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Kompetisi berhasil diajukan! Menunggu verifikasi admin.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      };
    }
    console.error("Submit error:", error);
    return { success: false, message: "Terjadi kesalahan. Coba lagi." };
  }
}

export async function toggleVerifyCompetitionAction(
  id: string,
  currentState: boolean
): Promise<{ success: boolean; message?: string }> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return {
        success: false,
        message: "Akses ditolak: Operasi ini membutuhkan hak akses Administrator.",
      };
    }

    await withDbRetry(() =>
      db
        .update(competitions)
        .set({ isVerified: !currentState })
        .where(eq(competitions.id, id))
    );

    revalidatePath("/");
    revalidatePath("/lomba");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Toggle verify error:", error);
    return { success: false, message: "Gagal memperbarui status kompetisi." };
  }
}

export async function deleteCompetitionAction(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return {
        success: false,
        message: "Akses ditolak: Operasi ini membutuhkan hak akses Administrator.",
      };
    }

    await withDbRetry(() =>
      db.delete(competitions).where(eq(competitions.id, id))
    );
    revalidatePath("/");
    revalidatePath("/lomba");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, message: "Gagal menghapus kompetisi." };
  }
}

// -------------------------------------------------------------
// Team Matchmaking Server Actions
// -------------------------------------------------------------

export interface CreateTeamPostingInput {
  competitionTitle: string;
  teamName: string;
  leaderName: string;
  schoolName: string;
  city: string;
  rolesNeeded: string[];
  description: string;
  workFormat: string;
  contactChannel: string;
  contactInfo: string;
  maxMembers: number;
}

export async function createTeamPostingAction(
  input: CreateTeamPostingInput
): Promise<{ success: boolean; message: string }> {
  try {
    if (await isRateLimited("createTeamPosting", 6, 60000)) {
      return {
        success: false,
        message: "Terlalu banyak permintaan posting tim. Mohon tunggu sebentar.",
      };
    }

    const teamName = sanitizeText(input.teamName);
    const leaderName = sanitizeText(input.leaderName);
    const schoolName = sanitizeText(input.schoolName);
    const city = sanitizeText(input.city);
    const description = sanitizeText(input.description);
    const contactInfo = sanitizeText(input.contactInfo);
    const sanitizedRoles = (input.rolesNeeded || [])
      .map(sanitizeText)
      .filter((r) => r.length > 0)
      .slice(0, 10);

    if (!teamName || !leaderName || !schoolName || !sanitizedRoles.length || !contactInfo) {
      return { success: false, message: "Lengkapi semua data tim yang wajib diisi." };
    }

    await withDbRetry(() =>
      db.insert(teamPostings).values({
        competitionTitle: sanitizeText(input.competitionTitle) || "Lomba Mandiri / Umum",
        teamName,
        leaderName,
        schoolName,
        city: city || "Indonesia",
        rolesNeeded: sanitizedRoles,
        description,
        workFormat: input.workFormat || "ONLINE",
        contactChannel: input.contactChannel || "WHATSAPP",
        contactInfo,
        membersCount: 1,
        maxMembers: Math.min(Math.max(input.maxMembers || 3, 2), 10),
        status: "OPEN",
      })
    );

    revalidatePath("/cari-tim");
    revalidatePath("/");
    return { success: true, message: "Perekrutan tim berhasil dipublikasikan!" };
  } catch (error) {
    console.error("createTeamPostingAction error:", error);
    return { success: false, message: "Gagal membuat postingan tim. Coba lagi." };
  }
}

export interface CreateTalentProfileInput {
  fullName: string;
  schoolName: string;
  gradeLevel: string;
  major: string;
  skills: string[];
  bio: string;
  achievements?: string;
  portfolioUrl?: string;
  contactChannel: string;
  contactInfo: string;
}

export async function createTalentProfileAction(
  input: CreateTalentProfileInput
): Promise<{ success: boolean; message: string }> {
  try {
    if (await isRateLimited("createTalentProfile", 6, 60000)) {
      return {
        success: false,
        message: "Terlalu banyak permintaan pembuatan profil. Mohon tunggu sebentar.",
      };
    }

    const fullName = sanitizeText(input.fullName);
    const schoolName = sanitizeText(input.schoolName);
    const bio = sanitizeText(input.bio);
    const contactInfo = sanitizeText(input.contactInfo);
    const sanitizedSkills = (input.skills || [])
      .map(sanitizeText)
      .filter((s) => s.length > 0)
      .slice(0, 15);

    if (!fullName || !schoolName || !sanitizedSkills.length || !contactInfo) {
      return { success: false, message: "Lengkapi data profil dan minimal 1 skill." };
    }

    await withDbRetry(() =>
      db.insert(talentProfiles).values({
        fullName,
        schoolName,
        gradeLevel: sanitizeText(input.gradeLevel) || "Siswa SMA/SMK",
        major: sanitizeText(input.major) || "Umum",
        skills: sanitizedSkills,
        bio,
        achievements: sanitizeText(input.achievements) || null,
        portfolioUrl: input.portfolioUrl ? sanitizeText(input.portfolioUrl) : null,
        contactChannel: input.contactChannel || "WHATSAPP",
        contactInfo,
        status: "AVAILABLE",
      })
    );

    revalidatePath("/cari-tim");
    revalidatePath("/");
    return { success: true, message: "Profil talent kamu berhasil dipajang!" };
  } catch (error) {
    console.error("createTalentProfileAction error:", error);
    return { success: false, message: "Gagal mendaftar talent pool. Coba lagi." };
  }
}

export interface ApplyToTeamInput {
  teamPostingId: string;
  applicantName: string;
  schoolName: string;
  roleApplied: string;
  message: string;
  contactInfo: string;
  portfolioUrl?: string;
}

export async function applyToTeamAction(
  input: ApplyToTeamInput
): Promise<{ success: boolean; message: string }> {
  try {
    if (await isRateLimited("applyToTeam", 8, 60000)) {
      return {
        success: false,
        message: "Terlalu banyak pengiriman lamaran. Mohon tunggu sebentar.",
      };
    }

    const applicantName = sanitizeText(input.applicantName);
    const schoolName = sanitizeText(input.schoolName);
    const roleApplied = sanitizeText(input.roleApplied);
    const message = sanitizeText(input.message);
    const contactInfo = sanitizeText(input.contactInfo);

    if (!input.teamPostingId || !applicantName || !roleApplied || !contactInfo) {
      return { success: false, message: "Lengkapi nama, role yang diminati, dan kontak." };
    }

    await withDbRetry(() =>
      db.insert(teamApplications).values({
        teamPostingId: input.teamPostingId,
        applicantName,
        schoolName: schoolName || "Pelajar Indonesia",
        roleApplied,
        message,
        contactInfo,
        portfolioUrl: input.portfolioUrl ? sanitizeText(input.portfolioUrl) : null,
        status: "PENDING",
      })
    );

    revalidatePath("/cari-tim");
    return { success: true, message: "Lamaran kolaborasi berhasil dikirimkan ke database!" };
  } catch (error) {
    console.error("applyToTeamAction error:", error);
    return { success: false, message: "Gagal mengirimkan lamaran. Coba lagi." };
  }
}

export async function publishStagedCompetitionAction(
  stagingId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, message: "Akses ditolak: Hanya untuk Administrator." };
    }

    const staged = await withDbRetry(() =>
      db
        .select()
        .from(crawledCompetitionsStaging)
        .where(eq(crawledCompetitionsStaging.id, stagingId))
        .limit(1)
    );

    if (!staged || staged.length === 0) {
      return { success: false, message: "Data staging tidak ditemukan." };
    }

    const item = staged[0];
    const slugBase = item.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${slugBase || "lomba"}-${item.id.slice(0, 6)}`;

    const validCategory = [
      "TEKNOLOGI_RPL",
      "DESAIN_SENI",
      "SAINS_MATEMATIKA",
      "BISNIS_AKUNTANSI",
      "BAHASA_DEBAT",
      "LOKAL_VOKASI",
      "UMUM",
    ].includes(item.category)
      ? (item.category as any)
      : "UMUM";

    const targetAudience =
      Array.isArray(item.targetLevels) && item.targetLevels.length > 0
        ? item.targetLevels
        : ["UMUM"];

    const now = new Date();
    const startDate = item.startDate ? new Date(item.startDate) : now;
    const deadlineDate = item.deadlineDate
      ? new Date(item.deadlineDate)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Insert into main competitions table
    await withDbRetry(() =>
      db.insert(competitions).values({
        title: item.title,
        slug,
        organizer: item.organizer || "Penyelenggara Terdata",
        description: item.description || `Informasi kompetisi ${item.title}.`,
        category: validCategory,
        level: "NASIONAL",
        targetAudience,
        registrationFee: item.registrationFee ?? 0,
        posterUrl: item.posterUrl,
        guidebookUrl: item.officialGuideUrl,
        registrationUrl: item.registrationUrl || item.canonicalUrl,
        startDate,
        deadlineDate,
        eventDate: item.eventDate ? new Date(item.eventDate) : null,
        isVerified: true,
        isFeatured: false,
      })
    );

    // Update staging status to VERIFIED_ACTIVE
    await withDbRetry(() =>
      db
        .update(crawledCompetitionsStaging)
        .set({ status: "VERIFIED_ACTIVE" })
        .where(eq(crawledCompetitionsStaging.id, stagingId))
    );

    revalidatePath("/");
    revalidatePath("/lomba");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Kompetisi "${item.title}" berhasil dipublikasikan ke direktori publik!`,
    };
  } catch (error) {
    console.error("publishStagedCompetitionAction error:", error);
    return { success: false, message: "Gagal mempublikasikan kompetisi." };
  }
}

export async function syncAllValidatedStagedCompetitionsAction(): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, message: "Akses ditolak: Hanya untuk Administrator.", count: 0 };
    }

    const validatedItems = await withDbRetry(() =>
      db
        .select()
        .from(crawledCompetitionsStaging)
        .where(eq(crawledCompetitionsStaging.status, "VALIDATED"))
    );

    let syncedCount = 0;
    for (const item of validatedItems) {
      const res = await publishStagedCompetitionAction(item.id);
      if (res.success) syncedCount++;
    }

    revalidatePath("/");
    revalidatePath("/lomba");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Berhasil mensinkronisasi ${syncedCount} kompetisi terverifikasi dari bot!`,
      count: syncedCount,
    };
  } catch (error) {
    console.error("syncAllValidatedStagedCompetitionsAction error:", error);
    return { success: false, message: "Gagal mensinkronisasi kompetisi.", count: 0 };
  }
}

export async function deleteStagedCompetitionAction(
  stagingId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, message: "Akses ditolak: Hanya untuk Administrator." };
    }

    await withDbRetry(() =>
      db
        .delete(crawledCompetitionsStaging)
        .where(eq(crawledCompetitionsStaging.id, stagingId))
    );

    revalidatePath("/admin");
    return { success: true, message: "Data antrean bot berhasil dihapus." };
  } catch (error) {
    console.error("deleteStagedCompetitionAction error:", error);
    return { success: false, message: "Gagal menghapus data antrean bot." };
  }
}

export async function cleanupFakeCrawledCompetitionsAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, message: "Akses ditolak: Hanya untuk Administrator." };
    }

    // 1. Remove mock/fake competitions from main public directory
    await withDbRetry(() =>
      db
        .delete(competitions)
        .where(
          or(
            like(competitions.registrationUrl, "%sains-nasional.id%"),
            like(competitions.registrationUrl, "%hackathon-smk.id%"),
            like(competitions.registrationUrl, "%pedulilingkungan.org%"),
            like(competitions.slug, "%sains-nasional%"),
            like(competitions.slug, "%hackathon-vokasi-smk%"),
            like(competitions.slug, "%olimpiade-sains-matematika%")
          )!
        )
    );

    // 2. Remove mock/fake items from staging table
    await withDbRetry(() =>
      db
        .delete(crawledCompetitionsStaging)
        .where(
          or(
            like(crawledCompetitionsStaging.canonicalUrl, "%sains-nasional.id%"),
            like(crawledCompetitionsStaging.canonicalUrl, "%hackathon-smk.id%"),
            like(crawledCompetitionsStaging.canonicalUrl, "%pedulilingkungan.org%")
          )!
        )
    );

    revalidatePath("/");
    revalidatePath("/lomba");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Data uji coba crawler dan link mati berhasil dibersihkan dari direktori web dan antrean staging!",
    };
  } catch (error) {
    console.error("cleanupFakeCrawledCompetitionsAction error:", error);
    return { success: false, message: "Gagal membersihkan data uji coba." };
  }
}
