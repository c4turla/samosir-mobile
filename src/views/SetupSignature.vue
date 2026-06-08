<template>
  <div class="px-5 py-6 dark:bg-slate-950 min-h-full transition-colors duration-300">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-8">
      <button 
        @click="router.push({ name: 'Profile' })"
        class="p-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-2xl transition-all active:scale-95"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Tanda Tangan Digital</h2>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Setup tanda tangan untuk dokumen pelaporan</p>
      </div>
    </div>

    <!-- Info Warning -->
    <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-3xl p-5 mb-6">
      <div class="flex space-x-3">
        <PenTool class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="text-xs font-bold text-blue-900 dark:text-blue-300">Pentingnya Tanda Tangan</h4>
          <p class="text-[10px] text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
            Tanda tangan digital Anda akan digunakan secara otomatis pada dokumen cetak PDF pelaporan E-Arrival, E-Departure, dan Pemesanan Jasa. Pastikan tanda tangan digambar dengan jelas.
          </p>
        </div>
      </div>
    </div>

    <!-- Active Signature Preview -->
    <div v-if="currentSignatureUrl" class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm mb-6 text-center">
      <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Tanda Tangan Aktif</h4>
      <div class="bg-slate-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-center h-32 overflow-hidden">
        <img :src="currentSignatureUrl" class="max-h-full max-w-full object-contain dark:invert" alt="Tanda Tangan Aktif" />
      </div>
    </div>

    <!-- Drawing Pad Canvas -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm mb-8">
      <div class="flex justify-between items-center mb-3">
        <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">Gambar Tanda Tangan Anda</h4>
        <button 
          @click="clearCanvas"
          class="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-lg transition-colors flex items-center space-x-1"
        >
          <Trash2 class="w-3 h-3" />
          <span>Hapus</span>
        </button>
      </div>

      <div class="relative bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-48 flex items-center justify-center">
        <canvas 
          ref="canvasRef"
          class="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawingTouch"
          @touchmove="drawTouch"
          @touchend="stopDrawing"
        ></canvas>
        <span v-if="!isDrawingStarted" class="text-[10px] text-gray-400 pointer-events-none select-none italic">
          Gunakan jari atau stylus untuk menggambar di sini
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-3 pb-24">
      <button 
        @click="saveSignature"
        :disabled="isSaving || !isDrawingStarted"
        class="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 text-white text-xs font-bold rounded-2xl transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-sm"
      >
        <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Tanda Tangan' }}</span>
      </button>

      <button 
        @click="router.push({ name: 'Profile' })"
        class="w-full py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl active:scale-[0.99] transition-colors border border-gray-150/40 dark:border-slate-800/80 text-center block"
      >
        Batal
      </button>
    </div>

    <!-- SUCCESS DIALOG -->
    <Transition name="fade">
      <div v-if="isSuccessModalOpen" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] border border-gray-150 dark:border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
          <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Tanda Tangan Disimpan!</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Tanda tangan digital Anda telah berhasil dikonfigurasi dan akan disematkan secara otomatis pada setiap pelaporan Anda.
          </p>

          <button 
            @click="goToProfile"
            class="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl active:scale-95 transition-all text-center block shadow-sm shadow-emerald-500/20"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    </Transition>

    <!-- ERROR DIALOG -->
    <Transition name="fade">
      <div v-if="isErrorModalOpen" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] border border-gray-150 dark:border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle class="w-8 h-8" />
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Gagal Menyimpan</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            {{ errorMessage }}
          </p>

          <button 
            @click="isErrorModalOpen = false"
            class="mt-6 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl active:scale-95 transition-all text-center block shadow-sm shadow-red-500/20"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  PenTool, 
  Trash2, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'
import { API_URL } from '@/config'

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isSaving = ref(false)
const isDrawingStarted = ref(false)
const currentSignatureUrl = ref('')

const isSuccessModalOpen = ref(false)
const isErrorModalOpen = ref(false)
const errorMessage = ref('')

const goToProfile = () => {
  isSuccessModalOpen.value = false
  router.push({ name: 'Profile' })
}

let ctx: CanvasRenderingContext2D | null = null
let drawing = false

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio

  ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  ctx.strokeStyle = '#0284c7' // sky-600
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const tempImage = canvas.toDataURL()

  initCanvas()

  const img = new Image()
  img.onload = () => {
    ctx?.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
  }
  img.src = tempImage
}

onMounted(() => {
  initCanvas()
  fetchCurrentSignature()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const fetchCurrentSignature = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const json = await response.json()
      const user = json.data || json
      if (user && user.signature) {
        currentSignatureUrl.value = user.signature
      }
    }
  } catch (err) {
    console.error('Gagal mengambil data tanda tangan:', err)
  }
}

// Mouse events
const startDrawing = (e: MouseEvent) => {
  drawing = true
  isDrawingStarted.value = true
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const rect = canvas.getBoundingClientRect()
  ctx.beginPath()
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
}

const draw = (e: MouseEvent) => {
  if (!drawing || !ctx || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
  ctx.stroke()
}

const stopDrawing = () => {
  drawing = false
}

// Touch events
const startDrawingTouch = (e: TouchEvent) => {
  e.preventDefault()
  drawing = true
  isDrawingStarted.value = true
  const canvas = canvasRef.value
  if (!canvas || !ctx || e.touches.length === 0) return
  const rect = canvas.getBoundingClientRect()
  const touch = e.touches[0]!
  ctx.beginPath()
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top)
}

const drawTouch = (e: TouchEvent) => {
  e.preventDefault()
  if (!drawing || !ctx || !canvasRef.value || e.touches.length === 0) return
  const rect = canvasRef.value.getBoundingClientRect()
  const touch = e.touches[0]!
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top)
  ctx.stroke()
}

const clearCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  isDrawingStarted.value = false
}

const saveSignature = async () => {
  const canvas = canvasRef.value
  if (!canvas || !isDrawingStarted.value) return

  isSaving.value = true
  const token = localStorage.getItem('token')
  if (!token) {
    isSaving.value = false
    errorMessage.value = 'Sesi Anda telah habis. Silakan login kembali.'
    isErrorModalOpen.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2500)
    return
  }

  const base64Data = canvas.toDataURL('image/png')

  try {
    const response = await fetch(`${API_URL}/profile/signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        signature: base64Data
      })
    })

    const result = await response.json()

    if (response.ok) {
      isSuccessModalOpen.value = true
    } else {
      errorMessage.value = result.message || 'Gagal menyimpan tanda tangan digital.'
      isErrorModalOpen.value = true
    }
  } catch (err) {
    console.error('Error saving signature:', err)
    errorMessage.value = 'Terjadi kesalahan jaringan saat mencoba menyimpan tanda tangan.'
    isErrorModalOpen.value = true
  } finally {
    isSaving.value = false
  }
}
</script>
