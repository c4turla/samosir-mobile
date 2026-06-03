<template>
  <div class="onboarding-screen">
    <!-- Skip Button -->
    <button class="onboarding-skip" @click="skipOnboarding">
      Lewati
    </button>

    <!-- Slides Container -->
    <div class="onboarding-slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="(slide, index) in slides" :key="index" class="onboarding-slide">
        <div class="onboarding-icon-wrapper">
          <div class="onboarding-icon" v-html="slide.icon"></div>
        </div>
        <h2 class="onboarding-title">{{ slide.title }}</h2>
        <p class="onboarding-description">{{ slide.description }}</p>
      </div>
    </div>

    <!-- Progress Indicators -->
    <div class="onboarding-indicators">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        class="onboarding-indicator"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>

    <!-- Navigation Buttons -->
    <div class="onboarding-actions">
      <button 
        v-if="currentSlide < slides.length - 1" 
        class="onboarding-btn onboarding-btn-next"
        @click="nextSlide"
      >
        Lanjut
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/>
        </svg>
      </button>
      <button 
        v-else 
        class="onboarding-btn onboarding-btn-start"
        @click="finishOnboarding"
      >
        Mulai Sekarang
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <!-- Wave Bottom -->
    <div class="onboarding-wave">
      <svg viewBox="0 0 390 100" fill="none" preserveAspectRatio="none">
        <path d="M0 0h390v60c-60 30-130 50-195 45S55 85 0 60V0z" fill="url(#onboardingWave)"/>
        <defs>
          <linearGradient id="onboardingWave" x1="0" y1="0" x2="390" y2="100">
            <stop offset="0%" stop-color="#0ea5e9"/>
            <stop offset="100%" stop-color="#6366f1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)

const slides = [
  {
    title: 'Selamat Datang di SAMOSIR',
    description: 'Aplikasi monitoring dan operasional Kepulauan Samosir yang membantu Anda dalam aktivitas sehari-hari.',
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#icon1)" opacity="0.2"/>
      <path d="M40 15L50 35H30L40 15Z" fill="#0ea5e9"/>
      <rect x="25" y="40" width="30" height="25" rx="4" fill="#6366f1"/>
      <circle cx="40" cy="52" r="6" fill="#fff"/>
      <defs>
        <linearGradient id="icon1" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    title: 'Jadwal Kapal & Perjalanan',
    description: 'Lihat jadwal keberangkatan dan kedatangan kapal dengan mudah. Dapatkan informasi real-time tentang status perjalanan.',
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#icon2)" opacity="0.2"/>
      <rect x="15" y="20" width="50" height="40" rx="6" fill="#0ea5e9"/>
      <rect x="20" y="25" width="20" height="12" rx="2" fill="#fff"/>
      <rect x="45" y="25" width="15" height="12" rx="2" fill="#fff" opacity="0.6"/>
      <rect x="20" y="42" width="15" height="12" rx="2" fill="#fff" opacity="0.6"/>
      <rect x="40" y="42" width="20" height="12" rx="2" fill="#fff"/>
      <defs>
        <linearGradient id="icon2" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    title: 'Komoditas & Produk Lokal',
    description: 'Jelajahi berbagai komoditas dan produk lokal dari Pulau Samosir. Dukung ekonomi lokal dengan mudah.',
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#icon3)" opacity="0.2"/>
      <path d="M25 55L40 20L55 55H25Z" fill="#6366f1"/>
      <circle cx="40" cy="40" r="8" fill="#fff"/>
      <path d="M30 60H50" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
      <defs>
        <linearGradient id="icon3" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    title: 'Chat & Komunikasi',
    description: 'Terhubung dengan pengelola kapal dan sesama pengguna. Tanya jawab dan bagikan informasi dengan mudah.',
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#icon4)" opacity="0.2"/>
      <path d="M15 25C15 22.2386 17.2386 20 20 20H60C62.7614 20 65 22.2386 65 25V45C65 47.7614 62.7614 50 60 50H45L35 60V50H20C17.2386 50 15 47.7614 15 45V25Z" fill="#0ea5e9"/>
      <circle cx="28" cy="35" r="3" fill="#fff"/>
      <circle cx="40" cy="35" r="3" fill="#fff"/>
      <circle cx="52" cy="35" r="3" fill="#fff"/>
      <defs>
        <linearGradient id="icon4" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    title: 'Siap Memulai?',
    description: 'Daftar sekarang dan nikmati semua fitur SAMOSIR. Selamat menikmati pengalaman terbaik di Kepulauan Samosir!',
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#icon5)" opacity="0.2"/>
      <circle cx="40" cy="40" r="20" fill="#0ea5e9"/>
      <path d="M35 40L38 43L45 36" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="icon5" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
    </svg>`
  }
]

const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const skipOnboarding = () => {
  finishOnboarding()
}

const finishOnboarding = () => {
  localStorage.setItem('hasSeenOnboarding', 'true')
  router.replace('/login')
}
</script>

<style scoped>
.onboarding-screen {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.onboarding-skip {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(100, 116, 139, 0.1);
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  font-family: inherit;
}

.onboarding-skip:hover {
  background: rgba(100, 116, 139, 0.2);
  color: #475569;
}

.onboarding-slides {
  flex: 1;
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.onboarding-slide {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px 120px;
  text-align: center;
}

.onboarding-icon-wrapper {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.onboarding-icon {
  width: 100%;
  height: 100%;
}

.onboarding-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.onboarding-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 16px;
  line-height: 1.2;
}

.onboarding-description {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  max-width: 320px;
  line-height: 1.6;
}

.onboarding-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 20px 0;
}

.onboarding-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.onboarding-indicator.active {
  width: 32px;
  border-radius: 5px;
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
}

.onboarding-actions {
  padding: 0 24px 140px;
  display: flex;
  justify-content: center;
}

.onboarding-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.onboarding-btn-next {
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
}

.onboarding-btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4);
}

.onboarding-btn-start {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.onboarding-btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
}

.onboarding-btn:active {
  transform: scale(0.98);
}

.onboarding-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.onboarding-wave svg {
  display: block;
  width: 100%;
  height: auto;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .onboarding-screen {
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  }
  
  .onboarding-title {
    color: #f1f5f9;
  }
  
  .onboarding-description {
    color: #94a3b8;
  }
  
  .onboarding-skip {
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
  }
  
  .onboarding-skip:hover {
    background: rgba(148, 163, 184, 0.2);
    color: #cbd5e1;
  }
}
</style>
