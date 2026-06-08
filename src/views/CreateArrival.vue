<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="p-2.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Lapor Kedatangan</h2>
          <p class="text-xs text-gray-500 mt-0.5">E-Arrival Pelaporan Kedatangan Kapal</p>
        </div>
      </div>
    </div>

    <!-- Alert / Toast Message -->
    <Transition name="fade">
      <div v-if="pageMessage.text" :class="[
        'p-4 rounded-2xl text-xs font-semibold flex items-start space-x-2 mb-6 border animate-in fade-in duration-205',
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
              {{ selectedVessel ? `${selectedVessel.vessel_name} (${selectedVessel.gt} GT)` : 'Cari & pilih kapal...' }}
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
                <span class="text-[10px] text-gray-500 mt-0.5">Alat Tangkap: {{ v.fishing_gear || '-' }} • {{ v.gt }} GT</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ASAL KAPAL -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Asal Kapal</label>
          <input 
            v-model="form.origin"
            type="text"
            placeholder="Contoh: Laut Jawa, Selat Sunda"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <!-- TANGGAL & WAKTU KEDATANGAN -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Tanggal <span class="text-red-500">*</span></label>
            <input 
              v-model="form.arrival_date"
              type="date"
              required
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Waktu (Jam:Menit)</label>
            <input 
              v-model="form.arrival_time"
              type="time"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- DERMAGA SELECT (Searchable Select2 Style) -->
        <div class="relative" :class="{ 'z-30': isLandingSiteDropdownOpen }">
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Dermaga Pendaratan</label>
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

        <!-- DYNAMIC FISH CATCHES SECTION -->
        <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-gray-200/60 dark:border-slate-800">
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">Hasil Tangkapan Ikan</h4>
            <button 
              type="button"
              @click="addCatchRow"
              class="px-3 py-1.5 bg-primary-650 hover:bg-primary-700 text-white rounded-xl text-[10px] font-bold flex items-center space-x-1 transition-all"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah Ikan</span>
            </button>
          </div>

          <div v-if="catches.length === 0" class="py-6 text-center text-xs text-gray-400 dark:text-gray-550">
            Belum ada data tangkapan ikan yang dimasukkan.
          </div>

          <div v-else class="space-y-4">
            <div v-for="(item, idx) in catches" :key="idx" 
              class="relative bg-white dark:bg-slate-900 p-4 border border-gray-150 dark:border-slate-800 rounded-2xl flex flex-col space-y-3 shadow-sm animate-in fade-in slide-in-from-top-1"
              :class="{ 'z-30': openCatchDropdownIndex === idx, 'z-10': openCatchDropdownIndex !== idx }"
            >
              
              <!-- Searchable Fish dropdown inside Catch Row -->
              <div class="relative" :class="{ 'z-40': openCatchDropdownIndex === idx }">
                <label class="text-[9px] font-bold text-gray-450 dark:text-gray-550 uppercase block mb-1">Jenis Ikan</label>
                <button 
                  type="button"
                  @click="toggleFishDropdown(idx)"
                  class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-xs flex justify-between items-center text-left"
                >
                  <span>
                    {{ item.fish_species_id && getSelectedFishName(item.fish_species_id) ? getSelectedFishName(item.fish_species_id) : 'Pilih jenis ikan...' }}
                  </span>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
                </button>

                <div v-if="openCatchDropdownIndex === idx" class="absolute z-40 w-full mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg flex flex-col max-h-[200px]">
                  <div class="p-2 sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-750">
                    <input 
                      v-model="fishQuery"
                      type="text"
                      placeholder="Cari ikan..."
                      class="w-full px-3 py-1.5 border border-gray-150 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div class="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
                    <button
                      v-for="fish in filteredFishSpecies(idx)"
                      :key="fish.id"
                      type="button"
                      @click="selectFish(idx, fish)"
                      class="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-750 font-medium"
                    >
                      {{ fish.species_name }} <span class="text-[9px] text-gray-450">({{ fish.local_name }})</span>
                    </button>
                    <div v-if="filteredFishSpecies(idx).length === 0" class="py-4 text-center text-xs text-gray-500">Ikan tidak ditemukan.</div>
                  </div>
                </div>
              </div>

              <!-- Weight and Delete Button row -->
              <div class="flex items-center space-x-3">
                <div class="flex-1">
                  <label class="text-[9px] font-bold text-gray-450 dark:text-gray-500 uppercase block mb-1">Berat (kg)</label>
                  <div class="relative">
                    <input 
                      v-model.number="item.weight_kg"
                      type="number"
                      min="1"
                      placeholder="Contoh: 150"
                      class="w-full pl-3.5 pr-8 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
                    />
                    <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 text-[10px] font-bold pointer-events-none">Kg</span>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="removeCatchRow(idx)"
                  class="self-end p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- INFORMASI TAMBAHAN -->
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pb-2">Informasi Tambahan</h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Produk</label>
              <select 
                v-model="form.fish_quality"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              >
                <option value="">Pilih Kualitas</option>
                <option value="Segar">Segar</option>
                <option value="Beku">Beku</option>
                <option value="Olahan">Olahan</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Harga Rata-rata</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-xs font-bold pointer-events-none">Rp</span>
                <input 
                  v-model.number="form.average_price"
                  type="number"
                  placeholder="0"
                  class="w-full pl-9 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1">Vol Limbah (kg)</label>
              <input 
                v-model.number="form.waste_volume"
                type="number"
                placeholder="0"
                class="w-full px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1">Suhu Ikan (°C)</label>
              <input 
                v-model.number="form.fish_temperature"
                type="number"
                placeholder="0"
                class="w-full px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1">Suhu Palka (°C)</label>
              <input 
                v-model.number="form.hold_temperature"
                type="number"
                placeholder="0"
                class="w-full px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Mutu</label>
              <select 
                v-model="form.mutu"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              >
                <option value="">Pilih Mutu</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Status <span class="text-red-500">*</span></label>
              <select 
                v-model="form.status"
                required
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
              >
                <option value="TAMBAT">Tambat</option>
                <option value="LABUH">Labuh</option>
                <option value="BONGKAR">Bongkar</option>
                <option value="MENGISI PERBEKALAN">Mengisi Perbekalan</option>
                <option value="PERBAIKAN">Perbaikan</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>
          </div>

        </div>

        <!-- CATATAN -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Catatan Tambahan</label>
          <textarea 
            v-model="form.notes"
            placeholder="Tambahkan catatan jika ada..."
            rows="3"
            class="w-full px-4 py-3.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs rounded-2xl focus:outline-none resize-none"
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  ChevronDown, 
  Search, 
  Plus, 
  Trash2, 
  AlertCircle,
  Lock
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()

