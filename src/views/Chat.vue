<template>
  <div class="h-full">
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
              <span class="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">{{ contact.roleLabel }}</span>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-sm truncate text-gray-500 dark:text-gray-400 max-w-[200px]">
                Mulai percakapan
              </p>
            </div>
          </div>
        </div>

        <!-- Loading state for contacts -->
        <div v-if="loadingContacts && contacts.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div class="w-8 h-8 border-3 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Memuat kontak...</p>
        </div>

        <!-- Empty state for contacts -->
        <div v-if="contacts.length === 0 && !loadingContacts" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 font-medium">Tidak ada kontak ditemukan</p>
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
          @click="goBack"
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
        <!-- Delete Conversation Button -->
        <button
          @click="confirmDeleteConversation"
          class="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
          title="Hapus percakapan"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
      <div v-for="message in messages" :key="message.id" class="flex" :class="Number(message.sender_id) === Number(userId) ? 'justify-end' : 'justify-start'">
        <!-- My messages (sent by current user) -->
        <div v-if="Number(message.sender_id) === Number(userId)" class="max-w-[75%] space-y-1">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 text-white px-5 py-3 rounded-3xl rounded-br-md shadow-lg ml-auto relative group"
            @contextmenu.prevent="openMessageMenu($event, message)"
          >
            <!-- File attachment -->
            <div v-if="message.file_full_url" class="mb-2">
              <img
                v-if="message.type === 'image'"
                :src="message.file_full_url"
                :alt="message.file_name"
                class="max-w-full rounded-2xl cursor-pointer"
                @click="openImage(message.file_full_url)"
              />
              <a
                v-else
                :href="message.file_full_url"
                target="_blank"
                class="flex items-center space-x-2 text-white/80 hover:text-white"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
                <span class="text-sm underline">{{ message.file_name || 'Lampiran' }}</span>
              </a>
            </div>
            <!-- Message text -->
            <p v-if="message.body" class="text-sm leading-relaxed" :class="{ 'italic text-white/70': message.is_deleted }">
              {{ message.body }}
            </p>
            <!-- Edited indicator -->
            <span v-if="message.is_edited && !message.is_deleted" class="text-[10px] text-white/50 ml-2">(diedit)</span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 text-right mr-2 flex items-center justify-end space-x-1">
            <span>{{ formatTime(message.created_at) }}</span>
            <!-- Message actions (shown on hover for own messages) -->
            <button
              v-if="!message.is_deleted"
              @click="openMessageMenu($event, message)"
              class="ml-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Other's messages -->
        <div v-else class="max-w-[75%] space-y-1">
          <div class="flex items-end space-x-3">
            <div class="relative flex-shrink-0">
              <div :class="['w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs', selectedConversation.color, 'bg-gradient-to-br']">
                {{ selectedConversation.initials }}
              </div>
            </div>
            <div class="bg-white dark:bg-slate-700 px-5 py-3 rounded-3xl rounded-bl-md shadow-lg border border-gray-100 dark:border-slate-600">
              <!-- File attachment -->
              <div v-if="message.file_full_url" class="mb-2">
                <img
                  v-if="message.type === 'image'"
                  :src="message.file_full_url"
                  :alt="message.file_name"
                  class="max-w-full rounded-2xl cursor-pointer"
                  @click="openImage(message.file_full_url)"
                />
                <a
                  v-else
                  :href="message.file_full_url"
                  target="_blank"
                  class="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                  <span class="text-sm">{{ message.file_name || 'Lampiran' }}</span>
                </a>
              </div>
              <!-- Message text -->
              <p v-if="message.body" class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed" :class="{ 'italic text-gray-400 dark:text-gray-500': message.is_deleted }">
                {{ message.body }}
              </p>
              <span v-if="message.is_edited && !message.is_deleted" class="text-[10px] text-gray-400 dark:text-gray-500 ml-2">(diedit)</span>
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
      <!-- File preview -->
      <div v-if="selectedFile" class="mb-3 flex items-center space-x-3 bg-gray-50 dark:bg-slate-700 rounded-2xl px-4 py-2">
        <div class="flex items-center space-x-2 flex-1 min-w-0">
          <svg class="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ selectedFile.name }}</span>
          <span class="text-xs text-gray-400">({{ formatFileSize(selectedFile.size) }})</span>
        </div>
        <button @click="removeFile" class="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
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
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            @change="handleFileSelect"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
          />
          <button
            @click="($refs.fileInput as HTMLInputElement)?.click()"
            class="absolute right-3 bottom-3 p-1 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>
        </div>
        <button
          @click="sendMessage"
          :disabled="(!newMessage.trim() && !selectedFile) || sendingMessage"
          class="p-3 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <svg v-if="!sendingMessage" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-6 9 6-9 6-9-6z" fill="none" stroke="none"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2l-7 20-4-9-9-4 20-7z"></path>
          </svg>
          <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </div>
    </div>
  </div>

  <!-- Context Menu for Messages -->
  <div
    v-if="contextMenu.visible"
    class="fixed z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 py-2 min-w-[160px] overflow-hidden"
    :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
  >
    <button
      v-if="Number(contextMenu.message?.sender_id) === Number(userId) && !contextMenu.message?.is_deleted"
      @click="startEditMessage(contextMenu.message)"
      class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
    >
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      <span class="text-sm text-gray-700 dark:text-gray-300">Edit</span>
    </button>
    <button
      v-if="Number(contextMenu.message?.sender_id) === Number(userId) && !contextMenu.message?.is_deleted"
      @click="deleteMessage(contextMenu.message)"
      class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
      <span class="text-sm text-red-500">Hapus</span>
    </button>
  </div>

  <!-- Edit Message Modal -->
  <div v-if="editingMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="cancelEditMessage">
    <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 mx-4 w-full max-w-md">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Pesan</h3>
      <textarea
        v-model="editMessageBody"
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        rows="3"
        placeholder="Edit pesan..."
      ></textarea>
      <div class="flex justify-end space-x-3 mt-4">
        <button
          @click="cancelEditMessage"
          class="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          Batal
        </button>
        <button
          @click="submitEditMessage"
          :disabled="!editMessageBody.trim() || savingEdit"
          class="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ savingEdit ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Image Preview Modal -->
  <div v-if="imagePreviewUrl" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click="imagePreviewUrl = null">
    <img :src="imagePreviewUrl" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { API_URL, REVERB_APP_KEY, REVERB_HOST, REVERB_PORT, REVERB_SCHEME } from '@/config'

