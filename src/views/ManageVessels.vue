<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="p-2.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Kelola Kapal</h2>
          <p class="text-xs text-gray-500 mt-0.5">Daftarkan & kelola armada kapal Anda</p>
        </div>
      </div>
    </div>

    <!-- Banner Peringatan Dokumen -->
    <div v-if="hasIncompleteDocs" class="mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-5 shadow-sm">
      <div class="flex items-start space-x-3.5">
        <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle class="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-amber-800 dark:text-amber-400">Dokumen Belum Lengkap</h4>
          <p class="text-xs text-amber-700 dark:text-amber-505 mt-1 leading-relaxed">
            Anda belum melengkapi berkas <span class="font-semibold">{{ missingDocs.join(' & ') }}</span>. 
            Anda tetap dapat mendaftarkan kapal, namun pendaftaran Anda hanya akan disetujui setelah berkas diunggah di menu Edit Profil.
          </p>
          <button 
            @click="router.push({ name: 'EditProfile' })"
            class="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
          >
            <span>Unggah Sekarang</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl mb-6">
      <button 
        @click="activeTab = 'my-vessels'"
        :class="[
          'flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all',
          activeTab === 'my-vessels'
            ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 bg-transparent'
        ]"
      >
        Kapal Saya ({{ myVessels.length }})
      </button>
      <button 
        @click="activeTab = 'register'"
        :class="[
          'flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all',
          activeTab === 'register'
            ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 bg-transparent'
        ]"
      >
        Daftar Kapal Baru
      </button>
    </div>

    <!-- Alert / Message Banner -->
    <Transition name="fade">
      <div v-if="pageMessage.text" :class="[
        'p-4 rounded-2xl text-xs font-semibold flex items-start space-x-2 mb-6 border animate-in fade-in duration-200',
        pageMessage.type === 'success' 
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
          : 'bg-red-50 dark:bg-red-950/20 border-red-105 dark:border-red-900/30 text-red-700 dark:text-red-400'
      ]">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{{ pageMessage.text }}</span>
      </div>
    </Transition>

    <!-- Content Area -->
    <div v-if="isLoading" class="space-y-4 py-8">
      <div v-for="i in 3" :key="i" class="h-20 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl animate-pulse flex items-center justify-between p-5">
        <div class="space-y-2 flex-1">
          <div class="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div class="h-2 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
        </div>
        <div class="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>

    <div v-else>
      <!-- TAB 1: Kapal Saya -->
      <div v-if="activeTab === 'my-vessels'" class="space-y-4 pb-24">
        <div v-if="myVessels.length === 0" class="py-16 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm px-6">
          <div class="w-16 h-16 bg-slate-50 dark:bg-slate-850 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-800">
            <Anchor class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Belum Ada Kapal Kelolaan</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
            Anda belum terdaftar untuk mengelola kapal apapun. Silakan ajukan pendaftaran kapal baru di tab sebelah.
          </p>
          <button 
            @click="activeTab = 'register'"
            class="mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-primary-200 dark:shadow-none transition-all active:scale-95 inline-flex items-center space-x-1.5"
          >
            <Plus class="w-4 h-4" />
            <span>Daftar Kapal Baru</span>
          </button>
        </div>

        <div v-else v-for="v in myVessels" :key="v.id" class="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-primary-100 transition-all duration-300">
          <div>
            <div class="flex items-center space-x-2">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-snug">{{ v.vessel_name }}</h4>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold tracking-wide flex items-center" :class="[
                v.pivot_status === 'approved' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
              ]">
                <Clock v-if="v.pivot_status === 'pending'" class="w-2.5 h-2.5 mr-1" />
                {{ v.pivot_status === 'approved' ? 'Disetujui' : 'Menunggu Petugas' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-450 mt-1 font-medium">
              Alat Tangkap: {{ v.fishing_gear || '-' }} • Ukuran: {{ v.gt || 0 }} GT
            </p>
            <p class="text-[10px] text-gray-400 mt-1">
              Pemilik: {{ v.owner_name || '-' }}
            </p>
          </div>
          <button 
            @click="handleUnregisterVessel(v.id)"
            :disabled="isUnregistering === v.id"
            class="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 p-3 rounded-2xl transition-colors disabled:opacity-50 active:scale-95 flex items-center justify-center"
            title="Batalkan Pengelolaan"
          >
            <span v-if="isUnregistering === v.id" class="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></span>
            <Trash2 v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- TAB 2: Daftar Kapal Baru -->
      <div v-if="activeTab === 'register'" class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm pb-8 space-y-6">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Daftarkan Kapal Baru</h3>

        <!-- Searchable Select (Select2 Behavior) -->
        <div class="relative">
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Pilih Kapal</label>
          
          <!-- Trigger Button -->
          <button 
            type="button"
            @click="toggleSelectDropdown"
            class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex justify-between items-center text-left"
          >
            <span>
              {{ selectedVessel ? `${selectedVessel.vessel_name} (${selectedVessel.gt} GT - ${selectedVessel.owner_name || 'Tanpa Pemilik'})` : 'Cari & pilih nama kapal...' }}
            </span>
            <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'transform rotate-180': isDropdownOpen }" />
          </button>

          <!-- Dropdown Options Panel -->
          <div 
            v-if="isDropdownOpen" 
            class="absolute z-30 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-150 flex flex-col max-h-[260px]"
          >
            <!-- Search Input inside dropdown (Select2 style search box) -->
            <div class="p-2.5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                  <Search class="w-4 h-4" />
                </span>
                <input 
                  ref="searchInputRef"
                  v-model="selectSearchQuery"
                  type="text"
                  placeholder="Ketik untuk mencari kapal..."
                  class="w-full pl-8 pr-3 py-2 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <!-- Scrollable Options List -->
            <div class="flex-1 overflow-y-auto max-h-[200px] divide-y divide-gray-50 dark:divide-slate-700/50">
              <div 
                v-if="filteredAvailableVessels.length === 0" 
                class="py-8 text-center text-xs text-gray-450 dark:text-gray-500"
              >
                Kapal tidak ditemukan.
              </div>
              <button
                v-else
                v-for="v in filteredAvailableVessels"
                :key="v.id"
                type="button"
                @click="selectOption(v)"
                class="w-full px-4 py-3 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-700 dark:hover:text-primary-400 transition-colors flex flex-col space-y-0.5"
              >
                <span class="font-bold text-gray-900 dark:text-white">{{ v.vessel_name }}</span>
                <span class="text-[10px] text-gray-450 dark:text-gray-500">
                  Alat Tangkap: {{ v.fishing_gear || '-' }} • Ukuran: {{ v.gt }} GT • Pemilik: {{ v.owner_name || '-' }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Alamat Pengelola (Opsional)</label>
          <textarea 
            v-model="registerAddress"
            placeholder="Masukkan alamat pengelola untuk kapal ini..."
            rows="3"
            class="w-full px-4 py-3.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-950 dark:text-white text-xs rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          ></textarea>
        </div>

        <button 
          @click="handleRegisterVessel"
          :disabled="!selectedAvailableVesselId || isRegistering"
          class="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 active:scale-95 shadow-md shadow-primary-200 dark:shadow-none"
        >
          <span v-if="isRegistering" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          <span>{{ isRegistering ? 'Mendaftarkan...' : 'Daftarkan Sebagai Pengelola' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  ChevronRight,
  Anchor, 
  Trash2, 
  Plus, 
  Ship, 
  Search, 
  ChevronDown, 
  AlertTriangle,
  AlertCircle,
  Clock
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()
const activeTab = ref('my-vessels')
const isLoading = ref(true)

const myVessels = ref<any[]>([])
const availableVessels = ref<any[]>([])

// Searchable Select States (Select2 like behavior)
const isDropdownOpen = ref(false)
const selectSearchQuery = ref('')
const selectedAvailableVesselId = ref<number | null>(null)
const selectedVessel = ref<any | null>(null)
const registerAddress = ref('')
const isRegistering = ref(false)
const isUnregistering = ref<number | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

// Document Warnings
const hasIncompleteDocs = ref(false)
const missingDocs = ref<string[]>([])

// Toast/Alert state
const pageMessage = ref({ type: 'success', text: '' })

const showPageMessage = (type: 'success' | 'error', text: string) => {
  pageMessage.value = { type, text }
  setTimeout(() => {
    pageMessage.value.text = ''
  }, 5000)
}

const goBack = () => {
  // Go back to profile
  router.push({ name: 'Profile' })
}

const toggleSelectDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    selectSearchQuery.value = ''
    nextTick(() => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    })
  }
}

const selectOption = (vessel: any) => {
  selectedAvailableVesselId.value = vessel.id
  selectedVessel.value = vessel
  isDropdownOpen.value = false
}

// Custom Select2-like filtering
const filteredAvailableVessels = computed(() => {
  if (!selectSearchQuery.value.trim()) return availableVessels.value
  const query = selectSearchQuery.value.toLowerCase().trim()
  return availableVessels.value.filter((v: any) => {
    return (v.vessel_name || '').toLowerCase().includes(query) ||
           (v.owner_name || '').toLowerCase().includes(query) ||
           (v.license_number || '').toLowerCase().includes(query)
  })
})

const fetchProfileInfo = async (headers: any) => {
  try {
    const resMe = await fetch(`${API_URL}/me`, { headers })
    if (resMe.ok) {
      const dataMe = await resMe.json()
      const user = dataMe.data || dataMe
      if (user) {
        const missing = []
        if (!user.id_card) missing.push('KTP')
        if (!user.authorization_letter) missing.push('Surat Kuasa')
        hasIncompleteDocs.value = missing.length > 0
        missingDocs.value = missing
      }
    }
  } catch (err) {
    console.error('Gagal mengambil data profil:', err)
  }
}

const fetchVesselsData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    // Fetch profile for KTP / Authorization letter status
    await fetchProfileInfo(headers)

    // Fetch currently managed vessels
    const resMy = await fetch(`${API_URL}/vessels/my-vessels?status=all&per_page=100`, { headers })
    if (resMy.ok) {
      const dataMy = await resMy.json()
      if (dataMy.status === 'success') {
        const rawList = dataMy.data.data || []
        myVessels.value = rawList.map((item: any) => ({
          id: item.id,
          vessel_name: item.vessel_name,
          fishing_gear: item.fishing_gear,
          gt: item.gt,
          owner_name: item.owner_name,
          pivot_status: item.managers?.[0]?.pivot?.status || 'pending'
        }))
      }
    }

    // Fetch available vessels (unmanaged)
    const resAvail = await fetch(`${API_URL}/vessels/available?per_page=200`, { headers })
    if (resAvail.ok) {
      const dataAvail = await resAvail.json()
      if (dataAvail.status === 'success') {
        availableVessels.value = dataAvail.data.data || []
      }
    }
  } catch (error) {
    console.error('Gagal memuat data kapal:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRegisterVessel = async () => {
  if (!selectedAvailableVesselId.value) return
  isRegistering.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/vessels/register-manager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vessel_id: selectedAvailableVesselId.value,
        address: registerAddress.value
      })
    })
    const data = await response.json()
    if (response.ok) {
      showPageMessage('success', data.message || 'Pendaftaran berhasil diajukan!')
      selectedAvailableVesselId.value = null
      selectedVessel.value = null
      registerAddress.value = ''
      await fetchVesselsData()
      activeTab.value = 'my-vessels' // Switch to my-vessels to see pending status
    } else {
      showPageMessage('error', data.message || 'Gagal mengajukan pendaftaran.')
    }
  } catch (error) {
    showPageMessage('error', 'Terjadi kesalahan koneksi.')
  } finally {
    isRegistering.value = false
  }
}

const handleUnregisterVessel = async (vesselId: number) => {
  if (!confirm('Apakah Anda yakin ingin membatalkan pengelolaan kapal ini?')) return
  isUnregistering.value = vesselId
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/vessels/unregister-manager`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vessel_id: vesselId
      })
    })
    const data = await response.json()
    if (response.ok) {
      showPageMessage('success', data.message || 'Pengelolaan kapal berhasil dibatalkan.')
      await fetchVesselsData()
    } else {
      showPageMessage('error', data.message || 'Gagal membatalkan pengelolaan.')
    }
  } catch (error) {
    showPageMessage('error', 'Terjadi kesalahan koneksi.')
  } finally {
    isUnregistering.value = null
  }
}

onMounted(() => {
  fetchVesselsData()
  
  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isDropdownOpen.value = false
    }
  })
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
/* Style for custom select dropdown scrolling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
