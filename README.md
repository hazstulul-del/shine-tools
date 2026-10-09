# ⚡ SHINE TOOLS — Premium All In One Tools

**SHINE TOOLS** adalah platform web all-in-one bernuansa **Premium Mobile App Store + Futuristic Tool Platform** yang dirancang dengan estetika visual aplikasi Android modern.

---

## 🎨 Tema & Desain (Light Futuristic Glass UI)

- **Background:** `#F4F7FF`
- **Card:** `#FFFFFF`
- **Primary:** `#4C7DFF`
- **Secondary:** `#6EA8FF`
- **Success:** `#32D583`
- **Warning:** `#FFD166`
- **Karakteristik:** Sudut membulat besar (25px–35px), border halus, bayangan lembut, glass blur, gradient biru muda, dan navigasi capsule mengambang.

---

## 🚀 Fitur & Modul

### 1. 📬 Shine Mail
- Email sementara (Guerrilla Mail) + generator variasi Gmail, inbox, dan deteksi OTP/magic link.

### 2. ⚡ Alight Motion Premium
- **Step 1:** Masukkan email → Klik **Kirim Magic Link**.
- **Step 2:** Masukkan magic link dari email → Klik **Verify Premium**.
- **Kartu Premium Aktif:** Menampilkan UID, Plan (VIP Lifetime), Order ID, dan status Expired.

### 3. 🪙 NFTOKEN Generator
- Tanpa input email.
- Tombol 1-klik: **GENERATE NFTOKEN**.
- Kartu Hasil: Menampilkan kode token siap pakai dengan tombol **COPY**.
- Konverter Cookie Netflix ke tautan NFToken.

### 4. 🖥 Server Status
- Pemantauan real-time status microservice, ping latensi, uptime, dan penggunaan memori.

---

## 🛠 Panduan Instalasi Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm, pnpm, atau yarn

### Langkah Instalasi
```bash
# 1. Clone repository
git clone https://github.com/username/shine-tools.git
cd shine-tools

# 2. Salin environment variable
cp .env.example .env

# 3. Pasang dependensi
npm install

# 4. Jalankan server pengembangan
npm run dev
```

Buka peramban Anda di `http://localhost:3000`.

---

## ☁ Panduan Deploy ke Vercel

1. **Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Shine Tools"
   git branch -M main
   git remote add origin https://github.com/your-username/shine-tools.git
   git push -u origin main
   ```

2. **Deploy di Vercel Dashboard**:
   - Masuk ke [Vercel](https://vercel.com/) dan klik **Add New Project**.
   - Pilih repository GitHub Anda.
   - Framework Preset: **Vite** (sudah diatur lewat `vercel.json`).
   - Backend otomatis jalan sebagai serverless function dari `api/index.ts`.
   - Tidak perlu environment variable.
   - Klik **Deploy**.

---

## 🔒 Arsitektur Keamanan & Proxy

Platform ini menggunakan backend proxy terisolasi di `api/index.ts` (`server.ts` hanya runner lokal/panel) untuk melindungi komunikasi API pihak ketiga, mencegah paparan kredensial, menyaring header Cloudflare, dan menyediakan mekanisme *fallback resilient* ketika terjadi gangguan jaringan.

---

© 2026 ⚡ SHINE TOOLS — Premium Mobile Tools Platform.
