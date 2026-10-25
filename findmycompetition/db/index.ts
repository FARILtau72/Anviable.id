import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var _dbPool: mysql.Pool | undefined;
}

function createResilientPool(): mysql.Pool {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 2000,
    idleTimeout: 15000,
    maxIdle: 1,
    connectTimeout: 10000,
  });

  return pool;
}

function getPool(): mysql.Pool {
  if (!globalThis._dbPool) {
    globalThis._dbPool = createResilientPool();
  }
  return globalThis._dbPool;
}

export const db = drizzle(getPool(), { schema, mode: "default" });

/**
 * Resilient query wrapper that guarantees automatic retry if a serverless connection drops.
 */
export async function withDbRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (
      retries > 0 &&
      (err?.code === "ECONNRESET" ||
        err?.code === "PROTOCOL_CONNECTION_LOST" ||
        err?.code === "ETIMEDOUT" ||
        err?.message?.includes("ECONNRESET") ||
        err?.message?.includes("Connection lost"))
    ) {
      console.warn(`Database connection dropped (${err.code}), retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return withDbRetry(fn, retries - 1);
    }
    throw err;
  }
}

let _matchmakingTablesInitialized = false;

/**
 * Ensures team_postings, talent_profiles, and team_applications tables exist in TiDB.
 */
export async function ensureMatchmakingTables(): Promise<void> {
  if (_matchmakingTablesInitialized) return;

  const pool = getPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS team_postings (
        id VARCHAR(191) PRIMARY KEY,
        competition_id VARCHAR(191),
        competition_title VARCHAR(255) NOT NULL,
        team_name VARCHAR(255) NOT NULL,
        leader_name VARCHAR(255) NOT NULL,
        school_name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        roles_needed JSON NOT NULL,
        description TEXT NOT NULL,
        work_format VARCHAR(50) NOT NULL DEFAULT 'ONLINE',
        contact_channel VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP',
        contact_info VARCHAR(255) NOT NULL,
        members_count INT NOT NULL DEFAULT 1,
        max_members INT NOT NULL DEFAULT 3,
        status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX team_status_idx (status),
        INDEX team_created_idx (created_at)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS talent_profiles (
        id VARCHAR(191) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        school_name VARCHAR(255) NOT NULL,
        grade_level VARCHAR(50) NOT NULL,
        major VARCHAR(100) NOT NULL,
        skills JSON NOT NULL,
        bio TEXT NOT NULL,
        achievements TEXT,
        portfolio_url VARCHAR(500),
        contact_channel VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP',
        contact_info VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX talent_status_idx (status),
        INDEX talent_created_idx (created_at)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS team_applications (
        id VARCHAR(191) PRIMARY KEY,
        team_posting_id VARCHAR(191) NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        school_name VARCHAR(255) NOT NULL,
        role_applied VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        contact_info VARCHAR(255) NOT NULL,
        portfolio_url VARCHAR(500),
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX app_team_idx (team_posting_id),
        INDEX app_created_idx (created_at)
      );
    `);

    // Check if team_postings has any data, seed 3 initial realistic postings if empty
    const [rows]: any = await pool.query(`SELECT COUNT(*) as cnt FROM team_postings`);
    const count = rows[0]?.cnt || 0;
    if (count === 0) {
      await pool.query(`
        INSERT INTO team_postings (
          id, competition_id, competition_title, team_name, leader_name,
          school_name, city, roles_needed, description, work_format,
          contact_channel, contact_info, members_count, max_members, status
        ) VALUES 
        (
          'team-iot-pens-2026',
          'national-vocational-hackathon-iot-challenge-2026',
          'National Vocational Hackathon & IoT Innovation Challenge',
          'IoT AgroTech Innovators',
          'Nicky Arsenta',
          'SMKN 1 Cimahi',
          'Bandung / Cimahi',
          '["UI/UX Designer", "Embedded Hardware (ESP32/LoRa)"]',
          'Kami sedang mengembangkan prototipe Smart Agriculture bertenaga ESP32 & LoRaWAN untuk monitoring nutrisi hidroponik otomatis. Backend REST API sudah siap, butuh rekan desain antarmuka mobile di Figma dan wiring sensor.',
          'ONLINE',
          'WHATSAPP',
          '0812-3456-7890',
          2,
          4,
          'OPEN'
        ),
        (
          'team-lkti-nanoplastik',
          'osn-bidang-informatika-komputer-2026',
          'Olimpiade Riset & LKTI Sains Nasional Puspresnas',
          'Biodegradable Lab Squad',
          'Clarissa Putri',
          'SMAN 3 Yogyakarta',
          'Yogyakarta',
          '["Data Analyst (Python / SPSS)", "Literatur Reviewer"]',
          'Draft riset degradasi nanoplastik menggunakan bakteri indigenous laut selatan sudah 60% dan telah uji coba lab primer. Mencari rekan untuk analisis visualisasi data statistik dan perapihan sitasi jurnal IEEE/Scopus.',
          'HYBRID',
          'TELEGRAM',
          '@clarissaputri_lkti',
          2,
          3,
          'OPEN'
        ),
        (
          'team-debat-nsdc-2026',
          'nsdc-pra-eliminasi-wilayah-2026',
          'National Schools Debating Championship (NSDC) Pra-Eliminasi',
          'Vanguard Parliamentary Debaters',
          'Daris Pratama',
          'SMAN 1 Surabaya',
          'Surabaya',
          '["2nd Substantive Speaker", "Reply Speaker (WSDC Style)"]',
          'Mempersiapkan tim debat bahasa Inggris kompetitif format World Schools Style untuk seleksi tingkat provinsi Jatim. Siap latihan motion sparring 2x seminggu via Discord.',
          'ONLINE',
          'DISCORD',
          'daris_debater#4521',
          1,
          3,
          'OPEN'
        );
      `);

      await pool.query(`
        INSERT INTO talent_profiles (
          id, full_name, school_name, grade_level, major, skills,
          bio, achievements, portfolio_url, contact_channel, contact_info, status
        ) VALUES
        (
          'talent-fajar-nugraha',
          'Fajar Nugraha',
          'SMKN 2 Surabaya',
          'Kelas 12 SMK',
          'Rekayasa Perangkat Lunak',
          '["Next.js", "TypeScript", "Tailwind CSS", "MySQL", "Git"]',
          'Fullstack web developer muda dengan pengalaman juara 2 LKS SMK tingkat Jawa Timur. Siap begadang dan agile dalam tim hackathon.',
          'Juara 2 LKS SMK Web Technologies Jatim 2025; Finalis CompFest 16',
          'https://github.com/fajarnugraha-dev',
          'WHATSAPP',
          '0856-7891-2345',
          'AVAILABLE'
        ),
        (
          'talent-alya-salsabila',
          'Alya Salsabila',
          'SMAN 8 Jakarta',
          'Kelas 11 SMA',
          'MIPA & Seni Desain',
          '["Figma", "UI/UX Research", "Pitch Deck Design", "Prototyping"]',
          'UI/UX designer antusias yang terbiasa mendesain aplikasi mobile dan pitch deck startup pelajar. Terbiasa kolaborasi lintas sekolah.',
          'Best Pitch Deck Presentation di SchoolPreneur Summit 2025',
          'https://behance.net/alyasalsabila',
          'TELEGRAM',
          '@alyasalsa_ui',
          'AVAILABLE'
        ),
        (
          'talent-bima-aditya',
          'Bima Aditya',
          'SMA Taruna Nusantara',
          'Kelas 11 SMA',
          'MIPA',
          '["Python", "Machine Learning", "Pandas", "Matematika OSN"]',
          'Peraih medali perunggu KSN Matematika 2024. Mahir Python data science untuk riset LKTI dan machine learning competition.',
          'Medali Perunggu OSN Matematika SMA 2024; Juara 1 Cerdas Cermat Sains UGM',
          'https://linkedin.com/in/bimaaditya-tn',
          'DISCORD',
          'bima_data#8812',
          'AVAILABLE'
        );
      `);
    }

    _matchmakingTablesInitialized = true;
  } catch (err: any) {
    console.warn("ensureMatchmakingTables non-fatal notice:", err?.message || err);
  }
}
