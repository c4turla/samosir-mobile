<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Pelaporan</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Layanan Laporan Kedatangan, Keberangkatan & Jasa</p>
    </div>

    <!-- Alert Melengkapi Dokumen (Pengelola Only) -->
    <div v-if="hasIncompleteDocs" class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-5 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
      <div class="flex items-start space-x-3.5">
        <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle class="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-amber-800 dark:text-amber-400">Fitur Pelaporan Terkunci</h4>
          <p class="text-xs text-amber-700 dark:text-amber-505 mt-1 leading-relaxed">
            Anda belum melengkapi dokumen <span class="font-semibold">{{ missingDocs.join(' & ') }}</span>. 
            Aktivitas pelaporan dikunci sementara sampai dokumen Anda diunggah dan dilengkapi di profil.
          </p>
          <button 
            @click="router.push({ name: 'EditProfile' })"
            class="mt-3.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <span>Lengkapi Sekarang</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stats for Reporting -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 flex items-center justify-around text-center">
      <div>
        <h4 class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ approvedCount }}</h4>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Disetujui</p>
      </div>
      <div class="w-px h-10 bg-gray-100 dark:bg-slate-800"></div>
      <div>
        <h4 class="text-2xl font-bold text-amber-500 dark:text-amber-400">{{ pendingCount }}</h4>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Pending</p>
      </div>
      <div class="w-px h-10 bg-gray-100 dark:bg-slate-800"></div>
      <div>
        <h4 class="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{{ draftCount }}</h4>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Draft</p>
      </div>
    </div>

    <!-- Report Types Grid -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <button 
        @click="router.push({ name: 'CreateArrival' })"
        :disabled="hasIncompleteDocs"
        :class="[
          'p-5 rounded-3xl border text-left transition-all active:scale-95 flex flex-col justify-between h-36 w-full',
          hasIncompleteDocs 
            ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800/80 opacity-60 cursor-not-allowed' 
            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-primary-100'
        ]"
      >
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" :class="hasIncompleteDocs ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'">
          <Lock v-if="hasIncompleteDocs" class="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <LogIn v-else class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-800 dark:text-gray-200">E-Arrival</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Lapor Kedatangan</p>
        </div>
      </button>
      
      <button 
        @click="router.push({ name: 'CreateDeparture' })"
        :disabled="hasIncompleteDocs"
        :class="[
          'p-5 rounded-3xl border text-left transition-all active:scale-95 flex flex-col justify-between h-36 w-full',
          hasIncompleteDocs 
            ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800/80 opacity-60 cursor-not-allowed' 
            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-primary-100'
        ]"
      >
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" :class="hasIncompleteDocs ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-blue-50 dark:bg-blue-900/20'">
          <Lock v-if="hasIncompleteDocs" class="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <LogOut v-else class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-800 dark:text-gray-200">E-Departure</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Lapor Keberangkatan</p>
        </div>
      </button>

      <button 
        @click="router.push({ name: 'CreateService' })"
        :disabled="hasIncompleteDocs"
        :class="[
          'p-5 rounded-3xl border text-left transition-all active:scale-95 flex flex-col justify-between h-36 w-full',
          hasIncompleteDocs 
            ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800/80 opacity-60 cursor-not-allowed' 
            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-primary-100'
        ]"
      >
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" :class="hasIncompleteDocs ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-purple-50 dark:bg-purple-900/20'">
          <Lock v-if="hasIncompleteDocs" class="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <Wrench v-else class="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-800 dark:text-gray-200">Jasa Pelabuhan</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Lapor Air, Ice, Alat</p>
        </div>
      </button>

      <button 
        @click="router.push({ name: 'CreateSprDeparture' })"
        :disabled="hasIncompleteDocs"
        :class="[
          'p-5 rounded-3xl border text-left transition-all active:scale-95 flex flex-col justify-between h-36 w-full',
          hasIncompleteDocs 
            ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800/80 opacity-60 cursor-not-allowed' 
            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-primary-100'
        ]"
      >
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" :class="hasIncompleteDocs ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-amber-50 dark:bg-amber-900/20'">
          <Lock v-if="hasIncompleteDocs" class="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <Compass v-else class="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-800 dark:text-gray-200">SPR Keberangkatan</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Permohonan SPR</p>
        </div>
      </button>
    </div>

    <!-- Recent History / Timeline -->
    <section>
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 px-1">Timeline Laporan</h3>
      
      <div v-if="isLoadingHistory" class="space-y-4">
        <div class="h-24 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-gray-50 dark:border-slate-800"></div>
        <div class="h-24 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-gray-50 dark:border-slate-800"></div>
      </div>
      
      <div v-else-if="history.length === 0" class="py-12 text-center text-xs text-gray-400 dark:text-gray-500">
        Belum ada aktivitas pelaporan terdaftar.
      </div>
      
      <div v-else class="space-y-6 px-1">
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
              <span :class="['px-2 py-0.5 rounded text-[9px] font-bold uppercase', log.statusBg]">
                {{ log.status }}
              </span>
            </div>
            
            <div v-if="log.status === 'Pending'" class="mt-3 flex space-x-2">
              <div class="h-1 flex-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-amber-400 w-1/2"></div>
              </div>
              <span class="text-[10px] font-bold text-amber-500 dark:text-amber-400 italic">Verifikasi Petugas...</span>
            </div>

            <!-- Detail Button -->
            <div class="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800/60 flex justify-between items-center">
              <span class="text-[9px] text-gray-400 dark:text-gray-500">Pantau detail & progres</span>
              <button 
                type="button"
                @click="showDetail(log)"
                class="px-3 py-1.5 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl text-[10px] font-bold active:scale-95 transition-all flex items-center space-x-1"
              >
                <span>Detail</span>
                <ChevronRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DETAIL MODAL -->
    <Transition name="fade">
      <div v-if="isDetailModalOpen && selectedDetail" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" @click.self="closeDetailModal">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] border border-gray-150 dark:border-slate-800 p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-250">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{{ selectedDetail.type }}</span>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{{ selectedDetail.id }}</h3>
            </div>
            <button 
              @click="closeDetailModal" 
              class="p-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-gray-550 rounded-xl transition-all active:scale-90"
            >
              <ChevronRight class="w-4 h-4 transform rotate-90" />
            </button>
          </div>

          <!-- Visual Process Progress (Vertical Tracker) -->
          <div class="p-4 bg-gray-50 dark:bg-slate-950/40 rounded-3xl border border-gray-100 dark:border-slate-800/80 mb-5 space-y-3">
            <h4 class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status Alur Proses</h4>
            
            <div class="relative pl-6 space-y-4">
              <!-- Connector line -->
              <div class="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gray-200 dark:bg-slate-800"></div>
              
              <!-- Step 1: Submitted -->
              <div class="relative flex items-start">
                <div class="absolute -left-6 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10">
                  <CheckCircle2 class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 class="text-xs font-bold text-slate-800 dark:text-gray-200">Laporan Diajukan</h5>
                  <p class="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Laporan berhasil terkirim ke sistem.</p>
                </div>
              </div>

              <!-- Step 2: Verification -->
              <div class="relative flex items-start">
                <div :class="['absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center z-10 transition-colors duration-250', 
                  isStep2Completed ? 'bg-emerald-500 text-white' : (isStep2Pending ? 'bg-amber-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-slate-800 text-gray-400')
                ]">
                  <component :is="isStep2Completed ? CheckCircle2 : (isStep2Pending ? Clock : AlertCircle)" class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 class="text-xs font-bold" :class="isStep2Completed || isStep2Pending ? 'text-slate-800 dark:text-gray-200' : 'text-gray-400'">Verifikasi Petugas</h5>
                  <p class="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Sedang diverifikasi oleh Syahbandar/Petugas pelaksana.</p>
                </div>
              </div>

              <!-- Step 3: Approved / Selesai -->
              <div class="relative flex items-start">
                <div :class="['absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center z-10 transition-colors duration-250', 
                  isStep3Completed ? 'bg-emerald-500 text-white' : (isStep3Rejected ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400')
                ]">
                  <component :is="isStep3Completed ? CheckCircle2 : (isStep3Rejected ? AlertCircle : Clock)" class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 class="text-xs font-bold" :class="isStep3Completed ? 'text-slate-800 dark:text-gray-200' : (isStep3Rejected ? 'text-red-500' : 'text-gray-400')">Persetujuan Selesai</h5>
                  <p class="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {{ isStep3Completed ? 'Laporan disetujui & selesai diproses.' : (isStep3Rejected ? 'Laporan ditolak / dibatalkan.' : 'Proses persetujuan akhir.') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Scrollable detail parameters -->
          <div class="space-y-4 flex-1 overflow-y-auto max-h-[35vh] pr-1 scrollbar-thin">
            
            <!-- 1. E-ARRIVAL DETAILS -->
            <div v-if="selectedDetail.type === 'E-ARRIVAL'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-450 dark:text-gray-500 block text-[9px] uppercase font-bold">Kapal</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.vessel?.vessel_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-450 dark:text-gray-500 block text-[9px] uppercase font-bold">Dermaga Pendaratan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.landing_site?.site_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Asal Kapal</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.origin || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Tanggal Kedatangan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatDateTimeHuman(selectedDetail.rawItem.arrival_date, selectedDetail.rawItem.arrival_time) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Kualitas / Mutu</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.fish_quality || '-' }} / Mutu {{ selectedDetail.rawItem.mutu || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Suhu Palka / Ikan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.hold_temperature || 0 }}°C / {{ selectedDetail.rawItem.fish_temperature || 0 }}°C</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Harga Rata-rata</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">Rp {{ formatNumber(selectedDetail.rawItem.average_price) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Volume Limbah</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.waste_volume || 0 }} kg</span>
                </div>
              </div>
              
              <!-- Catches items list -->
              <div v-if="selectedDetail.rawItem.catches && selectedDetail.rawItem.catches.length > 0" class="mt-4">
                <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold mb-2">Hasil Tangkapan Ikan</span>
                <div class="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 space-y-2">
                  <div v-for="c in selectedDetail.rawItem.catches" :key="c.id" class="flex justify-between items-center text-xs border-b border-gray-150/40 dark:border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                    <span class="font-semibold text-gray-700 dark:text-gray-300">
                      {{ c.fish_species?.species_name || 'Ikan' }} <span class="text-[10px] text-gray-400 dark:text-gray-500">({{ c.fish_species?.local_name || '-' }})</span>
                    </span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ c.weight_kg }} kg</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. E-DEPARTURE DETAILS -->
            <div v-else-if="selectedDetail.type === 'E-DEPARTURE'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-450 dark:text-gray-550 block text-[9px] uppercase font-bold">Kapal</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.vessel?.vessel_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-450 dark:text-gray-550 block text-[9px] uppercase font-bold">Dermaga Keberangkatan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.landing_site?.site_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Tujuan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.destination || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Nakhoda / ABK</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.nakhoda_name || '-' }} ({{ selectedDetail.rawItem.crew_count || 0 }} ABK)</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Waktu Masuk</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200 truncate block">{{ formatDateTimeHuman(selectedDetail.rawItem.arrival_datetime) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Waktu Keluar</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200 truncate block">{{ formatDateTimeHuman(selectedDetail.rawItem.departure_date, selectedDetail.rawItem.departure_time) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Etmal Keberadaan</span>
                  <span class="font-bold text-slate-600 dark:text-slate-400">{{ selectedDetail.rawItem.etmal_days }} Etmal ({{ selectedDetail.rawItem.etmal_hours || '-' }})</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Syahbandar</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.syahbandar || '-' }}</span>
                </div>
              </div>
              
              <!-- Supplies section -->
              <div class="mt-4">
                <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold mb-2">Suplai & Logistik Kapal</span>
                <div class="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 text-center text-xs">
                  <div>
                    <span class="text-[8px] text-gray-400 block">Es</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.ice_supply || 0 }} kg</span>
                  </div>
                  <div class="border-l border-r border-gray-150/40 dark:border-slate-800/40">
                    <span class="text-[8px] text-gray-400 block">Air</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.water_supply || 0 }} L</span>
                  </div>
                  <div>
                    <span class="text-[8px] text-gray-400 block">Solar</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.diesel_supply || 0 }} L</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. JASA AIR DETAILS -->
            <div v-else-if="selectedDetail.type === 'JASA AIR'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-450 dark:text-gray-550 block text-[9px] uppercase font-bold">Kapal</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.vessel?.vessel_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-450 dark:text-gray-550 block text-[9px] uppercase font-bold">Pemohon</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.requester || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Tanggal Permintaan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatDateTimeHuman(selectedDetail.rawItem.request_date) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Volume</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.volume }} M3</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Harga per M3</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">Rp {{ formatNumber(selectedDetail.rawItem.price) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Petugas Lapangan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.field_officer || '-' }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Estimasi Pembayaran</span>
                  <span class="font-extrabold text-blue-600 dark:text-blue-400 text-sm block mt-0.5">Rp {{ formatNumber(selectedDetail.rawItem.total_payment) }}</span>
                </div>
              </div>
            </div>

            <!-- 4. JASA ALAT / ICE CRUISER DETAILS -->
            <div v-else-if="selectedDetail.type === 'JASA ALAT' || selectedDetail.type === 'ICE CRUISER'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-450 dark:text-gray-550 block text-[9px] uppercase font-bold">Penyewa</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.renter_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-450 dark:text-gray-550 block text-[9px] uppercase font-bold">Kapal</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.vessel?.vessel_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-550 block text-[9px] uppercase font-bold">Tanggal Pemakaian</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatDateTimeHuman(selectedDetail.rawItem.service_date, selectedDetail.rawItem.start_time) }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Petugas</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.officer || '-' }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold">Total Pembayaran</span>
                  <span class="font-extrabold text-blue-600 dark:text-blue-400 text-sm block mt-0.5">Rp {{ formatNumber(selectedDetail.rawItem.total_amount) }}</span>
                </div>
              </div>

              <!-- Equipment items sub-table -->
              <div v-if="selectedDetail.rawItem.items && selectedDetail.rawItem.items.length > 0" class="mt-4">
                <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold mb-2">Detail Peralatan</span>
                <div class="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 space-y-2">
                  <div v-for="i in selectedDetail.rawItem.items" :key="i.id" class="flex justify-between items-center text-xs border-b border-gray-150/40 dark:border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                    <span class="font-semibold text-gray-700 dark:text-gray-300">
                      {{ formatEquipmentName(i.equipment_name) }}
                    </span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ i.quantity }} Unit</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes Section -->
            <div v-if="selectedDetail.rawItem.notes || (selectedDetail.rawItem.additional_notes && selectedDetail.type !== 'SPR DEPARTURE')" class="mt-4 pt-2 border-t border-gray-100 dark:border-slate-800/50">
              <span class="text-gray-455 dark:text-gray-555 block text-[9px] uppercase font-bold mb-1.5">Catatan Tambahan</span>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-gray-100 dark:border-slate-800/80 leading-relaxed italic">
                "{{ selectedDetail.rawItem.notes || selectedDetail.rawItem.additional_notes }}"
              </p>
            </div>
            <div v-if="selectedDetail.type === 'SPR DEPARTURE' && parseNotes(selectedDetail.rawItem.additional_notes)?.catatan" class="mt-4 pt-2 border-t border-gray-100 dark:border-slate-800/50">
              <span class="text-gray-455 dark:text-gray-555 block text-[9px] uppercase font-bold mb-1.5">Catatan Tambahan</span>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-gray-100 dark:border-slate-800/80 leading-relaxed italic">
                "{{ parseNotes(selectedDetail.rawItem.additional_notes)?.catatan }}"
              </p>
            </div>

            <!-- 5. SPR DEPARTURE DETAILS -->
            <div v-else-if="selectedDetail.type === 'SPR DEPARTURE'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-450 dark:text-gray-555 block text-[9px] uppercase font-bold">Kapal</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.vessel?.vessel_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-450 dark:text-gray-555 block text-[9px] uppercase font-bold">Nakhoda</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.nakhoda_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-555 block text-[9px] uppercase font-bold">Kegiatan</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ parseNotes(selectedDetail.rawItem.additional_notes)?.kegiatan || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-455 dark:text-gray-555 block text-[9px] uppercase font-bold">Pemohon</span>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{{ parseNotes(selectedDetail.rawItem.additional_notes)?.pemohon || selectedDetail.rawItem.user?.name || '-' }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-gray-455 dark:text-gray-555 block text-[9px] uppercase font-bold">Rencana Keberangkatan</span>
                  <span class="font-extrabold text-blue-600 dark:text-blue-400 text-xs block mt-0.5">{{ formatDateTimeHuman(selectedDetail.rawItem.planned_departure_datetime) }}</span>
                </div>
              </div>

              <!-- Muatan section -->
              <div class="mt-4">
                <span class="text-gray-455 dark:text-gray-555 block text-[9px] uppercase font-bold mb-2">Muatan Kapal</span>
                <div v-if="parseMuatan(selectedDetail.rawItem.muatan)" class="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-955 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 text-center text-xs">
                  <div>
                    <span class="text-[8px] text-gray-400 block font-semibold">BBM</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ parseMuatan(selectedDetail.rawItem.muatan)?.bbm }}</span>
                  </div>
                  <div class="border-l border-r border-gray-150/40 dark:border-slate-800/40">
                    <span class="text-[8px] text-gray-400 block font-semibold">Air</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ parseMuatan(selectedDetail.rawItem.muatan)?.air }}</span>
                  </div>
                  <div>
                    <span class="text-[8px] text-gray-400 block font-semibold">Es</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ parseMuatan(selectedDetail.rawItem.muatan)?.es }}</span>
                  </div>
                </div>
                <div v-else class="bg-slate-50 dark:bg-slate-955 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 text-xs text-gray-855 dark:text-gray-200">
                  {{ selectedDetail.rawItem.muatan || '-' }}
                </div>
              </div>

              <!-- CP & Physical Checks -->
              <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/50">
                <span class="text-gray-455 dark:text-gray-500 block text-[9px] uppercase font-bold mb-2">Check Point & Cek Fisik</span>
                <div class="bg-slate-50 dark:bg-slate-955 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 space-y-3 text-xs">
                  <div>
                    <span class="text-[9px] text-gray-450 uppercase block font-bold">CP Masuk (Kedatangan)</span>
                    <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.cp_arrival_date ? formatDateTimeHuman(selectedDetail.rawItem.cp_arrival_date) : '-' }}</span>
                    <span v-if="selectedDetail.rawItem.cp_arrival_stbl" class="text-[9px] text-gray-500 block mt-0.5">No. STBL: {{ selectedDetail.rawItem.cp_arrival_stbl }}</span>
                  </div>
                  <div class="border-t border-gray-150/40 dark:border-slate-800/40 pt-2">
                    <span class="text-[9px] text-gray-455 uppercase block font-bold">CP Keluar (Keberangkatan)</span>
                    <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.cp_departure_date ? formatDateTimeHuman(selectedDetail.rawItem.cp_departure_date) : '-' }}</span>
                    <span v-if="selectedDetail.rawItem.cp_departure_stbl" class="text-[9px] text-gray-500 block mt-0.5">No. STBL: {{ selectedDetail.rawItem.cp_departure_stbl }}</span>
                  </div>
                  <div class="border-t border-gray-150/40 dark:border-slate-800/40 pt-2">
                    <span class="text-[9px] text-gray-455 uppercase block font-bold">Cek Fisik Masuk</span>
                    <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.physical_arrival_date ? formatDateTimeHuman(selectedDetail.rawItem.physical_arrival_date) : '-' }}</span>
                    <span v-if="selectedDetail.rawItem.physical_arrival_stbl" class="text-[9px] text-gray-500 block mt-0.5">No. STBL: {{ selectedDetail.rawItem.physical_arrival_stbl }}</span>
                  </div>
                  <div class="border-t border-gray-150/40 dark:border-slate-800/40 pt-2">
                    <span class="text-[9px] text-gray-455 uppercase block font-bold">Cek Fisik Keluar</span>
                    <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedDetail.rawItem.physical_departure_date ? formatDateTimeHuman(selectedDetail.rawItem.physical_departure_date) : '-' }}</span>
                    <span v-if="selectedDetail.rawItem.physical_departure_stbl" class="text-[9px] text-gray-500 block mt-0.5">No. STBL: {{ selectedDetail.rawItem.physical_departure_stbl }}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <!-- Modal Action -->
          <div class="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
            <button 
              @click="closeDetailModal"
              class="w-full py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl active:scale-95 transition-all text-center block"
            >
              Tutup Detail
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LogIn, 
  LogOut, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  AlertTriangle,
  Wrench,
  Compass
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()
const userRole = ref(localStorage.getItem('userRole') || 'umum')
const hasIncompleteDocs = ref(false)
const missingDocs = ref<string[]>([])

