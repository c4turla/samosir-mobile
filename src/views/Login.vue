<template>
  <div class="auth-screen">
    <!-- Status bar spacer -->
    <div class="auth-statusbar"></div>

    <!-- Top wave decoration -->
    <div class="auth-wave">
      <svg viewBox="0 0 390 180" fill="none" preserveAspectRatio="none">
        <path d="M0 0h390v120c-60 40-130 60-195 55S60 140 0 100V0z" fill="url(#wave1)"/>
        <path d="M0 0h390v100c-50 35-120 55-195 50S55 120 0 85V0z" fill="url(#wave2)" opacity="0.6"/>
        <defs>
          <linearGradient id="wave1" x1="0" y1="0" x2="390" y2="180">
            <stop offset="0%" stop-color="#0ea5e9"/>
            <stop offset="100%" stop-color="#6366f1"/>
          </linearGradient>
          <linearGradient id="wave2" x1="0" y1="0" x2="390" y2="140">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#818cf8"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="auth-wave-logo">
        <img src="/logobaru.webp" alt="SAMOSIR Logo" class="auth-logo-img" />
        <div class="auth-logo-glow"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="auth-body">
      <h1 class="auth-title">Selamat Datang 👋</h1>
      <p class="auth-desc">Masuk ke akun SAMOSIR Anda</p>

      <!-- Error Alert -->
      <Transition name="slide-fade">
        <div v-if="errorMessage" class="auth-alert auth-alert--error">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
          <span>{{ errorMessage }}</span>
        </div>
      </Transition>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="auth-field">
          <label class="auth-field-label" for="login-email">Email atau Username</label>
          <div class="auth-input-box">
            <svg class="auth-input-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/></svg>
            <input id="login-email" v-model="form.email" type="text" required placeholder="nama@email.com" @focus="handleFocus" />
          </div>
          <p v-if="errors.email" class="auth-field-error">{{ errors.email[0] }}</p>
        </div>

        <div class="auth-field">
          <div class="auth-field-header">
            <label class="auth-field-label" for="login-pw">Kata Sandi</label>
            <a href="#" class="auth-link-sm">Lupa sandi?</a>
          </div>
          <div class="auth-input-box">
            <svg class="auth-input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/></svg>
            <input id="login-pw" v-model="form.password" :type="showPw ? 'text' : 'password'" required placeholder="••••••••" @focus="handleFocus" />
            <button type="button" class="auth-pw-toggle" @click="showPw = !showPw" tabindex="-1" aria-label="Toggle password">
              <svg v-if="!showPw" viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/><path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              <svg v-else viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clip-rule="evenodd"/><path d="M10.748 13.93l2.523 2.523A9.987 9.987 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41a1.651 1.651 0 010-1.186 10.007 10.007 0 012.56-3.703L5.25 7.727a4 4 0 005.499 6.203z"/></svg>
            </button>
          </div>
          <p v-if="errors.password" class="auth-field-error">{{ errors.password[0] }}</p>
        </div>

        <button type="submit" :disabled="isLoading" class="auth-btn">
          <span v-if="isLoading" class="auth-spinner"></span>
          <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
        </button>
      </form>

      <!-- Keyboard Spacer for iOS / Mobile layout stability -->
      <div class="auth-keyboard-spacer"></div>

      <!-- Footer -->
      <div class="auth-footer">
        <p class="auth-footer-text">
          Belum punya akun? <router-link to="/register" class="auth-footer-link">Daftar Sekarang</router-link>
        </p>
        
        <div class="auth-footer-divider"></div>
        
        <p class="auth-app-info">SAMOSIR APPS v3.0 • © 2026</p>
        <div class="auth-legal-links">
          <router-link to="/privacy-policy" class="auth-legal-link">Kebijakan Privasi</router-link>
          <span class="auth-legal-dot">•</span>
          <router-link to="/terms" class="auth-legal-link">Syarat & Ketentuan</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '@/config'

const router = useRouter()
const form = reactive({ email: '', password: '' })
const errors = ref<Record<string, string[]>>({})
const errorMessage = ref('')
const isLoading = ref(false)
const showPw = ref(false)

