<template>
  <div class="px-5 py-6 space-y-8 dark:bg-slate-950 transition-colors duration-300">
    <!-- Welcome Section & Vessel Selector -->
    <section>
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Halo, {{ userName }} 👋</h2>
        <button class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-2 rounded-xl">
          <Settings class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Vessel Switcher (Manager Only) -->
      <div v-if="userRole === 'pengelola'" class="mt-4 overflow-x-auto -mx-5 px-5 flex space-x-3 no-scrollbar transition-all">
        <button 
          v-for="vessel in managedVessels" 
          :key="vessel.id"
          @click="selectedVesselId = vessel.id"
          :class="[
            'flex-shrink-0 px-4 py-3 rounded-2xl border transition-all flex items-center space-x-3',
            selectedVesselId === vessel.id 
              ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none' 
              : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400'
          ]"
        >
          <Anchor :class="['w-5 h-5', selectedVesselId === vessel.id ? 'text-white' : 'text-gray-400']" />
          <div class="text-left">
            <p class="text-[10px] font-bold uppercase tracking-wider opacity-80">{{ vessel.status }}</p>
            <p class="text-xs font-bold">{{ vessel.name }}</p>
          </div>
        </button>
        <button class="flex-shrink-0 px-4 py-3 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-gray-400 flex items-center space-x-2">
          <Plus class="w-4 h-4" />
          <span class="text-xs font-bold">Tambah Kapal</span>
        </button>
      </div>

      <!-- Quick Info Bar (Public Only) -->
      <div v-if="userRole === 'umum'" class="mt-6 flex items-center justify-between bg-primary-50 dark:bg-primary-900/10 p-4 rounded-3xl border border-primary-100 dark:border-primary-900/20">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white">
            <Megaphone class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-primary-600 uppercase">Informasi Terbaru</p>
            <p class="text-xs font-bold text-gray-800 dark:text-gray-200">PPN Sibolga beroperasi normal 24/7</p>
          </div>
        </div>
        <ChevronRight class="w-5 h-5 text-primary-600" />
      </div>
    </section>

    <!-- Manager Specific Display -->
    <div v-if="userRole === 'pengelola' && currentVessel" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <Clock class="w-6 h-6 mb-2 opacity-80" />
          <p class="text-xs opacity-80 font-medium">Sisa Sandar</p>
          <h3 class="text-xl font-bold mt-1">{{ currentVessel.stats.timeRemaining }}</h3>
        </div>
        <div class="bg-emerald-600 dark:bg-emerald-700 rounded-2xl p-4 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
          <FileCheck class="w-6 h-6 mb-2 opacity-80" />
          <p class="text-xs opacity-80 font-medium">Status Izin</p>
          <h3 class="text-xl font-bold mt-1">Aktif</h3>
        </div>
      </div>

      <!-- Status Dokumen -->
      <section class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Status Dokumen - {{ currentVessel.name }}</h3>
          <button class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Lihat Semua</button>
        </div>
        <div class="space-y-3">
          <div v-for="doc in currentVessel.documents" :key="doc.name" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div class="flex items-center space-x-3">
              <div :class="['p-2 rounded-xl flex items-center justify-center', doc.bg]">
                <component :is="doc.icon" :class="['w-5 h-5', doc.text]" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ doc.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Berlaku s/d {{ doc.expiry }}</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
        </div>
      </section>
    </div>

    <!-- Public Specific Display (Directory Preview) -->
    <div v-if="userRole === 'umum'" class="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
      <section>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Kapal di Dermaga</h3>
          <router-link to="/schedule" class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Lihat Semua</router-link>
        </div>
        <div class="flex space-x-4 overflow-x-auto -mx-5 px-5 no-scrollbar pb-2">
          <div v-for="ship in publicShips" :key="ship.id" class="flex-shrink-0 w-44 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
            <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Ship class="w-6 h-6 text-primary-600" />
            </div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ ship.name }}</h4>
            <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">{{ ship.dock }}</p>
            <button class="mt-4 w-full bg-gray-50 dark:bg-slate-800 text-[10px] font-bold text-gray-600 dark:text-gray-400 py-2 rounded-xl transition-colors active:bg-gray-100">
              Detail Kapal
            </button>
          </div>
        </div>
      </section>

      <section class="bg-indigo-600 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div class="max-w-[180px]">
            <h4 class="font-bold text-lg leading-tight">Butuh Jasa Logistik?</h4>
            <p class="text-xs opacity-70 mt-2">Hubungi pengelola kapal langsung untuk pengiriman barang.</p>
          </div>
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <MessageSquare class="w-8 h-8" />
          </div>
        </div>
        <button class="mt-6 w-full bg-white text-indigo-600 py-3 rounded-2xl text-xs font-bold shadow-xl shadow-indigo-900/20">
          Cari Pengelola Kapal
        </button>
      </section>
    </div>

    <!-- Commodity Spill (NEW) -->
    <section v-if="userRole === 'pengelola'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Hasil Tangkapan Terbaru</h3>
        <button class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Logbook</button>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800 dark:text-white">Ikan Cakalang</p>
            <p class="text-[10px] text-gray-500">Estimasi 450 Kg • KM. SAMUDRA VII</p>
          </div>
        </div>
        <span class="text-xs font-bold text-emerald-600">+12%</span>
      </div>
    </section>

    <section v-if="userRole === 'umum'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Harga Ikan Hari Ini</h3>
        <router-link to="/commodity" class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Semua Ikan</router-link>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <p class="text-[10px] font-bold text-blue-600 uppercase">Cakalang</p>
          <p class="text-sm font-bold text-gray-800 dark:text-white mt-1">Rp 28.000 /kg</p>
        </div>
        <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <p class="text-[10px] font-bold text-indigo-600 uppercase">Tuna</p>
          <p class="text-sm font-bold text-gray-800 dark:text-white mt-1">Rp 45.000 /kg</p>
        </div>
      </div>
    </section>

    <!-- Info Cuaca (General) -->
    <section class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 dark:shadow-none relative overflow-hidden transition-all duration-500">
      <div class="absolute -right-4 -top-4 opacity-20 transform rotate-12">
        <CloudLightning v-if="weather.code >= 80" class="w-32 h-32" />
        <CloudRain v-else-if="weather.code >= 60" class="w-32 h-32" />
        <Cloud v-else-if="weather.code >= 1" class="w-32 h-32" />
        <Sun v-else class="w-32 h-32" />
      </div>

      <div class="relative z-10 flex justify-between items-start">
        <div v-if="weather.loading" class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-white/20 rounded w-3/4"></div>
            <div class="h-10 bg-white/20 rounded w-1/2"></div>
            <div class="h-4 bg-white/20 rounded w-full"></div>
          </div>
        </div>
        <div v-else>
          <p class="text-sm opacity-90 font-medium">Cuaca Maritim</p>
          <div class="flex items-center space-x-3 mt-1">
            <component :is="weatherIcon" class="w-10 h-10" />
            <span class="text-4xl font-bold">{{ Math.round(weather.temp) }}°C</span>
          </div>
          <p class="mt-4 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full inline-block">
            Angin: {{ weather.wind }} km/j
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs opacity-80">PPN Sibolga</p>
          <p class="text-sm font-bold">{{ weatherText }}</p>
        </div>
      </div>
    </section>

    <!-- Digital Vessel ID Quick Access -->
    <section class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-primary-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
      <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center">
        <QrCode class="w-10 h-10 text-slate-800 dark:text-slate-200" />
      </div>
      <div class="flex-1">
        <h4 class="font-bold text-gray-900 dark:text-white">Digital Vessel ID</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Identitas Kapal: {{ currentVessel?.name || '...' }}</p>
      </div>
      <button class="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
        <Maximize class="w-5 h-5" />
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Clock, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  CloudLightning,
  QrCode,
  Maximize,
  Anchor,
  Plus,
  Settings,
  ShieldCheck,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Megaphone,
  Ship,
  MessageSquare
} from 'lucide-vue-next'

