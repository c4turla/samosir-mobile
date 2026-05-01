# SAMOSIR Mobile 🚢
**Sistem Aplikasi Monitoring & Pelayanan Mandiri Pelabuhan (SAMOSIR)**

SAMOSIR Mobile adalah platform antarmuka berbasis web/mobile yang dirancang untuk mendigitalisasi operasional di Pelabuhan Perikanan Nusantara (PPN) Sibolga. Aplikasi ini memungkinkan pengelola kapal dan masyarakat umum untuk berinteraksi dengan layanan pelabuhan secara efisien melalui perangkat mobile.

## ✨ Fitur Utama

### 1. ⚓ Pengelolaan Multi-Armada (Vessel Manager)
*   **Vessel Switcher**: Beralih antar kapal yang dikelola dalam satu dashboard.
*   **Status Dokumen**: Monitoring masa berlaku dokumen perizinan (SIPI, SIUP, Sertifikat Kelayakan) dengan indikator real-time.
*   **Estimasi Sandar**: Informasi sisa waktu sandar kapal di dermaga.

### 👥 2. Mode Masyarakat Umum (Public Access)
*   **Informasi Komoditas**: Update stok dan estimasi harga ikan harian di pelabuhan.
*   **Manifest Kapal**: Mengetahui kapal mana yang sedang membawa muatan tertentu (Cakalang, Tuna, Udang, dll).
*   **Port Activity**: Pantau pergerakan kapal yang akan datang dan berangkat.

### 🌤️ 3. Integrasi Data Real-Time
*   **Weather API**: Data cuaca maritim spesifik lokasi PPN Sibolga menggunakan Open-Meteo API.
*   **Smart Icons**: Visualisasi kondisi cuaca (Cerah, Berawan, Hujan, Badai) secara dinamis.

### 💬 4. Sistem Komunikasi & Bantuan
*   **Role-Based Chat**: Kategori chat yang disesuaikan (Petugas/Klien untuk Pengelola, Petugas/Pengelola untuk Umum).
*   **Helpdesk Banner**: Akses cepat untuk bantuan teknis dan pembuatan tiket bantuan.

### 🌙 5. UI/UX Premium
*   **Full Dark Mode Support**: Transisi tema yang halus untuk kenyamanan penggunaan di malam hari.
*   **Modern Mobile Interface**: Dioptimalkan untuk pengalaman mobile-first menggunakan Tailwind CSS v4.

## 🚀 Tech Stack
*   **Framework**: [Vue 3](https://vuejs.org/) (Script Setup + TypeScript)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Icons**: [Lucide Vue Next](https://lucide.dev/)
*   **API**: [Open-Meteo](https://open-meteo.com/)

## 🛠️ Instalasi

1. Clone repositori:
```bash
git clone https://github.com/c4turla/samosir-mobile.git
```

2. Instal dependensi:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

---
Developed with ❤️ by **kendariweb.com**