const history = ref<any[]>([])
const isLoadingHistory = ref(true)
const approvedCount = ref(0)
const pendingCount = ref(0)
const draftCount = ref(0)

const isDetailModalOpen = ref(false)
const selectedDetail = ref<any>(null)

const showDetail = (log: any) => {
  selectedDetail.value = log
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedDetail.value = null
}

const parseMuatan = (muatanStr: string) => {
  if (!muatanStr) return null
  const bbmMatch = muatanStr.match(/BBM:\s*([^,]+)/i)
  const airMatch = muatanStr.match(/AIR:\s*([^,]+)/i)
  const esMatch = muatanStr.match(/ES:\s*([^,]+)/i)
  if (!bbmMatch && !airMatch && !esMatch) return null
  return {
    bbm: bbmMatch?.[1]?.trim() || '-',
    air: airMatch?.[1]?.trim() || '-',
    es: esMatch?.[1]?.trim() || '-'
  }
}

const parseNotes = (notesStr: string) => {
  if (!notesStr) return null
  const kegiatanMatch = notesStr.match(/Kegiatan:\s*([^|]+)/i)
  const pemohonMatch = notesStr.match(/Pemohon:\s*([^|]+)/i)
  const catatanMatch = notesStr.match(/Catatan:\s*(.+)/i)
  
  if (!kegiatanMatch && !pemohonMatch) {
    return {
      kegiatan: '-',
      pemohon: '-',
      catatan: notesStr
    }
  }
  return {
    kegiatan: kegiatanMatch?.[1]?.trim() || '-',
    pemohon: pemohonMatch?.[1]?.trim() || '-',
    catatan: catatanMatch?.[1]?.trim() || ''
  }
}