const handleFocus = (event: FocusEvent) => {
  // Smooth scroll target element into viewport center after keyboard has animated in
  setTimeout(() => {
    if (event.target) {
      (event.target as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, 250)
}

const handleLogin = async () => {
  isLoading.value = true
  errors.value = {}
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 422) errors.value = data.errors || {}
      else throw new Error(data.message || 'Kredensial tidak valid.')
      return
    }

    const payload = data.data || {}
    const token = payload.token || data.token || data.access_token
    if (token) localStorage.setItem('token', token)

    if (payload.user) {
      if (payload.user.id) localStorage.setItem('userId', String(payload.user.id))
      localStorage.setItem('userRole', payload.user.role || 'umum')
      localStorage.setItem('userName', payload.user.name || 'User')
    } else {
      localStorage.setItem('userRole', 'umum')
      localStorage.setItem('userName', 'User')
    }

    router.push('/home')
  } catch (err: any) {
    errorMessage.value = err.message || 'Koneksi ke server gagal. Pastikan API menyala.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  min-height: 100dvh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.auth-statusbar {
  height: env(safe-area-inset-top, 0px);
  background: #0ea5e9;
}

/* ── Wave Header ─────────────────────── */
.auth-wave {
  position: relative;
  flex-shrink: 0;
}

.auth-wave svg {
  display: block;
  width: 100%;
  height: auto;
}

.auth-wave-logo {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 140px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 40px rgba(14, 165, 233, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 10;
}

.auth-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.auth-logo-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 80%);
  animation: logo-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes logo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

/* ── Body ────────────────────────────── */
.auth-body {
  flex: 1;
  padding: 28px 24px 40px;
  display: flex;
  flex-direction: column;
}

.auth-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px;
}

.auth-desc {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 28px;
}

/* ── Alert ───────────────────────────── */
.auth-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 20px;
  line-height: 1.4;
}

.auth-alert--error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Form ────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-field-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.auth-link-sm {
  font-size: 12px;
  font-weight: 600;
  color: #0ea5e9;
  text-decoration: none;
}

.auth-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #94a3b8;
  pointer-events: none;
}

.auth-input-box input {
  width: 100%;
  padding: 14px 14px 14px 42px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.auth-input-box input::placeholder {
  color: #cbd5e1;
}

.auth-input-box input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.auth-pw-toggle {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
}

.auth-field-error {
  font-size: 12px;
  color: #ef4444;
  padding-left: 2px;
}

/* ── Button ──────────────────────────── */
.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 4px;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3);
  transition: transform 0.15s, box-shadow 0.15s;
}

.auth-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Keyboard Spacer ─────────────────── */
.auth-keyboard-spacer {
  height: 120px; /* Provides extra padding at the bottom so the container has room to scroll when keyboard is open */
}

/* ── Footer ──────────────────────────── */
.auth-footer {
  margin-top: auto;
  padding-top: 16px;
  text-align: center;
}

.auth-footer-text {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 16px;
}

.auth-footer-link {
  color: #0ea5e9;
  font-weight: 700;
  text-decoration: none;
}

.auth-footer-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0;
  opacity: 0.8;
}

.auth-app-info {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 6px;
}

.auth-legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.auth-legal-link {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.auth-legal-link:hover {
  color: #0ea5e9;
}

.auth-legal-dot {
  font-size: 11px;
  color: #cbd5e1;
}

/* ── Dark Mode ───────────────────────── */
@media (prefers-color-scheme: dark) {
  .auth-screen { background: #0f172a; }
  .auth-statusbar { background: #0c4a6e; }
  .auth-title { color: #f1f5f9; }
  .auth-desc { color: #64748b; }
  .auth-field-label { color: #cbd5e1; }
  .auth-input-box input { background: #1e293b; border-color: #334155; color: #f1f5f9; }
  .auth-input-box input::placeholder { color: #475569; }
  .auth-input-box input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }
  .auth-alert--error { background: rgba(239,68,68,0.1); color: #fca5a5; border-color: rgba(239,68,68,0.2); }
  .auth-footer-divider { background: #334155; }
  .auth-app-info { color: #64748b; }
  .auth-legal-link { color: #475569; }
  .auth-legal-link:hover { color: #38bdf8; }
  .auth-legal-dot { color: #334155; }
  .auth-wave-logo { background: #1e293b; border-color: #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(14,165,233,0.15); }
}

:root.dark .auth-screen { background: #0f172a; }
:root.dark .auth-statusbar { background: #0c4a6e; }
:root.dark .auth-title { color: #f1f5f9; }
:root.dark .auth-desc { color: #64748b; }
:root.dark .auth-field-label { color: #cbd5e1; }
:root.dark .auth-input-box input { background: #1e293b; border-color: #334155; color: #f1f5f9; }
:root.dark .auth-input-box input::placeholder { color: #475569; }
:root.dark .auth-input-box input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }
:root.dark .auth-alert--error { background: rgba(239,68,68,0.1); color: #fca5a5; border-color: rgba(239,68,68,0.2); }
:root.dark .auth-footer-divider { background: #334155; }
:root.dark .auth-app-info { color: #64748b; }
:root.dark .auth-legal-link { color: #475569; }
:root.dark .auth-legal-link:hover { color: #38bdf8; }
:root.dark .auth-legal-dot { color: #334155; }
:root.dark .auth-wave-logo { background: #1e293b; border-color: #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(14,165,233,0.15); }
</style>