const selectedVesselId = ref(1)
const userRole = ref(localStorage.getItem('userRole') || 'umum')
const userName = ref(localStorage.getItem('userName') || 'Pengunjung')

// Dummy data for public ships
const publicShips = [
  { id: 1, name: 'KM. SAMUDRA VII', dock: 'Dermaga A' },
  { id: 2, name: 'KM. BINTANG JAYA', dock: 'Dermaga B' },
  { id: 3, name: 'LCT. PUTRA MANDALA', dock: 'Dermaga C' },
]

// Titik Koordinat PPN Sibolga
const lat = 1.7397
const lon = 98.7838

const weather = ref({
  loading: true,
  temp: 0,
  code: 0,
  wind: 0
})

const fetchWeather = async () => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await response.json();
    if (data.current_weather) {
      weather.value = {
        loading: false,
        temp: data.current_weather.temperature,
        code: data.current_weather.weathercode,
        wind: data.current_weather.windspeed
      };
    }
  } catch (error) {
    console.error("Gagal memuat cuaca:", error);
    weather.value.loading = false;
  }
};

onMounted(() => {
  fetchWeather();
})

const weatherText = computed(() => {
  const code = weather.value.code;
  if (code === 0) return 'Cerah';
  if (code <= 3) return 'Cerah Berawan';
  if (code <= 48) return 'Berkabut';
  if (code <= 55) return 'Gerimis';
  if (code <= 65) return 'Hujan';
  if (code <= 82) return 'Hujan Lebat';
  return 'Badai Guntur';
});

const weatherIcon = computed(() => {
  const code = weather.value.code;
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  if (code <= 48) return Cloud;
  if (code <= 65) return CloudRain;
  return CloudLightning;
});

const managedVessels = [
  { 
    id: 1, 
    name: 'KM. SAMUDRA VII', 
    status: 'Bersandar',
    stats: { timeRemaining: '12 Jam' },
    documents: [
      { name: 'SIPI (Izin Penangkap)', expiry: '12 Des 2026', icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
      { name: 'SIUP (Izin Usaha)', expiry: '20 Jan 2027', icon: ShieldCheck, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
      { name: 'Sertifikat Kelayakan', expiry: 'Expired: 2 Hari!', icon: AlertCircle, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    ]
  },
  { 
    id: 2, 
    name: 'KM. BINTANG JAYA', 
    status: 'Menuju Pelabuhan',
    stats: { timeRemaining: 'ETA 2 Jam' },
    documents: [
      { name: 'SIPI (Izin Penangkap)', expiry: '05 Nov 2026', icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
      { name: 'Sertifikat Kelayakan', expiry: '15 Sep 2027', icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    ]
  },
  { 
    id: 3, 
    name: 'LCT. PUTRA MANDALA', 
    status: 'Docking',
    stats: { timeRemaining: '3 Hari' },
    documents: [
      { name: 'SIUP (Izin Usaha)', expiry: '10 Feb 2027', icon: ShieldCheck, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    ]
  }
]

const currentVessel = computed(() => managedVessels.find(v => v.id === selectedVesselId.value))
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
