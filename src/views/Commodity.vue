<template>
  <div class="px-5 py-6 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Komoditas</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Update harga & stok ikan hari ini</p>
      </div>
      <div class="bg-primary-50 dark:bg-primary-900/30 p-2.5 rounded-2xl">
        <Fish class="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
    </div>

    <!-- Market Overview -->
    <div class="grid grid-cols-3 gap-3 mb-8">
      <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
        <p class="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Total Stok</p>
        <h4 class="text-sm font-bold text-emerald-900 dark:text-emerald-300 mt-1">4.2 Ton</h4>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/30">
        <p class="text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase">Total Kapal</p>
        <h4 class="text-sm font-bold text-blue-900 dark:text-blue-300 mt-1">8 Armada</h4>
      </div>
      <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
        <p class="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase">Terfavorit</p>
        <h4 class="text-sm font-bold text-amber-900 dark:text-amber-300 mt-1">Udang</h4>
      </div>
    </div>

    <!-- Ship Manifests -->
    <section class="mb-8">
      <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 px-1 mb-4 flex items-center">
        <Anchor class="w-4 h-4 mr-2 text-primary-600" />
        Manifest Ikan Kapal (H-0)
      </h3>
      <div class="space-y-4">
        <div v-for="ship in manifests" :key="ship.name" class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 flex justify-between items-center">
            <h4 class="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">{{ ship.name }}</h4>
            <span class="text-[10px] font-medium text-gray-400">{{ ship.dock }}</span>
          </div>
          <div class="p-5 space-y-3">
            <div v-for="cargo in ship.cargo" :key="cargo.type" class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ cargo.emoji }}</span>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ cargo.type }}</span>
              </div>
              <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ cargo.amount }}</span>
            </div>
            <button class="w-full mt-2 py-2 text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              Kontak Pengelola
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Fish List -->
    <div class="space-y-4 pb-24">
      <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 px-1">Estimasi Harga Pasar</h3>
      <div v-for="item in commodities" :key="item.name" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-4">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl', item.bg]">
            {{ item.emoji }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ item.name }}</h4>
            <p class="text-[10px] text-gray-400 font-medium">Tersedia: {{ item.stock }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs font-bold text-gray-900 dark:text-white">Rp {{ item.price.toLocaleString() }}</p>
          <p class="text-[10px] text-emerald-600 font-medium">/ kg</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fish, TrendingUp, ShoppingCart, Anchor } from 'lucide-vue-next'

import { ref, onMounted } from 'vue'

const manifests = ref<any[]>([])
const commodities = ref<any[]>([])
const isLoading = ref(true)

const fishConfig: Record<string, { emoji: string, bg: string }> = {
  'Cakalang': { emoji: '🐟', bg: 'bg-blue-50 dark:bg-blue-900/10' },
  'Tuna': { emoji: '🐋', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
  'Udang': { emoji: '🦐', bg: 'bg-orange-50 dark:bg-orange-900/10' },
  'Kerapu': { emoji: '🐠', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
  'Cumi-cumi': { emoji: '🦑', bg: 'bg-slate-50 dark:bg-slate-900/10' },
  'default': { emoji: '🐟', bg: 'bg-gray-50 dark:bg-gray-900/10' }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const token = localStorage.getItem('token')
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    // Fetch Fish Species
    const resFish = await fetch(`${baseUrl}/fish`, { headers })
    const dataFish = await resFish.json()
    
    if (dataFish.status === 'success') {
      commodities.value = dataFish.data.map((item: any) => {
        const config = fishConfig[item.name] || fishConfig['default']
        return {
          name: item.name,
          stock: 'N/A', // API fish endpoint doesn't seem to have stock
          price: item.base_price || 0,
          emoji: config.emoji,
          bg: config.bg
        }
      })
    }

    // Fetch Arrivals for Manifests
    const resArrivals = await fetch(`${baseUrl}/arrivals`, { headers })
    const dataArrivals = await resArrivals.json()
    
    if (dataArrivals.status === 'success') {
      manifests.value = (dataArrivals.data.data || []).map((item: any) => ({
        name: item.vessel?.name || 'Unknown Vessel',
        dock: item.landing_site?.name || '-',
        cargo: (item.catches || []).map((c: any) => ({
          type: c.fish_species?.name || 'Unknown Fish',
          amount: `${c.weight} Kg`,
          emoji: (fishConfig[c.fish_species?.name] || fishConfig['default']).emoji
        }))
      })).filter((m: any) => m.cargo.length > 0).slice(0, 5)
    }

  } catch (error) {
    console.error('Gagal mengambil data komoditas:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
