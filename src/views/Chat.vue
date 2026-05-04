<template>
  <!-- Chat List View (Sidebar) -->
  <div v-if="!selectedConversation" class="flex flex-col h-full bg-white dark:bg-slate-950 transition-colors duration-300">
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
      <!-- Conversations List (for "Semua" category) -->
      <div v-if="activeCategory === 'Semua'" class="space-y-2">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="flex items-center space-x-4 p-4 rounded-3xl transition-all duration-200 active:scale-[0.98] cursor-pointer border border-transparent hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/30"
          @click="selectConversationFromList(conversation)"
        >
          <div class="relative flex-shrink-0">
            <div :class="['w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-white shadow-lg', conversation.color, 'bg-gradient-to-br shadow-primary-200 dark:shadow-primary-900/50']">
              {{ conversation.initials }}
            </div>
            <div v-if="conversation.online" class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-950 shadow-sm"></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-2">
              <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{{ conversation.name }}</h4>
              <span class="text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">{{ conversation.time }}</span>
            </div>
            <div class="flex justify-between items-center">
              <p :class="['text-sm truncate max-w-[200px]', conversation.unread > 0 ? 'text-gray-800 dark:text-gray-200 font-bold' : 'text-gray-500 dark:text-gray-400']">
                {{ conversation.lastMessage }}
              </p>
              <div v-if="conversation.unread > 0" class="ml-3 w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-xs font-bold text-white">{{ conversation.unread }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading state for conversations -->
        <div v-if="loadingConversations && conversations.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div class="w-8 h-8 border-3 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Memuat percakapan...</p>
        </div>

        <!-- Empty state for conversations -->
        <div v-if="conversations.length === 0 && !loadingConversations" class="text-center py-12">
          <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-semibold text-lg mb-2">Belum ada percakapan</p>
          <p class="text-sm text-gray-400 dark:text-gray-500">Pilih kontak untuk memulai chat</p>
        </div>
      </div>

      <!-- Contacts List (for other categories) -->
      <div v-if="activeCategory !== 'Semua'" class="space-y-2">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          class="flex items-center space-x-4 p-4 rounded-3xl transition-all duration-200 active:scale-[0.98] cursor-pointer border border-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:shadow-lg"
          @click="selectConversation(contact)"
        >
          <div class="relative flex-shrink-0">
            <div :class="['w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-white shadow-lg', contact.color || getColorForContact(contact), 'bg-gradient-to-br shadow-gray-300 dark:shadow-gray-900/50']">
              {{ contact.initials }}
            </div>
            <div v-if="contact.online" class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-950 shadow-sm"></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-2">
              <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{{ contact.name }}</h4>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">{{ contact.lastSeen || 'Offline' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-sm truncate text-gray-500 dark:text-gray-400 max-w-[200px]">
                {{ contact.lastMessage || 'Belum ada pesan' }}
              </p>
              <div v-if="contact.unread > 0" class="ml-3 w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-xs font-bold text-white">{{ contact.unread }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Chat Conversation View (Full Screen) -->
  <div v-if="selectedConversation" class="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950">
    <!-- Chat Header -->
    <div class="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 shadow-lg border-b border-gray-100 dark:border-slate-700">
      <div class="flex items-center space-x-4">
        <button
          @click="selectedConversation = null"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div class="relative">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg', selectedConversation.color, 'bg-gradient-to-br shadow-primary-200 dark:shadow-primary-900/50']">
            {{ selectedConversation.initials }}
          </div>
          <div v-if="selectedConversation.online" class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-800 shadow-sm"></div>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedConversation.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2" :class="selectedConversation.online ? 'bg-emerald-500' : 'bg-gray-400'"></span>
            {{ selectedConversation.online ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-slate-900/50 dark:to-slate-950" ref="messagesContainer">
      <!-- Date Separator -->
      <div v-if="messages.length > 0" class="flex justify-center my-6">
        <div class="bg-white dark:bg-slate-700 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-600">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ formatDate(new Date()) }}</span>
        </div>
      </div>

      <!-- Messages -->
      <div v-for="message in messages" :key="message.id" class="flex" :class="message.sender_id === userId ? 'justify-end' : 'justify-start'">
        <div v-if="message.sender_id === userId" class="max-w-[75%] space-y-1">
          <div class="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 text-white px-5 py-3 rounded-3xl rounded-br-md shadow-lg ml-auto">
            <p class="text-sm leading-relaxed">{{ message.body }}</p>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 text-right mr-2">{{ formatTime(message.created_at) }}</div>
        </div>
        <div v-else class="max-w-[75%] space-y-1">
          <div class="flex items-end space-x-3">
            <div class="relative flex-shrink-0">
              <div :class="['w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs', selectedConversation.color, 'bg-gradient-to-br']">
                {{ selectedConversation.initials }}
              </div>
            </div>
            <div class="bg-white dark:bg-slate-700 px-5 py-3 rounded-3xl rounded-bl-md shadow-lg border border-gray-100 dark:border-slate-600">
              <p class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{{ message.body }}</p>
            </div>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 text-left ml-11">{{ formatTime(message.created_at) }}</div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="flex items-end space-x-3">
          <div class="relative flex-shrink-0">
            <div :class="['w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs', selectedConversation.color, 'bg-gradient-to-br']">
              {{ selectedConversation.initials }}
            </div>
          </div>
          <div class="bg-white dark:bg-slate-700 px-4 py-2 rounded-3xl rounded-bl-md shadow-sm border border-gray-100 dark:border-slate-600">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="loadingMessages && messages.length === 0" class="flex justify-center py-8">
        <div class="flex items-center space-x-3 bg-white dark:bg-slate-700 px-6 py-3 rounded-2xl shadow-sm">
          <div class="w-5 h-5 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-gray-600 dark:text-gray-300 font-medium">Memuat pesan...</span>
        </div>
      </div>

      <!-- Empty state for messages -->
      <div v-if="messages.length === 0 && !loadingMessages" class="flex flex-col items-center justify-center py-16">
        <div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mb-6 flex items-center justify-center">
          <svg class="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Mulai Percakapan</h3>
        <p class="text-gray-500 dark:text-gray-400 text-center max-w-sm">Kirim pesan pertama untuk memulai obrolan dengan {{ selectedConversation.name }}</p>
      </div>
    </div>

    <!-- Message Input -->
    <div class="px-6 py-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
      <div class="flex items-end space-x-4">
        <div class="flex-1 relative">
          <textarea
            v-model="newMessage"
            @input="autoResizeTextarea"
            @keyup.enter.exact="sendMessage"
            @keydown.enter.shift.exact.prevent
            placeholder="Ketik pesan..."
            rows="1"
            class="w-full px-5 py-3 pr-12 rounded-3xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 overflow-y-auto"
            style="min-height: 48px;"
          ></textarea>
          <button class="absolute right-3 bottom-3 p-1 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200">
            <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>
        </div>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || sendingMessage"
          class="p-3 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <svg v-if="!sendingMessage" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

// Configure Laravel Echo for real-time communication
declare global {
  interface Window {
    Pusher: any;
  }
}

window.Pusher = Pusher

let echo: any = null

const initEcho = async () => {
  try {
    echo = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY || 'your-app-key',
      wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
      wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
      forceTLS: false,
      encrypted: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    })

    console.log('Laravel Echo initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Laravel Echo:', error)
    isWebSocketEnabled = false
  }
}

