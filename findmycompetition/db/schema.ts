import {
  mysqlTable,
  varchar,
  text,
  int,
  float,
  boolean,
  timestamp,
  mysqlEnum,
  json,
  index,
} from "drizzle-orm/mysql-core";

export const categoryEnum = [
  "TEKNOLOGI_RPL",
  "DESAIN_SENI",
  "SAINS_MATEMATIKA",
  "BISNIS_AKUNTANSI",
  "BAHASA_DEBAT",
  "LOKAL_VOKASI",
  "UMUM",
] as const;

export const levelEnum = [
  "KOTA_KABUPATEN",
  "PROVINSI",
  "NASIONAL",
  "INTERNASIONAL",
] as const;

export type Category = (typeof categoryEnum)[number];
export type Level = (typeof levelEnum)[number];

export const competitions = mysqlTable(
  "competitions",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    organizer: varchar("organizer", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: mysqlEnum("category", [...categoryEnum]).notNull(),
    level: mysqlEnum("level", [...levelEnum]).notNull(),
    targetAudience: json("target_audience").$type<string[]>().notNull(),
    registrationFee: int("registration_fee").default(0).notNull(),
    posterUrl: varchar("poster_url", { length: 500 }),
    guidebookUrl: varchar("guidebook_url", { length: 500 }),
    registrationUrl: varchar("registration_url", { length: 500 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    deadlineDate: timestamp("deadline_date").notNull(),
    eventDate: timestamp("event_date"),
    isVerified: boolean("is_verified").default(false).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    viewsCount: int("views_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    categoryLevelIdx: index("category_level_idx").on(
      table.category,
      table.level
    ),
    deadlineIdx: index("deadline_idx").on(table.deadlineDate),
  })
);

export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;

export const teamPostings = mysqlTable(
  "team_postings",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    competitionId: varchar("competition_id", { length: 191 }),
    competitionTitle: varchar("competition_title", { length: 255 }).notNull(),
    teamName: varchar("team_name", { length: 255 }).notNull(),
    leaderName: varchar("leader_name", { length: 255 }).notNull(),
    schoolName: varchar("school_name", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    rolesNeeded: json("roles_needed").$type<string[]>().notNull(),
    description: text("description").notNull(),
    workFormat: varchar("work_format", { length: 50 }).default("ONLINE").notNull(),
    contactChannel: varchar("contact_channel", { length: 50 }).default("WHATSAPP").notNull(),
    contactInfo: varchar("contact_info", { length: 255 }).notNull(),
    membersCount: int("members_count").default(1).notNull(),
    maxMembers: int("max_members").default(3).notNull(),
    status: varchar("status", { length: 20 }).default("OPEN").notNull(),
    managePin: varchar("manage_pin", { length: 20 }).default("1234").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("team_status_idx").on(table.status),
    createdAtIdx: index("team_created_idx").on(table.createdAt),
  })
);

export type TeamPosting = typeof teamPostings.$inferSelect;
export type NewTeamPosting = typeof teamPostings.$inferInsert;

export const talentProfiles = mysqlTable(
  "talent_profiles",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    schoolName: varchar("school_name", { length: 255 }).notNull(),
    gradeLevel: varchar("grade_level", { length: 50 }).notNull(),
    major: varchar("major", { length: 100 }).notNull(),
    skills: json("skills").$type<string[]>().notNull(),
    bio: text("bio").notNull(),
    achievements: text("achievements"),
    portfolioUrl: varchar("portfolio_url", { length: 500 }),
    contactChannel: varchar("contact_channel", { length: 50 }).default("WHATSAPP").notNull(),
    contactInfo: varchar("contact_info", { length: 255 }).notNull(),
    status: varchar("status", { length: 20 }).default("AVAILABLE").notNull(),
    managePin: varchar("manage_pin", { length: 20 }).default("1234").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("talent_status_idx").on(table.status),
    createdAtIdx: index("talent_created_idx").on(table.createdAt),
  })
);

export type TalentProfile = typeof talentProfiles.$inferSelect;
export type NewTalentProfile = typeof talentProfiles.$inferInsert;

export const teamApplications = mysqlTable(
  "team_applications",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamPostingId: varchar("team_posting_id", { length: 191 }).notNull(),
    applicantName: varchar("applicant_name", { length: 255 }).notNull(),
    schoolName: varchar("school_name", { length: 255 }).notNull(),
    roleApplied: varchar("role_applied", { length: 100 }).notNull(),
    message: text("message").notNull(),
    contactInfo: varchar("contact_info", { length: 255 }).notNull(),
    portfolioUrl: varchar("portfolio_url", { length: 500 }),
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    teamIdx: index("app_team_idx").on(table.teamPostingId),
    createdAtIdx: index("app_created_idx").on(table.createdAt),
  })
);

export type TeamApplication = typeof teamApplications.$inferSelect;
export type NewTeamApplication = typeof teamApplications.$inferInsert;

export const crawledCompetitionsStaging = mysqlTable(
  "crawled_competitions_staging",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    canonicalUrl: varchar("canonical_url", { length: 500 }).notNull(),
    sourceUrl: varchar("source_url", { length: 500 }).notNull(),
    fingerprint: varchar("fingerprint", { length: 64 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    organizer: varchar("organizer", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(),
    targetLevels: json("target_levels").$type<string[]>().notNull(),
    startDate: timestamp("start_date"),
    deadlineDate: timestamp("deadline_date"),
    eventDate: timestamp("event_date"),
    registrationFee: int("registration_fee"),
    prizePool: varchar("prize_pool", { length: 255 }),
    registrationUrl: varchar("registration_url", { length: 500 }),
    officialGuideUrl: varchar("official_guide_url", { length: 500 }),
    posterUrl: varchar("poster_url", { length: 500 }),
    extractionTier: varchar("extraction_tier", { length: 50 }).notNull(),
    extractionScore: float("extraction_score").notNull(),
    domain: varchar("domain", { length: 100 }).notNull(),
    status: varchar("status", { length: 30 }).notNull(),
    validationNotes: json("validation_notes").$type<string[]>(),
    extractedAt: timestamp("extracted_at").notNull(),
    lastVerifiedAt: timestamp("last_verified_at").notNull(),
  }
);

export type CrawledCompetitionStaging = typeof crawledCompetitionsStaging.$inferSelect;

export const domainCrawlMetrics = mysqlTable("domain_crawl_metrics", {
  id: int("id").primaryKey().autoincrement(),
  domain: varchar("domain", { length: 100 }).notNull().unique(),
  totalCrawled: int("total_crawled").default(0).notNull(),
  totalSuccess: int("total_success").default(0).notNull(),
  totalFailed: int("total_failed").default(0).notNull(),
  totalRateLimited: int("total_rate_limited").default(0).notNull(),
  lastCrawlAt: timestamp("last_crawl_at"),
  lastStatusCode: int("last_status_code"),
});

export type DomainCrawlMetric = typeof domainCrawlMetrics.$inferSelect;
