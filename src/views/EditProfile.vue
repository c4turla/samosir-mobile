<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-8">
      <button @click="router.back()" class="bg-gray-100 dark:bg-slate-800 p-2.5 rounded-2xl text-gray-600 dark:text-gray-300">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Edit Profil</h2>
    </div>

    <!-- Avatar -->
    <div class="flex justify-center mb-8">
      <div class="relative inline-block">
        <div class="w-28 h-28 bg-primary-100 dark:bg-primary-900/30 rounded-[2rem] flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
          <img v-if="photoPreview" :src="photoPreview" class="w-full h-full object-cover" />
          <User v-else class="w-14 h-14 text-primary-600 dark:text-primary-400" />
        </div>
        <label class="absolute bottom-0 right-0 p-2.5 bg-primary-600 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-lg cursor-pointer">
          <Camera class="w-4 h-4" />
          <input type="file" accept="image/jpeg,image/png,image/jpg" @change="onPhotoChange" class="hidden" />
        </label>
      </div>
    </div>

    <!-- Tab Switcher -->
    <div class="flex space-x-2 mb-6">
      <button 
        @click="activeTab = 'profile'"
        :class="[
          'flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all',
          activeTab === 'profile' 
            ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none' 
            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
        ]"
      >
        Data Profil
      </button>
      <button 
        @click="activeTab = 'password'"
        :class="[
          'flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all',
          activeTab === 'password' 
            ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none' 
            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
        ]"
      >
        Ubah Password
      </button>
    </div>

    <!-- Profile Form -->
    <form v-if="activeTab === 'profile'" @submit.prevent="handleSaveProfile" class="space-y-5">
      <!-- Nama -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <User class="w-5 h-5" />
          </span>
          <input 
            v-model="form.name"
            type="text"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
            placeholder="Masukkan nama lengkap"
          />
        </div>
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Mail class="w-5 h-5" />
          </span>
          <input 
            v-model="form.email"
            type="email"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
            placeholder="Masukkan email"
          />
        </div>
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">No. Telepon</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Phone class="w-5 h-5" />
          </span>
          <input 
            v-model="form.phone"
            type="tel"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
            placeholder="Masukkan no. telepon"
          />
        </div>
        <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
      </div>

      <!-- Address -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Alamat</label>
        <div class="relative">
          <span class="absolute top-3.5 left-0 pl-4 text-gray-400">
            <MapPin class="w-5 h-5" />
          </span>
          <textarea 
            v-model="form.address"
            rows="3"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500 resize-none"
            placeholder="Masukkan alamat"
          ></textarea>
        </div>
        <p v-if="errors.address" class="text-xs text-red-500 mt-1">{{ errors.address }}</p>
      </div>

      <!-- Role (readonly) -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Role</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Shield class="w-5 h-5" />
          </span>
          <input 
            :value="formatRole(form.role)"
            type="text"
            disabled
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-100 dark:bg-slate-900 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center space-x-3">
        <CheckCircle2 class="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p class="text-xs font-medium text-emerald-700 dark:text-emerald-400">{{ successMessage }}</p>
      </div>
      <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center space-x-3">
        <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0" />
        <p class="text-xs font-medium text-red-700 dark:text-red-400">{{ errorMessage }}</p>
      </div>

      <button 
        type="submit"
        :disabled="isSaving"
        class="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none transition-all disabled:opacity-50"
      >
        {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </form>

    <!-- Password Form -->
    <form v-if="activeTab === 'password'" @submit.prevent="handleChangePassword" class="space-y-5">
      <!-- Current Password -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Password Lama</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Lock class="w-5 h-5" />
          </span>
          <input 
            v-model="passwordForm.current_password"
            type="password"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
            placeholder="Masukkan password lama"
          />
        </div>
        <p v-if="pwErrors.current_password" class="text-xs text-red-500 mt-1">{{ pwErrors.current_password }}</p>
      </div>

      <!-- New Password -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Password Baru</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Lock class="w-5 h-5" />
          </span>
          <input 
            v-model="passwordForm.new_password"
            type="password"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
            placeholder="Masukkan password baru (min. 6 karakter)"
          />
        </div>
        <p v-if="pwErrors.new_password" class="text-xs text-red-500 mt-1">{{ pwErrors.new_password }}</p>
      </div>

      <!-- Confirm New Password -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <Lock class="w-5 h-5" />
          </span>
          <input 
            v-model="passwordForm.new_password_confirmation"
            type="password"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white dark:placeholder:text-gray-500"
            placeholder="Ulangi password baru"
          />
        </div>
      </div>

      <!-- Messages -->
      <div v-if="pwSuccessMessage" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center space-x-3">
        <CheckCircle2 class="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p class="text-xs font-medium text-emerald-700 dark:text-emerald-400">{{ pwSuccessMessage }}</p>
      </div>
      <div v-if="pwErrorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center space-x-3">
        <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0" />
        <p class="text-xs font-medium text-red-700 dark:text-red-400">{{ pwErrorMessage }}</p>
      </div>

      <button 
        type="submit"
        :disabled="isSavingPw"
        class="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none transition-all disabled:opacity-50"
      >
        {{ isSavingPw ? 'Menyimpan...' : 'Ubah Password' }}
      </button>
    </form>

    <div class="pb-24"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Camera, Mail, Phone, Shield, ArrowLeft, CheckCircle2, AlertCircle, Lock, MapPin } from 'lucide-vue-next'

