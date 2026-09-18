# Nasyid As-Shafa PWA 🎵

Progressive Web App (PWA) modern untuk koleksi **Nasyid As-Shafa**, di-porting secara 1:1 dari aplikasi Android asli dengan antarmuka yang responsive, cepat, ringan, installable, dan 100% menggunakan backend gratis (Firebase Authentication + Cloud Firestore + Cloudinary).

---

## ✨ Fitur Utama

- 📱 **Progressive Web App (PWA)**: Dapat diinstall di Android, iOS, Windows, macOS, dan Linux.
- 📶 **Offline Shell Support**: Aplikasi tetap dapat dibuka saat tidak ada jaringan internet.
- 🎵 **Koleksi & Detail Nasyid**: Menampilkan judul, lirik, dan galeri gambar nasyid.
- 🖼️ **Image Slider & Lightbox Zoom**: Dilengkapi gesture pinch-to-zoom di touchscreen, mouse wheel zoom, pan/drag pada desktop, serta navigasi keyboard.
- 🔍 **Pencarian Real-Time**: Filtering judul nasyid secara instan client-side tanpa memboroskan Firestore read.
- 🔐 **Autentikasi Admin & Security**: Admin login menggunakan Firebase Authentication & Role-Based Access Control (RBAC) via document `users/{uid}`.
- 🛠️ **Manajemen Konten Admin**: Admin dapat menambah, mengedit, menghapus nasyid, mengunggah gambar ke Cloudinary, dan mengatur urutan gambar (reorder).
- ⚡ **Optimasi Cloudinary**: Kompresi otomatis di browser sebelum upload (max width 1280px) dan transformasi URL otomatis untuk thumbnail card (`c_fill,w_600,h_400`).

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Warna Tema: Gold `#FFD700` & Dark Primary `#212121`)
- **Icons**: Lucide React
- **PWA Integration**: `vite-plugin-pwa` + Webmanifest + Service Worker
- **Backend Services**:
  - **Firebase Authentication**: Login Admin
  - **Cloud Firestore**: Database koleksi nasyid & perolehan role user
  - **Cloudinary**: Storage & CDN gambar via Unsigned Upload Preset

---

## 📁 Struktur Project

```
d:\Code\Nasyid-Shafai\
├── public/                     # Asset publik PWA (Manifest, Icons)
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── maskable-icon.png
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   │   ├── common/             # Header, EmptyState, LoadingSkeleton, ProtectedRoute
│   │   └── nasyid/             # NasyidCard, NasyidGrid, SearchBar, ImageLightbox
│   ├── config/
│   │   └── firebase.ts         # Inisialisasi Firebase Web SDK v10
│   ├── contexts/
│   │   └── AuthContext.tsx     # Context Auth & Verifikasi Role Admin
│   ├── pages/
│   │   ├── HomePage.tsx        # Halaman Utama (Daftar & Search)
│   │   ├── DetailPage.tsx      # Detail Lirik & Viewer Gambar
│   │   ├── LoginPage.tsx       # Form Login Admin
│   │   └── AdminAddEditPage.tsx # Form Tambah/Edit Nasyid Admin
│   ├── repositories/
│   │   └── nasyidRepository.ts # Service query Firestore (Real-time listener)
│   ├── services/
│   │   └── cloudinaryService.ts # Unsigned Upload & URL transformation Cloudinary
│   ├── types/
│   │   └── nasyid.ts           # Interface TypeScript Nasyid & User
│   ├── index.css
│   ├── App.tsx                 # Client-side HashRouter
│   └── main.tsx
├── firestore.rules             # Aturan Keamanan Firestore
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── .env.example
└── README.md
```

---

## 🚀 Cara Install & Jalankan Lokal

### 1. Prerequisites
- Node.js versi 18+ atau 20+
- npm atau yarn

