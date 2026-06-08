<template>
  <div class="px-4 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="p-2.5 bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Permohonan SPR Keberangkatan</h2>
          <p class="text-xs text-gray-500 mt-0.5">Surat Pemberitahuan Rencana Keberangkatan</p>
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
      <div class="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
      <div class="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Grid Layout (Responsive: 1 col on mobile, 2 cols on lg screens) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- LEFT COLUMN: Data Kapal & Nakhoda + Muatan -->
          <div class="space-y-6">
            <h3 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-blue-50 dark:border-blue-900/50 pb-2 mb-4 flex items-center gap-1.5">
              <Anchor class="w-4 h-4" /> Data Kapal & Nakhoda
            </h3>

            <!-- KAPAL SELECT (Searchable Select2 Style) -->
            <div class="relative" :class="{ 'z-30': isVesselDropdownOpen }">
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Nama Kapal <span class="text-red-500">*</span></label>
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
                    class="w-full px-4 py-3 text-left text-xs text-gray-700 hover:bg-primary-50 dark:hover:bg-slate-750 flex flex-col"
                  >
                    <span class="font-bold text-gray-900 dark:text-white">{{ v.vessel_name }}</span>
                    <span class="text-[10px] text-gray-500 mt-0.5">Izin: {{ v.license_number || '-' }} • {{ v.gt }} GT</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- PEMILIK/PERUSAHAAN (Auto-filled) -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Pemilik/Perusahaan</label>
              <input 
                v-model="form.owner_name"
                type="text"
                disabled
                placeholder="Auto-filled ketika kapal dipilih"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-400 text-xs cursor-not-allowed focus:outline-none"
              />
            </div>

            <!-- NAMA NAKHODA -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Nama Nakhoda <span class="text-red-500">*</span></label>
              <input 
                v-model="form.nakhoda_name"
                type="text"
                required
                placeholder="Masukkan nama nakhoda"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- TANDA SELAR (Auto-filled) -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Tanda Selar</label>
              <input 
                v-model="form.selar_mark"
                type="text"
                disabled
                placeholder="Auto-filled ketika kapal dipilih"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-400 text-xs cursor-not-allowed focus:outline-none"
              />
            </div>

            <!-- UKURAN KAPAL (Auto-filled) -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Ukuran Kapal (Length)</label>
                <div class="relative flex items-center">
                  <input 
                    v-model="form.length"
                    type="text"
                    disabled
                    placeholder="M"
                    class="w-full pl-4 pr-10 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-400 text-xs cursor-not-allowed focus:outline-none text-right font-semibold"
                  />
                  <span class="absolute right-4 text-xs font-bold text-gray-400 uppercase">M</span>
                </div>
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">GT</label>
                <div class="relative flex items-center">
                  <input 
                    v-model="form.gt"
                    type="text"
                    disabled
                    placeholder="GT"
                    class="w-full pl-4 pr-10 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-400 text-xs cursor-not-allowed focus:outline-none text-right font-semibold"
                  />
                  <span class="absolute right-4 text-xs font-bold text-gray-400 uppercase">GT</span>
                </div>
              </div>
            </div>

            <!-- MERK/KEKUATAN MESIN -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Merk/Kekuatan Mesin</label>
              <input 
                v-model="form.engine_power"
                type="text"
                placeholder="Contoh: 300 PK"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- SECTION: MUATAN -->
            <div class="pt-4">
              <h3 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-blue-50 dark:border-blue-900/50 pb-2 mb-4 flex items-center gap-1.5">
                <Box class="w-4 h-4" /> Muatan
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">BBM</label>
                  <input 
                    v-model="form.bbm"
                    type="text"
                    placeholder="Contoh: 2000 LTR"
                    class="w-full px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">AIR</label>
                  <input 
                    v-model="form.air"
                    type="text"
                    placeholder="Contoh: 2000 LTR"
                    class="w-full px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">ES</label>
                  <input 
                    v-model="form.es"
                    type="text"
                    placeholder="Contoh: 12.000 KG"
                    class="w-full px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Check Point & Fisik + Rencana Keberangkatan & Pemohon -->
          <div class="space-y-6">
            <h3 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-blue-50 dark:border-blue-900/50 pb-2 mb-4 flex items-center gap-1.5">
              <Compass class="w-4 h-4" /> Check Point & Fisik
            </h3>

            <!-- SUBSECTION: Check Point -->
            <div class="space-y-4">
              <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Check Point</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] text-gray-400 block mb-1">Tgl Masuk / STBL Kedatangan</label>
                  <div class="flex space-x-2">
                    <input v-model="form.cp_arrival_date" type="date" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                    <input v-model="form.cp_arrival_stbl" type="text" placeholder="No STBL" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label class="text-[10px] text-gray-400 block mb-1">Tgl Keluar / STBL Kapal Keluar</label>
                  <div class="flex space-x-2">
                    <input v-model="form.cp_departure_date" type="date" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                    <input v-model="form.cp_departure_stbl" type="text" placeholder="No STBL" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <!-- SUBSECTION: Check Fisik Keberangkatan -->
            <div class="space-y-4 pt-2">
              <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Check Fisik Keberangkatan</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] text-gray-400 block mb-1">Tgl Masuk / STBL Kedatangan</label>
                  <div class="flex space-x-2">
                    <input v-model="form.physical_arrival_date" type="date" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                    <input v-model="form.physical_arrival_stbl" type="text" placeholder="No STBL" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label class="text-[10px] text-gray-400 block mb-1">Tgl Keluar / STBL Kapal Keluar</label>
                  <div class="flex space-x-2">
                    <input v-model="form.physical_departure_date" type="date" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                    <input v-model="form.physical_departure_stbl" type="text" placeholder="No STBL" class="w-1/2 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <!-- KEGIATAN -->
            <div class="pt-2">
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Kegiatan</label>
              <input 
                v-model="form.kegiatan"
                type="text"
                placeholder="Contoh: CK/CE"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- RENCANA KEBERANGKATAN -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Rencana Keberangkatan <span class="text-red-500">*</span></label>
              <div class="flex space-x-4">
                <div class="w-1/2">
                  <input 
                    v-model="form.departure_date"
                    type="date"
                    required
                    class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div class="w-1/2">
                  <input 
                    v-model="form.departure_time"
                    type="time"
                    required
                    class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <!-- NAMA PEMOHON -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Nama Pemohon <span class="text-red-500">*</span></label>
              <input 
                v-model="form.applicant_name"
                type="text"
                required
                placeholder="Masukkan nama pemohon"
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- CATATAN TAMBAHAN -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Catatan Tambahan</label>
              <textarea 
                v-model="form.additional_notes"
                rows="3"
                placeholder="Catatan atau keterangan permohonan..."
                class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none resize-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

          </div>

        </div>

        <!-- SUBMIT & CANCEL BUTTONS -->
        <div class="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end space-x-3">
          <button 
            type="button"
            @click="goBack"
            class="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl text-xs active:scale-95 transition-all"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-xs active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Mengirim...</span>
            <span v-else>Simpan SPR</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronDown, Search, AlertCircle, Anchor, Box, Compass } from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()
