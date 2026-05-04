<template>
  <div class="px-5 py-6 space-y-8 dark:bg-slate-950 transition-colors duration-300">
    <!-- Welcome Section & Vessel Selector -->
    <section>
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Halo, {{ userName }} 👋</h2>
        <button @click="router.push('/profile')" class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-2 rounded-xl">
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
            <p class="text-[10px] font-bold uppercase tracking-wider opacity-80">{{ vessel.type }}</p>
            <p class="text-xs font-bold">{{ vessel.name }}</p>
          </div>
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
          <p class="text-xs opacity-80 font-medium">Alat Tangkap</p>
          <h3 class="text-lg font-bold mt-1">{{ currentVessel.fishingGear }}</h3>
        </div>
        <div class="bg-emerald-600 dark:bg-emerald-700 rounded-2xl p-4 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
          <FileCheck class="w-6 h-6 mb-2 opacity-80" />
          <p class="text-xs opacity-80 font-medium">GT Kapal</p>
          <h3 class="text-xl font-bold mt-1">{{ currentVessel.gt }} GT</h3>
        </div>
      </div>

      <!-- Recent Activity for this vessel -->
      <section class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Riwayat Terbaru - {{ currentVessel.name }}</h3>
          <router-link to="/schedule" class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Lihat Semua</router-link>
        </div>
        <div class="space-y-3">
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ currentVessel.type }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentVessel.time }} • {{ currentVessel.dock }}</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
        </div>
      </section>
    </div>

    <!-- Loading state for manager -->
    <div v-if="userRole === 'pengelola' && isLoading" class="space-y-4">
      <div class="animate-pulse grid grid-cols-2 gap-4">
        <div class="bg-gray-200 dark:bg-slate-800 rounded-2xl h-24"></div>
        <div class="bg-gray-200 dark:bg-slate-800 rounded-2xl h-24"></div>
      </div>
    </div>

    <!-- Public Specific Display (Directory Preview) -->
    <div v-if="userRole === 'umum'" class="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
      <section>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Kapal Terbaru</h3>
          <router-link to="/schedule" class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Lihat Semua</router-link>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex space-x-4 overflow-hidden -mx-5 px-5">
          <div v-for="i in 3" :key="i" class="flex-shrink-0 w-44 bg-gray-200 dark:bg-slate-800 rounded-3xl h-36 animate-pulse"></div>
        </div>

        <div v-else class="flex space-x-4 overflow-x-auto -mx-5 px-5 no-scrollbar pb-2">
          <div v-for="ship in publicShips" :key="ship.id" class="flex-shrink-0 w-44 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
            <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Ship class="w-6 h-6 text-primary-600" />
            </div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ ship.name }}</h4>
            <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">{{ ship.dock }}</p>
            <span :class="[
              'inline-block mt-2 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase',
              ship.type === 'Kedatangan' 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
            ]">{{ ship.type }}</span>
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

    <!-- Commodity Spill (Pengelola) -->
    <section v-if="userRole === 'pengelola'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Aktivitas Terbaru</h3>
        <router-link to="/schedule" class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Logbook</router-link>
      </div>
      <div v-if="latestActivity" class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800 dark:text-white">{{ latestActivity.name }}</p>
            <p class="text-[10px] text-gray-500">{{ latestActivity.type }} • {{ latestActivity.time }}</p>
          </div>
        </div>
        <span :class="[
          'text-xs font-bold',
          latestActivity.type === 'Kedatangan' ? 'text-emerald-600' : 'text-blue-600'
        ]">{{ latestActivity.type === 'Kedatangan' ? '📥' : '📤' }}</span>
      </div>
      <div v-else class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm text-center">
        <p class="text-xs text-gray-400">Belum ada aktivitas terbaru</p>
      </div>
    </section>

    <section v-if="userRole === 'umum'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Harga Ikan Hari Ini</h3>
        <router-link to="/commodity" class="text-primary-600 dark:text-primary-400 text-sm font-semibold">Semua Ikan</router-link>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="fish in fishPrices" :key="fish.name" class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <p class="text-[10px] font-bold text-blue-600 uppercase">{{ fish.name }}</p>
          <p class="text-sm font-bold text-gray-800 dark:text-white mt-1">Rp {{ fish.price.toLocaleString('id-ID') }} /kg</p>
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

    <!-- Berita PPN Sibolga -->
    <section class="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Berita PPN Sibolga</h3>
      </div>
      <div class="space-y-4">
        <div v-for="news in beritaList" :key="news.id" class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
          <div class="flex items-start space-x-4">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', news.bg]">
              <component :is="news.icon" :class="['w-6 h-6', news.iconColor]" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ news.title }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ news.description }}</p>
              <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">{{ news.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom padding -->
    <div class="pb-8"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Clock, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  CloudLightning,
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
  MessageSquare,
  TrendingUp,
  Newspaper,
  Info,
  AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const selectedVesselId = ref(0)
