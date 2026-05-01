<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center px-6 py-12 transition-colors duration-300">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-200 dark:shadow-none">
          S
        </div>
      </div>
      <h2 class="mt-8 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white line-height-tight">
        SAMOSIR APPS
      </h2>
      <p class="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        Monitoring & Pelayanan Mandiri Pelabuhan
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="bg-white dark:bg-slate-900 px-8 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl border border-slate-100 dark:border-slate-800">
        <div class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email atau Username</label>
            <div class="mt-2">
              <input 
                id="email" 
                name="email" 
                type="text" 
                required 
                class="block w-full rounded-xl border-0 py-3 text-slate-900 dark:text-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="Masukkan kredensial"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">Kata Sandi</label>
              <div class="text-sm">
                <a href="#" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">Lupa sandi?</a>
              </div>
            </div>
            <div class="mt-2">
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                class="block w-full rounded-xl border-0 py-3 text-slate-900 dark:text-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="pt-2">
            <button 
              @click="handleLogin"
              class="flex w-full justify-center rounded-xl bg-primary-600 px-3 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all active:scale-[0.98]"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span class="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">Atau masuk sebagai</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4">
            <button 
              @click="handlePublicLogin"
              class="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-800 px-3 py-3 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span class="text-sm font-semibold leading-6">Masyarakat Umum</span>
            </button>
          </div>
        </div>
      </div>
      
      <p class="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Belum punya akun?
        <a href="#" class="font-bold leading-6 text-primary-600 dark:text-primary-400 hover:text-primary-500 underline underline-offset-4">Daftar Masyarakat</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = () => {
  localStorage.setItem('userRole', 'pengelola')
  localStorage.setItem('userName', 'Capt. Heri Wibowo')
  router.push('/')
}

const handlePublicLogin = () => {
  localStorage.setItem('userRole', 'umum')
  localStorage.setItem('userName', 'Pengunjung')
  router.push('/')
}
</script>