### 2. Clone / Buka Project
```bash
cd d:\Code\Nasyid-Shafai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Konfigurasi Environment Variables (`.env`)
Salin file `.env.example` menjadi `.env` di root project:
```bash
cp .env.example .env
```

Isi variabel environment sesuai dengan credential Firebase & Cloudinary project Anda:
```env
# Firebase Web SDK Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nasyidappv2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nasyidappv2
VITE_FIREBASE_STORAGE_BUCKET=nasyidappv2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=174841572485
VITE_FIREBASE_APP_ID=1:174841572485:android:...

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dstgxr0ui
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### 5. Jalankan Local Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

---

## 🌐 Menghubungkan Firebase & Cloudinary Existing

### 1. Connecting Firebase Existing
Project PWA ini membaca database Firestore dan autentikasi dari project Firebase Android existing (`nasyidappv2`).
- Collection `nasyid`: Menyimpan data nasyid.
- Collection `users`: Menyimpan data role user (`{ uid, email, role: 'admin' }`).

### 2. Cloudinary Unsigned Upload Configuration
Agar frontend web dapat mengunggah gambar tanpa membocorkan `API Secret`:
1. Buka [Cloudinary Console](https://cloudinary.com/console).
2. Masuk ke **Settings** > **Upload** > **Upload presets**.
3. Pastikan terdapat Unsigned Upload Preset (misal `ml_default`) atau buat preset baru dengan Signing Mode = `Unsigned`.
4. Isikan nama preset tersebut pada `VITE_CLOUDINARY_UPLOAD_PRESET` di file `.env`.

---

## 🔒 Security Rules (Firestore Rules)

Gunakan aturan berikut di Firebase Console > Firestore Database > Rules untuk mengamankan data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /nasyid/{document} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }
  }
}
```

---

## 🚢 Panduan Deployment Gratis

### Option A: Deploy ke GitHub Pages (Rekomendasi)

1. Pastikan project menggunakan `HashRouter` (sudah terkonfigurasi secara bawaan di `src/App.tsx`).
2. Build project production:
   ```bash
   npm run build
   ```
3. Gunakan package `gh-pages` untuk melakukan publish folder `dist`:
   ```bash
   npx gh-pages -d dist
   ```

### Option B: Deploy ke Firebase Hosting Free Tier

1. Install Firebase CLI (jika belum ada):
   ```bash
   npm install -g firebase-tools
   ```
2. Inisialisasi Firebase Hosting di root project:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Pilih project Firebase existing (`nasyidappv2`)
   - Isikan Public directory: `dist`
   - Configure as a single-page app: `Yes`
3. Build dan Deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 📲 Cara Install PWA di Perangkat

- **Android (Chrome / Edge / Brave)**: Buka website PWA, klik menu tiga titik `⋮` > pilih **"Add to Home screen"** / **"Install app"**.
- **iOS / iPhone / iPad (Safari)**: Buka website PWA di Safari, tekan tombol **Share** > pilih **"Add to Home Screen"**.
- **Windows / macOS / Linux (Chrome / Edge)**: Klik ikon install `⊕` pada address bar browser > pilih **Install**.

---

## 💰 Batasan Free Tier & Hal yang Perlu Diperhatikan Agar Tetap Gratis

Aplikasi ini dirancang 100% menggunakan Free Tier layanan cloud:

1. **Firebase Firestore Free Tier**:
   - Limit: 50.000 Reads / hari, 20.000 Writes / hari, 20.000 Deletes / hari, 1 GiB Storage.
   - PWA ini telah dioptimasi dengan filtering search client-side pada data snapshot yang telah diambil, sehingga tidak melakukan query berulang setiap mengetik karakter.

2. **Cloudinary Free Tier**:
   - Limit: 25 Credits / bulan (~25 GB bandwidth / storage).
   - PWA ini mengkompresi gambar sebelum upload (max width 1280px, quality 70%) dan menggunakan URL transformation untuk thumbnail card (`c_fill,w_600,h_400`), menghemat bandwidth hingga 80%.

3. **Hal yang TIDAK Boleh Dilakukan**:
   - Jangan pernah menyertakan `API Secret` Cloudinary di kode JavaScript frontend.
   - Jangan mengubah listener Firestore menjadi polling berulang dengan interval singkat.
   - Jangan mengunggah file gambar original berukuran > 10MB tanpa kompresi client-side.