const userRole = ref(localStorage.getItem('userRole') || 'umum')
const userName = ref(localStorage.getItem('userName') || 'Pengunjung')
const isLoading = ref(true)

// Dynamic data
const publicShips = ref<any[]>([])
const managedVessels = ref<any[]>([])
const latestActivity = ref<any>(null)
const fishPrices = ref<any[]>([])

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
    const formattedTime = timeStr ? timeStr.substring(0, 5) + ' WIB' : ''
    return formattedTime ? `${formattedDate}, ${formattedTime}` : formattedDate
  } catch (e) {
    return `${dateStr} ${timeStr || ''}`.trim()
  }
}

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const token = localStorage.getItem('token')
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Fetch Arrivals
    const resArrivals = await fetch(`${baseUrl}/arrivals`, { headers })
    const dataArrivals = await resArrivals.json()
    
    // Fetch Departures
    const resDepartures = await fetch(`${baseUrl}/departures`, { headers })
    const dataDepartures = await resDepartures.json()

    const arrivalsList = (dataArrivals.data?.data || []).map((item: any) => ({
      id: `arr-${item.id}`,
      name: item.vessel?.vessel_name || 'Kapal Tidak Diketahui',
      dock: item.landing_site?.site_name || '-',
      type: 'Kedatangan',
      time: formatDateTime(item.arrival_date, item.arrival_time),
      fishingGear: item.vessel?.fishing_gear || '-',
      gt: item.vessel?.gt || 0,
      vesselId: item.vessel_id
    }))

    const departuresList = (dataDepartures.data?.data || []).map((item: any) => ({
      id: `dep-${item.id}`,
      name: item.vessel?.vessel_name || 'Kapal Tidak Diketahui',
      dock: item.landing_site?.site_name || '-',
      type: 'Keberangkatan',
      time: formatDateTime(item.departure_date, item.departure_time),
      fishingGear: item.vessel?.fishing_gear || '-',
      gt: item.vessel?.gt || 0,
      vesselId: item.vessel_id
    }))

    const allShips = [...arrivalsList, ...departuresList]

    if (userRole.value === 'umum') {
      // Show latest 5 ships for public
      publicShips.value = allShips.slice(0, 5)
    }

    if (userRole.value === 'pengelola') {
      // Group unique vessels for vessel switcher
      const vesselMap = new Map()
      allShips.forEach((ship: any) => {
        if (!vesselMap.has(ship.vesselId)) {
          vesselMap.set(ship.vesselId, ship)
        }
      })
      managedVessels.value = Array.from(vesselMap.values())
      
      if (managedVessels.value.length > 0) {
        selectedVesselId.value = managedVessels.value[0].vesselId
      }

      // Latest activity
      if (allShips.length > 0) {
        latestActivity.value = allShips[0]
      }
    }

    // Fetch Fish prices (for umum)
    if (userRole.value === 'umum') {
      try {
        const resFish = await fetch(`${baseUrl}/fish`, { headers })
        const dataFish = await resFish.json()
        if (dataFish.status === 'success') {
          fishPrices.value = (dataFish.data || []).slice(0, 4).map((item: any) => ({
            name: item.name,
            price: item.base_price || 0
          }))
        }
      } catch (e) {
        console.error('Gagal mengambil data ikan:', e)
      }
    }

  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

const currentVessel = computed(() => managedVessels.value.find((v: any) => v.vesselId === selectedVesselId.value))

// Berita PPN Sibolga
const beritaList = [
  { 
    id: 1, 
    title: 'Operasional PPN Sibolga Normal 24 Jam', 
    description: 'PPN Sibolga melayani aktivitas bongkar muat dan pendaratan ikan selama 24 jam. Semua dermaga dalam kondisi baik.',
    date: '1 Mei 2026',
    icon: Newspaper,
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    iconColor: 'text-primary-600 dark:text-primary-400'
  },
  { 
    id: 2, 
    title: 'Peraturan Baru: Wajib Lapor SPR Digital', 
    description: 'Mulai bulan ini, semua pengelola kapal diwajibkan melaporkan SPR secara digital melalui aplikasi SAMOSIR.',
    date: '28 April 2026',
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  { 
    id: 3, 
    title: 'Peringatan Cuaca Buruk Perairan Sibolga', 
    description: 'BMKG mengeluarkan peringatan gelombang tinggi 2-4 meter di perairan Sibolga untuk 3 hari ke depan.',
    date: '27 April 2026',
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
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
  fetchDashboardData();
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
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
