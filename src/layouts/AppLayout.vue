<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex-shrink-0 safe-area-top z-10 transition-colors">
      <div class="px-5 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">SAMOSIR</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="relative text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
            <Bell class="w-6 h-6" />
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 safe-area-bottom fixed bottom-0 left-0 right-0 z-10 transition-colors">
      <div class="grid grid-cols-5 h-16 max-w-lg mx-auto">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center space-y-1 transition-colors"
          :class="[$route.path === item.to ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400']"
        >
          <component :is="item.icon" class="w-6 h-6" />
          <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
          <div v-if="$route.path === item.to" class="w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full mt-0.5"></div>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  MessageCircle, 
  UserCircle,
  Bell,
  Fish
} from 'lucide-vue-next'

const userRole = ref(localStorage.getItem('userRole') || 'umum')

const allNavItems = [
  { name: 'Dashboard', label: 'Home', to: '/', icon: LayoutDashboard },
  { name: 'Schedule', label: 'Jadwal', to: '/schedule', icon: CalendarDays },
  { name: 'Commodity', label: 'Ikan', to: '/commodity', icon: Fish, role: 'umum' },
  { name: 'Report', label: 'Lapor', to: '/report', icon: FileText, role: 'pengelola' },
  { name: 'Chat', label: 'Chat', to: '/chat', icon: MessageCircle },
  { name: 'Profile', label: 'Profil', to: '/profile', icon: UserCircle },
]

const navItems = ref(allNavItems.filter(item => !item.role || item.role === userRole.value))

onMounted(() => {
  // Listen for role changes if necessary, but for now simple mount is enough
  userRole.value = localStorage.getItem('userRole') || 'umum'
  navItems.value = allNavItems.filter(item => !item.role || item.role === userRole.value)
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