// UI & Data Loading States
const isLoadingData = ref(true)
const isSubmitting = ref(false)
const isVesselDropdownOpen = ref(false)
const isLandingSiteDropdownOpen = ref(false)
const openCatchDropdownIndex = ref<number | null>(null)

// Dropdowns search queries
const vesselQuery = ref('')
const landingSiteQuery = ref('')
const fishQuery = ref('')

// Dropdown raw option lists
const vesselsList = ref<any[]>([])
const landingSitesList = ref<any[]>([])
const fishSpeciesList = ref<any[]>([])

// Selected objects
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
interface CatchItem {
  fish_species_id: number | '';
  weight_kg: number | '';
}

const form = ref({
  vessel_id: '',
  origin: '',
  arrival_date: new Date().toISOString().split('T')[0],
  arrival_time: new Date().toTimeString().slice(0, 5),
  landing_site_id: '',
  mutu: '',
  fish_quality: '',
  average_price: '',
  waste_volume: '',
  fish_temperature: '',
  hold_temperature: '',
  status: 'TAMBAT',
  notes: '',
})

const catches = ref<CatchItem[]>([])

const goBack = () => {
  router.push({ name: 'Report' })
}

// Dynamic Fish Catches management
const addCatchRow = () => {
  catches.value.push({
    fish_species_id: '',
    weight_kg: ''
  })
}

const removeCatchRow = (index: number) => {
  catches.value.splice(index, 1)
  if (openCatchDropdownIndex.value === index) {
    openCatchDropdownIndex.value = null
  }
}

const toggleFishDropdown = (index: number) => {
  if (openCatchDropdownIndex.value === index) {
    openCatchDropdownIndex.value = null
  } else {
    openCatchDropdownIndex.value = index
    fishQuery.value = ''
  }
}

const selectFish = (index: number, fish: any) => {
  if (catches.value[index]) {
    catches.value[index].fish_species_id = fish.id
  }
  openCatchDropdownIndex.value = null
}

const getSelectedFishName = (id: number) => {
  const f = fishSpeciesList.value.find(x => x.id === id)
  return f ? f.species_name : ''
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

const filteredFishSpecies = (currentIndex: number) => {
  // Exclude already selected fish in other rows
  const selectedIds = catches.value
    .map((item, idx) => idx !== currentIndex ? item.fish_species_id : '')
    .filter(id => id !== '')

  let available = fishSpeciesList.value.filter(f => !selectedIds.includes(f.id))

  if (!fishQuery.value.trim()) return available
  const q = fishQuery.value.toLowerCase().trim()
  return available.filter(f => 
    (f.species_name || '').toLowerCase().includes(q) ||
    (f.local_name || '').toLowerCase().includes(q)
  )
}

// Dropdown controls
const toggleVesselDropdown = () => {
  isVesselDropdownOpen.value = !isVesselDropdownOpen.value
  if (isVesselDropdownOpen.value) {
    vesselQuery.value = ''
    isLandingSiteDropdownOpen.value = false
    openCatchDropdownIndex.value = null
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
    openCatchDropdownIndex.value = null
  }
}

const selectLandingSite = (s: any) => {
  selectedLandingSite.value = s
  form.value.landing_site_id = s.id
  isLandingSiteDropdownOpen.value = false
}

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

    // 3. Fetch fish species
    const resFish = await fetch(`${API_URL}/fish`, { headers })
    if (resFish.ok) {
      const dataF = await resFish.json()
      fishSpeciesList.value = dataF.data || []
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

  // Filter valid catches
  const validCatches = catches.value.filter(c => c.fish_species_id !== '' && c.weight_kg !== '')
  
  isSubmitting.value = true
  const token = localStorage.getItem('token')
  
  try {
    const payload = {
      ...form.value,
      catches: validCatches
    }

    const response = await fetch(`${API_URL}/arrivals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    if (response.ok && result.status === 'success') {
      showPageMessage('success', 'Laporan Kedatangan berhasil disimpan!')
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
      openCatchDropdownIndex.value = null
    }
  })
})
</script>
