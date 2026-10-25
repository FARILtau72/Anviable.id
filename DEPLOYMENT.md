# Panduan Deployment Naviable.id ke VPS (Zero-Leak Security)

Dokumen ini berisi panduan komprehensif untuk mendorong (*push*) kode sumber ke GitHub dan melakukan *deployment* ke Virtual Private Server (VPS) secara aman tanpa ada kredensial atau *environment variables* yang bocor ke publik.

---

## 🔒 1. Kebijakan Keamanan (Zero-Leak Policy)

File `.env` berisi informasi sensitif seperti *password* TiDB Cloud Serverless dan kunci akses admin. 

* **File `.env` TIDAK PERNAH di-push ke GitHub**.
* Semua file `.env*` lokal telah dikunci rapat oleh `.gitignore` di tingkat *root*, folder `findmycompetition`, maupun `crawler_service`.
* Yang di-push ke GitHub hanyalah file cetak biru template:
  * `findmycompetition/.env.example`
  * `crawler_service/.env.example`
* Di server VPS, file `.env` dibuat secara manual atau disalin dari `.env.example` dan diisi kredensial rahasia langsung di dalam VPS.

---

## 🚀 2. Langkah Push ke GitHub Repository

Jalankan perintah berikut di terminal komputer lokal Anda (pada direktori proyek `FINDMYCOMPE`):

```bash
# 1. Pastikan status git bersih dan periksa file yang akan di-stage
git status

# 2. Tambahkan semua file yang aman ke staging
git add .

# 3. Verifikasi sekali lagi bahwa TIDAK ADA file .env yang masuk ke staging
git status
# (Pastikan hanya .env.example yang muncul, bukan .env asli)

# 4. Buat commit pertama
git commit -m "feat: initial commit Naviable.id platform and crawler service"

# 5. Pastikan branch utama bernama main
git branch -M main

# 6. Push kode ke GitHub
git push -u origin main
```

---

## 🖥️ 3. Persiapan Server VPS (Ubuntu 22.04 / 24.04 LTS)

Masuk ke VPS via SSH:
```bash
ssh user@IP_VPS_ANDA
```

Perbarui paket sistem:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw
```

---

## 🐳 4. Opsi Deployment A: Menggunakan Docker Compose (Sangat Direkomendasikan)

Metode ini paling praktis, bersih, dan memisahkan lingkungan Next.js serta Python Scrapy dalam kontainer terisolasi.

### Langkah 1: Pasang Docker & Docker Compose di VPS
```bash
# Install Docker Engine & Compose plugin
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### Langkah 2: Clone Repository
```bash
cd ~
git clone https://github.com/FARILtau72/Anviable.id.git anviable
cd anviable
```

### Langkah 3: Siapkan Environment Variables di VPS
Salin template `.env.example` ke `.env` asli:

```bash
# 1. Environment Web (Next.js)
cp findmycompetition/.env.example findmycompetition/.env
nano findmycompetition/.env

# Masukkan kredensial database TiDB Cloud asli & password admin Anda:
# DATABASE_URL="mysql://2RDkE8SSJ9asYGH.root:4ExRLXVwSLBAsEDZ@gateway03.us-west-2.prod.aws.tidbcloud.com:4000/test"
# ADMIN_PASSWORD="PasswordKuatAdminAnda"
# NEXT_PUBLIC_APP_URL="https://naviable.id"
```

```bash
# 2. Environment Crawler (Scrapy & FastAPI)
cp crawler_service/.env.example crawler_service/.env
nano crawler_service/.env

# Masukkan kredensial database TiDB Cloud asli:
# DATABASE_URL=mysql+pymysql://2RDkE8SSJ9asYGH.root:4ExRLXVwSLBAsEDZ@gateway03.us-west-2.prod.aws.tidbcloud.com:4000/test?ssl_verify_cert=true
```

### Langkah 4: Bangun & Jalankan Kontainer
```bash
docker compose up -d --build
```

Periksa kontainer yang berjalan:
```bash
docker compose ps
# naviable_web     -> Port 3000
# naviable_crawler -> Port 8000
```

Untuk melihat log:
```bash
docker compose logs -f web
docker compose logs -f crawler
```

---

## ⚙️ 5. Opsi Deployment B: Native Menggunakan PM2 + Nginx (Tanpa Docker)

Jika Anda lebih memilih menjalankan aplikasi langsung di host VPS:

### Langkah 1: Install Node.js 20, pnpm, & Python 3.11/3.12
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs python3 python3-pip python3-venv

# Install pnpm & PM2 secara global
sudo npm install -g pnpm pm2
```

### Langkah 2: Build Aplikasi Web Next.js
```bash
cd ~/anviable/findmycompetition
cp .env.example .env
nano .env # Isi kredensial TiDB & ADMIN_PASSWORD

pnpm install
pnpm build
```

### Langkah 3: Setup Virtualenv untuk Crawler Service
```bash
cd ~/anviable/crawler_service
cp .env.example .env
nano .env # Isi kredensial TiDB

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

### Langkah 4: Jalankan Semua Layanan dengan PM2
Pada folder utama `~/anviable`:
```bash
cd ~/anviable
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🌐 6. Konfigurasi Domain & Nginx Reverse Proxy dengan SSL (HTTPS)

Pasang Nginx & Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Buat konfigurasi virtual host:
```bash
sudo nano /etc/nginx/sites-available/naviable
```

Isi dengan konfigurasi berikut (ganti `naviable.id` dengan domain/subdomain Anda):
```nginx
server {
    server_name naviable.id www.naviable.id;

    # Frontend Next.js Web App
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Backend Crawler Service (Opsional jika ingin diekspos)
    location /crawler-api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi dan uji Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/naviable /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Pasang Sertifikat SSL Gratis (Let's Encrypt):
```bash
sudo certbot --nginx -d naviable.id -d www.naviable.id
```

Selesai! Website Naviable.id kini aktif di HTTPS dengan proteksi kredensial penuh.
