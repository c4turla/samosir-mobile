<template>
  <div class="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- Search and Date Filter Row -->
    <div class="px-5 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-20">
      <div class="flex space-x-2">
        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search class="w-5 h-5" />
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari kapal atau dermaga..." 
            class="block w-full pl-10 pr-3 py-3 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <button 
          @click="showDateFilter = !showDateFilter"
          :class="[
            'px-4 rounded-2xl border flex items-center justify-center transition-all active:scale-95',
            showDateFilter || dateFrom || dateTo
              ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400' 
              : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'
          ]"
          aria-label="Filter Tanggal"
        >
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <!-- Date Filter Panel -->
      <Transition name="slide-fade">
        <div v-if="showDateFilter" class="mt-3 p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center">
              <Calendar class="w-4 h-4 mr-1.5 text-primary-500" />
              Filter Rentang Tanggal
            </span>
            <button 
              v-if="dateFrom || dateTo"
              @click="clearDateFilter"
              class="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
            >
              Hapus Filter
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Mulai</label>
              <input 
                v-model="dateFrom"
                type="date"
                class="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Selesai</label>
              <input 
                v-model="dateTo"
                type="date"
                class="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Transition>
      
      <!-- Filter Tabs -->
      <div class="flex space-x-2 mt-4">
        <button 
          v-for="tab in ['Semua', 'Kedatangan', 'Keberangkatan']" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-2 rounded-full text-xs font-bold transition-all',
            activeTab === tab 
              ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none' 
              : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 py-2 space-y-4 pb-24">
      <div v-for="ship in schedules" :key="ship.id" class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Anchor class="w-6 h-6 text-slate-400 dark:text-gray-500" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white leading-tight">{{ ship.name }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ ship.captain }}</p>
            </div>
          </div>
          <span 
            :class="[
              'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider',
              ship.type === 'Kedatangan' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            ]"
          >
            {{ ship.type }}
          </span>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-4 py-4 border-y border-dashed border-gray-100 dark:border-slate-800">
          <div>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">Waktu</p>
            <p class="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{{ ship.time }}</p>
          </div>
          <div>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">Dermaga</p>
            <p class="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{{ ship.dock }}</p>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Users class="w-4 h-4 mr-1" />
            <span>{{ ship.crew }} Kru</span>
          </div>
          <button 
            @click="goToChat(ship)"
            class="flex items-center space-x-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 py-2 px-4 rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            <MessageSquare class="w-4 h-4" />
            <span>Chat Pengelola</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && schedules.length === 0" class="py-12 flex flex-col items-center justify-center">
        <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">Memuat jadwal...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && schedules.length === 0" class="py-12 text-center">
        <div class="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-800">
          <Search class="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200">Tidak ada jadwal</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Coba filter atau kata kunci lain.</p>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="pt-2 flex justify-center">
        <button 
          @click="loadMore"
          :disabled="isLoading"
          class="w-full py-3 px-4 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 text-gray-700 dark:text-gray-300 font-bold text-xs border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-gray-500/20 border-t-gray-500 rounded-full animate-spin"></span>
          <span>{{ isLoading ? 'Memuat...' : 'Muat Lebih Banyak' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Anchor, MessageSquare, Users, Filter, Calendar } from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()
const activeTab = ref('Semua')
const searchQuery = ref('')
const isLoading = ref(true)

const dateFrom = ref('')
const dateTo = ref('')
const showDateFilter = ref(false)

const schedules = ref<any[]>([])
const arrivalsPage = ref(1)
const departuresPage = ref(1)
const arrivalsHasMore = ref(false)
const departuresHasMore = ref(false)

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

const mapArrival = (item: any) => ({
  id: `arr-${item.id}`,
  name: item.vessel?.vessel_name || 'Kapal Tidak Diketahui',
  captain: `${item.vessel?.fishing_gear || '-'} • ${item.vessel?.gt || '0'} GT`,
  type: 'Kedatangan',
  time: formatDateTime(item.arrival_date, item.arrival_time),
  dock: item.landing_site?.site_name || '-',
  crew: item.crew_count || 0,
  rawDate: item.arrival_date,
  rawTime: item.arrival_time
})

const mapDeparture = (item: any) => ({
  id: `dep-${item.id}`,
  name: item.vessel?.vessel_name || 'Kapal Tidak Diketahui',
  captain: `${item.vessel?.fishing_gear || '-'} • ${item.vessel?.gt || '0'} GT`,
  type: 'Keberangkatan',
  time: formatDateTime(item.departure_date, item.departure_time),
  dock: item.landing_site?.site_name || '-',
  crew: item.crew_count || 0,
  rawDate: item.departure_date,
  rawTime: item.departure_time
})

const clearDateFilter = () => {
  dateFrom.value = ''
  dateTo.value = ''
}

const fetchSchedules = async (append = false) => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    if (!append) {
      arrivalsPage.value = 1
      departuresPage.value = 1
      schedules.value = []
    }

    let backendType = 'all'
    if (activeTab.value === 'Kedatangan') {
      backendType = 'arrivals'
    } else if (activeTab.value === 'Keberangkatan') {
      backendType = 'departures'
    }

    const params = new URLSearchParams()
    params.append('type', backendType)
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }
    if (dateFrom.value) {
      params.append('date_from', dateFrom.value)
    }
    if (dateTo.value) {
      params.append('date_to', dateTo.value)
    }

    if (backendType === 'all') {
      params.append('arrivals_page', String(arrivalsPage.value))
      params.append('departures_page', String(departuresPage.value))
    } else if (backendType === 'arrivals') {
      params.append('arrivals_page', String(arrivalsPage.value))
    } else if (backendType === 'departures') {
      params.append('departures_page', String(departuresPage.value))
    }

    const response = await fetch(`${API_URL}/schedules?${params.toString()}`, { headers })
    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        const payload = data.data

        let newArrivals: any[] = []
        let newDepartures: any[] = []

        if (backendType === 'all') {
          const arrData = payload.arrivals || {}
          const depData = payload.departures || {}

          newArrivals = (arrData.data || []).map(mapArrival)
          newDepartures = (depData.data || []).map(mapDeparture)

          arrivalsHasMore.value = !!arrData.next_page_url
          departuresHasMore.value = !!depData.next_page_url
        } else if (backendType === 'arrivals') {
          newArrivals = (payload.data || []).map(mapArrival)
          arrivalsHasMore.value = !!payload.next_page_url
          departuresHasMore.value = false
        } else if (backendType === 'departures') {
          newDepartures = (payload.data || []).map(mapDeparture)
          departuresHasMore.value = !!payload.next_page_url
          arrivalsHasMore.value = false
        }

        const newItems = [...newArrivals, ...newDepartures]

        if (append) {
          schedules.value = [...schedules.value, ...newItems]
        } else {
          schedules.value = newItems
        }

        // Sort schedules by rawDate desc, rawTime desc
        schedules.value.sort((a, b) => {
          const dateA = a.rawDate ? new Date(a.rawDate) : new Date(0)
          const dateB = b.rawDate ? new Date(b.rawDate) : new Date(0)
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime()
          }
          const timeA = a.rawTime || ''
          const timeB = b.rawTime || ''
          return timeB.localeCompare(timeA)
        })
      }
    }
  } catch (error) {
    console.error('Gagal mengambil jadwal:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (activeTab.value === 'Semua') {
    if (arrivalsHasMore.value) arrivalsPage.value++
    if (departuresHasMore.value) departuresPage.value++
  } else if (activeTab.value === 'Kedatangan' && arrivalsHasMore.value) {
    arrivalsPage.value++
  } else if (activeTab.value === 'Keberangkatan' && departuresHasMore.value) {
    departuresPage.value++
  }
  await fetchSchedules(true)
}

const hasMore = computed(() => {
  if (activeTab.value === 'Semua') {
    return arrivalsHasMore.value || departuresHasMore.value
  } else if (activeTab.value === 'Kedatangan') {
    return arrivalsHasMore.value
  } else if (activeTab.value === 'Keberangkatan') {
    return departuresHasMore.value
  }
  return false
})

watch(activeTab, () => {
  fetchSchedules(false)
})

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchSchedules(false)
  }, 500)
})

watch([dateFrom, dateTo], () => {
  fetchSchedules(false)
})

onMounted(() => {
  fetchSchedules(false)
})

const goToChat = (ship: any) => {
  router.push({ name: 'Chat' })
}
</script>

<style scoped>
/* Slide transition for filter drawer */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>