const isValidPhoto = (photo: string | null | undefined): boolean => {
  if (!photo) return false
  const trimmed = photo.trim()
  return (
    trimmed !== '' &&
    trimmed !== '/' &&
    !trimmed.endsWith('/storage') &&
    !trimmed.endsWith('/storage/') &&
    !trimmed.endsWith('/null') &&
    !trimmed.endsWith('/undefined')
  )
}

// Configure Laravel Echo for real-time communication
declare global {
  interface Window {
    Pusher: any
  }
}

window.Pusher = Pusher

let echo: any = null

const initEcho = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No auth token found, skipping Echo initialization')
      isWebSocketEnabled = false
      return
    }

    // This custom handler in api/v1/broadcasting/auth uses auth:sanctum and
    // generates valid Pusher-protocol auth signatures for Bearer-token clients.
    const authUrl = `${API_URL}/broadcasting/auth`

    const useTLS = REVERB_SCHEME === 'https' || Number(REVERB_PORT) === 443

    echo = new Echo({
      broadcaster: 'reverb',
      key: REVERB_APP_KEY,
      wsHost: REVERB_HOST,
      wsPort: useTLS ? 443 : Number(REVERB_PORT),
      wssPort: useTLS ? 443 : Number(REVERB_PORT),
      forceTLS: useTLS,
      enabledTransports: useTLS ? ['wss'] : ['ws'],
      authEndpoint: authUrl,
      auth: {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      }
    })

    console.log(`Laravel Echo initialized, authEndpoint: ${authUrl}`)
  } catch (error) {
    console.error('Failed to initialize Laravel Echo:', error)
    isWebSocketEnabled = false
  }
}

