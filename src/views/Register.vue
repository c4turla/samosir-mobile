<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center px-6 py-12 transition-colors duration-300">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-200 dark:shadow-none">
          S
        </div>
      </div>
      <h2 class="mt-8 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white line-height-tight">
        Daftar Akun
      </h2>
      <p class="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        Buat akun baru untuk mengakses SAMOSIR
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="bg-white dark:bg-slate-900 px-8 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl border border-slate-100 dark:border-slate-800">
        
        <!-- Pesan Alert -->
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm border border-green-200 dark:border-green-800">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          
          <!-- Nama Lengkap -->
          <div>
            <label for="name" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
            <div class="mt-2">
              <input 
                id="name" 
                v-model="form.name"
                type="text" 
                required 
                class="block w-full rounded-xl border-0 px-4 py-3 text-slate-900 dark:text-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name[0] }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <div class="mt-2">
              <input 
                id="email" 
                v-model="form.email"
                type="email" 
                required 
                class="block w-full rounded-xl border-0 px-4 py-3 text-slate-900 dark:text-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="nama@email.com"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email[0] }}</p>
          </div>

          <!-- Pilihan Role -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Daftar Sebagai</label>
            <div class="grid grid-cols-2 gap-3">
              <label 
                class="relative flex cursor-pointer rounded-xl border p-3 shadow-sm focus:outline-none"
                :class="form.role === 'umum' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-600' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'"
              >
                <input type="radio" v-model="form.role" value="umum" class="sr-only" />
                <span class="flex flex-col text-center w-full">
                  <span class="block text-sm font-medium" :class="form.role === 'umum' ? 'text-primary-900 dark:text-primary-100' : 'text-slate-900 dark:text-white'">Masyarakat Umum</span>
                </span>
              </label>

              <label 
                class="relative flex cursor-pointer rounded-xl border p-3 shadow-sm focus:outline-none"
                :class="form.role === 'pengelola_kapal' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-600' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'"
              >
                <input type="radio" v-model="form.role" value="pengelola_kapal" class="sr-only" />
                <span class="flex flex-col text-center w-full">
                  <span class="block text-sm font-medium" :class="form.role === 'pengelola_kapal' ? 'text-primary-900 dark:text-primary-100' : 'text-slate-900 dark:text-white'">Pengelola Kapal</span>
                </span>
              </label>
            </div>
          </div>

          <!-- Kata Sandi -->
          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">Kata Sandi</label>
            <div class="mt-2">
              <input 
                id="password" 
                v-model="form.password"
                type="password" 
                required 
                class="block w-full rounded-xl border-0 px-4 py-3 text-slate-900 dark:text-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="Minimal 8 karakter"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password[0] }}</p>
          </div>

          <div class="pt-4">
            <button 
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-xl bg-primary-600 px-3 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span v-if="isLoading">Memproses...</span>
              <span v-else>Daftar Sekarang</span>
            </button>
          </div>
        </form>
      </div>
      
      <p class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Sudah punya akun?
        <router-link to="/login" class="font-bold leading-6 text-primary-600 dark:text-primary-400 hover:text-primary-500 underline underline-offset-4">Masuk di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'umum'
})

const errors = ref<Record<string, string[]>>({})
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  errors.value = {}
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // VITE_API_URL diambil dari file .env
    // Pastikan Anda sudah membuat VITE_API_URL=http://localhost:8004/api/v1 di .env
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const endpoint = `${baseUrl}/register`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 422) {
        errors.value = data.errors || {}
      } else {
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar.')
      }
      return
    }

    successMessage.value = 'Registrasi berhasil! Anda akan diarahkan ke halaman login...'
    
    // Redirect ke login setelah 2 detik
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err: any) {
    errorMessage.value = err.message || 'Koneksi ke server gagal. Pastikan API menyala.'
  } finally {
    isLoading.value = false
  }
}
</script>