const isLoadingData = ref(true)
const isSubmitting = ref(false)

const vesselsList = ref<any[]>([])
const selectedVessel = ref<any>(null)
const isVesselDropdownOpen = ref(false)
const vesselQuery = ref('')

const form = ref({
  vessel_id: '',
  owner_name: '',
  selar_mark: '',
  length: '',
  gt: '',
  nakhoda_name: '',
  engine_power: '',
  // Muatan fields
  bbm: '',
  air: '',
  es: '',
  // Check Point
  cp_arrival_date: '',
  cp_arrival_stbl: '',
  cp_departure_date: '',
  cp_departure_stbl: '',
  // Physical check
  physical_arrival_date: '',
  physical_arrival_stbl: '',
  physical_departure_date: '',
  physical_departure_stbl: '',
  // Kegiatan
  kegiatan: '',
  // Rencana keberangkatan
  departure_date: '',
  departure_time: '',
  // Nama Pemohon
  applicant_name: localStorage.getItem('userName') || '',
  additional_notes: ''
})

const pageMessage = ref({
  type: '',
  text: ''
})

const toggleVesselDropdown = () => {
  isVesselDropdownOpen.value = !isVesselDropdownOpen.value
}

const selectVessel = (v: any) => {
  selectedVessel.value = v
  form.value.vessel_id = v.id
  form.value.owner_name = v.owner_name || '-'
  form.value.selar_mark = v.selar_mark || '-'
  form.value.length = v.length || '-'
  form.value.gt = v.gt || '-'
  form.value.engine_power = v.engine_power || ''
  isVesselDropdownOpen.value = false
}

