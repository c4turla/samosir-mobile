<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="p-2.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Jasa Pelabuhan</h2>
          <p class="text-xs text-gray-500 mt-0.5">Order Jasa Air, Ice Cruiser, & Peralatan</p>
        </div>
      </div>
    </div>

    <!-- Tab Switcher -->
    <div class="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl mb-6">
      <button 
        v-for="t in ['water', 'ice_cruiser', 'equipment']" 
        :key="t"
        @click="activeTab = t"
        :class="[
          'flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all capitalize',
          activeTab === t
            ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 bg-transparent'
        ]"
      >
        {{ t.replace('_', ' ') }}
      </button>
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
      <div class="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse p-5"></div>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm pb-8">
      
      <!-- TAB 1: Jasa Air Tawar -->
      <form v-if="activeTab === 'water'" @submit.prevent="submitWater" class="space-y-6">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">Form Jasa Air Tawar</h3>
        
        <!-- Vessel select (Searchable Select2 style) -->
        <div class="relative" :class="{ 'z-50': isVesselDropdownOpen && activeTab === 'water' }">
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Kapal <span class="text-red-500">*</span></label>
          <button 
            type="button"
            @click="toggleVesselDropdown"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none flex justify-between items-center text-left"
          >
            <span>
              {{ selectedVessel ? `${selectedVessel.vessel_name}` : 'Pilih kapal...' }}
            </span>
            <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'transform rotate-180': isVesselDropdownOpen }" />
          </button>

          <div v-if="isVesselDropdownOpen" class="absolute z-35 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[220px]">
            <div class="p-2.5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <input 
                v-model="vesselQuery"
                type="text"
                placeholder="Cari kapal..."
                class="w-full px-3 py-2 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
              <button
                v-for="v in filteredVessels"
                :key="v.id"
                type="button"
                @click="selectVessel(v)"
                class="w-full px-4 py-3 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-750 font-bold"
              >
                {{ v.vessel_name }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Tanggal Permintaan <span class="text-red-500">*</span></label>
          <input 
            v-model="waterForm.request_date"
            type="date"
            required
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Volume (M3) <span class="text-red-500">*</span></label>
            <input 
              v-model.number="waterForm.volume"
              type="number"
              step="0.01"
              required
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Harga /M3 <span class="text-red-500">*</span></label>
            <input 
              v-model.number="waterForm.price"
              type="number"
              required
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Total Calculation -->
        <div class="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-gray-150 dark:border-slate-800 flex justify-between items-center">
          <span class="text-xs font-bold text-gray-500">Estimasi Total Bayar:</span>
          <span class="text-base font-extrabold text-blue-600 dark:text-blue-400">Rp {{ formatNumber(waterForm.volume * waterForm.price) }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Pemohon</label>
            <input 
              v-model="waterForm.requester"
              type="text"
              placeholder="Nama pemohon"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Pelaksana Lapangan</label>
            <input 
              v-model="waterForm.field_officer"
              type="text"
              placeholder="Nama pelaksana"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Catatan</label>
          <textarea 
            v-model="waterForm.notes"
            placeholder="Masukkan keterangan tambahan jika ada..."
            rows="3"
            class="w-full px-4 py-3.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs rounded-2xl focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center space-x-3 border-t border-gray-100 dark:border-slate-800">
          <button type="button" @click="goBack" class="flex-1 py-3.5 border border-gray-200 dark:border-slate-750 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl active:scale-95 text-center">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 shadow-md shadow-primary-200 dark:shadow-none">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>Kirim Pesanan</span>
          </button>
        </div>
      </form>

      <!-- TAB 2: Jasa Ice Cruiser -->
      <form v-if="activeTab === 'ice_cruiser'" @submit.prevent="submitIce" class="space-y-6">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">Form Jasa Ice Cruiser</h3>

        <!-- Vessel select to autofill Renter Name -->
        <div class="relative" :class="{ 'z-50': isVesselDropdownOpen && activeTab === 'ice_cruiser' }">
          <div v-if="isVesselDropdownOpen" class="absolute z-35 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[220px]">
            <div class="p-2.5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <input 
                v-model="vesselQuery"
                type="text"
                placeholder="Cari kapal..."
                class="w-full px-3 py-2 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
              <button
                v-for="v in filteredVessels"
                :key="v.id"
                type="button"
                @click="selectVesselForRenter(v)"
                class="w-full px-4 py-3 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-750 font-bold"
              >
                {{ v.vessel_name }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Nama Penyewa <span class="text-red-500">*</span></label>
          <input 
            v-model="iceForm.renter_name"
            type="text"
            required
            placeholder="Masukkan nama penyewa/kapal"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Tanggal Order <span class="text-red-500">*</span></label>
            <input 
              v-model="iceForm.service_date"
              type="date"
              required
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Jumlah Pemakaian (Peralatan)</label>
            <input 
              v-model.number="iceForm.quantity"
              type="number"
              min="1"
              required
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Petugas</label>
            <input 
              v-model="iceForm.field_officer"
              type="text"
              placeholder="Nama petugas"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Catatan</label>
          <textarea 
            v-model="iceForm.notes"
            placeholder="Keterangan tambahan..."
            rows="3"
            class="w-full px-4 py-3.5 border border-gray-255 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs rounded-2xl focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center space-x-3 border-t border-gray-100 dark:border-slate-800">
          <button type="button" @click="goBack" class="flex-1 py-3.5 border border-gray-200 dark:border-slate-750 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl active:scale-95 text-center">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 shadow-md shadow-primary-200 dark:shadow-none">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>Kirim Pesanan</span>
          </button>
        </div>
      </form>

      <!-- TAB 3: Jasa Peralatan -->
      <form v-if="activeTab === 'equipment'" @submit.prevent="submitEquipment" class="space-y-6">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">Form Jasa Peralatan</h3>

        <!-- Vessel select to autofill Renter Name -->
        <div class="relative" :class="{ 'z-50': isVesselDropdownOpen && activeTab === 'equipment' }">
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Kapal Penyewa <span class="text-red-500">*</span></label>
          <button 
            type="button"
            @click="toggleVesselDropdown"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none flex justify-between items-center text-left"
          >
            <span>
              {{ selectedVessel ? `${selectedVessel.vessel_name}` : 'Pilih kapal...' }}
            </span>
            <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'transform rotate-180': isVesselDropdownOpen }" />
          </button>

          <div v-if="isVesselDropdownOpen" class="absolute z-35 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[220px]">
            <div class="p-2.5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <input 
                v-model="vesselQuery"
                type="text"
                placeholder="Cari kapal..."
                class="w-full px-3 py-2 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
              <button
                v-for="v in filteredVessels"
                :key="v.id"
                type="button"
                @click="selectVesselForRenter(v)"
                class="w-full px-4 py-3 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-750 font-bold"
              >
                {{ v.vessel_name }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Nama Renter / Penyewa <span class="text-red-500">*</span></label>
          <input 
            v-model="eqForm.renter_name"
            type="text"
            required
            placeholder="Nama penyewa"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Tanggal Order <span class="text-red-500">*</span></label>
          <input 
            v-model="eqForm.service_date"
            type="date"
            required
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none"
          />
        </div>

        <!-- Checklists of Equipment Items -->
        <div class="space-y-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-150 dark:border-slate-800">
          <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">List Pemakaian Peralatan</h4>
          
          <div class="space-y-4">
            <div v-for="item in eqItemsList" :key="item.key" class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <span class="text-xs font-bold text-gray-700 dark:text-gray-300 block">{{ item.label }}</span>
                <span v-if="item.disabled" class="text-[9px] text-gray-400 italic">Disertakan saat penimbangan saja</span>
              </div>
              <div v-if="!item.disabled" class="w-24">
                <input 
                  v-model.number="item.quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs text-center focus:outline-none"
                />
              </div>
              <div v-else class="text-xs text-gray-400 dark:text-gray-550 font-bold uppercase italic">Locked</div>
            </div>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Petugas Lapangan</label>
          <input 
            v-model="eqForm.field_officer"
            type="text"
            placeholder="Nama petugas"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block mb-1.5">Catatan</label>
          <textarea 
            v-model="eqForm.notes"
            placeholder="Catatan tambahan..."
            rows="3"
            class="w-full px-4 py-3.5 border border-gray-255 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs rounded-2xl focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center space-x-3 border-t border-gray-100 dark:border-slate-800">
          <button type="button" @click="goBack" class="flex-1 py-3.5 border border-gray-200 dark:border-slate-750 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl active:scale-95 text-center">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 shadow-md shadow-primary-200 dark:shadow-none">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>Kirim Pesanan</span>
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
  AlertCircle 
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()

const activeTab = ref('water')
const isLoadingData = ref(true)
const isSubmitting = ref(false)
const isVesselDropdownOpen = ref(false)

const vesselQuery = ref('')
const vesselsList = ref<any[]>([])
const selectedVessel = ref<any | null>(null)

// Page messages/toast
const pageMessage = ref({ type: 'success', text: '' })

const showPageMessage = (type: 'success' | 'error', text: string) => {
  pageMessage.value = { type, text }
  setTimeout(() => {
    pageMessage.value.text = ''
  }, 5000)
}

// Format number utility
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num || 0)
}

const loggedInUserName = localStorage.getItem('userName') || ''

// 1. Water Form State
const waterForm = ref({
  vessel_id: '',
  request_date: new Date().toISOString().split('T')[0],
  requester: loggedInUserName,
  volume: 0,
  price: 0,
  field_officer: '',
  notes: '',
})

// 2. Ice Cruiser Form State
const iceForm = ref({
  renter_name: loggedInUserName,
  service_date: new Date().toISOString().split('T')[0],
  quantity: 1,
  unit_price: 0,
  field_officer: '',
  notes: '',
})

// 3. Equipment Form State
const eqForm = ref({
  vessel_id: '',
  renter_name: loggedInUserName,
  service_date: new Date().toISOString().split('T')[0],
  field_officer: '',
  notes: '',
})

const eqItemsList = ref([
  { key: 'keranjang_plastik', label: 'Keranjang Plastik', quantity: 0, disabled: false },
  { key: 'meja_sortir', label: 'Meja Sortir', quantity: 0, disabled: false },
  { key: 'gerobak', label: 'Gerobak', quantity: 0, disabled: false },
  { key: 'timbangan', label: 'Timbangan', quantity: 0, disabled: true },
  { key: 'ice_cruiser', label: 'Ice Cruiser', quantity: 0, disabled: true },
])

const goBack = () => {
  router.push({ name: 'Report' })
}

// Computed filtered vessels
const filteredVessels = computed(() => {
  if (!vesselQuery.value.trim()) return vesselsList.value
  const q = vesselQuery.value.toLowerCase().trim()
  return vesselsList.value.filter(v => 
    (v.vessel_name || '').toLowerCase().includes(q)
  )
})

// Vessel dropdown controls
const toggleVesselDropdown = () => {
  isVesselDropdownOpen.value = !isVesselDropdownOpen.value
  if (isVesselDropdownOpen.value) {
    vesselQuery.value = ''
  }
}

const selectVessel = (v: any) => {
  selectedVessel.value = v
  waterForm.value.vessel_id = v.id
  isVesselDropdownOpen.value = false
}

const selectVesselForRenter = (v: any) => {
  selectedVessel.value = v
  
  if (activeTab.value === 'ice_cruiser') {
    iceForm.value.renter_name = v.vessel_name
  } else if (activeTab.value === 'equipment') {
    eqForm.value.vessel_id = v.id
    eqForm.value.renter_name = v.vessel_name
  }

  isVesselDropdownOpen.value = false
}

// Fetch user vessels
const loadVessels = async () => {
  isLoadingData.value = true
  const token = localStorage.getItem('token')
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_URL}/vessels/my-vessels?status=approved&per_page=100`, { headers })
    if (res.ok) {
      const data = await res.json()
      vesselsList.value = data.data?.data || []
    }
  } catch (err) {
    console.error('Error fetching vessels for services:', err)
  } finally {
    isLoadingData.value = false
  }
}

// Submissions
const submitWater = async () => {
  if (!waterForm.value.vessel_id) {
    showPageMessage('error', 'Mohon pilih kapal.')
    return
  }

  isSubmitting.value = true
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/services/water`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(waterForm.value)
    })

    const result = await response.json()
    if (response.ok && result.status === 'success') {
      showPageMessage('success', 'Order Jasa Air Tawar berhasil dikirim!')
      setTimeout(() => {
        router.push({ name: 'Report' })
      }, 1500)
    } else {
      showPageMessage('error', result.message || 'Gagal menyimpan pesanan.')
    }
  } catch (err) {
    showPageMessage('error', 'Terjadi kesalahan jaringan.')
  } finally {
    isSubmitting.value = false
  }
}

