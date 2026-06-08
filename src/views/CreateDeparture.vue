<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="p-2.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Lapor Keberangkatan</h2>
          <p class="text-xs text-gray-500 mt-0.5">E-Departure Pelaporan Keberangkatan Kapal</p>
        </div>
      </div>
    </div>

    <!-- Alert / Toast Message -->
    <Transition name="fade">
      <div v-if="pageMessage.text" :class="[
        'p-4 rounded-2xl text-xs font-semibold flex items-start space-x-2 mb-6 border animate-in fade-in duration-200',
        pageMessage.type === 'success' 
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
          : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
      ]">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ pageMessage.text }}</span>
      </div>
    </Transition>

    <div v-if="isLoadingData" class="space-y-4 py-8">
      <div class="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse p-5"></div>
      <div class="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse p-5"></div>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm pb-8 space-y-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- KAPAL SELECT (Searchable Select2 Style) -->
        <div class="relative" :class="{ 'z-30': isVesselDropdownOpen }">
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Kapal Kelolaan <span class="text-red-500">*</span></label>
          <button 
            type="button"
            @click="toggleVesselDropdown"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 flex justify-between items-center text-left"
          >
            <span>
              {{ selectedVessel ? `${selectedVessel.vessel_name} (${selectedVessel.license_number})` : 'Cari & pilih kapal...' }}
            </span>
            <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'transform rotate-180': isVesselDropdownOpen }" />
          </button>

          <div v-if="isVesselDropdownOpen" class="absolute z-30 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[240px]">
            <div class="p-2.5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                  <Search class="w-4 h-4" />
                </span>
                <input 
                  v-model="vesselQuery"
                  type="text"
                  placeholder="Cari kapal kelolaan..."
                  class="w-full pl-8 pr-3 py-2 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
              <div v-if="filteredVessels.length === 0" class="py-6 text-center text-xs text-gray-500">Kapal tidak ditemukan.</div>
              <button
                v-else
                v-for="v in filteredVessels"
                :key="v.id"
                type="button"
                @click="selectVessel(v)"
                class="w-full px-4 py-3 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-750 flex flex-col"
              >
                <span class="font-bold text-gray-900 dark:text-white">{{ v.vessel_name }}</span>
                <span class="text-[10px] text-gray-500 mt-0.5">Izin: {{ v.license_number || '-' }} • {{ v.gt }} GT</span>
              </button>
            </div>
          </div>
        </div>

        <!-- NAKHODA & ABK -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Nama Nakhoda</label>
            <input 
              v-model="form.nakhoda_name"
              type="text"
              placeholder="Nama nakhoda"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Jumlah ABK</label>
            <input 
              v-model.number="form.crew_count"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- TUJUAN -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Tujuan Keberangkatan <span class="text-red-500">*</span></label>
          <input 
            v-model="form.destination"
            type="text"
            required
            placeholder="Contoh: Selat Malaka, Laut Arafura"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
          />
        </div>

        <!-- DERMAGA SELECT (Searchable Select2 Style) -->
        <div class="relative" :class="{ 'z-30': isLandingSiteDropdownOpen }">
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Dermaga Keberangkatan</label>
          <button 
            type="button"
            @click="toggleLandingSiteDropdown"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 flex justify-between items-center text-left"
          >
            <span>
              {{ selectedLandingSite ? selectedLandingSite.site_name : 'Cari & pilih dermaga...' }}
            </span>
            <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'transform rotate-180': isLandingSiteDropdownOpen }" />
          </button>

          <div v-if="isLandingSiteDropdownOpen" class="absolute z-30 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[240px]">
            <div class="p-2.5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                  <Search class="w-4 h-4" />
                </span>
                <input 
                  v-model="landingSiteQuery"
                  type="text"
                  placeholder="Cari dermaga..."
                  class="w-full pl-8 pr-3 py-2 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
              <div v-if="filteredLandingSites.length === 0" class="py-6 text-center text-xs text-gray-500">Dermaga tidak ditemukan.</div>
              <button
                v-else
                v-for="site in filteredLandingSites"
                :key="site.id"
                type="button"
                @click="selectLandingSite(site)"
                class="w-full px-4 py-3.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-750 font-medium"
              >
                {{ site.site_name }} ({{ site.site_type }})
              </button>
            </div>
          </div>
        </div>

        <!-- TANGGAL & WAKTU MASUK & KELUAR -->
        <div class="space-y-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800">
          <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">Rentang Waktu Keberadaan Kapal</h4>
          
          <div class="space-y-3">
            <div>
              <label class="text-[9px] font-bold text-gray-450 dark:text-gray-500 uppercase block mb-1">Waktu Masuk Pelabuhan <span class="text-red-500">*</span></label>
              <input 
                v-model="form.arrival_datetime"
                type="datetime-local"
                required
                class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-755 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-455 dark:text-gray-500 uppercase block mb-1">Waktu Keluar / Keberangkatan <span class="text-red-500">*</span></label>
              <input 
                v-model="form.departure_datetime"
                type="datetime-local"
                required
                class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-755 rounded-xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Etmal Display Block -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-150 dark:border-slate-800">
              <span class="text-[9px] text-gray-400 uppercase font-bold block mb-1">Etmal Tambat</span>
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">{{ form.etmal_days }} Etmal</span>
            </div>
            <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-150 dark:border-slate-800">
              <span class="text-[9px] text-gray-400 uppercase font-bold block mb-1">Total Waktu</span>
              <span class="text-xs font-bold text-gray-700 dark:text-gray-300 truncate block">{{ form.etmal_hours || '0 Jam' }}</span>
            </div>
          </div>
        </div>

        <!-- SYAHBANDAR SELECT -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Syahbandar</label>
          <select 
            v-model="form.syahbandar"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
          >
            <option value="">Pilih Syahbandar</option>
            <option v-for="user in syahbandarsList" :key="user.id" :value="user.name">
              {{ user.name }}
            </option>
          </select>
        </div>

        <!-- STATUS KEGIATAN -->
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pb-2">Status Kegiatan</h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Floating</label>
              <input 
                v-model="form.floating_status"
                type="text"
                placeholder="Status floating"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Bongkar Ikan</label>
              <input 
                v-model="form.unloading_status"
                type="text"
                placeholder="Status bongkar"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Penyelesaian Administrasi</label>
            <select 
              v-model="form.admin_completion"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            >
              <option value="">Pilih Administrasi</option>
              <option value="Cek Poin">Cek Poin</option>
              <option value="Cek Fisik">Cek Fisik</option>
              <option value="Surat Keterangan">Surat Keterangan</option>
              <option value="Perberkalan">Perberkalan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <!-- INFO MUATAN / SUPLAI -->
        <div class="space-y-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800">
          <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200/50 dark:border-slate-800 pb-2">Info Muatan & Logistik</h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[9px] font-bold text-gray-450 dark:text-gray-500 uppercase block mb-1">Es (kg)</label>
              <input 
                v-model.number="form.ice_supply"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-450 dark:text-gray-500 uppercase block mb-1">Air (liter)</label>
              <input 
                v-model.number="form.water_supply"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-455 dark:text-gray-500 uppercase block mb-1">Solar (liter)</label>
              <input 
                v-model.number="form.diesel_supply"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-455 dark:text-gray-500 uppercase block mb-1">Oli (liter)</label>
              <input 
                v-model.number="form.oil_supply"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-455 dark:text-gray-500 uppercase block mb-1">Umpan (kg)</label>
              <input 
                v-model.number="form.gasoline_supply"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-455 dark:text-gray-500 uppercase block mb-1">Lain-lain</label>
              <input 
                v-model="form.other_supplies"
                type="text"
                placeholder="Muatan lainnya"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- STATUS KEBERANGKATAN -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Status Keberangkatan <span class="text-red-500">*</span></label>
            <select 
              v-model="form.status"
              required
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            >
              <option value="Sesuai Jadwal">Sesuai Jadwal</option>
              <option value="Pembatalan">Pembatalan</option>
              <option value="Ditunda">Ditunda</option>
            </select>
          </div>
        </div>

        <!-- CATATAN -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Catatan Tambahan</label>
          <textarea 
            v-model="form.notes"
            placeholder="Tambahkan catatan jika ada..."
            rows="3"
            class="w-full px-4 py-3.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs rounded-2xl focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- ACTIONS -->
        <div class="pt-4 flex items-center space-x-3 border-t border-gray-100 dark:border-slate-800">
          <button 
            type="button" 
            @click="goBack" 
            class="flex-1 py-3.5 border border-gray-200 dark:border-slate-750 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl active:scale-95 transition-all text-center"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 active:scale-95 shadow-md shadow-primary-200 dark:shadow-none"
          >
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Laporan' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  ChevronDown, 
  Search, 
  AlertCircle 
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()