// State
const userId = ref(Number(localStorage.getItem('userId')) || 1)
const userRole = ref(localStorage.getItem('userRole') || 'umum')
const contacts = ref([])
const conversations = ref([])
const messages = ref([])
const selectedConversation = ref(null)
const newMessage = ref('')
const loadingContacts = ref(false)
const loadingConversations = ref(false)
const loadingMessages = ref(false)
const sendingMessage = ref(false)
const activeCategory = ref('Semua')
const isTyping = ref(false)
const messagesContainer = ref(null)

// Real-time WebSocket
let echoChannel: any = null
let privateChannel: any = null
let isWebSocketEnabled = true

// Computed
const categories = computed(() => {
  return userRole.value === 'umum'
    ? ['Semua', 'Petugas', 'Pengelola']
    : ['Semua', 'Petugas', 'Klien']
})

const filteredContacts = computed(() => {
  // Filter contacts based on active category and user role
  return contacts.value.filter(contact => {
    // Category filter
    const matchCategory = activeCategory.value === 'Semua' || contact.category === activeCategory.value

    // Role-based visibility
    let visibleForRole = true
    if (userRole.value === 'umum' && contact.category === 'Klien') visibleForRole = false
    if (userRole.value === 'pengelola' && contact.category === 'Pengelola') {
      // Allow managers to see other managers
    }

    return matchCategory && visibleForRole
  })
})