const isStep2Completed = computed(() => {
  if (!selectedDetail.value) return false
  const status = selectedDetail.value.status
  if (selectedDetail.value.type === 'E-ARRIVAL' || selectedDetail.value.type === 'E-DEPARTURE') {
    return selectedDetail.value.rawItem.approval_status === 1 || selectedDetail.value.rawItem.approval_status === 2
  }
  return status === 'Diproses' || status === 'Approved' || status === 'Cancelled' || status === 'Rejected'
})

const isStep2Pending = computed(() => {
  if (!selectedDetail.value) return false
  const status = selectedDetail.value.status
  if (selectedDetail.value.type === 'E-ARRIVAL' || selectedDetail.value.type === 'E-DEPARTURE') {
    return selectedDetail.value.rawItem.approval_status === 0
  }
  return status === 'Pending'
})

const isStep3Completed = computed(() => {
  if (!selectedDetail.value) return false
  const status = selectedDetail.value.status
  if (selectedDetail.value.type === 'E-ARRIVAL' || selectedDetail.value.type === 'E-DEPARTURE') {
    return selectedDetail.value.rawItem.approval_status === 1
  }
  return status === 'Approved'
})

const isStep3Rejected = computed(() => {
  if (!selectedDetail.value) return false
  const status = selectedDetail.value.status
  if (selectedDetail.value.type === 'E-ARRIVAL' || selectedDetail.value.type === 'E-DEPARTURE') {
    return selectedDetail.value.rawItem.approval_status === 2
  }
  return status === 'Cancelled' || status === 'Rejected'
})

