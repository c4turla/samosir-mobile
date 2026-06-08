<template>
  <div class="splash-screen">
    <div class="splash-content">
      <div class="splash-logo-container">
        <img src="/logobaru.webp" alt="SAMOSIR Logo" class="splash-logo" />
      </div>
      <h1 class="splash-title">SAMOSIR <span class="text-sm">V.3.0</span></h1>
      <p class="splash-subtitle">Sistem Aplikasi Monitoring & Operasional PPN Sibolga</p>
      <div class="splash-loader">
        <div class="splash-loader-dot"></div>
        <div class="splash-loader-dot"></div>
        <div class="splash-loader-dot"></div>
      </div>
    </div>
    <div class="splash-wave">
      <svg viewBox="0 0 390 120" fill="none" preserveAspectRatio="none">
        <path d="M0 60c43.3-30 130-50 195-45s130 40 195 75v65H0V60z" fill="url(#splashWave)" opacity="0.15"/>
        <defs>
          <linearGradient id="splashWave" x1="0" y1="0" x2="390" y2="120">
            <stop offset="0%" stop-color="#0ea5e9"/>
            <stop offset="100%" stop-color="#6366f1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Check if user has seen onboarding
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
  
  setTimeout(() => {
    if (hasSeenOnboarding) {
      router.replace('/login')
    } else {
      router.replace('/onboarding')
    }
  }, 2500)
})
</script>

<style scoped>
.splash-screen {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  text-align: center;
  padding: 0 24px;
}

.splash-logo-container {
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 24px;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);
  }
}

.splash-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.splash-title {
  font-size: 42px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: 4px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.splash-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 40px;
  max-width: 280px;
  line-height: 1.5;
}

.splash-loader {
  display: flex;
  gap: 8px;
}

.splash-loader-dot {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.splash-loader-dot:nth-child(1) { animation-delay: -0.32s; }
.splash-loader-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.splash-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.splash-wave svg {
  display: block;
  width: 100%;
  height: auto;
}

/* Particles */
.splash-screen::before,
.splash-screen::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.splash-screen::before {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  animation: float 6s ease-in-out infinite;
}

.splash-screen::after {
  width: 150px;
  height: 150px;
  bottom: 100px;
  left: -30px;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}
</style>