// Methods
const fetchContacts = async () => {
  loadingContacts.value = true
  try {
    const response = await fetch(`${API_BASE}/api/v1/chat/contacts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // Transform contacts to match UI expectations
        contacts.value = data.data.map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          initials: contact.name.match(/\b\w/g)?.join('').substring(0, 2).toUpperCase() || '??',
          role: contact.role,
          category: contact.role, // Add category for filtering
          photo: contact.photo,
          online: Math.random() > 0.5, // Simulate online status
          lastSeen: Math.random() > 0.7 ? 'Baru aktif' : Math.random() > 0.3 ? 'Sembilan menit yang lalu' : 'Kemarin',
          lastMessage: Math.random() > 0.6 ? 'Halo, ada yang bisa saya bantu?' : '',
          unread: Math.floor(Math.random() * 5),
          color: ['bg-primary-600', 'bg-indigo-500', 'bg-emerald-600', 'bg-slate-700'][Math.floor(Math.random() * 4)]
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
  } finally {
    loadingContacts.value = false
  }
}

const fetchConversations = async () => {
  loadingConversations.value = true
  try {
    const response = await fetch(`${API_BASE}/api/v1/chat/conversations`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // Transform conversations
        conversations.value = data.data.map((conv: any) => ({
          id: conv.id,
          name: conv.participant?.name || 'Percakapan Grup',
          initials: conv.participant?.name?.match(/\b\w/g)?.join('').substring(0, 2).toUpperCase() || 'GP',
          lastMessage: conv.latest_message?.body || '',
          time: conv.latest_message?.created_at ? new Date(conv.latest_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
          unread: !conv.read_at ? 1 : 0, // Simplified
          online: conv.participant?.online ?? false,
          color: ['bg-primary-600', 'bg-indigo-500', 'bg-emerald-600', 'bg-slate-700'][Math.floor(Math.random() * 4)],
          category: conv.participant?.role || 'Petugas'
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
  } finally {
    loadingConversations.value = false
  }
}

const fetchMessages = async (conversationId: number, showLoading = true) => {
  console.log('fetchMessages called with conversationId:', conversationId, 'API_BASE:', API_BASE)

  if (!conversationId) {
    console.log('No conversationId provided, setting empty messages')
    messages.value = []
    return
  }

  if (showLoading) loadingMessages.value = true

  // Add dummy messages for testing (remove in production)
  if (conversationId == 1) {
    messages.value = [
      {
        id: 1,
        body: 'Selamat datang di aplikasi Samosir Mobile!',
        sender_id: 1,
        created_at: new Date().toISOString(),
        sender: { id: 1, name: 'Admin' }
      },
      {
        id: 2,
        body: 'Terima kasih atas sambutannya!',
        sender_id: 2,
        created_at: new Date().toISOString(),
        sender: { id: 2, name: 'User' }
      }
    ]
    if (showLoading) loadingMessages.value = false
    setTimeout(() => scrollToBottom(), 100)
    return
  } else if (conversationId == 2) {
    messages.value = [
      {
        id: 3,
        body: 'Halo Capt. Heri, bagaimana kondisi ikan hari ini?',
        sender_id: 2,
        created_at: new Date().toISOString(),
        sender: { id: 2, name: 'User' }
      },
      {
        id: 4,
        body: 'Baik-baik saja. Ikan tuna 500kg sudah ready untuk diantar.',
        sender_id: 3,
        created_at: new Date().toISOString(),
        sender: { id: 3, name: 'Capt. Heri' }
      }
    ]
    if (showLoading) loadingMessages.value = false
    setTimeout(() => scrollToBottom(), 100)
    return
  }

  try {
    // For selectConversationFromList (existing conversations), conversationId is already the conversation ID
    // For selectConversation (new conversations), we need to handle differently

    let targetConversationId = conversationId

    // Check if this conversationId exists in our conversations list (meaning it's a real conversation ID)
    const existingConversation = conversations.value.find((conv: any) => conv.id === conversationId)

    if (existingConversation) {
      // This is already a conversation ID, use it directly
      console.log('Using conversation ID directly:', conversationId)
      targetConversationId = conversationId
    } else {
      // This might be a contact ID, try to find existing conversation
      const conversationByParticipant = conversations.value.find((conv: any) =>
        conv.participant?.id === conversationId
      )

      if (conversationByParticipant) {
        console.log('Found conversation by participant:', conversationByParticipant)
        targetConversationId = conversationByParticipant.id
      } else {
        // No existing conversation, this is a new conversation
        console.log('No existing conversation found for contact:', conversationId)
        messages.value = []
        if (showLoading) loadingMessages.value = false
        return
      }
    }

    const url = `${API_BASE}/api/v1/chat/conversations/${targetConversationId}/messages`
    console.log('Fetching messages from URL:', url)

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })

    console.log('Response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('Response data:', data)

      if (data.status === 'success') {
        const newMessages = data.data.data.map((msg: any) => ({
          id: msg.id,
          body: msg.body,
          sender_id: msg.sender_id,
          created_at: msg.created_at,
          sender: msg.sender
        }))

        console.log('Mapped messages:', newMessages)

        // Always update messages for initial load
        messages.value = newMessages

        // Scroll to bottom for initial load
        if (showLoading) {
          setTimeout(() => scrollToBottom(), 100)
        }
      } else {
        console.error('API returned error status:', data)
        messages.value = []
      }
    } else {
      console.error('HTTP error:', response.status, response.statusText)
      messages.value = []
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    messages.value = []
  } finally {
    if (showLoading) loadingMessages.value = false
  }
}

const selectConversation = (contact: any) => {
  console.log('Selecting conversation with contact:', contact)
  // Create a conversation object from contact
  selectedConversation.value = {
    id: contact.id,
    name: contact.name,
    initials: contact.initials,
    color: contact.color,
    online: contact.online
  }

  console.log('selectedConversation set to:', selectedConversation.value)

  // Fetch actual messages for this conversation
  // Note: In production, you should first check if a conversation exists
  // or create one via the API. For now, we'll try to fetch messages directly
  fetchMessages(contact.id)

  // Setup real-time for this conversation
  setupRealTimeForConversation(contact.id)
}

const selectConversationFromList = (conversation: any) => {
  console.log('Selecting conversation from list:', conversation)
  // Select existing conversation
  selectedConversation.value = {
    id: conversation.id, // Use conversation ID for identification
    name: conversation.name,
    initials: conversation.initials,
    color: conversation.color,
    online: conversation.online,
    conversationId: conversation.id // Store actual conversation ID
  }

  console.log('selectedConversation set to:', selectedConversation.value)

  // Fetch messages using conversation ID
  fetchMessages(conversation.id)

  // Setup real-time for this conversation
  setupRealTimeForConversation(conversation.id)

  // Scroll to bottom after messages load
  setTimeout(() => scrollToBottom(), 500)
}

const setupRealTimeForConversation = (conversationId: number) => {
  if (!isWebSocketEnabled || !echo) {
    console.log('WebSocket disabled or Echo not initialized, skipping real-time setup')
    return
  }

  try {
    // Leave previous channels
    if (echoChannel) {
      echoChannel.stopListening('MessageSent')
      echo.leaveChannel(`conversation.${echoChannel.name}`)
    }

    // Join new conversation channel
    echoChannel = echo.private(`conversation.${conversationId}`)
      .listen('.MessageSent', (event: any) => {
        console.log('Real-time message received:', event)

        // Add new message if it's not from current user
        if (event.message.sender_id !== userId.value) {
          messages.value.push({
            id: event.message.id,
            body: event.message.body,
            sender_id: event.message.sender_id,
            created_at: event.message.created_at,
            sender: event.sender
          })

          // Scroll to bottom
          scrollToBottom()
        }

        // Refresh conversations list
        fetchConversations()
      })
      .error((error: any) => {
        console.error('WebSocket conversation channel error:', error)
        isWebSocketEnabled = false
        // Fallback to polling
        startPollingFallback()
      })
  } catch (error) {
    console.error('Failed to setup WebSocket for conversation:', error)
    isWebSocketEnabled = false
    startPollingFallback()
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  sendingMessage.value = true
  try {
    const payload = {
      receiver_id: selectedConversation.value.id,
      message: newMessage.value
    }

    // If we have a conversation ID from selected conversation, use it
    if (selectedConversation.value.conversationId) {
      payload.conversation_id = selectedConversation.value.conversationId
      delete payload.receiver_id
    } else if (messages.value.length > 0) {
      // Find conversation ID from existing conversations
      const conversation = conversations.value.find((conv: any) =>
        conv.participant?.id === selectedConversation.value.id
      )
      if (conversation) {
        payload.conversation_id = conversation.id
        delete payload.receiver_id
      }
    }

    const response = await fetch(`${API_BASE}/api/v1/chat/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // Add the sent message to local list
        messages.value.push({
          id: data.data.id,
          body: data.data.body,
          sender_id: userId.value,
          created_at: data.data.created_at,
          sender: { id: userId.value, name: 'Anda' }
        })

        // Clear input
        newMessage.value = ''

        // Refresh conversations immediately to update latest message
        fetchConversations()

        // If this created a new conversation, update selectedConversation with conversationId
        if (!selectedConversation.value.conversationId && data.data.conversation_id) {
          selectedConversation.value.conversationId = data.data.conversation_id
        }

        // Scroll to bottom
        scrollToBottom()
      }
    } else {
      console.error('Failed to send message:', response.statusText)
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sendingMessage.value = false
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

const formatDate = (date: Date) => {
  const today = new Date()
  const messageDate = new Date(date)

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Hari ini'
  }

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Kemarin'
  }

  return messageDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      const container = messagesContainer.value as HTMLElement
      container.scrollTop = container.scrollHeight
    }, 100)
  }
}

const autoResizeTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'
}

const getColorForContact = (contact: any) => {
  // Consistent color based on contact ID
  const colors = ['bg-primary-600', 'bg-indigo-500', 'bg-emerald-600', 'bg-slate-700', 'bg-purple-600', 'bg-rose-600']
  return colors[Math.abs(contact.id) % colors.length]
}

const startRealTimeUpdates = async () => {
  if (!isWebSocketEnabled) {
    console.log('WebSocket disabled, using polling fallback')
    startPollingFallback()
    return
  }

  try {
    // Initialize Echo if not already done
    if (!echo) {
      await initEcho()
    }

    if (!echo) {
      console.log('Failed to initialize Echo, using polling fallback')
      startPollingFallback()
      return
    }

    // Setup real-time for conversations
    privateChannel = echo.private(`user.${userId.value}`)
      .listen('.MessageSent', (event: any) => {
        console.log('New message notification:', event)

        // Refresh conversations when new message arrives
        fetchConversations()

        // If we have a selected conversation and the message is for it, add it
        if (selectedConversation.value && event.message.conversation_id === selectedConversation.value.conversationId) {
          // Message will be handled by conversation-specific channel
        }
      })
      .error((error: any) => {
        console.error('WebSocket user channel error:', error)
        isWebSocketEnabled = false
        startPollingFallback()
      })
  } catch (error) {
    console.error('Failed to setup WebSocket:', error)
    isWebSocketEnabled = false
    startPollingFallback()
  }
}

