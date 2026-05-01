<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Profil Saya</h2>
      <button class="bg-gray-100 dark:bg-slate-800 p-2.5 rounded-2xl text-gray-600 dark:text-gray-300">
        <Settings class="w-6 h-6" />
      </button>
    </div>

    <!-- Profile Card -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-center">
      <div class="relative inline-block mb-4">
        <div class="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-[2rem] flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl">
          <User class="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <button class="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-lg">
          <Camera class="w-3.5 h-3.5" />
        </button>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Capt. Heri Wibowo</h3>
      <p class="text-xs text-gray-400 font-medium mt-1">ID: HW-992120 • Pengelola Kapal</p>
      
      <div class="mt-6 flex items-center justify-center space-x-2">
        <span class="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center">
          <CheckCircle2 class="w-3 h-3 mr-1" /> Terverifikasi
        </span>
      </div>
    </div>

    <!-- Dark Mode Toggle -->
    <section class="mb-8">
      <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-4">
          <div :class="['p-2.5 rounded-2xl flex items-center justify-center transition-colors', isDarkMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600']">
            <component :is="isDarkMode ? Sun : Moon" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">Mode Gelap</h4>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Optimalkan baterai & kenyamanan mata</p>
          </div>
        </div>
        <button 
          @click="toggleDarkMode"
          :class="['w-12 h-6 rounded-full relative transition-colors duration-300', isDarkMode ? 'bg-primary-600' : 'bg-gray-200']"
        >
          <div :class="['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm', isDarkMode ? 'left-6.5' : 'left-0.5']"></div>
        </button>
      </div>
    </section>

    <!-- Vessel Quick Info / QR -->
    <section class="bg-slate-900 rounded-[2.5rem] p-6 text-white mb-8 relative overflow-hidden group">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
      <div class="relative z-10 flex items-center space-x-4">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-900/50">
          <QrCode class="w-10 h-10" />
        </div>
        <div>
          <h4 class="font-bold text-lg leading-tight">Digital Vessel ID</h4>
          <p class="text-xs opacity-60 mt-1">3 Kapal Terdaftar</p>
        </div>
      </div>
      <button class="mt-6 w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2">
        <Maximize2 class="w-4 h-4" />
        <span>Buka Daftar QR Kapal</span>
      </button>
    </section>

    <!-- Menu Items -->
    <section class="space-y-3">
      <div v-for="item in menuItems" :key="item.label" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-slate-800/50 active:scale-[0.99]">
        <div class="flex items-center space-x-3">
          <div :class="['p-2 rounded-xl flex items-center justify-center', item.bg]">
            <component :is="item.icon" :class="['w-5 h-5', item.color]" />
          </div>
          <span class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ item.label }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span v-if="item.badge" class="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[9px] font-bold">{{ item.badge }}</span>
          <ChevronRight class="w-5 h-5 text-gray-200 dark:text-gray-700" />
        </div>
      </div>
    </section>

    <!-- Logout -->
    <button 
      @click="handleLogout"
      class="mt-8 w-full p-4 flex items-center justify-center space-x-2 text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
    >
      <LogOut class="w-5 h-5" />
      <span>Keluar Aplikasi</span>
    </button>
    
    <div class="mt-12 text-center pb-24">
      <p class="text-[10px] text-gray-400 font-medium">SAMOSIR APPS v3.0</p>
      <p class="text-[10px] text-gray-300 mt-1 italic">Create by kendariweb.com</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Settings, 
  User, 
  Camera, 
  CheckCircle2, 
  QrCode, 
  Maximize2,
  ChevronRight,
  Shield,
  CreditCard,
  PenTool,
  Bell,
  LogOut,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-vue-next'

const router = useRouter()
const isDarkMode = ref(false)

onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogout = () => {
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  router.push('/login')
}

const menuItems = [
  { label: 'Informasi Armada', icon: Shield, bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-600 dark:text-indigo-400' },
  { label: 'Tanda Tangan Digital', icon: PenTool, bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-600 dark:text-amber-400', badge: 'Setup' },
  { label: 'Metode Pembayaran', icon: CreditCard, bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Notifikasi', icon: Bell, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-600 dark:text-blue-400', badge: '3' },
  { label: 'Hubungi Support', icon: HelpCircle, bg: 'bg-slate-50 dark:bg-slate-800', color: 'text-slate-600 dark:text-slate-400' },
]
</script>

<style scoped>
.left-6\.5 {
  left: 1.625rem;
}
</style>
