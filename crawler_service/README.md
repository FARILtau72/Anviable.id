# Anviable.id — Adaptive Web Crawling & Competition Pipeline Subsystem

Sub-sistem crawler terdistribusi, adaptif, dan modular untuk **Anviable.id** (platform direktori kompetisi akademik/non-akademik di Indonesia serta team matchmaking). 

Sistem ini didesain oleh Senior Python Web Crawling Engineer dengan prinsip **Zero-AI & Zero-Paid-API dependency**: seluruh proses ekstraksi informasi lomba menggunakan pendekatan deterministik berjenjang (*multi-tier fallback*), validasi skema data ketat (Pydantic v2), deduplikasi berbasis SHA-256 fingerprint, dan penyimpanan langsung ke **TiDB Cloud Serverless**.

---

## 🏗️ 1. Arsitektur & Pola Kerja (Multi-Tier Extraction)

Sistem crawling mengadopsi mekanisme ekstraksi adaptif berbobot (*weighted confidence scoring*) agar tahan terhadap perubahan struktur DOM (*selector drift*):

```
                        [ Halaman Web Publik ]
                                   │
                                   ▼
                       [ Scrapy Engine & Spiders ]
                                   │
           ┌───────────────────────┴───────────────────────┐
           ▼                                               ▼
[ Tier 1: JSON-LD / Schema.org ]               [ Tier 2: OpenGraph & Meta ]
Event / EducationEvent                         og:title, og:description,
Score: 0.85 - 1.0                              og:image, twitter:*
           │                                   Score: 0.60 - 0.85
           │ (Fallback jika tidak ada)                     │
           └───────────────────────┬───────────────────────┘
                                   ▼
                   [ Tier 3: Indonesian RegEx Parsers ]
                   - Parsing tanggal bulan Indonesia (Jan - Des)
                   - Normalisasi biaya pendaftaran (Gratis vs IDR)
                   - Inferensi jenjang (SD, SMP, SMA, SMK, Mahasiswa)
                   - Kategori (Sains, Teknologi, Desain, Bisnis, dsb.)
                                   │
                                   ▼
                  [ Item Pipeline 1: Deduplikasi ]
                  - URL Canonicalization (strip UTM, fbclid, tracking)
                  - SHA-256 Content Fingerprint (title + org + url)
                                   │
                                   ▼
                  [ Item Pipeline 2: Pydantic v2 ]
                  - Strict typing & temporal validation
                  - Status assignment: VALIDATED vs FLAGGED_FOR_REVIEW
                                   │
                                   ▼
                  [ Item Pipeline 3: TiDB Storage ]
                  - Upsert ke `crawled_competitions_staging`
                  - Update metrik domain ke `domain_crawl_metrics`
                                   │
                                   ▼
                   [ FastAPI Management & Review ]
                   - Review dashboard, approval, & monitoring
```

### Fallback JavaScript / SPA (Dynamic Fallback)
Jika halaman yang di-crawl terdeteksi sebagai Client-Side Rendered (CSR / Single Page Application) dengan kerangka `<div id="root"></div>` atau `<div id="__next"></div>` yang kosong, `DynamicRenderFallbackMiddleware` secara otomatis mengalihkan request ke **Playwright Chromium headless** untuk mengeksekusi JavaScript sebelum diekstraksi.

---

## 📁 2. Struktur Direktori

```
crawler_service/
├── .env                              # Kredensial TiDB Cloud & parameter crawler
├── .env.example                      # Template konfigurasi environment
├── pyproject.toml                    # Konfigurasi dependensi & pytest
├── requirements.txt                  # Daftar pustaka pip
├── scrapy.cfg                        # Konfigurasi Scrapy CLI
├── crawler/
│   ├── items.py                      # Definisi item Scrapy (CompetitionRawItem)
│   ├── settings.py                   # Kebijakan rate-limiting, pipelines, middlewares
│   ├── api/
│   │   └── main.py                   # REST API FastAPI untuk review & integrasi Anviable
│   ├── extractors/
│   │   ├── base.py                   # Base class multi-tier extractor
│   │   ├── jsonld.py                 # Extractor Tier 1: Schema.org Event/EducationEvent
│   │   ├── opengraph.py              # Extractor Tier 2: OpenGraph & meta tags
│   │   └── regex_parsers.py          # Extractor Tier 3: NLP/RegEx bahasa Indonesia
│   ├── middlewares/
│   │   ├── rate_limit.py             # Domain politeness throttle & 429/503 backoff
│   │   ├── dynamic_fallback.py       # Deteksi SPA & pemicu Playwright
│   │   └── error_classifier.py       # Klasifikasi error HTTP, DNS, & timeout
│   ├── pipelines/
│   │   ├── deduplication.py          # Pembersihan parameter UTM & SHA-256 fingerprint
│   │   ├── validation.py             # Validasi skema & status Pydantic
│   │   └── storage.py                # Upsert ke TiDB Cloud Serverless
│   ├── schedulers/
│   │   └── runner.py                 # Runner cron/interval periodik (APScheduler)
│   ├── spiders/
│   │   ├── base.py                   # BaseCompetitionSpider kompatibel Scrapy 2.13+
│   │   ├── fixture_spider.py         # Spider offline/fixture end-to-end integration
│   │   └── sample_competition_spider.py # Spider portal pengumuman lomba nasional (Puspresnas)
│   ├── storage/
│   │   ├── database.py               # SQLAlchemy engine & SSL connection pool ke TiDB
│   │   └── models.py                 # Definisi tabel staging & domain metrics
│   └── validators/
│       └── schemas.py                # Schema Pydantic v2 untuk kompetisi
└── tests/
    ├── fixtures/                     # File HTML contoh uji coba (JSON-LD, OG, Messy)
    ├── test_api.py                   # Automated tests FastAPI endpoints
    ├── test_extractors.py            # Automated tests extractors & regex parsers
    └── test_pipelines.py             # Automated tests deduplication & validation
```

