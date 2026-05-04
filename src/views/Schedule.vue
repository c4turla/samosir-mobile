<template>
  <div class="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- Search Barrier -->
    <div class="px-5 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-20">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search class="w-5 h-5" />
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari kapal atau alat tangkap..." 
          class="block w-full pl-10 pr-3 py-3 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
        />
      </div>
      
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
      <div v-for="ship in filteredSchedules" :key="ship.id" class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
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

      <!-- Empty State -->
      <div v-if="filteredSchedules.length === 0" class="py-12 text-center">
        <div class="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-800">
          <Search class="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200">Tidak ada jadwal</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Coba filter atau kata kunci lain.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Anchor, MessageSquare, Users } from 'lucide-vue-next'

const router = useRouter()
const activeTab = ref('Semua')
const searchQuery = ref('')
const isLoading = ref(true)

const schedules = ref<any[]>([])

const fetchData = async () => {
  isLoading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const token = localStorage.getItem('token')
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    // Fetch Arrivals
    const resArrivals = await fetch(`${baseUrl}/arrivals`, { headers })
    const dataArrivals = await resArrivals.json()
    
    // Fetch Departures
    const resDepartures = await fetch(`${baseUrl}/departures`, { headers })
    const dataDepartures = await resDepartures.json()

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

    const arrivals = (dataArrivals.data.data || []).map((item: any) => ({
      id: `arr-${item.id}`,
      name: item.vessel?.vessel_name || 'Kapal Tidak Diketahui',
      captain: `${item.vessel?.fishing_gear || '-'} • ${item.vessel?.gt || '0'} GT`,
      type: 'Kedatangan',
      time: formatDateTime(item.arrival_date, item.arrival_time),
      dock: item.landing_site?.site_name || '-',
      crew: item.crew_count || 0
    }))

    const departures = (dataDepartures.data.data || []).map((item: any) => ({
      id: `dep-${item.id}`,
      name: item.vessel?.vessel_name || 'Kapal Tidak Diketahui',
      captain: `${item.vessel?.fishing_gear || '-'} • ${item.vessel?.gt || '0'} GT`,
      type: 'Keberangkatan',
      time: formatDateTime(item.departure_date, item.departure_time),
      dock: item.landing_site?.site_name || '-',
      crew: item.crew_count || 0
    }))

    schedules.value = [...arrivals, ...departures]
  } catch (error) {
    console.error('Gagal mengambil jadwal:', error)
  } finally {
    isLoading.value = false
  }
}

import { onMounted } from 'vue'
onMounted(() => {
  fetchData()
})

const filteredSchedules = computed(() => {
  return schedules.value.filter(ship => {
    const matchesTab = activeTab.value === 'Semua' || ship.type === activeTab.value
    const matchesSearch = ship.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          ship.captain.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesTab && matchesSearch
  })
})

const goToChat = (ship: any) => {
  router.push('/chat')
}
</script>
