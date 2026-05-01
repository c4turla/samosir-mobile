<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Pelaporan</h2>
      <button class="bg-primary-600 text-white p-2.5 rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none transition-transform active:scale-95">
        <Plus class="w-6 h-6" />
      </button>
    </div>

    <!-- Stats for Reporting -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 flex items-center justify-around text-center">
      <div>
        <h4 class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">12</h4>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Disetujui</p>
      </div>
      <div class="w-px h-10 bg-gray-100 dark:bg-slate-800"></div>
      <div>
        <h4 class="text-2xl font-bold text-amber-500 dark:text-amber-400">2</h4>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Pending</p>
      </div>
      <div class="w-px h-10 bg-gray-100 dark:bg-slate-800"></div>
      <div>
        <h4 class="text-2xl font-bold text-indigo-500 dark:text-indigo-400">3</h4>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Draft</p>
      </div>
    </div>

    <!-- Report Types Grid -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <button class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm text-left hover:border-primary-100 transition-all active:scale-95">
        <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-3">
          <LogIn class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p class="text-sm font-bold text-gray-800 dark:text-gray-200">E-Arrival</p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Lapor Kedatangan</p>
      </button>
      <button class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm text-left hover:border-primary-100 transition-all active:scale-95">
        <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-3">
          <LogOut class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="text-sm font-bold text-gray-800 dark:text-gray-200">E-Departure</p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Lapor Keberangkatan</p>
      </button>
      <button class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm text-left hover:border-primary-100 transition-all active:scale-95 col-span-2 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
            <ClipboardList class="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800 dark:text-gray-200">Logbook Tangkapan</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Input hasil tangkapan harian</p>
          </div>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-300 dark:text-gray-600" />
      </button>
    </div>

    <!-- Recent History / Timeline -->
    <section>
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 px-1">Timeline Laporan</h3>
      <div class="space-y-6 px-1">
        <div v-for="(log, idx) in history" :key="idx" class="relative pl-8">
          <!-- Timeline Connector -->
          <div v-if="idx !== history.length - 1" class="absolute left-3.5 top-8 bottom-0 w-px bg-gray-100 dark:bg-slate-800"></div>
          
          <!-- Timeline Dot -->
          <div :class="['absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center z-10 shadow-sm', log.dotBg]">
            <component :is="log.icon" :class="['w-3.5 h-3.5', log.dotText]" />
          </div>
          
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-50 dark:border-slate-800 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-bold" :class="log.typeColor">{{ log.type }}</p>
                <h4 class="text-sm font-bold text-slate-800 dark:text-gray-200 mt-1">{{ log.title }}</h4>
                <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{{ log.date }} • {{ log.id }}</p>
              </div>
              <span :class="['px-2 py-0.5 rounded text-[9px] font-bold uppercase', log.statusBg, log.statusText]">
                {{ log.status }}
              </span>
            </div>
            
            <div v-if="log.status === 'Pending'" class="mt-3 flex space-x-2">
              <div class="h-1 flex-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-amber-400 w-1/2"></div>
              </div>
              <span class="text-[10px] font-bold text-amber-500 dark:text-amber-400 italic">Verifikasi Petugas...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { 
  Plus, 
  LogIn, 
  LogOut, 
  ClipboardList, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-vue-next'

const history = [
  {
    type: 'E-ARRIVAL',
    typeColor: 'text-emerald-600',
    title: 'Kedatangan KM. Samudra Jaya VII',
    date: 'Hari ini, 08:30',
    id: 'REQ-88291',
    status: 'Pending',
    statusBg: 'bg-amber-50',
    statusText: 'text-amber-600',
    icon: Clock,
    dotBg: 'bg-amber-100',
    dotText: 'text-amber-600'
  },
  {
    type: 'LOGBOOK',
    typeColor: 'text-amber-600',
    title: 'Input Hasil Tangkapan (Cakalang)',
    date: 'Kemarin, 17:00',
    id: 'LOG-99210',
    status: 'Approved',
    statusBg: 'bg-emerald-50',
    statusText: 'text-emerald-600',
    icon: CheckCircle2,
    dotBg: 'bg-emerald-100',
    dotText: 'text-emerald-600'
  },
  {
    type: 'E-DEPARTURE',
    typeColor: 'text-blue-600',
    title: 'Rencana Keberangkatan Armada',
    date: '28 Apr 2026, 10:15',
    id: 'REQ-88100',
    status: 'Approved',
    statusBg: 'bg-emerald-50',
    statusText: 'text-emerald-600',
    icon: CheckCircle2,
    dotBg: 'bg-emerald-100',
    dotText: 'text-emerald-600'
  }
]
</script>