const router = useRouter()
const activeTab = ref('profile')

// Profile form state
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const errors = ref<Record<string, string>>({})
const photoFile = ref<File | null>(null)
const photoPreview = ref('')

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  role: 'umum'
})

// Password form state
const isSavingPw = ref(false)
const pwSuccessMessage = ref('')
const pwErrorMessage = ref('')
const pwErrors = ref<Record<string, string>>({})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const formatRole = (role: string) => {
  if (role === 'pengelola_kapal' || role === 'pengelola') return 'Pengelola Kapal'
  if (role === 'umum') return 'Masyarakat Umum'
  return role
}

const onPhotoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    photoFile.value = target.files[0]
    photoPreview.value = URL.createObjectURL(target.files[0])
  }
}

const fetchProfile = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch(`${baseUrl}/me`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      const user = data.data || data
      form.value = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'umum'
      }
      if (user.photo) {
        photoPreview.value = user.photo
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data profile:', error)
  }
}

const handleSaveProfile = async () => {
  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  errors.value = {}

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const token = localStorage.getItem('token')

    // Use FormData for multipart/form-data (supports file upload)
    const formData = new FormData()
    if (form.value.name) formData.append('name', form.value.name)
    if (form.value.email) formData.append('email', form.value.email)
    if (form.value.phone) formData.append('phone', form.value.phone)
    if (form.value.address) formData.append('address', form.value.address)
    if (photoFile.value) formData.append('photo', photoFile.value)

    const response = await fetch(`${baseUrl}/profile/update`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 422) {
        const apiErrors = data.errors || {}
        for (const key in apiErrors) {
          errors.value[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key]
        }
      } else {
        throw new Error(data.message || 'Gagal menyimpan perubahan.')
      }
      return
    }

    localStorage.setItem('userName', form.value.name)
    successMessage.value = data.message || 'Profil berhasil diperbarui!'

  } catch (err: any) {
    errorMessage.value = err.message || 'Koneksi ke server gagal.'
  } finally {
    isSaving.value = false
  }
}

const handleChangePassword = async () => {
  isSavingPw.value = true
  pwSuccessMessage.value = ''
  pwErrorMessage.value = ''
  pwErrors.value = {}

  // Client-side validation
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    pwErrors.value.new_password = 'Konfirmasi password tidak cocok.'
    isSavingPw.value = false
    return
  }

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004/api/v1'
    const token = localStorage.getItem('token')

    const response = await fetch(`${baseUrl}/profile/change-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password,
        new_password_confirmation: passwordForm.value.new_password_confirmation
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 422) {
        const apiErrors = data.errors || {}
        for (const key in apiErrors) {
          pwErrors.value[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key]
        }
      } else {
        throw new Error(data.message || 'Gagal mengubah password.')
      }
      return
    }

    pwSuccessMessage.value = data.message || 'Password berhasil diubah!'
    passwordForm.value = { current_password: '', new_password: '', new_password_confirmation: '' }

  } catch (err: any) {
    pwErrorMessage.value = err.message || 'Koneksi ke server gagal.'
  } finally {
    isSavingPw.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