// State
const userId = ref(Number(localStorage.getItem('userId')) || 1)
const userRole = ref(localStorage.getItem('userRole') || 'umum')
const contacts = ref([] as any[])
const conversations = ref([] as any[])
const messages = ref([] as any[])
const selectedConversation = ref(null as any)
const newMessage = ref('')
const loadingContacts = ref(false)
const loadingConversations = ref(false)
const loadingMessages = ref(false)
const sendingMessage = ref(false)
const activeCategory = ref('Semua')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)

// Context menu state
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  message: null as any
})

// Edit message state
const editingMessage = ref<any>(null)
const editMessageBody = ref('')
const savingEdit = ref(false)

// Real-time WebSocket
let echoChannel: any = null
let privateChannel: any = null
let isWebSocketEnabled = true
let pollingIntervals: ReturnType<typeof setInterval>[] = []
let isMounted = false

const onlineUserIds = ref(new Set<number>())

const updateOnlineStatus = () => {
  contacts.value.forEach(c => {
    c.online = onlineUserIds.value.has(Number(c.id))
  })
  conversations.value.forEach(c => {
    const participantId = c.participant?.id || c.id
    c.online = onlineUserIds.value.has(Number(participantId))
  })
  if (selectedConversation.value) {
    const participantId = selectedConversation.value.participant?.id || selectedConversation.value.id
    selectedConversation.value.online = onlineUserIds.value.has(Number(participantId))
  }
}


// Role to category mapping
const roleToCategory = (role: string): string => {
  const mapping: Record<string, string> = {
    'admin': 'Admin',
    'petugas': 'Petugas',
    'pengelola': 'Pengelola',
    'syahbandar': 'Syahbandar',
    'umum': 'Umum',
  }
  return mapping[role?.toLowerCase()] || 'Lainnya'
}

// Role label for display
const roleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    'admin': 'Admin',
    'petugas': 'Petugas',
    'syahbandar': 'Syahbandar',
    'pengelola': 'Pengelola',
    'umum': 'Umum',
  }
  return labels[role?.toLowerCase()] || role || ''
}

// Computed
const categories = computed(() => {
  return userRole.value === 'umum'
    ? ['Semua', 'Petugas', 'Pengelola']
    : ['Semua', 'Petugas', 'Umum']
})

const filteredContacts = computed(() => {
  return contacts.value.filter(contact => {
    const cat = contact.category
    if (activeCategory.value === 'Semua') return true
    return cat === activeCategory.value
  })
})

// Consistent color based on ID
const getColorForId = (id: number): string => {
  const colors = ['bg-primary-600', 'bg-indigo-500', 'bg-emerald-600', 'bg-slate-700', 'bg-purple-600', 'bg-rose-600']
  return colors[Math.abs(id) % colors.length] || 'bg-primary-600'
}

const getColorForContact = (contact: any) => {
  return getColorForId(contact.id)
}

// Helper: get initials from name
const getInitials = (name: string): string => {
  return name?.match(/\b\w/g)?.join('').substring(0, 2).toUpperCase() || '??'
}

// Auth headers helper
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Accept': 'application/json'
})

// ========================
// API Methods (per api_chat.md)
// ========================

// 1. GET /chat/contacts
const fetchContacts = async () => {
  if (!isMounted) return
  loadingContacts.value = true
  try {
    const response = await fetch(`${API_URL}/chat/contacts`, {
      headers: getAuthHeaders()
    })

    if (!isMounted) return

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        contacts.value = data.data.map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          initials: getInitials(contact.name),
          role: contact.role,
          roleLabel: roleLabel(contact.role),
          category: roleToCategory(contact.role),
          photo: contact.photo || null,
          online: false,
          color: getColorForId(contact.id)
        }))
        updateOnlineStatus()
      }
    }
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
  } finally {
    loadingContacts.value = false
  }
}

