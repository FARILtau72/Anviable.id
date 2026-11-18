import { GraduationCap, Briefcase, Users, CheckCircle2, Calendar, Award } from "lucide-react";

interface GuidePillar {
  icon: typeof GraduationCap;
  title: string;
  badge: string;
  badgeColor: string;
  headerBg: string;
  description: string;
  benefits: string[];
}

const GUIDE_PILLARS: GuidePillar[] = [
  {
    icon: GraduationCap,
    title: "Portofolio SNBP & Seleksi Jalur Prestasi",
    badge: "Siswa SMA / MA",
    badgeColor: "bg-[#4285F4] text-white",
    headerBg: "bg-[#E8F0FE]",
    description:
      "Sertifikat kejuaraan resmi berskala kabupaten, provinsi, nasional hingga internasional dapat diunggah sebagai dokumen pendukung nilai rapor pada seleksi SNBP dan jalur mandiri prestasi PTN.",
    benefits: [
      "Bobot nilai tambah seleksi masuk PTN impian",
      "Validasi sertifikat terakreditasi Puspresnas & BPTI",
      "Peluang beasiswa kuliah jalur prestasi akademik",
    ],
  },
  {
    icon: Briefcase,
    title: "Validasi Keterampilan Nyata Siswa Vokasi",
    badge: "Siswa SMK",
    badgeColor: "bg-[#FBBC04] text-black",
    headerBg: "bg-[#FEF7E0]",
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
    badgeColor: "bg-[#34A853] text-white",
    headerBg: "bg-[#E6F4EA]",
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
    <section className="neo-box overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_#000]">
      {/* Retro Window Titlebar */}
      <div className="retro-window-header border-b-2 border-black bg-[#FAF8F5] px-4 py-2 flex items-center justify-between">
        <div className="retro-dots">
          <span className="retro-dot bg-[#EA4335]" />
          <span className="retro-dot bg-[#FBBC04]" />
          <span className="retro-dot bg-[#34A853]" />
          <span className="ml-2 font-mono text-[11px] font-black text-black">
            naviable://roadmap_prestasi.sys
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-slate-600">
          EDUKASI PORTOFOLIO
        </span>
      </div>

      <div className="p-6 sm:p-10 lg:p-12 space-y-8">
        {/* Header & Calendar Badge Area (Inspired by 'Setahun bersama GDGoC IPB') */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
          <div>
            <div className="neo-badge bg-[#E8F0FE] text-[#1967D2] px-2.5 py-1 text-xs mb-2">
              <span>PANDUAN PRESTASI & KARIER PELAJAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Mengapa Mengikuti Kompetisi Sejak SMA & SMK?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl font-medium">
              Kompetisi bukan sekadar sertifikat, melainkan pembuktian kecakapan nyata untuk portofolio SNBP, seleksi politeknik, dan kesiapan berkarya di industri.
            </p>
          </div>

          {/* Retro Calendar Icon Illustration */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-[#FAF8F5] p-3 shadow-[3px_3px_0px_#000] shrink-0">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-black bg-white px-3 py-1.5 shadow-[2px_2px_0px_#000]">
              <span className="font-mono text-[9px] font-black uppercase text-[#EA4335]">2026</span>
              <span className="font-mono text-xl font-black text-black">365</span>
            </div>
            <div>
              <span className="block font-black text-xs text-black">Target Juara</span>
              <span className="font-mono text-[10px] text-slate-600">1 Portofolio Tiap Semester</span>
            </div>
          </div>
        </div>

        {/* Retro Roadmap Progress Bar */}
        <div className="rounded-xl border-2 border-black bg-[#FAF8F5] p-4 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between font-mono text-[11px] font-black mb-2 text-black">
            <span>TAHAP 1: EKSPLORASI (KELAS 10)</span>
            <span>TAHAP 2: EKSEKUSI (KELAS 11)</span>
            <span>TAHAP 3: PORTOFOLIO (KELAS 12)</span>
          </div>
          {/* Progress track */}
          <div className="relative h-4 w-full rounded-md border-2 border-black bg-white overflow-hidden p-0.5">
            <div className="h-full w-2/3 rounded-xs bg-[#34A853] border-r-2 border-black" />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 mt-2">
            <span>• Ikuti lomba tingkat kota/kabupaten</span>
            <span>• Bentuk tim & asah proyek teknologi / riset</span>
            <span>• Finalisasi sertifikat SNBP & uji kompetensi</span>
          </div>
        </div>

        {/* 3 Guide Cards: Neo-Brutalist Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {GUIDE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-xl border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] transition-all"
              >
                {/* Window Top Strip */}
                <div className={`flex items-center justify-between border-b-2 border-black px-3.5 py-2 ${pillar.headerBg}`}>
                  <span className="font-mono text-[10px] font-black uppercase text-black">
                    pilar_prestasi.doc
                  </span>
                  <span className={`neo-badge px-2 py-0.5 text-[9px] ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Icon */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000] mb-3 text-black">
                      <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-black text-black mb-2">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-slate-700 mb-4 font-medium">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Benefits List with Retro Checkmarks */}
                  <div className="border-t-2 border-black/10 pt-3.5 space-y-2 text-xs text-slate-800">
                    {pillar.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#34A853] shrink-0 mt-0.5" />
                        <span className="font-medium text-[11px]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