// UI & Data Loading States
const isLoadingData = ref(true)
const isSubmitting = ref(false)
const isVesselDropdownOpen = ref(false)
const isLandingSiteDropdownOpen = ref(false)

// Dropdowns search queries
const vesselQuery = ref('')
const landingSiteQuery = ref('')

// Lists
const vesselsList = ref<any[]>([])
const landingSitesList = ref<any[]>([])
const syahbandarsList = ref<any[]>([])

// Selections
const selectedVessel = ref<any | null>(null)
const selectedLandingSite = ref<any | null>(null)

// Toast message
const pageMessage = ref({ type: 'success', text: '' })

const showPageMessage = (type: 'success' | 'error', text: string) => {
  pageMessage.value = { type, text }
  setTimeout(() => {
    pageMessage.value.text = ''
  }, 5000)
}

// Form state
const form = ref({
  vessel_id: '',
  nakhoda_name: '',
  destination: '',
  crew_count: '' as string | number,
  arrival_datetime: '',
  departure_date: new Date().toISOString().split('T')[0],
  departure_time: '',
  departure_datetime: '',
  landing_site_id: '',
  syahbandar: '',
  ice_supply: '' as string | number,
  water_supply: '' as string | number,
  diesel_supply: '' as string | number,
  oil_supply: '' as string | number,
  gasoline_supply: '' as string | number,
  other_supplies: '',
  notes: '',
  floating_status: '',
  unloading_status: '',
  admin_completion: '',
  status: 'Sesuai Jadwal',
  etmal_days: 0,
  etmal_hours: '0 Jam',
})

