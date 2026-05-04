<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-8">
      <button @click="router.back()" class="bg-gray-100 dark:bg-slate-800 p-2.5 rounded-2xl text-gray-600 dark:text-gray-300">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Tentang PPN Sibolga</h2>
    </div>

    <!-- Hero Card -->
    <section class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 text-white mb-8 relative overflow-hidden">
      <div class="absolute -right-6 -bottom-6 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div class="relative z-10">
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
          <Anchor class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold leading-tight">Pelabuhan Perikanan Nusantara Sibolga</h3>
        <p class="text-sm opacity-80 mt-2">Kota Sibolga, Sumatera Utara</p>
      </div>
    </section>

    <!-- Info Cards -->
    <div class="space-y-4 mb-8">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Info class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Tentang PPN Sibolga</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Pelabuhan Perikanan Nusantara (PPN) Sibolga merupakan Unit Pelaksana Teknis di bidang pelabuhan perikanan 
              yang berada di bawah dan bertanggung jawab kepada Direktur Jenderal Perikanan Tangkap, 
              Kementerian Kelautan dan Perikanan Republik Indonesia.
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
              PPN Sibolga terletak di Kota Sibolga, Provinsi Sumatera Utara dan menjadi pusat kegiatan 
              perikanan tangkap di wilayah pantai barat Sumatera Utara. Pelabuhan ini melayani berbagai 
              aktivitas mulai dari pendaratan ikan, bongkar muat, pengisian perbekalan, hingga pemeliharaan kapal.
            </p>
          </div>
        </div>
      </div>

      <!-- Fasilitas -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
        <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Building2 class="w-4 h-4 mr-2 text-primary-600" />
          Fasilitas Utama
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="facility in facilities" :key="facility.name" class="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl">
            <component :is="facility.icon" :class="['w-5 h-5 mb-2', facility.color]" />
            <p class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ facility.name }}</p>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ facility.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Kontak -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
        <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Phone class="w-4 h-4 mr-2 text-primary-600" />
          Kontak & Alamat
        </h4>
        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <MapPin class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-gray-600 dark:text-gray-400">Jl. Gatot Subroto No. 1, Kel. Pondok Batu, Kota Sibolga, Sumatera Utara 22535</p>
          </div>
          <div class="flex items-center space-x-3">
            <Phone class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p class="text-xs text-gray-600 dark:text-gray-400">(0631) 21234</p>
          </div>
          <div class="flex items-center space-x-3">
            <Mail class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p class="text-xs text-gray-600 dark:text-gray-400">ppn.sibolga@kkp.go.id</p>
          </div>
          <div class="flex items-center space-x-3">
            <Globe class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p class="text-xs text-gray-600 dark:text-gray-400">ppnsibolga.kkp.go.id</p>
          </div>
        </div>
      </div>

      <!-- Jam Operasional -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
        <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock class="w-4 h-4 mr-2 text-primary-600" />
          Jam Operasional
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-600 dark:text-gray-400">Senin - Jumat</span>
            <span class="text-xs font-bold text-gray-800 dark:text-gray-200">08.00 - 16.00 WIB</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-600 dark:text-gray-400">Sabtu</span>
            <span class="text-xs font-bold text-gray-800 dark:text-gray-200">08.00 - 12.00 WIB</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-600 dark:text-gray-400">Dermaga & TPI</span>
            <span class="text-xs font-bold text-emerald-600">24 Jam Operasional</span>
          </div>
        </div>
      </div>
    </div>

    <!-- App Info -->
    <div class="text-center pb-24">
      <p class="text-[10px] text-gray-400 font-medium">SAMOSIR APPS v3.0</p>
      <p class="text-[10px] text-gray-300 mt-1 italic">Create by kendariweb.com</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Anchor, 
  Info, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Clock,
  Ship,
  Warehouse,
  Fuel,
  Wrench,
  Fish,
  ShieldCheck,
  Droplets,
  Container
} from 'lucide-vue-next'

const router = useRouter()

const facilities = [
  { name: 'Dermaga Bongkar', desc: '4 unit dermaga', icon: Ship, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'Cold Storage', desc: 'Kapasitas 200 ton', icon: Container, color: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'SPDN / BBM', desc: 'Solar & bensin', icon: Fuel, color: 'text-amber-600 dark:text-amber-400' },
  { name: 'Docking Kapal', desc: 'Maks 100 GT', icon: Wrench, color: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'TPI (Pelelangan)', desc: 'Buka 24 jam', icon: Fish, color: 'text-primary-600 dark:text-primary-400' },
  { name: 'PSDKP', desc: 'Pengawasan perikanan', icon: ShieldCheck, color: 'text-red-600 dark:text-red-400' },
]
</script>