const startPollingFallback = () => {
  console.log('Starting polling fallback for real-time updates')

  // Poll conversations every 10 seconds
  setInterval(() => {
    if (activeCategory.value === 'Semua') {
      fetchConversations()
    }
  }, 10000)

  // Poll messages every 5 seconds if conversation is selected
  setInterval(() => {
    if (selectedConversation.value) {
      const conversationId = selectedConversation.value.conversationId ||
        conversations.value.find((conv: any) =>
          conv.participant?.id === selectedConversation.value.id
        )?.id

      if (conversationId) {
        fetchMessages(conversationId, false) // Don't show loading for polling
      }
    }
  }, 5000)
}

const stopRealTimeUpdates = () => {
  if (isWebSocketEnabled && echo) {
    if (echoChannel) {
      echoChannel.stopListening('MessageSent')
      echo.leaveChannel(`conversation.${echoChannel.name}`)
      echoChannel = null
    }

    if (privateChannel) {
      privateChannel.stopListening('MessageSent')
      echo.leaveChannel(`user.${userId.value}`)
      privateChannel = null
    }
  }
}

// Watchers
watch(activeCategory, (newCategory, oldCategory) => {
  // Stop polling when switching away from "Semua"
  if (oldCategory === 'Semua' && newCategory !== 'Semua') {
    // Real-time is always active, no need to stop
  }

  // Clear selected conversation when switching categories
  if (newCategory !== oldCategory) {
    selectedConversation.value = null
    messages.value = []
  }
})