const goBack = () => {
  router.push({ name: 'Report' })
}

// Filters computed
const filteredVessels = computed(() => {
  if (!vesselQuery.value.trim()) return vesselsList.value
  const q = vesselQuery.value.toLowerCase().trim()
  return vesselsList.value.filter(v => 
    (v.vessel_name || '').toLowerCase().includes(q)
  )
})

const filteredLandingSites = computed(() => {
  if (!landingSiteQuery.value.trim()) return landingSitesList.value
  const q = landingSiteQuery.value.toLowerCase().trim()
  return landingSitesList.value.filter(s => 
    (s.site_name || '').toLowerCase().includes(q)
  )
})

// Dropdown controls
const toggleVesselDropdown = () => {
  isVesselDropdownOpen.value = !isVesselDropdownOpen.value
  if (isVesselDropdownOpen.value) {
    vesselQuery.value = ''
    isLandingSiteDropdownOpen.value = false
  }
}

const selectVessel = (v: any) => {
  selectedVessel.value = v
  form.value.vessel_id = v.id
  isVesselDropdownOpen.value = false
}

const toggleLandingSiteDropdown = () => {
  isLandingSiteDropdownOpen.value = !isLandingSiteDropdownOpen.value
  if (isLandingSiteDropdownOpen.value) {
    landingSiteQuery.value = ''
    isVesselDropdownOpen.value = false
  }
}

const selectLandingSite = (s: any) => {
  selectedLandingSite.value = s
  form.value.landing_site_id = s.id
  isLandingSiteDropdownOpen.value = false
}

