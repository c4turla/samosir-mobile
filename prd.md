# Product Requirements Document (PRD) - Aplikasi Mobile SAMOSIR

## 1. Pendahuluan
**Nama Produk:** SAMOSIR APPS
**Versi:** 3.0
**Tujuan Dokumen:** Menjabarkan spesifikasi fungsionalitas aplikasi mobile yang berfokus pada pelayanan mandiri, transparansi informasi, dan komunikasi real-time bagi pengguna di luar otoritas pelabuhan.
**Latar Belakang:** Untuk melengkapi sistem web SAMOSIR yang digunakan internal petugas, aplikasi mobile ini hadir sebagai *front-end* bagi mitra pelabuhan dan publik guna mempercepat alur pelaporan dan mempererat interaksi antar stakeholder melalui perangkat smartphone.

---

## 2. Sasaran Pengguna (Target Audience)
1.  **Pengelola/Nahkoda Kapal (Vessel Manager/Skipper):**
    *   Tanggung Jawab: Melaporkan pergerakan kapal, mengelola dokumen armada, dan memantau status persetujuan.
2.  **Masyarakat Umum (Public User):**
    *   Tanggung Jawab: Mencari informasi jadwal, memantau aktivitas pelabuhan, dan berinteraksi dengan pengelola kapal/petugas.

---

## 3. Arsitektur Platform & Teknologi
*   **Framework:** Vue JS + Capacitor JS.
*   **Backend:** Laravel 11 (RESTful API dengan Laravel Sanctum).
*   **Real-time Engine:** **Laravel Reverb** (WebSockets) untuk Chat & Notifikasi.
*   **Push Notification:** Firebase Cloud Messaging (FCM) untuk Android & Apple Push Notification service (APNs).
*   **Integrasi Hardware:** Kamera (Scan QR & Upload Dokumen), GPS (Geofencing lokasi pelaporan).

---

## 4. Fitur Utama & Kebutuhan Fungsional

### 4.1. Manajemen Akun & Identitas
*   **Multi-Role Login:** Login tunggal dengan deteksi peran (Pengelola vs Umum).
*   **Registrasi Masyarakat:** Pendaftaran mandiri menggunakan email/nomor telepon.
*   **Digital Vessel ID:** Pengelola dapat menampilkan QR Code identitas kapal untuk diverifikasi petugas lapangan secara visual.
*   **Signature Pad:** Fitur tanda tangan digital pada layar HP untuk validasi form laporan.

### 4.2. Dashboard & Informasi Publik
*   **Dashboard Pengelola:** Widget status dokumen (SIPI/SIUP), limit waktu sandar, dan status laporan terbaru.
*   **Info Pelabuhan (Publik):** Jadwal kedatangan/keberangkatan kapal, pengumuman resmi, dan informasi cuaca BMKG maritim.
*   **Direktori Kapal:** Daftar kapal yang sedang/akan bersandar yang dapat diakses oleh masyarakat umum.

### 4.3. Modul Pelaporan Mandiri (Self-Service)
*   **E-Arrival/Departure:** Form input mandiri untuk rencana kedatangan/keberangkatan. 
    *   *Note: Status hanya bisa diubah menjadi "Approved" oleh petugas melalui sistem Web.*
*   **Logbook Tangkapan Digital:** Input hasil tangkapan per jenis ikan (fish species) disertai lampiran foto bukti timbangan/fisik.
*   **Tracking Laporan:** Timeline visual untuk memantau sejauh mana laporan diproses oleh petugas web.

### 4.4. Ekosistem Komunikasi (Smart Chat System)
Sistem komunikasi dibangun untuk mendukung tiga jalur utama:
1.  **User ↔ Petugas (Helpdesk):** Pengguna mobile bertanya ke petugas pelabuhan (Petugas membalas via Web).
2.  **Masyarakat ↔ Pengelola Kapal (P2P):** Masyarakat dapat menghubungi pengelola kapal langsung dari daftar direktori kapal untuk urusan logistik atau bisnis.
3.  **Chat Features:** 
    *   Indikator pesan terbaca (Read receipts).
    *   Lampiran gambar/dokumen.
    *   Notifikasi *pop-up* saat aplikasi tidak dibuka.

---

## 5. Alur Pengguna (Key User Flows)

### 5.1. Alur Komunikasi Masyarakat ke Pengelola Kapal
1.  **Masyarakat** membuka menu **"Jadwal Kapal"**.
2.  Memilih salah satu kapal yang ingin dituju.
3.  Klik ikon **"Chat Pengelola"**.
4.  Jendela chat terbuka (Real-time via Reverb). **Pengelola** menerima notifikasi di HP dan dapat langsung membalas.

### 5.2. Alur Pelaporan & Approval (Mobile ke Web)
1.  **Nahkoda** mengisi form **"Lapor Kedatangan"** di aplikasi mobile.
2.  Data masuk ke database dengan status `Pending`.
3.  **Petugas Pelabuhan** melihat notifikasi di **Dashboard Web**.
4.  Petugas memverifikasi data dan menekan tombol **"Approve"** di Web.
5.  **Nahkoda** menerima Push Notification: *"Laporan Kedatangan Kapal [Nama Kapal] telah Disetujui"*.

---

## 6. Kebutuhan Non-Fungsional
*   **Security:** Enkripsi SSL untuk transmisi data API. Token akses otomatis hangus dalam jangka waktu tertentu (Token Expiry).
*   **Availability:** Mode offline untuk pengisian draf laporan saat berada di area *blank spot* sinyal, yang akan tersinkronisasi otomatis saat mendapat internet.
*   **UI/UX:** Desain dengan elemen besar dan kontras tinggi agar mudah dioperasikan di lingkungan dermaga yang terik (Outdoor Friendly).

---

## 7. Matriks Kewenangan (Mobile vs Web)

| Fitur | Masyarakat (Mobile) | Pengelola (Mobile) | Petugas (Web) |
| :--- | :---: | :---: | :---: |
| Lihat Jadwal Kapal | ✅ | ✅ | ✅ |
| Input Laporan Kedatangan | ❌ | ✅ | ❌ |
| Approval Laporan | ❌ | ❌ | ✅ |
| Chat ke Petugas | ✅ | ✅ | ✅ |
| Chat ke Pengelola | ✅ | ❌ | ❌ |
| Kelola User & Hak Akses | ❌ | ❌ | ✅ |

---

## 8. Roadmap Pengembangan
*   **Fase 1 (Core):** Integrasi API Laravel 11, Auth Sanctum, Dashboard Informasi, & Digital Vessel ID.
*   **Fase 2 (Reporting):** Modul E-Arrival/Departure, Logbook Tangkapan, & Integrasi Notifikasi.
*   **Fase 3 (Social):** Implementasi Full Chat System (User-to-Official & User-to-User) via Laravel Reverb.
*   **Fase 4 (Optimization):** Offline mode, Geofencing pelaporan, & Rilis Store (Playstore/AppStore).