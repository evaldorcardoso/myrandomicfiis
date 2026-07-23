<template>
  <Transition name="banner">
    <div
      v-if="isOffline"
      class="bg-yellow-900/80 text-yellow-200 text-sm text-center px-4 py-2 flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <span>Você está offline. Os dados exibidos podem não estar atualizados.</span>
      <button
        @click="dismiss"
        class="ml-2 p-0.5 rounded hover:bg-yellow-800/50 transition-colors"
        aria-label="Fechar banner"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOffline = ref(!navigator.onLine)

function onOnline() {
  isOffline.value = false
}

function onOffline() {
  isOffline.value = true
}

function dismiss() {
  isOffline.value = false
}

onMounted(() => {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', onOnline)
  window.removeEventListener('offline', onOffline)
})
</script>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: all 0.3s ease;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
