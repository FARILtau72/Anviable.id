import "dotenv/config";
import { db } from "../db";
import { competitions, type NewCompetition } from "../db/schema";
import dayjs from "dayjs";

async function main() {
  console.log("Seeding 6 realistic Indonesian SMA/SMK competitions...");

  const dummyCompetitions: NewCompetition[] = [
    {
      title: "Olimpiade Sains Nasional (OSN) Bidang Informatika Komputer 2026",
      slug: "osn-bidang-informatika-komputer-2026",
      organizer: "Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek",
      description:
        "Ajang talenta bergengsi tahunan bagi siswa SMA/MA di seluruh Indonesia untuk menguji kemampuan algoritma, struktur data, dan pemrograman kompetitif (C++). Pemenang medali berpeluang mewakili Indonesia di International Olympiad in Informatics (IOI).",
      category: "TEKNOLOGI_RPL",
      level: "NASIONAL",
      targetAudience: ["SMA", "MA"],
      registrationFee: 0,
      posterUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      guidebookUrl: "https://pusatprestasinasional.kemdikbud.go.id/juknis-osn-2026.pdf",
      registrationUrl: "https://daftar-bpti.kemdikbud.go.id",
      startDate: dayjs().subtract(5, "day").toDate(),
      deadlineDate: dayjs().add(25, "day").toDate(),
      eventDate: dayjs().add(60, "day").toDate(),
      isVerified: true,
      isFeatured: true,
      viewsCount: 1420,
    },
    {
      title: "Lomba Kompetensi Siswa (LKS) SMK Tingkat Nasional - Web Technologies",
      slug: "lks-smk-nasional-web-technologies-2026",
      organizer: "Direktorat SMK Ditjen Pendidikan Vokasi",
      description:
        "Kompetisi keahlian vokasi siswa SMK bidang Web Technologies mencakup Client-Side Development, Server-Side API, Responsive Web Design, CMS Customization, and Speed Challenge standar WorldSkills.",
      category: "TEKNOLOGI_RPL",
      level: "NASIONAL",
      targetAudience: ["SMK"],
      registrationFee: 0,
      posterUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80",
      guidebookUrl: "https://smk.kemdikbud.go.id/juknis-lks-web-2026.pdf",
      registrationUrl: "https://smk.kemdikbud.go.id/lks",
      startDate: dayjs().subtract(2, "day").toDate(),
      deadlineDate: dayjs().add(18, "day").toDate(),
      eventDate: dayjs().add(45, "day").toDate(),
      isVerified: true,
      isFeatured: true,
      viewsCount: 980,
    },
    {
      title: "Festival dan Lomba Seni Siswa Nasional (FLS2N) - Desain Poster Digital",
      slug: "fls2n-desain-poster-digital-2026",
      organizer: "Pusat Prestasi Nasional",
      description:
        "Kompetisi kreativitas visual desain poster bertema 'Harmoni Budaya Nusantara untuk Pembangunan Berkelanjutan'. Terbuka untuk siswa SMA dan SMK dengan penilaian konsep cerita, tipografi, dan komposisi artistik.",
      category: "DESAIN_SENI",
      level: "PROVINSI",
      targetAudience: ["SMA", "SMK"],
      registrationFee: 0,
      posterUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
      guidebookUrl: "https://puspresnas.id/panduan-fls2n-poster-2026.pdf",
      registrationUrl: "https://puspresnas.id/fls2n",
      startDate: dayjs().subtract(1, "day").toDate(),
      deadlineDate: dayjs().add(12, "day").toDate(),
      eventDate: dayjs().add(30, "day").toDate(),
      isVerified: true,
      isFeatured: false,
      viewsCount: 650,
    },
    {
      title: "National Vocational Hackathon & IoT Innovation Challenge",
      slug: "national-vocational-hackathon-iot-challenge-2026",
      organizer: "Politeknik Elektronika Negeri Surabaya (PENS) & Industri Mitra",
      description:
        "Hackathon 36 jam khusus pelajar SMK jurusan RPL, SIJA, dan TKJ untuk menciptakan purwarupa solusi Smart Agriculture dan Industry 4.0. Total hadiah 50 juta rupiah serta beasiswa perkuliahan vokasi.",
      category: "LOKAL_VOKASI",
      level: "NASIONAL",
      targetAudience: ["SMK"],
      registrationFee: 50000,
      posterUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
      guidebookUrl: "https://hackathon.pens.ac.id/guidebook-2026.pdf",
      registrationUrl: "https://hackathon.pens.ac.id/register",
      startDate: dayjs().subtract(10, "day").toDate(),
      deadlineDate: dayjs().add(5, "day").toDate(),
      eventDate: dayjs().add(20, "day").toDate(),
      isVerified: true,
      isFeatured: true,
      viewsCount: 1120,
    },
    {
      title: "Olimpiade Akuntansi dan Perbankan Syariah Pelajar Indonesia (OASIS)",
      slug: "olimpiade-akuntansi-perbankan-syariah-oasis-2026",
      organizer: "Fakultas Ekonomi dan Bisnis Universitas Airlangga",
      description:
        "Kompetisi akuntansi siklus perusahaan jasa & dagang, audit dasar, dan studi kasus perbankan syariah tingkat SMA/SMK sederajat se-Indonesia. Diikuti oleh lebih dari 300 tim dari 28 provinsi.",
      category: "BISNIS_AKUNTANSI",
      level: "NASIONAL",
      targetAudience: ["SMA", "SMK", "MA"],
      registrationFee: 75000,
      posterUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
      guidebookUrl: "https://feb.unair.ac.id/oasis2026-guidebook.pdf",
      registrationUrl: "https://oasis-unair.com/daftar",
      startDate: dayjs().subtract(7, "day").toDate(),
      deadlineDate: dayjs().add(15, "day").toDate(),
      eventDate: dayjs().add(35, "day").toDate(),
      isVerified: true,
      isFeatured: false,
      viewsCount: 540,
    },
    {
      title: "National Schools Debating Championship (NSDC) Pra-Eliminasi Wilayah",
      slug: "nsdc-pra-eliminasi-wilayah-2026",
      organizer: "Indonesian Debate Community & Kemendikbudristek",
      description:
        "Lomba debat parlemen format World Schools Style (WSDC) berbahasa Inggris. Mengasah kemampuan berpikir kritis, penguasaan isu geopolitik internasional, ekonomi global, dan retorika persuasif.",
      category: "BAHASA_DEBAT",
      level: "PROVINSI",
      targetAudience: ["SMA", "SMK", "MA"],
      registrationFee: 100000,
      posterUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
      guidebookUrl: "https://nsdc-indonesia.org/handbook-2026.pdf",
      registrationUrl: "https://nsdc-indonesia.org/registration",
      startDate: dayjs().subtract(3, "day").toDate(),
      deadlineDate: dayjs().add(22, "day").toDate(),
      eventDate: dayjs().add(50, "day").toDate(),
      isVerified: true,
      isFeatured: false,
      viewsCount: 430,
    },
  ];

  for (const item of dummyCompetitions) {
    await db.insert(competitions).values(item).onDuplicateKeyUpdate({
      set: {
        title: item.title,
        description: item.description,
        deadlineDate: item.deadlineDate,
        isVerified: true,
      },
    });
    console.log(`✓ Seeded: ${item.title}`);
  }

  console.log("Seeding 6 competitions completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
