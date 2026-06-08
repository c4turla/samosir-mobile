<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button 
          @click="router.back()" 
          class="p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 transition-all"
        >
          <ChevronLeft class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Notifikasi</h2>
          <p class="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Kotak Masuk Aktivitas & Persetujuan</p>
        </div>
      </div>

      <button 
        v-if="notifications.length > 0 && unreadCount > 0"
        @click="markAllRead" 
        :disabled="isProcessing"
        class="px-3.5 py-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center space-x-1.5"
      >
        <CheckCheck class="w-3.5 h-3.5" />
        <span>Tandai Semua Dibaca</span>
      </button>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 rounded-3xl p-4 flex items-start space-x-4 animate-pulse">
        <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-2xl flex-shrink-0"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/3"></div>
          <div class="h-2 bg-gray-100 dark:bg-slate-800 rounded w-5/6"></div>
          <div class="h-2 bg-gray-100 dark:bg-slate-800 rounded w-1/4 mt-2"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="notifications.length === 0" class="py-20 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-primary-50 dark:bg-primary-950/20 border border-primary-100/50 dark:border-primary-900/10 rounded-[2rem] flex items-center justify-center mb-5 animate-bounce">
        <BellOff class="w-7 h-7 text-primary-500 dark:text-primary-400" />
      </div>
      <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">Tidak ada notifikasi</h3>
      <p class="text-xs text-gray-400 dark:text-gray-500 max-w-xs mt-1 leading-relaxed">
        Kami akan memberitahu Anda saat ada perubahan status pelaporan kedatangan, keberangkatan, atau jasa pelabuhan.
      </p>
    </div>

    <!-- Notifications List -->
    <div v-else class="space-y-4">
      <TransitionGroup name="list" tag="div" class="space-y-3">
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          @click="handleNotifClick(notif)"
          :class="[
            'bg-white dark:bg-slate-900 border rounded-3xl p-4 flex items-start space-x-4 transition-all active:scale-[0.99] cursor-pointer hover:border-primary-200 dark:hover:border-primary-900/30',
            notif.read_at 
              ? 'border-gray-100 dark:border-slate-800/80 opacity-75' 
              : 'border-primary-100/80 dark:border-primary-900/20 ring-1 ring-primary-100/50 dark:ring-primary-900/10 shadow-sm'
          ]"
        >
          <!-- Type Icon -->
          <div 
            :class="[
              'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors',
              getIconBgClass(notif.type)
            ]"
          >
            <component 
              :is="getIconComponent(notif.type)" 
              :class="['w-5 h-5', getIconTextClass(notif.type)]" 
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 
                :class="[
                  'text-xs font-bold truncate pr-3',
                  notif.read_at ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                ]"
              >
                {{ notif.title }}
              </h4>
              <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {{ timeAgo(notif.created_at) }}
              </span>
            </div>
            
            <p 
              :class="[
                'text-xs mt-1 leading-relaxed',
                notif.read_at ? 'text-gray-450 dark:text-gray-400' : 'text-gray-650 dark:text-gray-300 font-medium'
              ]"
            >
              {{ notif.message }}
            </p>
          </div>

          <!-- Unread Dot -->
          <div v-if="!notif.read_at" class="w-2.5 h-2.5 bg-primary-600 rounded-full flex-shrink-0 mt-1.5 shadow-sm shadow-primary-200"></div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  BellOff, 
  CheckCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()
const notifications = ref<any[]>([])
const unreadCount = ref(0)
const isLoading = ref(true)
const isProcessing = ref(false)

const getIconComponent = (type: string) => {
  if (type === 'success') return CheckCircle2
  if (type === 'warning') return AlertTriangle
  if (type === 'danger') return AlertCircle
  return Info
}

const getIconBgClass = (type: string) => {
  if (type === 'success') return 'bg-emerald-50 dark:bg-emerald-950/20'
  if (type === 'warning') return 'bg-amber-50 dark:bg-amber-950/20'
  if (type === 'danger') return 'bg-rose-50 dark:bg-rose-950/20'
  return 'bg-blue-50 dark:bg-blue-950/20'
}

const getIconTextClass = (type: string) => {
  if (type === 'success') return 'text-emerald-600 dark:text-emerald-400'
  if (type === 'warning') return 'text-amber-600 dark:text-amber-400'
  if (type === 'danger') return 'text-rose-600 dark:text-rose-400'
  return 'text-blue-600 dark:text-blue-400'
}

const timeAgo = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins}m yang lalu`
    if (diffHours < 24) return `${diffHours}j yang lalu`
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    
    const d = date.getDate()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    return `${d < 10 ? '0' + d : d}-${m < 10 ? '0' + m : m}-${y}`
  } catch (e) {
    return dateStr
  }
}

const fetchNotifications = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      notifications.value = result.data?.notifications || []
      unreadCount.value = result.data?.unread_count || 0
    }
  } catch (error) {
    console.error('Gagal mengambil data notifikasi:', error)
  } finally {
    isLoading.value = false
  }
}

const handleNotifClick = async (notif: any) => {
  // If it's already read, navigate to report timeline page if appropriate
  if (notif.read_at) {
    goToTarget(notif.url)
    return
  }

  // Mark as read in backend
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    // Optimistic UI update
    notif.read_at = new Date().toISOString()
    if (unreadCount.value > 0) unreadCount.value--

    await fetch(`${API_URL}/notifications/${notif.id}/read`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error) {
    console.error('Gagal menandai notifikasi dibaca:', error)
  }

  goToTarget(notif.url)
}

const goToTarget = (url: string) => {
  if (url === '/arrivals' || url === '/departures' || url === '/services') {
    router.push({ name: 'Report' })
  } else {
    // fallback to default home or dashboard
    router.push('/home')
  }
}

const markAllRead = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  const token = localStorage.getItem('token')
  if (!token) {
    isProcessing.value = false
    return
  }

  try {
    // Optimistic update
    notifications.value.forEach(notif => {
      if (!notif.read_at) {
        notif.read_at = new Date().toISOString()
      }
    })
    unreadCount.value = 0

    await fetch(`${API_URL}/notifications/read-all`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error) {
    console.error('Gagal menandai semua notifikasi dibaca:', error)
    // Rollback by refetching
    fetchNotifications()
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
