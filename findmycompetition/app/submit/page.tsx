"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitCompetitionAction } from "@/lib/actions";
import {
  categoryEnum,
  levelEnum,
  type Category,
  type Level,
} from "@/db/schema";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@/lib/utils";
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Link as LinkIcon,
  DollarSign,
  FileText,
  Building,
  Image,
} from "lucide-react";

const formSchema = z.object({
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
  registrationFee: z.coerce.number().min(0, "Biaya tidak boleh negatif"),
  posterUrl: z.string().url("URL poster tidak valid").optional().or(z.literal("")),
  guidebookUrl: z.string().url("URL juknis tidak valid").optional().or(z.literal("")),
  registrationUrl: z.string().url("URL pendaftaran harus diawali https://"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  deadlineDate: z.string().min(1, "Deadline wajib diisi"),
  eventDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AUDIENCE_OPTIONS = ["SMA", "SMK", "MA", "Umum"] as const;

export default function SubmitPage() {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "TEKNOLOGI_RPL",
      level: "NASIONAL",
      targetAudience: ["SMA", "SMK"],
      registrationFee: 0,
      posterUrl: "",
      guidebookUrl: "",
      eventDate: "",
    },
  });

  const selectedAudiences = watch("targetAudience") || [];

  const handleAudienceToggle = (item: string) => {
    if (selectedAudiences.includes(item)) {
      setValue(
        "targetAudience",
        selectedAudiences.filter((a) => a !== item),
        { shouldValidate: true }
      );
    } else {
      setValue("targetAudience", [...selectedAudiences, item], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setFeedback(null);
    const result = await submitCompetitionAction(values);
    if (result.success) {
      setFeedback({ type: "success", message: result.message });
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setFeedback({ type: "error", message: result.message });
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs">
          <PlusCircle className="h-3.5 w-3.5" />
          Formulir Kurasi Penyelenggara
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Ajukan <span className="gradient-ptn">Kompetisi Baru</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl">
          Publikasikan informasi lomba Anda kepada siswa SMA, SMK, dan MA di seluruh Indonesia. Seluruh submisi akan diverifikasi oleh tim kurator naviable.id dalam 1x24 jam.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          )}
          <div className="text-sm font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6"
      >
        {/* Title */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <FileText className="h-4 w-4 text-indigo-600" />
            Judul Kompetisi *
          </label>
          <input
            {...register("title")}
            placeholder="Contoh: National Web & Mobile App Competition 2026"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Organizer */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Building className="h-4 w-4 text-indigo-600" />
            Nama Penyelenggara / Institusi *
          </label>
          <input
            {...register("organizer")}
            placeholder="Contoh: Himpunan Mahasiswa Informatika ITB"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
          />
          {errors.organizer && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.organizer.message}</p>
          )}
        </div>

        {/* Category & Level */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Kategori Lomba *
            </label>
            <select
              {...register("category")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-base sm:text-sm text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              {categoryEnum.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c as Category]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Tingkat Kompetisi *
            </label>
            <select
              {...register("level")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-base sm:text-sm text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              {levelEnum.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_LABELS[l as Level]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Audience Checkboxes */}
        <div>
          <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
            Target Peserta * (Pilih minimal 1)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {AUDIENCE_OPTIONS.map((aud) => {
              const active = selectedAudiences.includes(aud);
              return (
                <button
                  type="button"
                  key={aud}
                  onClick={() => handleAudienceToggle(aud)}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {active ? `✓ ${aud}` : `+ ${aud}`}
                </button>
              );
            })}
          </div>
          {errors.targetAudience && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.targetAudience.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
            Deskripsi Lengkap *
          </label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Jelaskan mengenai tema, tahapan lomba, persyaratan umum, dan total hadiah..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Registration Fee */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Biaya Pendaftaran (IDR) *
          </label>
          <input
            type="number"
            {...register("registrationFee")}
            placeholder="0 jika gratis"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
          />
          <p className="mt-1 text-xs text-slate-500">
            Masukkan angka 0 apabila lomba tidak memungut biaya pendaftaran (Gratis).
          </p>
          {errors.registrationFee && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.registrationFee.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              Buka Pendaftaran *
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base sm:text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            />
            {errors.startDate && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-rose-600" />
              Deadline Pendaftaran *
            </label>
            <input
              type="date"
              {...register("deadlineDate")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base sm:text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            />
            {errors.deadlineDate && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.deadlineDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              Tanggal Acara (Opsional)
            </label>
            <input
              type="date"
              {...register("eventDate")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base sm:text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <LinkIcon className="h-4 w-4 text-indigo-600" />
              Link Pendaftaran Resmi (Google Form / Web) *
            </label>
            <input
              {...register("registrationUrl")}
              placeholder="https://..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            />
            {errors.registrationUrl && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.registrationUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText className="h-4 w-4 text-slate-400" />
              Link Buku Panduan / Juknis (Opsional)
            </label>
            <input
              {...register("guidebookUrl")}
              placeholder="https://drive.google.com/..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            />
            {errors.guidebookUrl && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.guidebookUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Image className="h-4 w-4 text-slate-400" />
              Link URL Poster (Opsional)
            </label>
            <input
              {...register("posterUrl")}
              placeholder="https://images.unsplash.com/... atau URL gambar publik"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            />
            {errors.posterUrl && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.posterUrl.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-coral flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses & Mendaftarkan Lomba...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Kirim Pengajuan Lomba untuk Dikurasi
            </>
          )}
        </button>
      </form>
    </div>
  );
}