// Watcher for real-time Etmal calculation (same as web app logic)
watch([() => form.value.arrival_datetime, () => form.value.departure_datetime], () => {
  if (!form.value.arrival_datetime || !form.value.departure_datetime) {
    form.value.etmal_days = 0
    form.value.etmal_hours = '0 Jam'
    return
  }

  const arrival = new Date(form.value.arrival_datetime)
  const departure = new Date(form.value.departure_datetime)

  if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
    form.value.etmal_days = 0
    form.value.etmal_hours = '0 Jam'
    return
  }

  const diffMs = departure.getTime() - arrival.getTime()
  if (diffMs <= 0) {
    form.value.etmal_days = 0
    form.value.etmal_hours = '0 Jam'
    return
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(totalMinutes / 60)
  const remainingHours = diffHours % 24
  const remainingMinutes = totalMinutes % 60

  let etcDays = Math.floor(diffHours / 24)
  let etcHours = '0'

  if (remainingHours > 0 || remainingMinutes > 0) {
    if (remainingHours <= 6) {
      etcHours = '0.25'
    } else if (remainingHours <= 12) {
      etcHours = '0.50'
    } else if (remainingHours <= 18) {
      etcHours = '0.75'
    } else {
      etcDays += 1
      etcHours = '0'
    }
  }

  form.value.etmal_days = parseFloat((etcDays + parseFloat(etcHours)).toFixed(2))
  
  const totalMin = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(totalMin / 60)
  const minutes = totalMin % 60
  
  let timeStr = ''
  if (hours > 0) timeStr += `${hours} Jam `
  if (minutes > 0) timeStr += `${minutes} Menit`
  if (!timeStr) timeStr = '0 Jam'
  
  form.value.etmal_hours = timeStr.trim()
})

// Fetch initial data
const loadInitialData = async () => {
  isLoadingData.value = true
  const token = localStorage.getItem('token')
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  try {
    // 1. Fetch user's approved vessels
    const resVessels = await fetch(`${API_URL}/vessels/my-vessels?status=approved&per_page=100`, { headers })
    if (resVessels.ok) {
      const dataV = await resVessels.json()
      vesselsList.value = dataV.data?.data || []
    }

    // 2. Fetch active landing sites
    const resSites = await fetch(`${API_URL}/landing-sites`, { headers })
    if (resSites.ok) {
      const dataS = await resSites.json()
      landingSitesList.value = dataS.data || []
    }

    // 3. Fetch syahbandars
    const resSyahbandar = await fetch(`${API_URL}/syahbandars`, { headers })
    if (resSyahbandar.ok) {
      const dataSy = await resSyahbandar.json()
      syahbandarsList.value = dataSy.data || []
    }

  } catch (err) {
    console.error('Error loading initial lists:', err)
    showPageMessage('error', 'Gagal mengambil data referensi dari server.')
  } finally {
    isLoadingData.value = false
  }
}

// Form Submission
const handleSubmit = async () => {
  if (!form.value.vessel_id) {
    showPageMessage('error', 'Mohon pilih kapal kelolaan.')
    return
  }

  isSubmitting.value = true
  const token = localStorage.getItem('token')

  try {
    // Set separate departure_date and departure_time values from departure_datetime for compatibility
    if (form.value.departure_datetime) {
      const depDateObj = new Date(form.value.departure_datetime)
      form.value.departure_date = depDateObj.toISOString().split('T')[0]
      form.value.departure_time = depDateObj.toTimeString().slice(0, 5)
    }

    const response = await fetch(`${API_URL}/departures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form.value)
    })

    const result = await response.json()
    if (response.ok && result.status === 'success') {
      showPageMessage('success', 'Laporan Keberangkatan berhasil disimpan!')
      setTimeout(() => {
        router.push({ name: 'Report' })
      }, 1500)
    } else {
      showPageMessage('error', result.message || 'Gagal menyimpan laporan.')
    }

  } catch (err) {
    showPageMessage('error', 'Terjadi kesalahan jaringan.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadInitialData()

  // Close dropdowns on outside clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isVesselDropdownOpen.value = false
      isLandingSiteDropdownOpen.value = false
    }
  })
})
</script>