// 2. GET /chat/conversations
const fetchConversations = async () => {
  if (!isMounted) return
  loadingConversations.value = true
  try {
    const response = await fetch(`${API_URL}/chat/conversations`, {
      headers: getAuthHeaders()
    })

    if (!isMounted) return

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        conversations.value = data.data.map((conv: any) => ({
          id: conv.id,
          type: conv.type,
          name: conv.participant?.name || 'Percakapan',
          initials: getInitials(conv.participant?.name || '??'),
          photo: conv.participant?.photo || null,
          lastMessage: conv.latest_message?.body || '',
          time: conv.latest_message?.created_at
            ? new Date(conv.latest_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
          unread: !conv.read_at ? 1 : 0,
          online: false,
          color: getColorForId(conv.participant?.id || 0),
          category: roleToCategory(conv.participant?.role || ''),
          // Keep raw participant data for lookups
          participant: conv.participant,
          read_at: conv.read_at,
          last_message_at: conv.last_message_at
        }))
        updateOnlineStatus()
      }
    }
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
  } finally {
    loadingConversations.value = false
  }
}

// 3. POST /chat/conversations/get (Get or Create Conversation)
const getOrCreateConversation = async (receiverId: number): Promise<number | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/conversations/get`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receiver_id: receiverId })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        return data.data.id
      }
    }
    return null
  } catch (error) {
    console.error('Failed to get/create conversation:', error)
    return null
  }
}

// 4. GET /chat/conversations/{id}/messages
const fetchMessages = async (conversationId: number, showLoading = true) => {
  if (!isMounted) return
  if (!conversationId) {
    messages.value = []
    return
  }

  if (showLoading) loadingMessages.value = true

  try {
    const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages?per_page=50`, {
      headers: getAuthHeaders()
    })

    if (!isMounted) return

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // API returns paginated data: data.data.data
        const messagesData = data.data.data || data.data || []
        messages.value = messagesData.map((msg: any) => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          body: msg.body,
          sender_id: msg.sender_id,
          type: msg.type,
          file_url: msg.file_url,
          file_name: msg.file_name,
          file_type: msg.file_type,
          file_full_url: msg.file_full_url,
          is_edited: msg.is_edited,
          is_deleted: msg.is_deleted,
          created_at: msg.created_at,
          sender: msg.sender
        }))

        if (showLoading) {
          setTimeout(() => scrollToBottom(), 100)
        }
      } else {
        messages.value = []
      }
    } else {
      console.error('Failed to fetch messages:', response.status, response.statusText)
      messages.value = []
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    messages.value = []
  } finally {
    if (showLoading) loadingMessages.value = false
  }
}