const submitIce = async () => {
  if (!iceForm.value.renter_name) {
    showPageMessage('error', 'Mohon isi nama penyewa.')
    return
  }

  isSubmitting.value = true
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/services/ice-cruiser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(iceForm.value)
    })

    const result = await response.json()
    if (response.ok && result.status === 'success') {
      showPageMessage('success', 'Order Jasa Ice Cruiser berhasil dikirim!')
      setTimeout(() => {
        router.push({ name: 'Report' })
      }, 1500)
    } else {
      showPageMessage('error', result.message || 'Gagal menyimpan pesanan.')
    }
  } catch (err) {
    showPageMessage('error', 'Terjadi kesalahan jaringan.')
  } finally {
    isSubmitting.value = false
  }
}

const submitEquipment = async () => {
  if (!eqForm.value.vessel_id || !eqForm.value.renter_name) {
    showPageMessage('error', 'Mohon pilih kapal & isi nama penyewa.')
    return
  }

  // Filter items with quantity > 0
  const activeItems = eqItemsList.value
    .filter(item => !item.disabled && item.quantity > 0)
    .map(item => ({
      equipment_name: item.key,
      quantity: item.quantity,
      unit_price: 0, // Default 0 for order stage
      notes: ''
    }))

  if (activeItems.length === 0) {
    showPageMessage('error', 'Mohon tentukan minimal satu jumlah peralatan.')
    return
  }

  isSubmitting.value = true
  const token = localStorage.getItem('token')

  try {
    const payload = {
      ...eqForm.value,
      items: activeItems
    }

    const response = await fetch(`${API_URL}/services/equipment`, {
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
      showPageMessage('success', 'Order Jasa Peralatan berhasil dikirim!')
      setTimeout(() => {
        router.push({ name: 'Report' })
      }, 1500)
    } else {
      showPageMessage('error', result.message || 'Gagal menyimpan pesanan.')
    }
  } catch (err) {
    showPageMessage('error', 'Terjadi kesalahan jaringan.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadVessels()

  // Close dropdowns on outside clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isVesselDropdownOpen.value = false
    }
  })
})
</script>