const checkDocuments = async () => {
  const token = localStorage.getItem('token')
  if (userRole.value === 'pengelola' && token) {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const user = data.data || data
        if (user) {
          if (user.id) {
            localStorage.setItem('userId', String(user.id))
          }
          const missing = []
          if (!user.id_card) missing.push('KTP')
          if (!user.authorization_letter) missing.push('Surat Kuasa')
          hasIncompleteDocs.value = missing.length > 0
          missingDocs.value = missing
        }
      }
    } catch (err) {
      console.error('Gagal memverifikasi dokumen:', err)
    }
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const isToday = d.toDateString() === today.toDateString()
    const isYesterday = d.toDateString() === yesterday.toDateString()

    if (isToday) {
      return 'Hari ini'
    } else if (isYesterday) {
      return 'Kemarin'
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }
  } catch (e) {
    return dateStr
  }
}

const formatDateTimeHuman = (dateVal: string, timeVal: string = '') => {
  if (!dateVal) return '-'
  try {
    let datePart = ''
    let timePart = ''
    if (dateVal.includes('T') || dateVal.includes(' ')) {
      const parts = dateVal.split(/[T ]/)
      datePart = parts[0] || ''
      if (parts[1]) timePart = parts[1].slice(0, 5)
    } else {
      datePart = dateVal
      timePart = timeVal ? timeVal.slice(0, 5) : ''
    }
    const dParts = datePart.split('-')
    if (dParts.length === 3) {
      const formattedDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`
      return timePart ? `${formattedDate} ${timePart}` : formattedDate
    }
    return dateVal
  } catch (e) {
    return dateVal
  }
}

const matchStatus = (status: string) => {
  if (status === 'order') return 'Pending'
  if (status === 'processed') return 'Diproses'
  if (status === 'completed') return 'Approved'
  if (status === 'cancelled') return 'Cancelled'
  return status
}

const getServiceStatusBg = (status: string) => {
  if (status === 'order') return 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400'
  if (status === 'processed') return 'bg-blue-50 text-blue-600 dark:bg-blue-955/20 dark:text-blue-400'
  if (status === 'completed') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400'
  if (status === 'cancelled') return 'bg-red-50 text-red-600 dark:bg-red-955/20 dark:text-red-400'
  return 'bg-gray-50 text-gray-600 dark:bg-gray-955/20 dark:text-gray-400'
}

const formatEquipmentName = (key: string) => {
  if (key === 'keranjang_plastik') return 'Keranjang Plastik'
  if (key === 'meja_sortir') return 'Meja Sortir'
  if (key === 'gerobak') return 'Gerobak'
  if (key === 'timbangan') return 'Timbangan'
  if (key === 'ice_cruiser') return 'Ice Cruiser'
  return key.replace(/_/g, ' ')
}

const formatNumber = (num: any) => {
  return new Intl.NumberFormat('id-ID').format(parseFloat(num) || 0)
}

const fetchHistory = async () => {
  isLoadingHistory.value = true
  const token = localStorage.getItem('token')
  if (!token) {
    isLoadingHistory.value = false
    return
  }

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  try {
    const [resArrivals, resDepartures, resServices, resSpr] = await Promise.all([
      fetch(`${API_URL}/arrivals?per_page=15`, { headers }),
      fetch(`${API_URL}/departures?per_page=15`, { headers }),
      fetch(`${API_URL}/services`, { headers }),
      fetch(`${API_URL}/spr-departures?per_page=15`, { headers }),
    ])

    let arrivalsData: any[] = []
    let departuresData: any[] = []
    let waterServicesData: any[] = []
    let eqServicesData: any[] = []
    let sprDeparturesData: any[] = []

    if (resArrivals.ok) {
      const json = await resArrivals.json()
      arrivalsData = json.data?.data || []
    }
    if (resDepartures.ok) {
      const json = await resDepartures.json()
      departuresData = json.data?.data || []
    }
    if (resServices.ok) {
      const json = await resServices.json()
      const dataS = json.data || {}
      waterServicesData = dataS.water || []
      eqServicesData = dataS.equipment || []
    }
    if (resSpr.ok) {
      const json = await resSpr.json()
      sprDeparturesData = json.data?.data || []
    }

    // Real stats count
    let approved = 0
    let pending = 0
    let draft = 0

    // Map Arrivals
    const arrivalsMapped = arrivalsData.map(item => {
      const vesselName = item.vessel ? item.vessel.vessel_name : 'Kapal'
      const statusLabel = item.approval_status === 1 ? 'Approved' : (item.approval_status === 2 ? 'Rejected' : 'Pending')
      
      if (item.approval_status === 1) approved++
      else if (item.approval_status === 0) pending++

      const statusBg = item.approval_status === 1 
        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400' 
        : (item.approval_status === 2 ? 'bg-red-50 text-red-600 dark:bg-red-955/20 dark:text-red-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400')
      
      const dotBg = item.approval_status === 1 ? 'bg-emerald-100 dark:bg-emerald-950/30' : (item.approval_status === 2 ? 'bg-red-100 dark:bg-red-950/30' : 'bg-amber-100 dark:bg-amber-950/30')
      const dotText = item.approval_status === 1 ? 'text-emerald-600 dark:text-emerald-400' : (item.approval_status === 2 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')

      return {
        type: 'E-ARRIVAL',
        typeColor: 'text-emerald-600 dark:text-emerald-400',
        title: `Kedatangan ${vesselName}`,
        date: formatDateTimeHuman(item.arrival_date, item.arrival_time),
        id: item.status || 'TAMBAT',
        status: statusLabel,
        statusBg: statusBg,
        icon: item.approval_status === 1 ? CheckCircle2 : (item.approval_status === 2 ? AlertCircle : Clock),
        dotBg: dotBg,
        dotText: dotText,
        rawDate: item.created_at || item.arrival_date,
        rawItem: item
      }
    })

    // Map Departures
    const departuresMapped = departuresData.map(item => {
      const vesselName = item.vessel ? item.vessel.vessel_name : 'Kapal'
      const statusLabel = item.approval_status === 1 ? 'Approved' : (item.approval_status === 2 ? 'Rejected' : 'Pending')
      
      if (item.approval_status === 1) approved++
      else if (item.approval_status === 0) pending++

      const statusBg = item.approval_status === 1 
        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400' 
        : (item.approval_status === 2 ? 'bg-red-50 text-red-600 dark:bg-red-955/20 dark:text-red-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400')
      
      const dotBg = item.approval_status === 1 ? 'bg-emerald-100 dark:bg-emerald-950/30' : (item.approval_status === 2 ? 'bg-red-100 dark:bg-red-950/30' : 'bg-amber-100 dark:bg-amber-950/30')
      const dotText = item.approval_status === 1 ? 'text-emerald-600 dark:text-emerald-400' : (item.approval_status === 2 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')

      return {
        type: 'E-DEPARTURE',
        typeColor: 'text-blue-600 dark:text-blue-400',
        title: `Keberangkatan ${vesselName}`,
        date: formatDateTimeHuman(item.departure_date, item.departure_time),
        id: item.nomor || 'E-DEP',
        status: statusLabel,
        statusBg: statusBg,
        icon: item.approval_status === 1 ? CheckCircle2 : (item.approval_status === 2 ? AlertCircle : Clock),
        dotBg: dotBg,
        dotText: dotText,
        rawDate: item.created_at || item.departure_date,
        rawItem: item
      }
    })

    // Map Water Services
    const waterMapped = waterServicesData.map(item => {
      const vesselName = item.vessel ? item.vessel.vessel_name : ''
      const statusLabel = matchStatus(item.status)
      const statusBg = getServiceStatusBg(item.status)

      if (item.status === 'completed') approved++
      else if (item.status === 'order' || item.status === 'processed') pending++

      const isCompleted = item.status === 'completed'
      const isCancelled = item.status === 'cancelled'
      const dotBg = isCompleted ? 'bg-emerald-100 dark:bg-emerald-950/30' : (isCancelled ? 'bg-red-100 dark:bg-red-950/30' : 'bg-amber-100 dark:bg-amber-950/30')
      const dotText = isCompleted ? 'text-emerald-600 dark:text-emerald-400' : (isCancelled ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')

      return {
        type: 'JASA AIR',
        typeColor: 'text-sky-600 dark:text-sky-400',
        title: `Jasa Air ${vesselName}`.trim(),
        date: formatDateTimeHuman(item.request_date) + ` • ${item.volume} M3`,
        id: item.order_number,
        status: statusLabel,
        statusBg: statusBg,
        icon: isCompleted ? CheckCircle2 : (isCancelled ? AlertCircle : Clock),
        dotBg: dotBg,
        dotText: dotText,
        rawDate: item.created_at || item.request_date,
        rawItem: item
      }
    })

    // Map Equipment Services
    const eqMapped = eqServicesData.map(item => {
      const vesselName = item.vessel ? item.vessel.vessel_name : ''
      const statusLabel = matchStatus(item.status)
      const statusBg = getServiceStatusBg(item.status)

      if (item.status === 'completed') approved++
      else if (item.status === 'order' || item.status === 'processed') pending++

      const isCompleted = item.status === 'completed'
      const isCancelled = item.status === 'cancelled'
      const dotBg = isCompleted ? 'bg-emerald-100 dark:bg-emerald-950/30' : (isCancelled ? 'bg-red-100 dark:bg-red-950/30' : 'bg-amber-100 dark:bg-amber-950/30')
      const dotText = isCompleted ? 'text-emerald-600 dark:text-emerald-400' : (isCancelled ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')

      const eqItemsCount = item.items ? item.items.length : 0
      const isIceCruiser = item.items && item.items.some((x: any) => x.equipment_name === 'ice_cruiser')
      const typeLabel = isIceCruiser ? 'ICE CRUISER' : 'JASA ALAT'
      const typeColor = isIceCruiser ? 'text-teal-600 dark:text-teal-400' : 'text-purple-600 dark:text-purple-400'
      const titleLabel = isIceCruiser 
        ? `Ice Cruiser ${vesselName || item.renter_name || ''}`.trim() 
        : `Jasa Alat ${vesselName || item.renter_name || ''}`.trim()

      return {
        type: typeLabel,
        typeColor: typeColor,
        title: titleLabel,
        date: formatDateTimeHuman(item.service_date, item.start_time) + (eqItemsCount > 0 ? ` • ${eqItemsCount} Item` : ''),
        id: item.order_number,
        status: statusLabel,
        statusBg: statusBg,
        icon: isCompleted ? CheckCircle2 : (isCancelled ? AlertCircle : Clock),
        dotBg: dotBg,
        dotText: dotText,
        rawDate: item.created_at || item.service_date,
        rawItem: item
      }
    })

    // Map SPR Departures
    const sprMapped = sprDeparturesData.map(item => {
      const vesselName = item.vessel ? item.vessel.vessel_name : 'Kapal'
      const statusLabel = item.status === 'approved' ? 'Approved' : (item.status === 'rejected' ? 'Rejected' : (item.status === 'processed' ? 'Diproses' : 'Pending'))
      
      if (item.status === 'approved') approved++
      else if (item.status === 'pending' || item.status === 'processed') pending++

      const statusBg = item.status === 'approved' 
        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400' 
        : (item.status === 'rejected' ? 'bg-red-50 text-red-650 dark:bg-red-955/20 dark:text-red-400' : (item.status === 'processed' ? 'bg-blue-50 text-blue-600 dark:bg-blue-955/20 dark:text-blue-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400'))
      
      const dotBg = item.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/30' : (item.status === 'rejected' ? 'bg-red-100 dark:bg-red-950/30' : 'bg-amber-100 dark:bg-amber-950/30')
      const dotText = item.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : (item.status === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')

      return {
        type: 'SPR DEPARTURE',
        typeColor: 'text-amber-600 dark:text-amber-400',
        title: `SPR Keberangkatan ${vesselName}`,
        date: formatDateTimeHuman(item.planned_departure_datetime),
        id: `SPR-${String(item.id).padStart(5, '0')}`,
        status: statusLabel,
        statusBg: statusBg,
        icon: item.status === 'approved' ? CheckCircle2 : (item.status === 'rejected' ? AlertCircle : Clock),
        dotBg: dotBg,
        dotText: dotText,
        rawDate: item.created_at || item.planned_departure_datetime,
        rawItem: item
      }
    })

    // Combine all and sort
    const combined = [
      ...arrivalsMapped,
      ...departuresMapped,
      ...waterMapped,
      ...eqMapped,
      ...sprMapped
    ]

    combined.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
    history.value = combined.slice(0, 10)

    approvedCount.value = approved
    pendingCount.value = pending
    draftCount.value = draft

  } catch (err) {
    console.error('Error fetching timeline history:', err)
  } finally {
    isLoadingHistory.value = false
  }
}

onMounted(() => {
  checkDocuments()
  fetchHistory()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