const filteredVessels = computed(() => {
  if (!vesselQuery.value) return vesselsList.value
  const q = vesselQuery.value.toLowerCase()
  return vesselsList.value.filter(v => 
    v.vessel_name.toLowerCase().includes(q) || 
    (v.license_number && v.license_number.toLowerCase().includes(q))
  )
})

const showPageMessage = (type: string, text: string) => {
  pageMessage.value = { type, text }
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (type === 'success') {
    setTimeout(() => {
      pageMessage.value = { type: '', text: '' }
    }, 4000)
  }
}

const loadData = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    isLoadingData.value = false
    return
  }

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_URL}/vessels/my-vessels?status=approved&per_page=100`, { headers })
    if (res.ok) {
      const result = await res.json()
      vesselsList.value = result.data?.data || []
    }
    
    // Auto-fill logged in user as applicant_name by default if still empty
    if (!form.value.applicant_name) {
      form.value.applicant_name = localStorage.getItem('userName') || ''
    }
  } catch (error) {
    console.error('Gagal mengambil data:', error)
    showPageMessage('error', 'Gagal memuat data kapal kelolaan.')
  } finally {
    isLoadingData.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.vessel_id) {
    showPageMessage('error', 'Silakan pilih kapal kelolaan.')
    return
  }

  isSubmitting.value = true
  const token = localStorage.getItem('token')
  if (!token) {
    isSubmitting.value = false
    return
  }

  // Combine Muatan (BBM, Air, Es)
  const combinedMuatan = `BBM: ${form.value.bbm || '-'}, AIR: ${form.value.air || '-'}, ES: ${form.value.es || '-'}`
  
  // Combine Additional Notes with Kegiatan & Applicant
  const combinedNotes = `Kegiatan: ${form.value.kegiatan || '-'} | Pemohon: ${form.value.applicant_name || '-'} | Catatan: ${form.value.additional_notes || '-'}`
  
  // Combine planned departure datetime
  const combinedDepartureDatetime = `${form.value.departure_date} ${form.value.departure_time || '00:00'}:00`

  const payload = {
    vessel_id: form.value.vessel_id,
    nakhoda_name: form.value.nakhoda_name,
    muatan: combinedMuatan,
    planned_departure_datetime: combinedDepartureDatetime,
    additional_notes: combinedNotes,
    cp_arrival_date: form.value.cp_arrival_date || null,
    cp_arrival_stbl: form.value.cp_arrival_stbl || null,
    cp_departure_date: form.value.cp_departure_date || null,
    cp_departure_stbl: form.value.cp_departure_stbl || null,
    physical_arrival_date: form.value.physical_arrival_date || null,
    physical_arrival_stbl: form.value.physical_arrival_stbl || null,
    physical_departure_date: form.value.physical_departure_date || null,
    physical_departure_stbl: form.value.physical_departure_stbl || null,
  }

  try {
    const response = await fetch(`${API_URL}/spr-departures`, {
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
      showPageMessage('success', 'Permohonan SPR Keberangkatan berhasil diajukan!')
      setTimeout(() => {
        router.push({ name: 'Report' })
      }, 1500)
    } else {
      showPageMessage('error', result.message || 'Gagal mengirimkan permohonan SPR.')
    }
  } catch (error) {
    console.error('Gagal menyimpan permohonan SPR:', error)
    showPageMessage('error', 'Terjadi kesalahan sistem, silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadData()
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