// Lifecycle
onMounted(async () => {
  console.log('Chat component mounted, initializing...')
  fetchContacts()
  fetchConversations()
  await startRealTimeUpdates()

  // Add dummy data for testing (remove in production)
  setTimeout(() => {
    if (conversations.value.length === 0) {
      conversations.value = [
        {
          id: 1,
          name: 'Admin Pelabuhan',
          initials: 'AP',
          lastMessage: 'Selamat datang di aplikasi!',
          time: '10:30',
          unread: 0,
          online: true,
          color: 'bg-primary-600',
          participant: { id: 1, name: 'Admin Pelabuhan' }
        },
        {
          id: 2,
          name: 'Capt. Heri',
          initials: 'CH',
          lastMessage: 'Ikan sudah siap diantar',
          time: '09:15',
          unread: 2,
          online: false,
          color: 'bg-emerald-600',
          participant: { id: 2, name: 'Capt. Heri' }
        }
      ]
    }

    if (contacts.value.length === 0) {
      contacts.value = [
        {
          id: 1,
          name: 'Admin Pelabuhan',
          initials: 'AP',
          role: 'Petugas',
          online: true,
          lastSeen: 'Online',
          lastMessage: 'Selamat datang!',
          unread: 0,
          color: 'bg-primary-600',
          category: 'Petugas'
        },
        {
          id: 2,
          name: 'Capt. Heri',
          initials: 'CH',
          role: 'Pengelola',
          online: false,
          lastSeen: '2 jam yang lalu',
          lastMessage: 'Ikan sudah ready',
          unread: 2,
          color: 'bg-emerald-600',
          category: 'Pengelola'
        }
      ]
    }
  }, 1000)
})

onUnmounted(() => {
  stopRealTimeUpdates()
})
</script>