---

## ⚙️ 3. Konfigurasi Environment (`.env`)

Pastikan file `.env` sudah terisi dengan kredensial TiDB Cloud:

```ini
# Environment
CRAWLER_ENV=development
LOG_LEVEL=INFO

# Storage - TiDB Cloud Serverless Connection
TIDB_HOST=gateway03.us-west-2.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=your_tidb_user_here
TIDB_PASSWORD=your_tidb_password_here
TIDB_DATABASE=your_database_name
DATABASE_URL=mysql+pymysql://your_tidb_user:your_tidb_password@gateway03.us-west-2.prod.aws.tidbcloud.com:4000/your_database_name?ssl_verify_cert=true

# Crawler Engine Politeness & Compliance
ROBOTSTXT_OBEY=true
CONCURRENT_REQUESTS_PER_DOMAIN=2
DOWNLOAD_DELAY=2.0
AUTOTHROTTLE_ENABLED=true
AUTOTHROTTLE_START_DELAY=2.0
AUTOTHROTTLE_MAX_DELAY=15.0

# API Service
API_HOST=0.0.0.0
API_PORT=8000
```

---

## 🚀 4. Cara Menjalankan

### A. Menjalankan Spider Scrapy

1. **Uji Coba Integrasi Pipeline End-to-End (Offline Fixtures):**
   ```bash
   scrapy crawl fixture_spider
   ```
   Spider ini akan memproses 3 varian HTML (JSON-LD, OpenGraph, Messy HTML), memvalidasi via Pydantic, dan melakukan upsert langsung ke TiDB Cloud.

2. **Menjalankan Spider Portal Lomba Publik (Pusat Prestasi Nasional Kemdikbud):**
   ```bash
   scrapy crawl puspresnas_spider
   ```
   *Catatan: Spider secara ketat mematuhi robots.txt target dan menerapkan politeness delay 2-3 detik per request.*

### B. Menjalankan Scheduler Periodik (APScheduler)

Untuk menjalankan crawling secara terjadwal otomatis di background:
```bash
python -m crawler.schedulers.runner
```
*Secara default menjalankan rotasi spider setiap 12 jam (bisa disesuaikan pada file runner).*

### C. Menjalankan Management & Review API (FastAPI)

Untuk menghubungkan data hasil staging dengan backend Anviable.id:
```bash
uvicorn crawler.api.main:app --host 0.0.0.0 --port 8000 --reload
```
Akses dokumentasi interaktif Swagger UI di:
👉 **http://localhost:8000/docs**

#### Endpoint Utama:
- `GET /health` : Memeriksa kesehatan crawler service dan status koneksi TiDB Cloud.
- `GET /api/competitions/staging?status=VALIDATED&limit=50` : Mengambil data lomba yang telah diekstrak dan siap direview/dipublish.
- `POST /api/competitions/{id}/approve` : Menyetujui lomba dari staging untuk tampil di direktori publik `VERIFIED_ACTIVE`.
- `GET /api/monitoring/domains` : Melihat rekap metrik kesehatan domain (jumlah sukses, gagal, rate-limited, status code terakhir).

### D. Menjalankan Automated Test Suite

Jalankan rangkaian pengujian otomatis lengkap (14 test cases):
```bash
pytest tests -v
```

---

## ⚖️ 5. Kepatuhan Hukum & Etika Web Crawling

Sistem crawler Anviable.id dibangun di atas etika rekayasa data yang ketat:

1. **Kepatuhan `robots.txt`**: Engine menghormati direktif `User-agent: *` dan `Disallow` dari setiap domain target. Request otomatis dibatalkan jika dilarang.
2. **Identitas Bot Transparan**: Setiap HTTP request mengirimkan User-Agent resmi:
   ```
   AnviableBot/1.0 (+https://anviable.id/bot; media-partner competition indexer; bot@anviable.id)
   ```
3. **Pencegahan Overload Server Target**: Menggunakan `AutoThrottle` dan `DomainPolitenessMiddleware` dengan minimal jeda 2.0 detik antar request dan concurrency maksimal 2 request per host.
4. **Respon Cerdas Rate-Limiting**: Jika menerima kode `HTTP 429 (Too Many Requests)` atau `HTTP 503 (Service Unavailable)`, delay domain otomatis dinaikkan secara eksponensial hingga 60 detik.
5. **Batasan Sistem (System Boundaries)**:
   - Crawler **TIDAK** melakukan bypass halaman login / autentikasi pribadi.
   - Crawler **TIDAK** memecahkan atau membypass CAPTCHA / Cloudflare Turnstile.
   - Crawler **TIDAK** melakukan scraping bot tidak resmi pada platform terproteksi berat seperti Instagram API tertutup.
   - Semua data tersimpan di tabel staging untuk proses kurasi dan verifikasi sebelum dipublikasikan ke pencari lomba.
