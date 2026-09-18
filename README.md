# Nasyid Shafai PWA 🎵

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-gold.svg)](https://dhaphreddd.github.io/Nasyid-Shafai/)
[![Vite](https://img.shields.io/badge/Vite-5.x-blue.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28.svg)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5.svg)](https://cloudinary.com/)

A modern, responsive Progressive Web App (PWA) for managing and displaying the **Nasyid Shafai** collection. Ported seamlessly from the native Android application while preserving 100% of data models, Firebase Firestore collections, and Cloudinary media hosting.

---

## ✨ Features

- 📱 **Full PWA Experience**: Installable on Android, iOS, Windows, macOS, and Linux with full auto-rotation support across orientations.
- 🌙 **Smart Dark Mode**: Built-in dark mode support that automatically follows the user's device preferences with a manual toggle.
- ⚡ **Offline First & persistent Cache**: Integrated Workbox Service Worker caching and Firestore IndexedDB persistence so previously loaded nasyids and images work completely offline without re-downloading.
- 🖼️ **Touch-Optimized Lightbox Viewer**: Gesture swipe navigation between images, touch pinch-to-zoom, pan/drag, and clean clutter-free mobile interface.
- 🔍 **Real-Time Client Search**: Instant title search filtered locally without incurring extra server database reads.
- 🔐 **Admin Authentication & RBAC**: Admin management protected via Firebase Authentication and Firestore Security Rules.
- 📤 **Safe Cloudinary Uploads**: Client-side canvas image compression (max 1280px) and unsigned upload presets ensuring API Secrets are never exposed.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS + Custom Dark Mode Theme System
- **Icons**: Lucide React
- **PWA Runtime**: `vite-plugin-pwa` + Workbox Caching
- **Backend Services**:
  - **Firebase Auth**: Admin login authentication
  - **Cloud Firestore**: Real-time Nasyid catalog & user roles
  - **Cloudinary**: CDN Image storage & URL transformation

---

## 📁 Project Structure

```
.
├── public/                     # PWA Manifest & App Icons
├── src/
│   ├── components/
│   │   ├── common/             # Header, EmptyState, LoadingSkeleton, ProtectedRoute
│   │   └── nasyid/             # NasyidCard, NasyidGrid, SearchBar, ImageLightbox
│   ├── config/
│   │   └── firebase.ts         # Firebase Web SDK & Offline Persistence
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Firebase Authentication State
│   │   └── ThemeContext.tsx    # Dark Mode System Preference Context
│   ├── pages/
│   │   ├── HomePage.tsx        # Main Catalog & Real-time Search
│   │   ├── DetailPage.tsx      # Lyrics & Media Viewer
│   │   ├── LoginPage.tsx       # Admin Authentication Page
│   │   └── AdminAddEditPage.tsx # Content Management & Upload Form
│   ├── repositories/
│   │   └── nasyidRepository.ts # Firestore Real-time Queries
│   ├── services/
│   │   └── cloudinaryService.ts # Image Compression & Cloudinary API
│   ├── types/
│   │   └── nasyid.ts           # TypeScript Type Definitions
│   ├── App.tsx                 # Client-side HashRouter
│   └── main.tsx
├── firestore.rules             # Firestore Security Rules
├── vite.config.ts              # Vite & PWA Build Configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

### 2. Installation

```bash
git clone https://github.com/dhaphreddd/Nasyid-Shafai.git
cd Nasyid-Shafai
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Firebase Web SDK Configuration
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_WEB_APP_ID

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET=YOUR_UNSIGNED_UPLOAD_PRESET
```

### 4. Running Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔒 Firestore Security Rules

Deploy the following Security Rules to your Firebase Console:

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

## 🚢 Deployment

### Deploy to GitHub Pages

```bash
npm run deploy
```

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## 📄 License

This project is licensed under the MIT License.
