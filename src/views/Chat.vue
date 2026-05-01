<template>
  <div class="flex flex-col h-full bg-white dark:bg-slate-950 transition-colors duration-300">
    <!-- Chat Categories -->
    <div class="px-5 pt-6 flex-shrink-0">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pesan</h2>
      <div class="flex space-x-6 border-b border-gray-100 dark:border-slate-800">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'pb-3 text-sm font-bold transition-all relative',
            activeCategory === cat ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'
          ]"
        >
          {{ cat }}
          <div v-if="activeCategory === cat" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
        </button>
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-2 pb-24">
      <div 
        v-for="chat in chatList" 
        :key="chat.id"
        class="flex items-center space-x-4 p-3 rounded-2xl transition-colors active:bg-gray-50 dark:active:bg-slate-900 border border-transparent hover:border-gray-50 dark:hover:border-slate-800"
      >
        <div class="relative flex-shrink-0">
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm', chat.color]">
            {{ chat.initials }}
          </div>
          <div v-if="chat.online" class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950"></div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-baseline mb-1">
            <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{{ chat.name }}</h4>
            <span class="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">{{ chat.time }}</span>
          </div>
          <div class="flex justify-between items-center">
            <p :class="['text-xs truncate', chat.unread > 0 ? 'text-gray-800 dark:text-gray-200 font-bold' : 'text-gray-500 dark:text-gray-400']">
              {{ chat.lastMessage }}
            </p>
            <div v-if="chat.unread > 0" class="ml-2 w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center">
              <span class="text-[10px] font-bold text-white">{{ chat.unread }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Helpdesk Banner -->
      <div class="mt-8 bg-sky-50 dark:bg-sky-900/10 rounded-3xl p-6 border border-sky-100 dark:border-sky-900/20 transition-colors">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-sky-600 dark:bg-sky-700 rounded-2xl flex items-center justify-center text-white">
            <Headphones class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-sky-900 dark:text-sky-300">Bantuan Petugas</h4>
            <p class="text-xs text-sky-700 dark:text-sky-400/80 mt-0.5">Pertanyaan terkait sistem web atau kendala teknis.</p>
          </div>
        </div>
        <button class="mt-4 w-full bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-sky-100 dark:shadow-none hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors">
          Buka Tiket Baru
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Headphones } from 'lucide-vue-next'

const userRole = ref(localStorage.getItem('userRole') || 'umum')
const activeCategory = ref('Semua')

const categories = computed(() => {
  return userRole.value === 'umum' 
    ? ['Semua', 'Petugas', 'Pengelola'] 
    : ['Semua', 'Petugas', 'Klien']
})

const chatListRaw = [
  {
    id: 1,
    name: 'Admin Pelabuhan (Sibolga)',
    initials: 'AD',
    lastMessage: 'Update: Dermaga C kembali beroperasi normal.',
    time: '10:12',
    unread: 1,
    online: true,
    color: 'bg-primary-600',
    category: 'Petugas'
  },
  {
    id: 2,
    name: 'Capt. Heri Wibowo',
    initials: 'HW',
    lastMessage: 'Ikan Cakalang baru landing 450Kg, mau ambil borongan?',
    time: '09:45',
    unread: 0,
    online: false,
    color: 'bg-indigo-500',
    category: 'Pengelola'
  },
  {
    id: 3,
    name: 'UD. Ikan Segar (Klien)',
    initials: 'IS',
    lastMessage: 'PO ikan Tuna untuk besok pagi sudah saya kirim ya.',
    time: '08:20',
    unread: 0,
    online: true,
    color: 'bg-emerald-600',
    category: 'Klien'
  },
  {
    id: 4,
    name: 'Bpk. Ahmad (Nahkoda)',
    initials: 'BA',
    lastMessage: 'Cuaca di laut cukup tenang untuk bongkar muat.',
    time: 'Kemarin',
    unread: 0,
    online: true,
    color: 'bg-slate-700',
    category: 'Pengelola'
  }
]

const chatList = computed(() => {
  return chatListRaw.filter(chat => {
    // Basic filter by category
    const matchCategory = activeCategory.value === 'Semua' || chat.category === activeCategory.value
    
    // Visibility filter by role
    let visibleForRole = true
    if (userRole.value === 'umum' && chat.category === 'Klien') visibleForRole = false
    if (userRole.value === 'pengelola' && chat.category === 'Pengelola') {
       // A manager seeing "Pengelola" might be seeing other managers, which is OK
    }
    
    return matchCategory && visibleForRole
  })
})
</script>
