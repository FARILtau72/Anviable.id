import { GraduationCap, Briefcase, Users, CheckCircle2, BookOpen } from "lucide-react";

interface GuidePillar {
  icon: typeof GraduationCap;
  title: string;
  badge: string;
  badgeBg: string;
  description: string;
  benefits: string[];
}

const GUIDE_PILLARS: GuidePillar[] = [
  {
    icon: GraduationCap,
    title: "Portofolio SNBP & Seleksi Jalur Prestasi",
    badge: "Siswa SMA / MA",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description:
      "Sertifikat kejuaraan resmi berskala kabupaten, provinsi, nasional hingga internasional dapat diunggah sebagai dokumen pendukung nilai rapor pada seleksi SNBP dan jalur mandiri prestasi PTN.",
    benefits: [
      "Bobot nilai tambah pada seleksi masuk PTN impian",
      "Validasi sertifikat terakreditasi Puspresnas & BPTI",
      "Peluang beasiswa kuliah jalur prestasi akademik",
    ],
  },
  {
    icon: Briefcase,
    title: "Validasi Keterampilan Nyata Siswa Vokasi",
    badge: "Siswa SMK",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
    description:
      "Ajang kejuruan seperti LKS SMK, Web Development, UI/UX Design, Cyber Security, dan Robotik menguji kecakapan teknis langsung di bawah standar kurikulum industri terkini.",
    benefits: [
      "Artefak karya riil untuk portofolio siap kerja",
      "Diakui oleh industri mitra dan institusi politeknik",
      "Meningkatkan rasa percaya diri saat uji kompetensi",
    ],
  },
  {
    icon: Users,
    title: "Mental Kompetitif & Kolaborasi Tim",
    badge: "Lintas Pelajar",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description:
      "Mengerjakan proyek Hackathon, naskah riset LKTI, atau debat melatih kerja sama tim lintas sekolah, pemecahan masalah kritis, dan kemampuan komunikasi publik.",
    benefits: [
      "Pengalaman membagi peran Hacker, Hipster, & Hustler",
      "Jejaring pertemanan pelajar berprestasi se-Indonesia",
      "Manajemen tenggat waktu dan simulasi sprint proyek",
    ],
  },
];

export default function TestimonialsSection() {
  return (
    <section className="space-y-8 pt-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-slate-500">
          Panduan Prestasi & Karier Pelajar
        </span>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Mengapa Mengikuti Kompetisi Sejak SMA & SMK?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Kompetisi bukan sekadar sertifikat, melainkan pembuktian kecakapan nyata untuk portofolio SNBP, seleksi politeknik, dan kesiapan berkarya.
        </p>
      </div>

      {/* 3 Guide Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {GUIDE_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Header Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${pillar.badgeBg}`}>
                    {pillar.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 mb-4">
                  {pillar.description}
                </p>

                {/* Benefits List */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-700">
                  {pillar.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-900 font-bold">•</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
