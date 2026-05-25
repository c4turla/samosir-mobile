<template>
  <div class="legal-screen">
    <!-- Status bar spacer -->
    <div class="legal-statusbar"></div>

    <!-- Header -->
    <header class="legal-header">
      <button class="legal-back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="legal-title">Kebijakan Privasi</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- Content -->
    <div class="legal-content">
      <div class="legal-card">
        <p class="legal-last-updated">Terakhir diperbarui: 25 Mei 2026</p>
        
        <h2>1. Informasi yang Kami Kumpulkan</h2>
        <p>Kami mengumpulkan data akun seperti nama lengkap, alamat email, dan informasi kapal bagi pengelola kapal demi menunjang layanan monitoring pelabuhan mandiri SAMOSIR.</p>

        <h2>2. Penggunaan Informasi</h2>
        <p>Informasi Anda digunakan untuk mengidentifikasi akun, memberikan akses fitur yang sesuai dengan peran (role) Anda, dan mempermudah komunikasi serta pelaporan aktivitas pelabuhan secara real-time.</p>

        <h2>3. Keamanan Data</h2>
        <p>Keamanan data Anda adalah prioritas kami. Kami menggunakan teknologi enkripsi terkini untuk melindungi transmisi informasi data sensitif dan password Anda.</p>

        <h2>4. Hubungi Kami</h2>
        <p>Apabila Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi tim dukungan kami melalui menu bantuan di dalam aplikasi.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.legal-screen {
  min-height: 100vh;
  min-height: 100dvh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.legal-statusbar {
  height: env(safe-area-inset-top, 0px);
  background: #ffffff;
}

.legal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #ffffff;
  border-b: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.legal-back-btn {
  background: none;
  border: none;
  color: #0f172a;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.legal-back-btn:hover {
  background-color: #f1f5f9;
}

.legal-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-spacer {
  width: 36px;
}

.legal-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.legal-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.legal-last-updated {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 20px;
}

h2 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 24px 0 8px;
}

h2:first-of-type {
  margin-top: 0;
}

p {
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0 0 16px;
}

/* ── Dark Mode ───────────────────────── */
@media (prefers-color-scheme: dark) {
  .legal-screen { background: #0f172a; }
  .legal-statusbar { background: #0f172a; }
  .legal-header { background: #1e293b; border-bottom-color: #334155; }
  .legal-back-btn { color: #f1f5f9; }
  .legal-back-btn:hover { background-color: #334155; }
  .legal-title { color: #f1f5f9; }
  .legal-card { background: #1e293b; border-color: #334155; }
  h2 { color: #f1f5f9; }
  p { color: #cbd5e1; }
}

:root.dark .legal-screen { background: #0f172a; }
:root.dark .legal-statusbar { background: #0f172a; }
:root.dark .legal-header { background: #1e293b; border-bottom-color: #334155; }
:root.dark .legal-back-btn { color: #f1f5f9; }
:root.dark .legal-back-btn:hover { background-color: #334155; }
:root.dark .legal-title { color: #f1f5f9; }
:root.dark .legal-card { background: #1e293b; border-color: #334155; }
:root.dark h2 { color: #f1f5f9; }
:root.dark p { color: #cbd5e1; }
</style>