// 5. POST /chat/messages (Send Message - supports multipart/form-data)
const sendMessage = async () => {
  if (!selectedConversation.value) return
  if (!newMessage.value.trim() && !selectedFile.value) return

  sendingMessage.value = true
  try {
    const formData = new FormData()

    // Add conversation_id if available
    const convId = selectedConversation.value.conversationId
    if (convId) {
      formData.append('conversation_id', String(convId))
    } else {
      // Use receiver_id when no conversation exists
      formData.append('receiver_id', String(selectedConversation.value.receiverId))
    }

    // Add message text
    if (newMessage.value.trim()) {
      formData.append('message', newMessage.value.trim())
    }

    // Add file if selected
    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }

    const response = await fetch(`${API_URL}/chat/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
        // Note: Do NOT set Content-Type for FormData, browser sets it automatically with boundary
      },
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // Add the sent message to local list
        const sentMsg = data.data
        messages.value.push({
          id: sentMsg.id,
          conversation_id: sentMsg.conversation_id,
          body: sentMsg.body,
          sender_id: sentMsg.sender_id,
          type: sentMsg.type,
          file_url: sentMsg.file_url,
          file_name: sentMsg.file_name,
          file_type: sentMsg.file_type,
          file_full_url: sentMsg.file_full_url,
          is_edited: sentMsg.is_edited || false,
          is_deleted: sentMsg.is_deleted || false,
          created_at: sentMsg.created_at,
          sender: sentMsg.sender
        })

        // Clear input and file
        newMessage.value = ''
        removeFile()

        // Update conversation ID if this was a new conversation
        if (!selectedConversation.value.conversationId && sentMsg.conversation_id) {
          selectedConversation.value.conversationId = sentMsg.conversation_id
          // Setup WebSocket for this new conversation
          setupRealTimeForConversation(sentMsg.conversation_id)
        }

        // Refresh conversations list
        fetchConversations()

        // Scroll to bottom
        scrollToBottom()
      }
    } else {
      const errorData = await response.json().catch(() => null)
      console.error('Failed to send message:', response.statusText, errorData)
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sendingMessage.value = false
  }
}

// 6. PUT /chat/messages/{id} (Update/Edit Message)
const updateMessage = async (messageId: number, newBody: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/chat/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: newBody })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // Update local message
        const idx = messages.value.findIndex((m: any) => m.id === messageId)
        if (idx !== -1) {
          messages.value[idx] = {
            ...messages.value[idx],
            body: data.data.body,
            is_edited: data.data.is_edited
          }
        }
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Failed to update message:', error)
    return false
  }
}

// 7. DELETE /chat/messages/{id} (Delete Message - soft delete)
const deleteMessageApi = async (messageId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/chat/messages/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        // Update local message to show deleted state
        const idx = messages.value.findIndex((m: any) => m.id === messageId)
        if (idx !== -1) {
          messages.value[idx] = {
            ...messages.value[idx],
            body: data.data.body, // "Pesan ini telah dihapus"
            is_deleted: data.data.is_deleted
          }
        }
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Failed to delete message:', error)
    return false
  }
}

// 8. DELETE /chat/conversations/{id} (Delete Conversation)
const deleteConversationApi = async (conversationId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (response.ok) {
      const data = await response.json()
      return data.status === 'success'
    }
    return false
  } catch (error) {
    console.error('Failed to delete conversation:', error)
    return false
  }
}

// ========================
// UI Interaction Methods
// ========================

// Select conversation from contacts list (starts new or existing conversation)
const selectConversation = async (contact: any) => {
  // Try to find existing conversation with this contact
  const existingConv = conversations.value.find((conv: any) =>
    conv.participant?.id === contact.id
  )

  if (existingConv) {
    // Conversation exists, select it directly
    selectConversationFromList(existingConv)
    return
  }

  // No existing conversation - set up selectedConversation with receiver info
  selectedConversation.value = {
    id: contact.id,
    receiverId: contact.id, // Will be used as receiver_id when sending first message
    name: contact.name,
    initials: contact.initials,
    color: contact.color,
    photo: contact.photo,
    online: contact.online,
    conversationId: null // No conversation yet
  }

  messages.value = []

  // Try to get or create conversation via API
  const convId = await getOrCreateConversation(contact.id)
  if (convId) {
    selectedConversation.value.conversationId = convId
    // Fetch messages for this conversation
    await fetchMessages(convId)
    // Setup WebSocket
    setupRealTimeForConversation(convId)
    // Refresh conversations list
    fetchConversations()
  }
}

// Select conversation from conversations list
const selectConversationFromList = (conversation: any) => {
  selectedConversation.value = {
    id: conversation.participant?.id || conversation.id,
    receiverId: conversation.participant?.id || conversation.id,
    name: conversation.name,
    initials: conversation.initials,
    color: conversation.color,
    photo: conversation.photo,
    online: conversation.online,
    conversationId: conversation.id
  }

  // Fetch messages using conversation ID
  fetchMessages(conversation.id)

  // Setup real-time
  setupRealTimeForConversation(conversation.id)

  setTimeout(() => scrollToBottom(), 500)
}

// Go back to conversation list
const goBack = () => {
  selectedConversation.value = null
  messages.value = []
  // Refresh conversations when going back
  fetchConversations()
}

// Confirm and delete conversation
const confirmDeleteConversation = async () => {
  if (!selectedConversation.value?.conversationId) return

  if (confirm('Apakah Anda yakin ingin menghapus seluruh percakapan ini?')) {
    const success = await deleteConversationApi(selectedConversation.value.conversationId)
    if (success) {
      // Go back to list
      selectedConversation.value = null
      messages.value = []
      // Refresh conversations
      fetchConversations()
    }
  }
}

// Context menu for messages
const openMessageMenu = (event: MouseEvent, message: any) => {
  event.preventDefault()
  event.stopPropagation()

  // Position the menu, keeping it within viewport
  const x = Math.min(event.clientX, window.innerWidth - 180)
  const y = Math.min(event.clientY, window.innerHeight - 120)

  contextMenu.value = {
    visible: true,
    x,
    y,
    message
  }
}

// Close context menu on click outside
const closeContextMenu = () => {
  contextMenu.value.visible = false
}

// Start editing a message
const startEditMessage = (message: any) => {
  closeContextMenu()
  editingMessage.value = message
  editMessageBody.value = message.body
}

// Cancel editing
const cancelEditMessage = () => {
  editingMessage.value = null
  editMessageBody.value = ''
}

// Submit edited message
const submitEditMessage = async () => {
  if (!editingMessage.value || !editMessageBody.value.trim()) return

  savingEdit.value = true
  const success = await updateMessage(editingMessage.value.id, editMessageBody.value.trim())
  savingEdit.value = false

  if (success) {
    cancelEditMessage()
  }
}

// Delete a message
const deleteMessage = async (message: any) => {
  closeContextMenu()
  if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
    await deleteMessageApi(message.id)
  }
}

// File handling
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10 MB')
      return
    }
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Open image in preview
const openImage = (url: string) => {
  imagePreviewUrl.value = url
}

// ========================
// Real-time WebSocket
// ========================

const setupRealTimeForConversation = (conversationId: number) => {
  if (!isWebSocketEnabled || !echo) {
    console.log('WebSocket disabled or Echo not initialized, skipping real-time setup')
    return
  }

  try {
    // Leave previous conversation channel
    if (echoChannel) {
      echoChannel.stopListening('.message.sent')
      echoChannel.stopListening('.message.updated')
      echoChannel.stopListening('.message.deleted')
      echo.leave(`chat.${echoChannel.conversationId}`)
      echoChannel = null
    }

    // Join new conversation channel
    echoChannel = echo.private(`chat.${conversationId}`)
    echoChannel.conversationId = conversationId

    echoChannel
      .listen('.message.sent', (event: any) => {
        console.log('Real-time: message.sent', event)
        const msg = event.message || event
        // Add new message if it's not from current user and not a duplicate
        if (msg.sender_id !== userId.value && msg.id) {
          const alreadyExists = messages.value.some((m: any) => m.id === msg.id)
          if (!alreadyExists) {
            messages.value.push({
              id: msg.id,
              conversation_id: msg.conversation_id,
              body: msg.body,
              sender_id: msg.sender_id,
              type: msg.type,
              file_url: msg.file_url,
              file_name: msg.file_name,
              file_type: msg.file_type,
              file_full_url: msg.file_full_url,
              is_edited: msg.is_edited || false,
              is_deleted: msg.is_deleted || false,
              created_at: msg.created_at,
              sender: msg.sender || event.sender
            })
            scrollToBottom()
          }
        }
        fetchConversations()
      })
      .listen('.message.updated', (event: any) => {
        console.log('Real-time: message.updated', event)
        const msg = event.message || event
        const idx = messages.value.findIndex((m: any) => m.id === msg.id)
        if (idx !== -1) {
          messages.value[idx] = {
            ...messages.value[idx],
            body: msg.body,
            is_edited: msg.is_edited
          }
        }
      })
      .listen('.message.deleted', (event: any) => {
        console.log('Real-time: message.deleted', event)
        const msg = event.message || event
        const idx = messages.value.findIndex((m: any) => m.id === msg.id)
        if (idx !== -1) {
          messages.value[idx] = {
            ...messages.value[idx],
            body: msg.body || 'Pesan ini telah dihapus',
            is_deleted: msg.is_deleted || true
          }
        }
      })
      .error((error: any) => {
        console.error('WebSocket conversation channel error:', error)
        isWebSocketEnabled = false
        startPollingFallback()
      })
  } catch (error) {
    console.error('Failed to setup WebSocket for conversation:', error)
    isWebSocketEnabled = false
    startPollingFallback()
  }
}

const startRealTimeUpdates = async () => {
  if (!isMounted) return

  if (!isWebSocketEnabled) {
    console.log('WebSocket disabled, using polling fallback')
    startPollingFallback()
    return
  }

  try {
    if (!echo) {
      await initEcho()
    }

    if (!isMounted) return

    if (!echo) {
      console.log('Failed to initialize Echo, using polling fallback')
      startPollingFallback()
      return
    }

    // Setup user-specific channel for new message notifications
    privateChannel = echo.private(`App.Models.User.${userId.value}`)
    privateChannel
      .listen('.message.sent', (event: any) => {
        if (!isMounted) return
        console.log('User channel: New message notification', event)
        // Refresh conversations list
        fetchConversations()
        // Also re-fetch messages if we're currently in a conversation
        // This ensures web-sent messages appear immediately on mobile
        if (selectedConversation.value?.conversationId) {
          const incomingConvId = event.message?.conversation_id
          if (!incomingConvId || incomingConvId === selectedConversation.value.conversationId) {
            fetchMessages(selectedConversation.value.conversationId, false)
          }
        }
      })
      .error((error: any) => {
        console.error('WebSocket user channel error:', error)
        isWebSocketEnabled = false
        startPollingFallback()
      })

    // Setup presence channel to track online status
    echo.join('chat-presence')
      .here((users: any[]) => {
        console.log('Online users here:', users)
        const ids = users.map(u => Number(u.id))
        onlineUserIds.value = new Set(ids)
        updateOnlineStatus()
      })
      .joining((user: any) => {
        console.log('User joined:', user)
        onlineUserIds.value.add(Number(user.id))
        updateOnlineStatus()
      })
      .leaving((user: any) => {
        console.log('User left:', user)
        onlineUserIds.value.delete(Number(user.id))
        updateOnlineStatus()
      })
      .error((error: any) => {
        console.error('WebSocket presence channel error:', error)
      })
  } catch (error) {
    console.error('Failed to setup WebSocket:', error)
    isWebSocketEnabled = false
    startPollingFallback()
  }
}

const startPollingFallback = () => {
  if (!isMounted) return
  console.log('Starting polling fallback for real-time updates')

  // Clear any existing intervals
  stopPollingFallback()

  // Poll conversations every 10 seconds
  const convInterval = setInterval(() => {
    if (!isMounted) {
      stopPollingFallback()
      return
    }
    fetchConversations()
  }, 10000)
  pollingIntervals.push(convInterval)

  // Poll messages every 5 seconds if conversation is selected
  const msgInterval = setInterval(() => {
    if (!isMounted) {
      stopPollingFallback()
      return
    }
    if (selectedConversation.value?.conversationId) {
      fetchMessages(selectedConversation.value.conversationId, false)
    }
  }, 5000)
  pollingIntervals.push(msgInterval)
}

const stopPollingFallback = () => {
  pollingIntervals.forEach(interval => clearInterval(interval))
  pollingIntervals = []
}

const stopRealTimeUpdates = () => {
  if (isWebSocketEnabled && echo) {
    if (echoChannel) {
      echoChannel.stopListening('.message.sent')
      echoChannel.stopListening('.message.updated')
      echoChannel.stopListening('.message.deleted')
      try {
        echo.leave(`chat.${echoChannel.conversationId}`)
      } catch (e) { /* ignore */ }
      echoChannel = null
    }

    if (privateChannel) {
      privateChannel.stopListening('.message.sent')
      try {
        echo.leave(`App.Models.User.${userId.value}`)
      } catch (e) { /* ignore */ }
      privateChannel = null
    }

    try {
      echo.leave('chat-presence')
    } catch (e) { /* ignore */ }
  }
  stopPollingFallback()
}

// ========================
// Utility Methods
// ========================

const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

// ========================
// Watchers
// ========================

watch(activeCategory, (newCategory, oldCategory) => {
  if (newCategory !== oldCategory) {
    selectedConversation.value = null
    messages.value = []
  }
})

// Close context menu on click outside
const handleClickOutside = () => {
  if (contextMenu.value.visible) {
    closeContextMenu()
  }
}

// ========================
// Lifecycle
// ========================

onMounted(async () => {
  isMounted = true
  console.log('Chat component mounted, initializing...')
  
  // Fetch profile to get real user ID first
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        const user = data.data || data
        if (user && user.id) {
          userId.value = Number(user.id)
          localStorage.setItem('userId', String(user.id))
        }
      }
    } catch (e) {
      console.error('Error fetching profile in chat:', e)
    }
  }

  fetchContacts()
  fetchConversations()
  await startRealTimeUpdates()

  if (!isMounted) return

  // Add click listener to close context menu
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  isMounted = false
  stopRealTimeUpdates()
  document.removeEventListener('click', handleClickOutside)
})
</script>
