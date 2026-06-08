<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-8">
      <button @click="goBack" class="p-2.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Hubungi Support</h2>
        <p class="text-xs text-gray-500 mt-0.5">Bantuan & Layanan Pelanggan SAMOSIR</p>
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

    <!-- Quick Contact Cards -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <a href="https://wa.me/6285340517686" target="_blank" class="p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl text-left shadow-sm hover:border-emerald-250 dark:hover:border-emerald-900/40 active:scale-98 transition-all flex flex-col justify-between h-32">
        <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/25 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-450">
          <MessageSquare class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-xs font-bold text-gray-950 dark:text-white">WhatsApp</h4>
          <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Respon Cepat (WA Only)</p>
        </div>
      </a>

      <a href="mailto:support@kendariweb.com" class="p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl text-left shadow-sm hover:border-blue-250 dark:hover:border-blue-900/40 active:scale-98 transition-all flex flex-col justify-between h-32">
        <div class="w-10 h-10 bg-blue-50 dark:bg-blue-950/25 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-450">
          <Mail class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-xs font-bold text-gray-955 dark:text-white">Email</h4>
          <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">support@kendariweb.com</p>
        </div>
      </a>
    </div>

    <!-- Office Info -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm mb-6 flex items-center space-x-4">
      <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-500 dark:text-slate-400">
        <Clock class="w-5 h-5" />
      </div>
      <div>
        <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">Jam Operasional Support</h4>
        <p class="text-[10px] text-gray-550 dark:text-gray-400 mt-1">Senin - Jumat: 08:00 - 17:00 WIB</p>
        <p class="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">* Sabtu, Minggu, & Libur Nasional tutup</p>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="bg-white dark:bg-slate-900 p-6 border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-sm mb-12">
      <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-50 dark:border-slate-800/80 pb-2">Kirim Tiket Bantuan</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Kategori Masalah <span class="text-red-500">*</span></label>
          <select 
            v-model="form.category"
            required
            class="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="">Pilih Kategori...</option>
            <option value="technical">Kendala Teknis Aplikasi</option>
            <option value="vessel_data">Perubahan / Pengajuan Data Kapal</option>
            <option value="services">Kendala Jasa Pelabuhan</option>
            <option value="account">Masalah Akun & Tanda Tangan</option>
            <option value="other">Masalah Lainnya</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Judul Pesan <span class="text-red-500">*</span></label>
          <input 
            v-model="form.subject"
            type="text"
            required
            placeholder="Subjek singkat masalah Anda"
            class="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-wider block mb-1.5">Detail Kendala <span class="text-red-500">*</span></label>
          <textarea 
            v-model="form.message"
            rows="4"
            required
            placeholder="Jelaskan secara rinci kendala yang Anda hadapi..."
            class="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-955 dark:text-white text-xs focus:outline-none resize-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <button 
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-xs active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send class="w-4 h-4" />
          <span>{{ isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Bantuan' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, MessageSquare, Mail, Clock, Send, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const isSubmitting = ref(false)

const form = ref({
  category: '',
  subject: '',
  message: ''
})

const pageMessage = ref({
  type: '',
  text: ''
})

const goBack = () => {
  router.back()
}

const showPageMessage = (type: string, text: string) => {
  pageMessage.value = { type, text }
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (type === 'success') {
    setTimeout(() => {
      pageMessage.value = { type: '', text: '' }
    }, 4000)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // Simulate API submission
  setTimeout(() => {
    isSubmitting.value = false
    showPageMessage('success', 'Tiket bantuan Anda berhasil dikirim! Tim support akan menghubungi Anda sesegera mungkin.')
    form.value = {
      category: '',
      subject: '',
      message: ''
    }
  }, 1200)
}
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
